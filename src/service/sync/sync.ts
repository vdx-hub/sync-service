import { ObjectId } from "mongodb";
// import { reindexByIdX, q } from "../../index";


const axios = require("axios");

function setTimeZoneOffset(dateAt: any) {
  const date = new Date(parseInt(dateAt));
  const timeZoneCorrection = new Date(date.getTime() + date.getTimezoneOffset() * -60000);
  return timeZoneCorrection.toISOString().split('.')[0] + "Z";
}

async function getFirstTimeSync({ client, db, collection }) {
  const lastSyncData = await client.db(db).collection(collection).find({ "syncAt": { $exists: true } }).sort({
    syncAt: -1
  }).limit(1).toArray();
  if (lastSyncData?.[0]) {
    return lastSyncData?.[0]
  }
  return;
}

async function getTokenApi(endpoint, endpointSource, apiKey) {
  let config = {
    method: 'post',
    url: `${endpoint}/CSDL/${endpointSource}/token`, // `http://api.ceid.gov.vn:8000/CSDL/quantridulieu/token`
    headers: {
      'key': apiKey //'DKCLdP45EjCp75zKdUroHIF3nNWo1jtq'
    }
  };
  return await axios(config)
    .then(function (response) {
      return response?.data?.access_token
    })
    .catch(function (error) {
      console.log(error);
    });
}

export async function getDataSource({ endpoint, endpointSource, apiKey, collection, resumptionToken, from, until, query }) {
  let result: any;
  const tokenApi = await getTokenApi(endpoint, endpointSource, apiKey);
  const urlGetData = `${endpoint}/CSDL/${endpointSource}/${collection}${resumptionToken >= 0 ? '?resumptionToken=' + resumptionToken : ''}${from ? '&from=' + from : ''}${until ? '&until=' + until : ''}`;
  if (tokenApi) {
    let configPost = {
      method: "post",
      url: urlGetData,
      headers: {
        'key': apiKey,
        'transform': 'NO',
        'Authorization': `Bearer ${tokenApi}`,
        'Content-Type': 'application/json'
      },
      ...query ? {
        data: query
      } : {}
    };
    await axios(configPost)
      .then(async function (response) {
        if (Array.isArray(response?.data?.data)) {
          result = response.data
        }
        else {
          console.log(response?.data)
        }
      })
      .catch(function (error) {
        console.log('error', error?.response?.data);
      });
    return result;
  }
}

function setOnInsertData(SERVICE_USERNAME) {
  let now = new Date().getTime();
  return {
    createdAt: now,
    username: SERVICE_USERNAME,
  }
}

async function preProcessData(record) {
  let { createdAt, modifiedAt, lastusername, username, openAccess, order, ...result } = record
  return result;
}

function genMetadata({ metadata, SOURCEREF }) {
  return {
    sourceRef: SOURCEREF,
    sourceID: `${SOURCEREF}___${metadata.id}`,
    syncAt: metadata.syncTime,
    syncAtStr: metadata.syncTimeStr,
    openAccess: metadata.openAccess,
    site: metadata.site,
    order: 0,
    accessRoles: [
      {
        "shortName": "admin",
        "permission": "2"
      },
      {
        "shortName": "AdminData",
        "permission": "2"
      }
    ]
  }
}

function addAuditField({ data, customMetadata, SERVICE_USERNAME }) {
  let now = new Date().getTime();
  data = {
    ...data,
    ...customMetadata,
    modifiedAt: now,
    lastusername: SERVICE_USERNAME
  }
  return data;
}

export async function upsertOne({ client, db, collection, filter, data, isUpsert, customMetadata, SERVICE_USERNAME }) {
  data = await preProcessData(data)
  let unsetData = {};
  const ignoreKey = ["sourceRef", "sourceRefId",]
  for (let key in data) {
    if (data[key] === null && ignoreKey.indexOf(key) == -1) {
      unsetData[key] = ""
      delete data[key];
    }
  }
  // console.log(addAuditField({ data, customMetadata, SERVICE_USERNAME }));
  // console.log(unsetData);

  return await client.db(db).collection(collection).updateOne(filter, {
    $setOnInsert: setOnInsertData(SERVICE_USERNAME),
    $set: addAuditField({ data, customMetadata, SERVICE_USERNAME }),
    ...Object.keys(unsetData).length > 0 ? { $unset: unsetData } : {}
  }, { upsert: isUpsert });
}

