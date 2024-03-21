import { _client } from "@db/mongodb";
import { ObjectId } from "mongodb";

const endpoint = "http://vuejx-core:3000"

export async function kiemTraQuaHanSanPham() {
  let res = await searchSanPhamQuaHan()
  if (Array.isArray(res) && res?.length > 0) {
    console.log('kiemTraQuaHanSanPham');
    let countModified = 0
    for (let sanpham of res) {
      // Có sản phẩm quá hạn => chuyển trạng thái hết giá trị
      let res = await _client.db('CSDL_Ceid').collection('T_SanPhamBocTach').updateOne({
        _id: new ObjectId(sanpham._id)
      }, {
        $set: {
          TrangThaiBaoQuanSanPham: {
            _source: {
              MaMuc: '02',
              TenMuc: 'Hết giá trị',
              isAutoRun: true,
            }
          }
        }
      })
      if (res.acknowledged && res.modifiedCount === 1) {
        countModified++
      }
      else {
        console.error(res);
      }
    }
    console.log(`Cập nhật thành công ${countModified}/${res?.length} bản ghi quá hạn`);
  }
}

async function searchSanPhamQuaHan() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  let today = new Date()
  today.setHours(0, 0, 0, 0)

  var graphql = JSON.stringify({
    query: "query search($token: String, $body: JSON, $db: String, $collection: String) { results: search(token: $token, body: $body, db: $db, collection: $collection )}",
    variables: {
      "body": {
        "size": 15,
        "query": {
          "bool": {
            "filter": [{
              "match": {
                "site": "ceid"
              }
            }, {
              "exists": {
                "field": "ThoiDiemQuaHan"
              }
            }, {
              "match": { "storage": "regular" }
            }],
            "must": [
              {
                "range": { // Khoảng
                  "ThoiDiemQuaHan": {
                    "lt": today.getTime(),
                  }
                },
              },
              {
                bool: {
                  should: [
                    {
                      match: {
                        'TrangThaiBaoQuanSanPham._source.MaMuc': '01'
                      }
                    }, {
                      bool: {
                        must_not: {
                          exists: {
                            field: 'TrangThaiBaoQuanSanPham'
                          }
                        }
                      }
                    }
                  ]
                }
              }
            ]
          }
        },
        "from": 0
      },
      "db": "CSDL_Ceid",
      "collection": "T_SanPhamBocTach",
    }
  })
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: graphql,
  };

  return await fetch(`${endpoint}/`, requestOptions)
    .then(async response => {
      let res = await response.json()

      return res?.data?.results?.hits?.hits
    })
    .catch(error => console.log('error', error));
}