import express from 'express';
import { verify } from 'service/auth/jwt';
import { kiemTraQuaHanSanPham } from 'service/cronjob/bao_quan_san_pham';
const router = express.Router();

router.post('/', async function (req, res) {
  let body = req?.body
  const authStatus = await verify(body.token);
  if (authStatus?.status == 403) {
    res.send(authStatus)
    return;
  }
  let kq = await kiemTraQuaHanSanPham()
  res.status(200).send(kq)
})

export default router