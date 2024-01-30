import { _client } from '@db/mongodb';
import express from 'express';
import { verify } from 'service/auth/jwt';
import { pushCollectionToQTDL, pushRecordToQTDL } from 'service/sync/syncWithQTDL';
const router = express.Router();

router.post('/ping', async function (_req, res) {
  res.status(200).send("Service push up and running!")
})

router.post('/:collection/start', async function (req, res) {
  let body = req?.body
  let param = req.params
  const authStatus = await verify(body.token);
  if (authStatus?.status == 403) {
    res.send(authStatus)
    return;
  }
  let kq = await pushCollectionToQTDL({
    client: _client,
    db: 'CSDL_Ceid',
    collection: param?.collection,
    SOURCEREF: 'TULIEU'
  })
  res.status(200).send(kq)
})

router.post('/:collection/record/start', async function (req, res) {
  let body = req?.body
  let param = req.params
  const authStatus = await verify(body.token);
  if (authStatus?.status == 403) {
    res.send(authStatus)
    return;
  }
  let kq = await pushRecordToQTDL({
    collection: param?.collection,
    record: body?.record,
    SOURCEREF: 'TULIEU'
  })
  res.status(200).send(kq)
})

export default router