function transformRecord(collection: string, record: any) {
  let mappedRecord = {};
  mappedRecord['metadata.NguonThamChieu.MaThamChieu'] = record?.metadata?.NguonThamChieu?.MaThamChieu || record?.sourceRefId;
  mappedRecord['metadata.NguonThamChieu.MaNguonDuLieu'] = record?.metadata?.NguonThamChieu?.NguonDuLieu || record?.sourceRef;
  mappedRecord['storage'] = record?.storage;
  mappedRecord['type'] = record?.type;
  if (collection === "T_ChuDauTu") {
    if (record['MaDinhDanh']) {
      mappedRecord['MaDinhDanh'] = record['MaDinhDanh'];
    }
    mappedRecord['TenGoi'] = record['TenGoi'];
    mappedRecord['DiaChi'] = record['DiaChi'];
    mappedRecord['DangKyKinhDoanh._source'] = record['GiayToChungNhan'];
    mappedRecord['MaSoThue'] = record['MaSoThue'];
    mappedRecord['NguoiDaiDien'] = record['NguoiDaiDien'];
    mappedRecord['DanhBaLienLac'] = record['DanhBaLienLac'];
  }
  else if (collection === "T_GiayPhepMoiTruong") {
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
  }
  else if (collection === "T_MoiTruongCoSo") {
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
  }
  else if (collection === "T_DonViDVQTMT") {
    if (record['MaDinhDanh']) {
      mappedRecord['MaDinhDanh'] = record['MaDinhDanh'];
    }
    mappedRecord['TenGoi'] = record?.['TenGoi'];
    mappedRecord['DiaChi'] = record?.['DiaChi'];
    mappedRecord['Vimcerts'] = record?.['Vimcerts'];
    mappedRecord['LinhVucPhamViQTMT'] = record?.['LinhVucPhamViQTMT'];
    mappedRecord['TinhTrangHoatDong'] = record?.['TinhTrangHoatDong'];
  }
  else if (collection == 'T_CanBo') {
    let keyToGet = ["MaDinhDanh", "MaSoThue", "MaBHXH", "TenGoi", "HoVaTen", "BiDanh", "NgaySinh", "NgaySinh___Nam", "NgaySinh___Thang", "NgaySinh___Ngay", "GioiTinh", "NoiSinh", "QueQuan", "DanToc", "TonGiao", "QuocTich", "NhomMau", "DiaChiThuongTru", "NoiOHienTai", "DanhBaLienLac", "TinhTrangHonNhan", "TinhTrangSinhSong", "AnhCaNhan", "MaSoCanBo", "NgayTuyenDung", "CoQuanTuyenDung", "NoiCongTac", "CoQuanChuQuan", "DoiTuongCanBo", "TrinhDoChuyenMon", "ChucDanhNgheNghiep", "ChucVuCapBac", "TinhTrangCongTac", "NgayThoiViec", "pendingActivateSSOUser", "sourceRef", "sourceRefId", "TaiKhoanDienTu", "TrangThaiSSO", "userSSO", "pendingActivateSSOUser"];
    for (let key of keyToGet) {
      if (record[key]) {
        mappedRecord[key] = record[key]
      }
      else {
        mappedRecord[key] = null;
      }
    }
  }
  return mappedRecord;
}

async function saveSyncData({ client, db, collection, filter, record, isUpsert, SOURCEREF, SERVICE_USERNAME, customMetadata }, getResponse?: boolean) {
  let ketQua: any = {}
  let { result, connection, message, ...response } = await upsertOne({
    client, db, collection, filter: filter,
    data: record,
    isUpsert: isUpsert,
    customMetadata: genMetadata({
      metadata: customMetadata,
      SOURCEREF
    }),
    SERVICE_USERNAME
  });
  if (getResponse) {
    return response
  }
  if (response.modifiedCount == 1) {
    ketQua.updated = (ketQua.updated || 0) + 1;
  }
  if (response.upsertedId?._id) {
    ketQua.inserted = [
      ...ketQua.inserted || [],
      response.upsertedId?._id
    ];
  }
  return ketQua
}

