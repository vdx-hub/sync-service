import { _client } from "@db/mongodb";
import { ObjectId } from "mongodb";
const mapLinhVucCuSangMoi = {
  "10": {
    "_id": "65b1e0485234af05a104aaf4",
    "_source": {
      "MaMuc": "23.02.06",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về các loại chất thải khác",
      "type": "C_LinhVuc"
    }
  },
  "11": {
    "_id": "65b1e0485234af05a104aafc",
    "_source": {
      "MaMuc": "23.04.02",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về ô nhiễm môi trường, sự cố môi trường",
      "type": "C_LinhVuc"
    }
  },
  "12": {
    "_id": "65b1e0485234af05a104aaf5",
    "_source": {
      "MaMuc": "23.02.07",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về quản lý chất thải nói chung",
      "type": "C_LinhVuc"
    }
  },
  "13": {
    "_id": "65b1e0475234af05a104aaed",
    "_source": {
      "MaMuc": "23.01.02",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về công tác bảo vệ môi trường của dự án đầu tư, cơ sở, khu sản xuất, kinh doanh, dịch vụ tập trung, cụm công nghiệp",
      "type": "C_LinhVuc"
    }
  },
  "14": {
    "_id": "65b1e0485234af05a104aafc",
    "_source": {
      "MaMuc": "23.04.02",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về ô nhiễm môi trường, sự cố môi trường",
      "type": "C_LinhVuc"
    }
  },
  "15": {
    "_id": "65b1e0475234af05a104aaed",
    "_source": {
      "MaMuc": "23.01.02",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về công tác bảo vệ môi trường của dự án đầu tư, cơ sở, khu sản xuất, kinh doanh, dịch vụ tập trung, cụm công nghiệp",
      "type": "C_LinhVuc"
    }
  },
  "20": {
    "_id": "65b1e0475234af05a104aaed",
    "_source": {
      "MaMuc": "23.01.02",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về công tác bảo vệ môi trường của dự án đầu tư, cơ sở, khu sản xuất, kinh doanh, dịch vụ tập trung, cụm công nghiệp",
      "type": "C_LinhVuc"
    }
  },
  "21": {
    "_id": "65b1e0475234af05a104aaed",
    "_source": {
      "MaMuc": "23.01.02",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về công tác bảo vệ môi trường của dự án đầu tư, cơ sở, khu sản xuất, kinh doanh, dịch vụ tập trung, cụm công nghiệp",
      "type": "C_LinhVuc"
    }
  },
  "22": {
    "_id": "65b1e0485234af05a104ab01",
    "_source": {
      "MaMuc": "23.04.07",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về môi trường nói chung (Quản lý môi trường, phát triển bền vững…)",
      "type": "C_LinhVuc"
    }
  },
  "23": {
    "_id": "65b1e0485234af05a104ab01",
    "_source": {
      "MaMuc": "23.04.07",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về môi trường nói chung (Quản lý môi trường, phát triển bền vững…)",
      "type": "C_LinhVuc"
    }
  },
  "24": {
    "_id": "65b1e0485234af05a104aafc",
    "_source": {
      "MaMuc": "23.04.02",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về ô nhiễm môi trường, sự cố môi trường",
      "type": "C_LinhVuc"
    }
  },
  "25": {
    "_id": "65b1e0485234af05a104aaff",
    "_source": {
      "MaMuc": "23.04.05",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về các công cụ quản lý môi trường (Công nghệ môi trường, Kinh tế môi trường, Đào tạo truyền thông, Hợp tác quốc tế…)",
      "type": "C_LinhVuc"
    }
  },
  "26": {
    "_id": "65b1e0485234af05a104aafd",
    "_source": {
      "MaMuc": "23.04.03",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về chất lượng môi trường, kết quả quan trắc môi trường",
      "type": "C_LinhVuc"
    }
  },
  "27": {
    "_id": "65b1e0485234af05a104aafd",
    "_source": {
      "MaMuc": "23.04.03",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về chất lượng môi trường, kết quả quan trắc môi trường",
      "type": "C_LinhVuc"
    }
  },
  "28": {
    "_id": "65b1e0485234af05a104aafd",
    "_source": {
      "MaMuc": "23.04.03",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về chất lượng môi trường, kết quả quan trắc môi trường",
      "type": "C_LinhVuc"
    }
  },
  "29": {
    "_id": "65b1e0485234af05a104aafe",
    "_source": {
      "MaMuc": "23.04.04",
      "TenMuc": "Văn bản quy phạm pháp luật, chính sách, chiến lược, quy hoạch, kế hoạch, tiêu chuẩn, quy chuẩn kỹ thuật, quy định kỹ thuật và  quy trình chuyên môn, định mức KT-KT, đơn giá  về môi trường ",
      "type": "C_LinhVuc"
    }
  },
  "30": {
    "_id": "65b1e0485234af05a104aaff",
    "_source": {
      "MaMuc": "23.04.05",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về các công cụ quản lý môi trường (Công nghệ môi trường, Kinh tế môi trường, Đào tạo truyền thông, Hợp tác quốc tế…)",
      "type": "C_LinhVuc"
    }
  },
  "31": {
    "_id": "65b1e0485234af05a104ab00",
    "_source": {
      "MaMuc": "23.04.06",
      "TenMuc": "Nhiệm vụ, dự án, đề tài về thông tin, dữ liệu môi trường, ứng dụng CNTT trong môi trường (thông tin, dữ liệu môi trường nói chung, xây dựng, quản lý, vận hành các HTTT, CSDL về môi trường…)",
      "type": "C_LinhVuc"
    }
  },
  "32": {
    "_id": "65b1e0485234af05a104aafe",
    "_source": {
      "MaMuc": "23.04.04",
      "TenMuc": "Văn bản quy phạm pháp luật, chính sách, chiến lược, quy hoạch, kế hoạch, tiêu chuẩn, quy chuẩn kỹ thuật, quy định kỹ thuật và  quy trình chuyên môn, định mức KT-KT, đơn giá  về môi trường ",
      "type": "C_LinhVuc"
    }
  },
  "33": {
    "_id": "65b1e0485234af05a104aaff",
    "_source": {
      "MaMuc": "23.04.05",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về các công cụ quản lý môi trường (Công nghệ môi trường, Kinh tế môi trường, Đào tạo truyền thông, Hợp tác quốc tế…)",
      "type": "C_LinhVuc"
    }
  },
  "34": {
    "_id": "65b1e0485234af05a104ab00",
    "_source": {
      "MaMuc": "23.04.06",
      "TenMuc": "Nhiệm vụ, dự án, đề tài về thông tin, dữ liệu môi trường, ứng dụng CNTT trong môi trường (thông tin, dữ liệu môi trường nói chung, xây dựng, quản lý, vận hành các HTTT, CSDL về môi trường…)",
      "type": "C_LinhVuc"
    }
  },
  "01": {
    "_id": "65b1e0485234af05a104aafe",
    "_source": {
      "MaMuc": "23.04.04",
      "TenMuc": "Văn bản quy phạm pháp luật, chính sách, chiến lược, quy hoạch, kế hoạch, tiêu chuẩn, quy chuẩn kỹ thuật, quy định kỹ thuật và  quy trình chuyên môn, định mức KT-KT, đơn giá  về môi trường ",
      "type": "C_LinhVuc"
    }
  },
  "02": {
    "_id": "65b1e0485234af05a104aafd",
    "_source": {
      "MaMuc": "23.04.03",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về chất lượng môi trường, kết quả quan trắc môi trường",
      "type": "C_LinhVuc"
    }
  },
  "03": {
    "_id": "65b1e0485234af05a104aaff",
    "_source": {
      "MaMuc": "23.04.05",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về các công cụ quản lý môi trường (Công nghệ môi trường, Kinh tế môi trường, Đào tạo truyền thông, Hợp tác quốc tế…)",
      "type": "C_LinhVuc"
    }
  },
  "04": {
    "_id": "65b1e0485234af05a104aaf9",
    "_source": {
      "MaMuc": "23.03.03",
      "TenMuc": "Nhiệm vụ, dự án, đề tài về kiểm tra, thanh tra về bảo vệ môi trường đối với dự án đầu tư, cơ sở, khu sản xuất, kinh doanh, dịch vụ tập trung, cụm công nghiệp theo quy định",
      "type": "C_LinhVuc"
    }
  },
  "05": {
    "_id": "65b1e0485234af05a104ab01",
    "_source": {
      "MaMuc": "23.04.07",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về môi trường nói chung (Quản lý môi trường, phát triển bền vững…)",
      "type": "C_LinhVuc"
    }
  },
  "06": {
    "_id": "65b1e0495234af05a104ab09",
    "_source": {
      "MaMuc": "27.00.00",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về biến đổi khí hậu",
      "type": "C_LinhVuc"
    }
  },
  "07": {
    "_id": "65b1e0495234af05a104ab08",
    "_source": {
      "MaMuc": "23.05.06",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về bảo tồn thiên nhiên và đa dạng sinh học nói chung",
      "type": "C_LinhVuc"
    }
  },
  "08": {
    "_id": "65b1e0495234af05a104ab05",
    "_source": {
      "MaMuc": "23.05.03",
      "TenMuc": "Nhiệm vụ, dự án, đề tài, thông tin, báo cáo về quản lý an toàn sinh học",
      "type": "C_LinhVuc"
    }
  },
  "09": {
    "_id": "65b1e0485234af05a104aaf7",
    "_source": {
      "MaMuc": "23.03.01",
      "TenMuc": "Nhiệm vụ, dự án, đề tài về đánh giá tác động môi trường, đánh giá môi trường chiến lược, đề án bảo vệ môi trường, kế hoạch bảo vệ môi trường",
      "type": "C_LinhVuc"
    }
  }
}

