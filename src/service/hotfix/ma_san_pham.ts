import { _client } from "@db/mongodb";
import { getSTT } from "service/sync/count";


let DanhMucDonVi: Map<string, any>

export async function sinhMaSanPham() {
  if (!DanhMucDonVi)
    await getMaDonViFull()
  const minYear = 1990
  const maxYear = 2023
  for (let curYear = minYear; curYear <= maxYear; curYear++) {
    if (curYear == 2019) {
      await processDotBanGiaoTheoNam(curYear)
      console.log(`Done process year: ${curYear}`)
    }
  }
  return "ok"
}
async function getMaDonViFull() {
  let lstDonVi = await _client.db('CSDL_Ceid').collection('C_DonVi').find({
    $and: [
      { "storage": "regular" },
    ]
  }).toArray()
  DanhMucDonVi = new Map(
    lstDonVi.map(obj => {
      return [obj?.MaDonVi, obj?.MaDonViFull];
    }),
  )
}
async function processDotBanGiaoTheoNam(NamGiaoNop: number) {
  try {
    let cursorDotBanGiao = _client.db('CSDL_Ceid').collection('T_DotBanGiao').find({
      $and: [
        { "storage": "regular" },
        {
          $or: [
            { "NhiemVu._source.NamGiaoNop": Number(NamGiaoNop) },
            { "NhiemVu._source.NamGiaoNop": String(NamGiaoNop) }
          ]
        }]
    }).sort({
      NgayBanGiao: 1,
      _id: 1
    }).addCursorFlag("noCursorTimeout", true)
    while (await cursorDotBanGiao.hasNext()) {
      let dotBanGiao = await cursorDotBanGiao.next();
      let nhiemVu = await _client.db('CSDL_Ceid').collection('T_NhiemVu').findOne({
        $and: [
          { "storage": "regular" },
          {
            $or: [
              { MaNhiemVu: dotBanGiao?.NhiemVu?._source?.MaNhiemVu },
              { code: dotBanGiao?.code }]
          }
        ]
      })
      let soSanPham = await processSanPhamCuaDot(dotBanGiao, nhiemVu)
      console.log(`Done DotBanGiao ${dotBanGiao?._id} code ${dotBanGiao?.code}. So san pham: ${soSanPham || 0}`)
      await new Promise(r => setTimeout(r, 600));
    }
  } catch (error) {
    console.error(error);
  }
}
async function processSanPhamCuaDot(dotBanGiao, nhiemVu) {
  const donViBanGiao = dotBanGiao?.NhiemVu?._source?.DonViBanGiao?._source?.MaDonVi
  const namGiaoNop = dotBanGiao?.NhiemVu?._source?.NamGiaoNop
  const linhVucNhiemVu = nhiemVu?.LinhVuc?._source?.MaMuc
  if (!donViBanGiao || !namGiaoNop || !linhVucNhiemVu) {
    console.error(`Dot: ${dotBanGiao._id}, donvi: ${donViBanGiao}, nam: ${namGiaoNop}, linhvuc: ${linhVucNhiemVu}`)
    return
  }

  let lstSanPhamCuaDot = await _client.db('CSDL_Ceid').collection('T_SanPhamBocTach').find({
    $and: [
      { "storage": "regular" },
      {
        $or: [
          { "DotBanGiao._source.code": dotBanGiao.code },
          { "DotBanGiao._source.MaDotBanGiao": dotBanGiao.MaDotBanGiao },
        ],
      },
      // { "MaSanPham_test": null } // skip already run san pham
    ]
  }).sort({
    code: 1,
  }).toArray()
  for (const sanPham of lstSanPhamCuaDot) {
    let MaDonViBanGiao = DanhMucDonVi.get(String(sanPham?.DotBanGiao?._source?.NhiemVu?._source?.DonViBanGiao?._source?.MaDonVi)) || sanPham?.DotBanGiao?._source?.NhiemVu?._source?.DonViBanGiao?._source?.MaDonViFull
    let ma_sp = await autoGenMaSanPham(MaDonViBanGiao, namGiaoNop, linhVucNhiemVu)
    // console.log("Sanpham _id:", sanPham?._id, ma_sp);
    await _client.db('CSDL_Ceid').collection('T_SanPhamBocTach').updateOne({
      _id: sanPham?._id
    }, {
      $set: {
        MaSanPham_test: ma_sp
      }
    })
    await new Promise(r => setTimeout(r, 200));
  }
  return lstSanPhamCuaDot.length
}

async function autoGenMaSanPham(MaDonVi, NamGiaoNop, LinhVuc) {
  let count = await getSTT({ MaDonVi: String(MaDonVi), NamGiaoNop: String(NamGiaoNop) })
  if (!count) {
    return;
  }
  return `${MaDonVi}.${NamGiaoNop}.${LinhVuc}.${pad(count, 4)}`;
}
function pad(n, width, z?) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