export async function pullCollection({ endpoint, endpointSource, apiKey, client, db, collection, openAccess, site, SERVICE_USERNAME, SOURCEREF }) {
  console.log(new Date().toLocaleString('vi-VN'), 'pullCollection', collection, endpoint, '=>', SOURCEREF);

  const syncTimeCollection = new Date().getTime();
  const syncTimeCollectionStr = setTimeZoneOffset(syncTimeCollection);
  const ketQuaDongBo = {};

  if (collection && (!openAccess || !site)) {
    //get collection info
    const collectionInfo = await client.db(db).collection('vuejx_collection').find({ "shortName": collection }).limit(1).toArray();
    openAccess = collectionInfo?.[0]?.openAccess;
    site = collectionInfo?.[0]?.site;
    if ((!openAccess && openAccess != 0) || !site) return {
      status: 400,
      message: 'Collection config not found'
    };
  }

  // Per collection run
  let lastsyncRecord = await getFirstTimeSync({ client, db, collection });
  const GET_RECORD_FROM = lastsyncRecord?.syncAtStr || '';

  let resumptionToken = 0;
  while (resumptionToken >= 0) {
    ketQuaDongBo[collection] = {}
    let res = await getDataSource({ endpoint, endpointSource, apiKey, collection, resumptionToken, from: GET_RECORD_FROM, until: '', query: '' });
    let syncResult: any = {};
    if (res) {
      if (Array.isArray(res.data)) {
        for (let record of res.data) {
          const syncTime = new Date(Number(record?.modifiedAt)).getTime();
          const syncTimeStr = setTimeZoneOffset(syncTime);

          if (collection.startsWith('C_')) {
            syncResult = await saveSyncData({
              client, db, collection,
              filter: {
                MaMuc: record.MaMuc
              }, isUpsert: true, record, SOURCEREF, SERVICE_USERNAME,
              customMetadata: { id: record.MaMuc, syncTime, syncTimeStr, openAccess, site }
            });
          }
          else if (collection.startsWith('T_')) {
            let mappedRecord: any = transformRecord(collection, record);
            if (!mappedRecord.MaDinhDanh) {
              continue;
            }
            let foundID: any;
            if (mappedRecord['metadata.NguonThamChieu.MaNguonDuLieu'] === SOURCEREF && mappedRecord['metadata.NguonThamChieu.MaThamChieu']) {
              let catchIdRegEx = new RegExp(/\/(.+)$/i);
              try {
                let sourceRefIdString = mappedRecord['metadata.NguonThamChieu.MaThamChieu'].match(catchIdRegEx)
                if (sourceRefIdString && sourceRefIdString[1] && sourceRefIdString[1].length === 24) {
                  foundID = new ObjectId(sourceRefIdString[1]);
                }
              }
              catch (err) {
                console.log(err)
              }
              if (foundID) {
                let response = await saveSyncData({
                  client, db, collection,
                  filter: {
                    _id: new ObjectId(foundID)
                  }, record: mappedRecord, isUpsert: false, SOURCEREF, SERVICE_USERNAME,
                  customMetadata: { id: mappedRecord.MaDinhDanh, syncTime, syncTimeStr, openAccess, site }
                }, true);

                if (response.modifiedCount == 1) {
                  syncResult.updated = (syncResult.updated || 0) + 1;
                }
                else {
                  // update By Id fail => back to upsert by MaDinhDanh
                  syncResult = await saveSyncData({
                    client, db, collection,
                    filter: {
                      MaDinhDanh: mappedRecord.MaDinhDanh
                    }, isUpsert: true, record, SOURCEREF, SERVICE_USERNAME,
                    customMetadata: { id: mappedRecord.MaDinhDanh, syncTime, syncTimeStr, openAccess, site }
                  });
                }
              }

            }
            else {
              //upsert by MaDinhDanh
              syncResult = await saveSyncData({
                client, db, collection,
                filter: {
                  MaDinhDanh: mappedRecord.MaDinhDanh
                }, record: mappedRecord, isUpsert: true, SOURCEREF, SERVICE_USERNAME,
                customMetadata: { id: mappedRecord.MaDinhDanh, syncTime, syncTimeStr, openAccess, site }
              });
            }
            if (syncResult?.inserted?.length > 0) {
              for (let recordToIndex of syncResult?.inserted) {
                // await reindexByIdX(q, client, db, collection, new ObjectId(recordToIndex));
              }
            }
            if (foundID) {
              // await reindexByIdX(q, client, db, collection, new ObjectId(foundID));
            }
          }
        }
      }
      ketQuaDongBo[collection] = syncResult;

      if (res.resumptionToken && res.resumptionToken != resumptionToken) {
        // next page
        resumptionToken = res.resumptionToken;
      }
      else {
        // final page
        console.log('Done', { collection: collection, lastResumptionToken: resumptionToken })
        await new Promise(r => setTimeout(r, 500));
        break;
      }
    }
    else {
      console.log('No response', collection, resumptionToken)
      await new Promise(r => setTimeout(r, 500));
      break;
    }
    await new Promise(r => setTimeout(r, 500));
  }

  await client.db(db).collection('vuejx_collection').updateOne({
    shortName: collection
  }, {
    $set: {
      last_asyncAt: syncTimeCollection,
      last_asyncAtStr: syncTimeCollectionStr,
    }
  });
  return ketQuaDongBo;
}

export async function pushRecord({ endpoint, endpointSource, apiKey, collection, record, SOURCEREF }) {
  const tokenApi = await getTokenApi(endpoint, endpointSource, apiKey);
  let configPost = {
    method: "post",
    url: `${endpoint}/CSDL/${endpointSource}/${collection}/update`, //`${endpoint}/update`,
    headers: {
      'Authorization': `Bearer ${tokenApi}`,
      'Content-Type': 'application/json',
      'transform': 'NO',
      'key': apiKey
    },
    data: JSON.stringify({
      ...record,
      sourceRef: SOURCEREF
    }),
  };
  return await axios(configPost)
    .then(function (response) {
      if (response?.data?.data) {
        return response?.data?.data;
      }
      else {
        console.log(`${endpoint}${collection}/update`, response.status);
      }
    })
    .catch(function (error) {
      console.log('error', error);
    });
}
