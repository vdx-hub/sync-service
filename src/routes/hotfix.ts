import { _client } from '@db/mongodb';
import express from 'express';
import { verify } from 'service/auth/jwt';
import { fixDiaChi } from 'service/hotfix/S_DiaChi';
const router = express.Router();

router.post('/ping', async function (_req, res) {
  res.status(200).send("Service hotfix up and running!")
})

router.post('/:collection/fixDiaChi', async function (req, res) {
  let body = req?.body
  let param = req.params
  const authStatus = await verify(body.token);
  if (authStatus?.status == 403) {
    res.send(authStatus)
    return;
  }
  let kq = await fixDiaChi({
    collection: param.collection,
    key: body?.key
  })
  res.status(200).send(kq)
})

export default router