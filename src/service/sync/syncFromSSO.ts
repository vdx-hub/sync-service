import { pullCollection, pushRecord, getDataSource } from './sync'
const ENDPOINT_QTDL = `http://api.ceid.gov.vn:8000`
const ENDPOINTSOURCE_QTDL = `sso`
const SERVICE_USERNAME = 'apiSync'
const APIKEY = process.env.API_KEY
interface connectionInfo {
  /** client mongo */
  client: any
  /** collection sync dữ liệu */
  collection: string
  /** db để lấy dữ liệu về từ SSO */
  db: string
  /** SOURCEREF mã hệ thống đồng bộ với SSO, dùng để check id nội bộ với case lần đầu sync không có mã định danh */
  SOURCEREF: string
  /** Optional: dữ liệu mặc định lấy từ vuejx_collection */
  openAccess?: string
  /** Optional: dữ liệu mặc định lấy từ vuejx_collection */
  site?: string
}

export const pullCollectionFromSSO = async ({ client, collection, db, openAccess, site, SOURCEREF }: connectionInfo) => {
  console.log('pullCollectionFromSSO', collection, db, openAccess, site, SOURCEREF);
  await pullCollection({
    SERVICE_USERNAME,
    endpoint: ENDPOINT_QTDL,
    endpointSource: ENDPOINTSOURCE_QTDL,
    apiKey: APIKEY,
    client,
    collection,
    db,
    openAccess,
    site,
    SOURCEREF
  })
}
export const findSSO = async ({ collection, query, from, until, resumptionToken }) => await getDataSource({
  endpoint: ENDPOINT_QTDL,
  endpointSource: ENDPOINTSOURCE_QTDL,
  apiKey: APIKEY,
  collection: collection,
  from: from,
  until: until,
  query: query,
  resumptionToken: resumptionToken
})
export const pushRecordToSSO = async ({ collection, record, SOURCEREF }) => await pushRecord({
  SOURCEREF,
  endpoint: ENDPOINT_QTDL,
  endpointSource: ENDPOINTSOURCE_QTDL,
  apiKey: APIKEY,
  collection,
  record
})

