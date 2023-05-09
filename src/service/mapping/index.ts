import { transformPullT_ChuDauTu, transformPushT_ChuDauTu } from "./T_ChuDauTu";
import { transformPullT_GiayPhepMoiTruong, transformPushT_GiayPhepMoiTruong } from "./T_GiayPhepMoiTruong";
import { transformPullT_MoiTruongCoSo, transformPushT_MoiTruongCoSo } from "./T_MoiTruongCoSo";
import { transformPullT_DonViDVQTMT, transformPushT_DonViDVQTMT } from "./T_DonViDVQTMT";
import { transformPullT_CanBo, transformPushT_CanBo } from "./T_CanBo";

export function transformPullRecord(collection: string, record: any) {
  let mappedRecord = {};
  mappedRecord['metadata.NguonThamChieu.MaThamChieu'] = record?.metadata?.NguonThamChieu?.MaThamChieu || record?.sourceRefId;
  mappedRecord['metadata.NguonThamChieu.MaNguonDuLieu'] = record?.metadata?.NguonThamChieu?.NguonDuLieu || record?.sourceRef;
  mappedRecord['storage'] = record?.storage;
  mappedRecord['type'] = record?.type;
  if (collection === "T_ChuDauTu") {
    return transformPullT_ChuDauTu(record)
  }
  else if (collection === "T_GiayPhepMoiTruong") {
    return transformPullT_GiayPhepMoiTruong(record)
  }
  else if (collection === "T_MoiTruongCoSo") {
    return transformPullT_MoiTruongCoSo(record)
  }
  else if (collection === "T_DonViDVQTMT") {
    return transformPullT_DonViDVQTMT(record)
  }
  else if (collection === "T_CanBo") {
    return transformPullT_CanBo(record)
  }
  return mappedRecord
}

export function transformPushRecord(collection: string, record: any) {
  let mappedRecord = {};
  if (collection === "T_ChuDauTu") {
    return transformPushT_ChuDauTu(record)
  }
  else if (collection === "T_GiayPhepMoiTruong") {
    return transformPushT_GiayPhepMoiTruong(record)
  }
  else if (collection === "T_MoiTruongCoSo") {
    return transformPushT_MoiTruongCoSo(record)
  }
  else if (collection === "T_DonViDVQTMT") {
    return transformPushT_DonViDVQTMT(record)
  }
  else if (collection === "T_CanBo") {
    return transformPushT_CanBo(record)
  }
  else {
    mappedRecord = record
  }
  return mappedRecord
}