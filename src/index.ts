import 'dotenv/config'
import bodyParser from 'body-parser';
import https from 'https';
import express from 'express';

import syncRouter from "@routes/sync";
import pushRouter from "@routes/push";
import hotfixRouter from "@routes/hotfix";
import countRouter from "@routes/count";


https.globalAgent.options.rejectUnauthorized = false;

const app = express();
app.use(bodyParser.json({
  limit: "50mb"
}));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use((err: any, _req: any, res: any, _next: any) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});
app.use('/sync', syncRouter)
app.use('/push', pushRouter)
app.use('/hotfix', hotfixRouter)
app.use('/count', countRouter)
app.listen(process.env.PORT, async () => {
  console.log(`Server is up! http://0.0.0.0:${process.env.PORT}`);
})
