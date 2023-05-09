function transformPull(record) {
  let mappedRecord = {};
  if (record['MaDinhDanh']) {
    mappedRecord['MaDinhDanh'] = record['MaDinhDanh'];
  }
  mappedRecord['TenGoi'] = record['TenGoi'];
  mappedRecord['DiaChi'] = record['DiaChi'];
  mappedRecord['DangKyKinhDoanh._source'] = record['GiayToChungNhan'];
  mappedRecord['MaSoThue'] = record['MaSoThue'];
  mappedRecord['NguoiDaiDien'] = record['NguoiDaiDien'];
  mappedRecord['DanhBaLienLac'] = record['DanhBaLienLac'];
  return mappedRecord
}

function transformPush(record) {
  let mappedRecord = record;
  return mappedRecord
}
export {
  transformPull as transformPullT_ChuDauTu,
  transformPush as transformPushT_ChuDauTu
}