function transformPull(record) {
  let mappedRecord = {};
  if (record['MaDinhDanh']) {
    mappedRecord['MaDinhDanh'] = record['MaDinhDanh'];
  }
  mappedRecord['LoaiGiayPhepMoiTruong'] = record['LoaiGiayPhepMoiTruong'];
  mappedRecord['SoHieuVanBan'] = record['SoHieuVanBan'];
  mappedRecord['NgayBanHanh'] = record['NgayBanHanh'];
  mappedRecord['NgayHetHan'] = record['NgayHetHan'];
  mappedRecord['CoQuanBanHanh'] = record['CoQuanBanHanh'];
  mappedRecord['ChuDauTu._source.DiaChi'] = record?.ChuDauTu?._source?.DiaChi;
  mappedRecord['ChuDauTu._source.MaDinhDanh'] = record?.ChuDauTu?._source?.MaDinhDanh;
  mappedRecord['ChuDauTu._source.TenGoi'] = record?.ChuDauTu?._source?.TenGoi;
  mappedRecord['ChuDauTu._source.DangKyKinhDoanh._source.SoGiay'] = record?.ChuDauTu?._source?.GiayToChungNhan?.SoGiay;
  mappedRecord['ChuDauTu._source.DangKyKinhDoanh._source.NoiCap'] = record?.ChuDauTu?._source?.GiayToChungNhan?.NoiCap;
  mappedRecord['ChuDauTu._source.DangKyKinhDoanh._source.NgayCap'] = record?.ChuDauTu?._source?.GiayToChungNhan?.NgayCap;
  mappedRecord['ChuDauTu._source.DangKyKinhDoanh._source.NoiCap'] = record?.ChuDauTu?._source?.GiayToChungNhan?.NoiCap;
  mappedRecord['ChuDauTu._source.MaSoThue'] = record?.ChuDauTu?._source?.MaSoThue;
  mappedRecord['ChuDauTu._source.NguoiDaiDien'] = record?.ChuDauTu?._source?.NguoiDaiDien;
  mappedRecord['MoiTruongCoSo._source.MaDinhDanh'] = record?.MoiTruongCoSo?._source?.MaDinhDanh;
  mappedRecord['MoiTruongCoSo._source.TenGoi'] = record?.MoiTruongCoSo?._source?.TenGoi;
  mappedRecord['MoiTruongCoSo._source.DiaChi'] = record?.MoiTruongCoSo?._source?.DiaChi;
  return mappedRecord
}

function transformPush(record) {
  let mappedRecord = record;
  return mappedRecord
}
export {
  transformPull as transformPullT_GiayPhepMoiTruong,
  transformPush as transformPushT_GiayPhepMoiTruong
}