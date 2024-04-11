import { _client } from "@db/mongodb";

export async function fixNgayBanGiaoDot() {
  let cursorDotBanGiao = _client.db('CSDL_Ceid').collection('T_DotBanGiao').find({
    $and: [
      { "NhiemVu._source.NamGiaoNop": { $ne: null } },
      { "NgayBanGiao": null },
      { "storage": "regular" }]
  })
  while (await cursorDotBanGiao.hasNext()) {
    let dotBanGiao = await cursorDotBanGiao.next();
    if (dotBanGiao?.NhiemVu?._source?.NamGiaoNop) {
      if (!dotBanGiao.NgayBanGiao) {
        let d = new Date(dotBanGiao?.NhiemVu?._source?.NamGiaoNop, 11, 31)
        _client.db('CSDL_Ceid').collection('T_DotBanGiao').updateOne({
          _id: dotBanGiao?._id
        }, {
          $set: {
            NgayBanGiao: d.getTime(),
            NgayBanGiao___Ngay: d.getDate(),
            NgayBanGiao___Thang: d.getMonth() + 1,
            NgayBanGiao___Nam: d.getFullYear(),
            NgayBanGiaoFix: new Date().toLocaleString('vi'),
          }
        })
      }
    }
  }

}