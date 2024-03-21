import express from 'express';
import { verify } from 'service/auth/jwt';
import { fixDiaChi } from 'service/hotfix/S_DiaChi';
import { fixLinhVucNhiemVu, themLinhVucNhiemVu } from 'service/hotfix/linh_vuc_nhiem_vu';
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
router.post('/fixLinhVucNhiemVu', async function (req, res) {
  let body = req?.body
  const authStatus = await verify(body.token);
  if (authStatus?.status == 403) {
    res.send(authStatus)
    return;
  }
  // let kq = await fixLinhVucNhiemVu()
  let kq = await themLinhVucNhiemVu()
  res.status(200).send(kq)
})

export default router