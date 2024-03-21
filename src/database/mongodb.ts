import { ConnectOptions, MongoClient } from 'mongodb';
const _client = new MongoClient(process.env.MONGODB_URI || '', {
  connectTimeoutMS: 30000,
} as ConnectOptions);
const _clientGridFS = new MongoClient(process.env.MONGODBFS_URI || '', {
  connectTimeoutMS: 30000,
} as ConnectOptions)
_client.connect();
_clientGridFS.connect();
// _client.on("serverOpening", (e) => {
//   log('serverOpening', e)
// })
export { _client, _clientGridFS }