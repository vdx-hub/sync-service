function transformPull(record) {
  let mappedRecord = {};
  let keyToGet = ["MaDinhDanh", "MaSoThue", "MaBHXH", "TenGoi", "HoVaTen", "BiDanh", "NgaySinh", "NgaySinh___Nam", "NgaySinh___Thang", "NgaySinh___Ngay", "GioiTinh", "NoiSinh", "QueQuan", "DanToc", "TonGiao", "QuocTich", "NhomMau", "DiaChiThuongTru", "NoiOHienTai", "DanhBaLienLac", "TinhTrangHonNhan", "TinhTrangSinhSong", "AnhCaNhan", "MaSoCanBo", "NgayTuyenDung", "CoQuanTuyenDung", "NoiCongTac", "CoQuanChuQuan", "DoiTuongCanBo", "TrinhDoChuyenMon", "ChucDanhNgheNghiep", "ChucVuCapBac", "TinhTrangCongTac", "NgayThoiViec", "pendingActivateSSOUser", "sourceRef", "sourceRefId", "TaiKhoanDienTu", "TrangThaiSSO", "userSSO", "pendingActivateSSOUser"];
  for (let key of keyToGet) {
    if (record[key]) {
      mappedRecord[key] = record[key]
    }
    else {
      mappedRecord[key] = null;
    }
  }
  return mappedRecord
}

function transformPush(record) {
  let mappedRecord = record;
  return mappedRecord
}
export {
  transformPull as transformPullT_CanBo,
  transformPush as transformPushT_CanBo
}