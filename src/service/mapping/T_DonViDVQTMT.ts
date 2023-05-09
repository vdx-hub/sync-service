function transformPull(record) {
  let mappedRecord = {};
  if (record['MaDinhDanh']) {
    mappedRecord['MaDinhDanh'] = record['MaDinhDanh'];
  }
  mappedRecord['TenGoi'] = record?.['TenGoi'];
  mappedRecord['DiaChi'] = record?.['DiaChi'];
  mappedRecord['Vimcerts'] = record?.['Vimcerts'];
  mappedRecord['LinhVucPhamViQTMT'] = record?.['LinhVucPhamViQTMT'];
  mappedRecord['TinhTrangHoatDong'] = record?.['TinhTrangHoatDong'];
  return mappedRecord
}

function transformPush(record) {
  let mappedRecord = record;
  return mappedRecord
}
export {
  transformPull as transformPullT_DonViDVQTMT,
  transformPush as transformPushT_DonViDVQTMT
}