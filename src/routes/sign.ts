import { _client } from '@db/mongodb';
import axios from 'axios';
import express from 'express';
import { verify } from 'service/auth/jwt';
const router = express.Router();

const endpoint = "http://vuejx-core:3000"
router.post('/generateDocxAndStore/:bucket', async function (req, res) {
  let body = req?.body
  let bucket = req.params.bucket;
  const authStatus = await verify(body.token);
  if (authStatus?.status == 403) {
    res.send(authStatus)
    return;
  }
  let arrayBuffer = await getDocx(body)
  let jsonFile = await uploadFileDocx({
    fileBuffer: arrayBuffer, fileName: `${Date.now()}___${body.docFileName}`, token: body.token, bucket: bucket
  })

  // debug return file
  // let buffer = Buffer.from(arrayBuffer)
  // res.writeHead(200, {
  //   'Content-Type': "application/octet-stream",
  //   'Content-disposition': 'attachment;filename=' + encodeURI("Test.docx"),
  //   'Content-Length': buffer?.length
  // });
  res.send(jsonFile)
})

async function getDocx(body): Promise<void | ArrayBuffer> {
  let config: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      responseType: 'blob',
      'token': body.token
    },
    body: JSON.stringify({
      "docFileName": body?.docFileName,
      "token": body.token,
      "site": body.site,
      "db": body.db,
      "collection": body.collection,
      "postBody": body.postBody,
      "dataId": body.dataId
    }),
    redirect: 'follow'
  };

  // forward to http://vuejx-core:3000/docx/generate
  return await fetch(`${endpoint}/docx/generate`, config)
    .then(async response => await response.arrayBuffer())
    .catch(error => {
      // Handle errors
    });
}

async function uploadFileDocx({
  fileBuffer, fileName, token, bucket
}) {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json, text/plain, */*");
  myHeaders.append("token", token);

  var formdata = new FormData();
  formdata.append("files", new Blob([fileBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), fileName);

  var requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
  };

  return await fetch(`http://security:3000/uploads/${bucket}`, requestOptions)
    .then(response => response.json())
    .then(result => result)
    .catch(error => console.log('error', error));

}
export default router