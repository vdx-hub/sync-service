import { _client } from "@db/mongodb";

export async function getSTT({
  MaDonVi,
  NamGiaoNop,
}) {
  const curCount = await _client.db('vuejx_cfg').collection('vuejx_count').findOne({
    MaDonVi, NamGiaoNop
  })
  if (!curCount) {
    await _client.db('vuejx_cfg').collection('vuejx_count').insertOne(
      {
        MaDonVi, NamGiaoNop, count: 1
      },
    )
    return 1
  }
  else {
    await _client.db('vuejx_cfg').collection('vuejx_count').updateOne(
      {
        MaDonVi, NamGiaoNop
      },
      { $inc: { count: 1 } })
    return curCount.count + 1
  }

}