export async function getMapLinhVucCuSangMoi() {
  let lstLinhVuc = await _client.db('CSDL_Ceid').collection('C_LinhVuc').find({ storage: 'regular' }, {
    projection: {
      MaMuc: 1, TenMuc: 1, type: 1
    }
  }).toArray()
  let mapLinhVucCuSangMoi = new Map(
    lstLinhVuc.map(obj => {
      return [obj?.MaMuc, {
        _id: obj._id.toString(),
        _source: {
          MaMuc: obj.MaMuc,
          TenMuc: obj.TenMuc,
          type: obj.type,
        }
      }];
    }),
  )

  let finalLinhVuc = {
    "01": mapLinhVucCuSangMoi.get("23.04.04"),
    "02": mapLinhVucCuSangMoi.get("23.04.03"),
    "03": mapLinhVucCuSangMoi.get("23.04.05"),
    "04": mapLinhVucCuSangMoi.get("23.03.03"),
    "05": mapLinhVucCuSangMoi.get("23.04.07"),
    "06": mapLinhVucCuSangMoi.get("27.00.00"),
    "07": mapLinhVucCuSangMoi.get("23.05.06"),
    "08": mapLinhVucCuSangMoi.get("23.05.03"),
    "09": mapLinhVucCuSangMoi.get("23.03.01"),
    "10": mapLinhVucCuSangMoi.get("23.02.06"),
    "11": mapLinhVucCuSangMoi.get("23.04.02"),
    "12": mapLinhVucCuSangMoi.get("23.02.07"),
    "13": mapLinhVucCuSangMoi.get("23.01.02"),
    "14": mapLinhVucCuSangMoi.get("23.04.02"),
    "15": mapLinhVucCuSangMoi.get("23.01.02"),
    "20": mapLinhVucCuSangMoi.get("23.01.02"),
    "21": mapLinhVucCuSangMoi.get("23.01.02"),
    "22": mapLinhVucCuSangMoi.get("23.04.07"),
    "23": mapLinhVucCuSangMoi.get("23.04.07"),
    "24": mapLinhVucCuSangMoi.get("23.04.02"),
    "25": mapLinhVucCuSangMoi.get("23.04.05"),
    "26": mapLinhVucCuSangMoi.get("23.04.03"),
    "27": mapLinhVucCuSangMoi.get("23.04.03"),
    "28": mapLinhVucCuSangMoi.get("23.04.03"),
    "29": mapLinhVucCuSangMoi.get("23.04.04"),
    "30": mapLinhVucCuSangMoi.get("23.04.05"),
    "31": mapLinhVucCuSangMoi.get("23.04.06"),
    "32": mapLinhVucCuSangMoi.get("23.04.04"),
    "33": mapLinhVucCuSangMoi.get("23.04.05"),
    "34": mapLinhVucCuSangMoi.get("23.04.06"),
  }

  console.log(JSON.stringify(finalLinhVuc));
  return finalLinhVuc
}

