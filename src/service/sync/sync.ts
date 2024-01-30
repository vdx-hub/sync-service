import { ObjectId } from "mongodb";
import { transformPullRecord, transformPushRecord } from "service/mapping";
// import { reindexByIdX, q } from "../../index";


const axios = require("axios");

function setTimeZoneOffset(dateAt: any) {
  const date = new Date(parseInt(dateAt));
  const timeZoneCorrection = new Date(date.getTime() + date.getTimezoneOffset() * -60000);
  return timeZoneCorrection.toISOString().split('.')[0] + "Z";
}

async function getLastTimeSyncCollection({ client, db, collection }) {
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
  let lastsyncRecord = await getLastTimeSyncCollection({ client, db, collection });
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
            let mappedRecord: any = transformPullRecord(collection, record);
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
  let transformedRecord: any = transformPushRecord(collection, record)
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
      ...transformedRecord,
      sourceRef: SOURCEREF
    }),
  };
  return await axios(configPost)
    .then(function (response) {
      if (response?.data?.data) {
        console.log('record pushed', record._id);
        return response?.data?.data;
      }
      else {
        console.log('record update', record._id, `${endpoint} ${collection}/update`, response?.data);
        return {
          endpoint: `${endpoint}/CSDL/${endpointSource}/${collection}/update`,
          data: response?.data
        }
      }
    })
    .catch(function (error) {
      console.log('error', error);
    });
}

export async function pushOneCollection({
  client,
  db,
  endpoint,
  endpointSource,
  apiKey,
  collection,
  SOURCEREF
}) {
  console.log('pushOneCollection', db, collection);

  const pushTime = new Date().getTime();
  const pushTimeStr = setTimeZoneOffset(pushTime);

  let lastSyncTime = await getLastTimeSyncCollection({ client, db, collection });
  const ketQuaPush = {};

  const cursor = client.db(db).collection(collection).find({
    $and: [
      { "storage": "regular" },
      ...lastSyncTime?.last_asyncAt ? [{
        "modifiedAt": { $gt: lastSyncTime?.last_asyncAt }
      }] : []]
  })

  while (await cursor.hasNext()) {
    let doc: any = await cursor.next();
    if (doc._id) {
      ketQuaPush[doc._id] = []
      ketQuaPush[doc._id] = await pushRecord({ endpoint, endpointSource, apiKey, collection, record: doc, SOURCEREF })
    }
    await new Promise(r => setTimeout(r, 100));
  }

  await client.db(db).collection('vuejx_collection').updateOne({
    shortName: collection
  }, {
    $set: {
      last_pushAt: pushTime,
      last_pushAtStr: pushTimeStr,
    }
  });
  return ketQuaPush;
}
