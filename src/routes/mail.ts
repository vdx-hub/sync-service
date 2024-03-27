import { _client } from '@db/mongodb';
import express from 'express';
import * as fs from 'fs-extra';
import { verify } from 'service/auth/jwt';
import { sendMail } from 'service/mail';
const router = express.Router();

router.post('/sendMail', async function (req, res) {
  let body = req?.body
  if (!body?.to) { return }
  const authStatus = await verify(body.token);
  if (authStatus?.status == 403) {
    res.send(authStatus)
    return;
  }
  try {
    let template = await fs.readJSON(`data/template/${body.templateName}.json`)
    if (!template?.TemplateData) {
      res.status(400).send(`Template ${body.templateName} not found!`)
      return
    }

    let response = await sendMail({
      to: body?.to,
      data: body?.data,
      template: template.TemplateData,
      subject: body?.subject,
    })
    await _client.db('CSDL_Ceid').collection('T_EmailLogs').insertOne({
      to: body?.to,
      data: body?.data,
      templateName: body.templateName,
      subject: body?.subject,
    })
    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json("Error")
  }
})

// getTemplate
router.post('/template/:MaMau', async function (req, res) {
  let param = req.params
  let body = req?.body
  if (!body.token) {
    return res.status(400).send("No token!")
  }
  const authStatus = await verify(body.token);
  if (authStatus?.status == 403) {
    res.send(authStatus)
    return;
  }
  try {
    let data = await fs.readJSON(`data/template/${param.MaMau}.json`)
    return res.status(200).send(data)
  } catch (error) {
    return res.status(500).send('File not found')
  }

})

// Update template
router.post('/template', async function (req, res) {
  let body = req?.body
  const authStatus = await verify(body.token);
  if (authStatus?.status == 403) {
    res.send(authStatus)
    return;
  }
  if (!body?.MaMau || !body?.TemplateData) {
    res.status(400).send('Cần có MaMau string và TemplateData html')
  }
  await fs.writeJson(`data/template/${body?.MaMau}.json`, {
    MaMau: body?.MaMau,
    TenMau: body?.TenMau,
    TemplateData: body?.TemplateData
  })
  res.status(200).send("Template saved")
})

// Delete template
router.delete('/template/:MaMau/delete', async function (req, res) {
  let param = req.params
  let body = req?.body
  const authStatus = await verify(body.token);
  if (authStatus?.status == 403) {
    res.send(authStatus)
    return;
  }
  try {
    await fs.remove(`data/template/${param.MaMau}.json`)
    return res.status(200).send("Template deleted")
  } catch (error) {
    return res.status(500).send(error)
  }

})

// list
router.get('/templates', async function (req, res) {
  let body = req?.body
  const authStatus = await verify(body.token);
  if (authStatus?.status == 403) {
    res.send(authStatus)
    return;
  }
  let dir = await fs.readdir('data/template/')
  let kq: any = []
  for (let filename of dir) {
    let fileStat = await fs.stat(`data/template/${filename}`)
    kq.push({
      MaMuc: filename.substring(0, filename.indexOf('.')),
      createdAt: Number(fileStat.ctimeMs.toFixed()),
      modifiedAt: Number(fileStat.mtimeMs.toFixed()),
    })
  }
  res.status(200).send(kq)
})

export default router