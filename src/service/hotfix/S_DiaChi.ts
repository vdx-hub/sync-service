import { _client } from "@db/mongodb";
import dot from 'dot-object'
export async function fixDiaChi({ db, collection, key }: any) {
  if (!db) db = 'CSDL_Ceid';
  try {
    let filter = {
      $and: [{
        [`${key}`]: {
          $exists: true
        }
      }, {
        $or: [
          {
            $and: [{
              [`${key}.TinhThanh`]: { $type: "object" }
            }, {
              [`${key}.TinhThanh`]: { $not: { $type: "array" } }
            }]
          },
          {
            $and: [{
              [`${key}.QuanHuyen`]: { $type: "object" }
            }, {
              [`${key}.QuanHuyen`]: { $not: { $type: "array" } }
            }]
          },
          {
            $and: [{
              [`${key}.PhuongXa`]: { $type: "object" }
            }, {
              [`${key}.PhuongXa`]: { $not: { $type: "array" } }
            }]
          }
        ]
      }]
    }
    console.log(JSON.stringify(filter));
    const cursor = _client.db(db).collection(collection).find(
      filter, {
      projection: {
        [key]: 1
      }
    })
    while (await cursor.hasNext()) {
      let doc: any = await cursor.next();
      let result = {}
      if (dot.pick(`${key}.TinhThanh._source`, doc)) {
        // is object => convert to array
        result[`${key}.TinhThanh`] = [
          dot.pick(`${key}.TinhThanh`, doc)
        ]
      }
      if (dot.pick(`${key}.QuanHuyen._source`, doc)) {
        // is object => convert to array
        result[`${key}.QuanHuyen`] = [
          dot.pick(`${key}.QuanHuyen`, doc)
        ]
      }
      if (dot.pick(`${key}.PhuongXa._source`, doc)) {
        // is object => convert to array
        result[`${key}.PhuongXa`] = [
          dot.pick(`${key}.PhuongXa`, doc)
        ]
      }
      await _client.db(db).collection(collection).updateOne({
        _id: doc._id
      }, {
        $set: result
      })
    }
    console.log('Done fixDiaChi', db, collection, key);

  } catch (error) {
    console.log(error)
  }
}