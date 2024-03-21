import { _client, _clientGridFS } from '@db/mongodb';
import express from 'express';
import { verify } from 'service/auth/jwt';
const router = express.Router();
import multer from 'multer';
import { deleteFileById, downloadFile, uploadFile } from 'service/mongo/gridfs';

var upload = multer();

router.post('/upload', upload.single('file'), async function (req, res) {
  let token = String(req?.headers?.token)
  const authStatus = await verify(token);
  if (authStatus?.status == 403) {
    res.send(authStatus)
    return;
  }

  if (!req.file) {
    return res.status(400).send("0 file uploaded")
  }

  let kq = await uploadFile(_clientGridFS, {
    db: 'oauth2',
    bucketName: 'TT_ThuTucDVC',
    file: req.file
  })
  res.status(200).send(kq)
})
router.post('/delete/:id', async function (req, res) {
  let params = req?.params
  let token = String(req?.headers?.token)
  const authStatus = await verify(token);
  if (authStatus?.status == 403) {
    res.send(authStatus)
    return;
  }
  let kq = await deleteFileById(_clientGridFS, {
    db: 'oauth2',
    bucketName: 'TT_ThuTucDVC',
    fileID: params.id,
  })
  res.status(200).send(kq)
})
router.post('/download', async function (req, res) {
  let body = req?.body
  let token = String(req?.headers?.token)
  const authStatus = await verify(token);
  if (authStatus?.status == 403) {
    res.send(authStatus)
    return;
  }
  let kq = await downloadFile(_clientGridFS, {
    db: 'oauth2',
    bucketName: 'TT_ThuTucDVC',
    filename: body.fileName,
  })
  if (kq?.status === 404) {
    return res.status(404).send(kq.msg)
  }
  else if (kq?.status === 200) {
    res.writeHead(200, {
      'Content-Type': kq.mimetype,
      'Content-disposition': 'attachment;filename=' + encodeURI(body.fileName),
    });
    kq.file?.pipe(res)
  }
})

export default router