export async function fixLinhVucNhiemVu() {
  for (let key in mapLinhVucCuSangMoi) {
    var cursor = await _client.db('CSDL_Ceid').collection("T_NhiemVu").find({
      $or: [
        { 'LinhVuc._source.MaMuc': Number(key) },
        { 'LinhVuc._source.MaMuc': String(key) },
      ]
    }, {
      projection: {
        LinhVuc: 1, LinhVucCu: 1
      }
    });
    while (await cursor.hasNext()) {
      let doc = await cursor.next();
      if (!doc) continue;

      let kq = await _client.db('CSDL_Ceid').collection("T_NhiemVu").updateOne({
        _id: doc._id
      }, {
        $set: {
          LinhVuc: mapLinhVucCuSangMoi[key],
          LinhVucCu: doc.LinhVuc
        }
      })
      console.log(kq);

    }
  }
}
export async function themLinhVucNhiemVu() {
  let lstLinhVuc = await _client.db('CSDL_Ceid').collection('C_LinhVuc').find({ storage: 'regular' }, {
    projection: {
      MaMuc: 1, TenMuc: 1, type: 1
    }
  }).toArray()
  let mapLinhVucObj = new Map(
    lstLinhVuc.map(obj => {
      return [obj?.MaMuc, {
        _id: obj._id.toString(),
        _source: {
          MaMuc: obj.MaMuc,
          TenMuc: obj.TenMuc,
          type: obj.type,
        }
      }];
    }),
  )
  var cursor = await _client.db('CSDL_Ceid').collection("T_NhiemVu").find({
    $and: [{ "LoaiNhiemVu._source.MaMuc": "ĐTM" }, { "LinhVuc": { $exists: false } }]
  }, {
    projection: {
      LinhVuc: 1
    }
  });
  while (await cursor.hasNext()) {
    let doc = await cursor.next();
    if (!doc) continue;

    await _client.db('CSDL_Ceid').collection("T_NhiemVu").updateOne({
      _id: doc._id
    }, {
      $set: {
        LinhVuc: mapLinhVucObj.get('23.03.01'),
      }
    })
  }
}