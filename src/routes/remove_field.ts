import { _client } from '@db/mongodb';
import express from 'express';
import { ObjectId } from 'mongodb';
import { verify } from 'service/auth/jwt';
const router = express.Router();

router.post('/:db/:collection/:id', async function (req, res) {
  let body = req?.body
  let param = req.params
  const authStatus = await verify(body.token);
  if (authStatus?.status == 403) {
    res.send(authStatus)
    return;
  }
  if (!body?.updateField && !body?.removeField) {
    res.status(400).send("Body request missing!")
    return
  }

  if (!body?.updateField && !body?.removeField) {
    res.status(400).send("Body request missing!")
    return
  }

  let kq = await _client.db(param.db).collection(param.collection).updateOne({
    _id: new ObjectId(param.id)
  }, {
    ...body?.updateField && Object.keys(body?.updateField)?.length > 0 ? { $set: body?.updateField } : {},
    ...body?.removeField && Object.keys(body?.removeField)?.length > 0 ? { $unset: body?.removeField } : {},
  })
  res.status(200).send(kq)


})

export default router