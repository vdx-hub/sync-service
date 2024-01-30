import { _client } from '@db/mongodb';
import express from 'express';
import { verify } from 'service/auth/jwt';
import { getSTT } from 'service/sync/count';
const router = express.Router();

router.post('/', async function (req, res) {
  let body = req?.body
  const authStatus = await verify(body.token);
  if (authStatus?.status == 403) {
    res.send(authStatus)
    return;
  }
  const stt = await getSTT({
    MaDonVi: body?.MaDonVi,
    NamGiaoNop: body?.NamGiaoNop,
  })
  res.status(200).send({
    count: stt
  })
})

export default router