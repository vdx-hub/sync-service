function transformPull(record) {
  let mappedRecord = {};
  if (record['MaDinhDanh']) {
    mappedRecord['MaDinhDanh'] = record['MaDinhDanh'];
  }
  mappedRecord['LoaiHinhCoSo'] = record['LoaiHinhCoSo'];
  mappedRecord['TenGoi'] = record['TenGoi'];
  mappedRecord['DiaChi'] = record['DiaChi'];
  mappedRecord['TrongKhuTapTrung'] = record['TrongKhuTapTrung'];
  mappedRecord['ChuDauTu._source.MaDinhDanh'] = record?.ChuDauTu?._source?.MaDinhDanh;
  mappedRecord['ChuDauTu._source.TenGoi'] = record?.ChuDauTu?._source?.TenGoi;
  mappedRecord['ChuDauTu._source.DiaChi'] = record?.ChuDauTu?._source?.DiaChi;
  mappedRecord['CapQuanLy'] = record?.CapQuanLy;
  mappedRecord['NganhNgheKinhDoanh'] = record?.LoaiNganhNgheKinhTe;
  mappedRecord['NhienLieuTieuThu'] = record?.NhienLieuSuDung;
  mappedRecord['PhanLoaiNguonThai'] = record?.PhanLoaiNguonThai;
  return mappedRecord
}

function transformPush(record) {
  let mappedRecord = record;
  return mappedRecord
}
export {
  transformPull as transformPullT_MoiTruongCoSo,
  transformPush as transformPushT_MoiTruongCoSo
}