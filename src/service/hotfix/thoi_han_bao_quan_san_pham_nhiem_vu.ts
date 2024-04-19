import { _client } from "@db/mongodb";
export async function capNhatTHBQSanPhamTuNhiemVu() {
  try {
    let cursorNhiemVu = _client.db('CSDL_Ceid').collection('T_NhiemVu').find({
      $and: [
        { "storage": "regular" },]
    }).addCursorFlag("noCursorTimeout", true)
    while (await cursorNhiemVu.hasNext()) {
      let nhiemVu = await cursorNhiemVu.next();
      let kq = await processSanPhamCuaNhiemVu(nhiemVu)
      console.log(`Done NhiemVu ${nhiemVu?._id} code ${nhiemVu?.code}. Total: ${kq}`)
      // break; // debug
      await new Promise(r => setTimeout(r, 600));
    }
  } catch (error) {
    console.error(error);
  }
  return "ok"
}

async function processSanPhamCuaNhiemVu(nhiemVu) {
  let ngayPhatHanh = new Date(nhiemVu.NamGiaoNop, 11, 31)
  let thoiHanBQSP
  if (nhiemVu.LoaiNhiemVu._source.MaMuc === "ĐTM") {
    thoiHanBQSP = {
      "_source": {
        "MaMuc": "01.29",
        "TenMuc": "Vĩnh viễn",
        "type": "C_ThoiHanBaoQuanSanPham"
      }
    }
  }
  else {
    thoiHanBQSP = nhiemVu.ThoiHanBaoQuanSanPham
  }

  let lstSanPhamCuaNhiemVu = await _client.db('CSDL_Ceid').collection('T_SanPhamBocTach').find({
    $and: [
      { "storage": "regular" },
      {
        $or: [
          { "DotBanGiao._source.NhiemVu._source.code": nhiemVu.code },
          { "DotBanGiao._source.NhiemVu._source.MaNhiemVu": nhiemVu.MaNhiemVu },
        ],
      },
      // { "MaSanPham_test": null } // skip already run san pham
    ]
  }).toArray()
  for (const sanPham of lstSanPhamCuaNhiemVu) {
    // console.log("Sanpham _id:", sanPham?._id, ma_sp);
    await _client.db('CSDL_Ceid').collection('T_SanPhamBocTach').updateOne({
      _id: sanPham?._id
    }, {
      $unset: {
        MaSanPham_test: ""
      },
      $set: {
        ThoiHanBaoQuanSanPham: thoiHanBQSP,
        NgayPhatHanh: ngayPhatHanh.getTime(),
        NgayPhatHanh___Ngay: ngayPhatHanh.getDate(),
        NgayPhatHanh___Thang: ngayPhatHanh.getMonth() + 1,
        NgayPhatHanh___Nam: ngayPhatHanh.getFullYear()
      }
    })
    await new Promise(r => setTimeout(r, 500));
  }
  return lstSanPhamCuaNhiemVu.length
}

