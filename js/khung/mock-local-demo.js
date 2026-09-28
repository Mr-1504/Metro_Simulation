/* @file js/khung/mock-local-demo.js — mock local demo ONLY cho localhost/127.0.0.1.
   Tệp này không dùng cho production: chỉ cung cấp dữ liệu mẫu + mã khởi động tối thiểu để chạy giao diện khi không có Apps Script/Google Sheet. */
(function(){
'use strict';
const C=window.CAU_HINH_WEB||{};
if(!C.MOCK_LOCAL_DEMO) return;

const TEN_BANG_BAT_BUOC=[
  'DL_TUYEN','DL_GA','DL_DUONG_CONG','DL_TRAC_DOC','DL_GHI','DL_HAN_CHE','DL_HINH_HOC_TUYEN','DL_DEPOT','DL_DEPOT_TOA_DO'
];

const NGUOI_DUNG_DEMO={
  ten:'demo_local',
  ho_ten:'Local Demo User',
  vai_tro:'quan_tri',
  ten_vai_tro:'Quản trị (Demo local)'
};

/* Mã logic tối thiểu cho demo local:
   - phát sự kiện app:san-sang để khoi-dong.js tiếp tục
   - cung cấp App.toast dạng console để tránh lỗi khi gọi toast
   - cung cấp fallback no-op cho các hàm runtime (run/tab/zoom/...) để bấm nút không văng ReferenceError */
const MA_LOGIC_DEMO=[
"(function(){",
"  'use strict';",
"  window.App=window.App||{};",
"  var daBao={};",
"  function thongBao(ten){",
"    if(daBao[ten]) return;",
"    daBao[ten]=1;",
"    var msg='[Local Demo] Chức năng \"'+ten+'\" chưa có logic backend đầy đủ trong mock local.';",
"    try{ if(window.App&&typeof window.App.toast==='function') window.App.toast(msg); else console.info(msg); }catch(e){}",
"  }",
"  function boSung(ten){",
"    if(typeof window[ten]==='function') return;",
"    window[ten]=function(){ thongBao(ten); return null; };",
"  }",
"  function boSungApp(ten){",
"    if(typeof window.App[ten]==='function') return;",
"    window.App[ten]=function(){ thongBao('App.'+ten); return null; };",
"  }",
"  if(typeof window.App.toast!=='function'){",
"    window.App.toast=function(msg){ try{ console.info('[Local Demo]', msg); }catch(e){} };",
"  }",
"  ['run','tab','setAW','loadXlsx','check','expXlsxKQ','zoomBy','zoomReset','expCSV','expSVG','expPDF','sweep','sens','benchRun','onPat','chkAll','chkIC','optimise'].forEach(boSung);",
"  ['exportData','exportResults','check','report'].forEach(boSungApp);",
"  document.dispatchEvent(new Event('app:san-sang'));",
"})();"
].join('\n');

function bam32(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return h.toString(16);}

const KHOI_MA={
  ten:'logic_local_demo.js',
  ma:MA_LOGIC_DEMO,
  dai:MA_LOGIC_DEMO.length,
  ks:bam32(MA_LOGIC_DEMO)
};

const GOI_DEMO={
  du_lieu:{
    DL_TUYEN:[
      ['ma_tuyen','ten','chieu_dai_m','van_toc_thiet_ke_kmh','van_toc_khai_thac_kmh','thoi_gian_phu_s'],
      ['Mã tuyến (khoá)','Tên tuyến','Chiều dài tuyến (m)','Vận tốc thiết kế (km/h)','Vận tốc khai thác (km/h)','Thời gian phụ (s)'],
      ['T1','Tuyến demo local','10000','90','80','30']
    ],
    DL_GA:[
      ['ma_tuyen','stt','ma','ten','s0','s1','ch','L','tang','sau','z','tc','vuot','X','Y'],
      ['Mã tuyến','Số thứ tự trên tuyến','Mã ga','Tên ga (không bắt buộc)','Lý trình đầu ke ga (m)','Lý trình cuối ke ga (m)','Lý trình tim ga (m)','Chiều dài ke ga (m)','Số tầng','Độ sâu (m)','Cao độ ray tại ga (m)','Ga trung chuyển (TRUE/FALSE)','Ga có đường vượt (TRUE/FALSE)','Toạ độ X VN-2000 (m)','Toạ độ Y VN-2000 (m)'],
      ['T1','1','T1-G01','Ga Bến đầu','0','120','60','120','2','12','5','FALSE','FALSE','',''],
      ['T1','2','T1-G02','Ga Trung tâm','4800','4940','4870','140','3','18','4','TRUE','TRUE','',''],
      ['T1','3','T1-G03','Ga Bến cuối','9880','10000','9940','120','2','10','5','FALSE','FALSE','','']
    ],
    DL_DUONG_CONG:[
      ['ma_tuyen','stt','s0','s1','R'],
      ['Mã tuyến','Số thứ tự','Lý trình đầu (m)','Lý trình cuối (m)','Bán kính (m)'],
      ['T1','1','1000','1250','450'],
      ['T1','2','7200','7420','600']
    ],
    DL_TRAC_DOC:[
      ['ma_tuyen','stt','ly_trinh','cao_do'],
      ['Mã tuyến','Số thứ tự','Lý trình (m)','Cao độ đỉnh ray (m)'],
      ['T1','1','0','5.0'],
      ['T1','2','4000','8.0'],
      ['T1','3','10000','5.2']
    ],
    DL_GHI:[
      ['ma_tuyen','stt','ga','loai','tang','s0','s1','v'],
      ['Mã tuyến','Số thứ tự','Mã ga','Loại ghi','Tỷ số ghi (ví dụ 1/9)','Lý trình đầu (m)','Lý trình cuối (m)','Tốc độ hạn chế (km/h)'],
      ['T1','1','T1-G02','Ghi số 9','1/9','4860','4885','35']
    ],
    DL_HAN_CHE:[
      ['ma_tuyen','stt','s0','s1','v','ly_do'],
      ['Mã tuyến','Số thứ tự','Lý trình đầu (m)','Lý trình cuối (m)','Tốc độ hạn chế (km/h)','Lý do'],
      ['T1','1','3000','3300','45','Đoạn kiểm tra local demo']
    ],
    DL_HINH_HOC_TUYEN:[
      ['ma_tuyen','stt','vi_do','kinh_do'],
      ['Mã tuyến','Số thứ tự điểm','Vĩ độ (độ)','Kinh độ (độ)'],
      ['T1','1','10.77600','106.69900'],
      ['T1','2','10.77710','106.70040'],
      ['T1','3','10.77820','106.70180']
    ],
    DL_DEPOT:[
      ['stt','ma_tuyen','ten'],
      ['Số thứ tự depot','Tuyến','Tên depot'],
      ['1','T1','Depot Demo T1']
    ],
    DL_DEPOT_TOA_DO:[
      ['stt_depot','stt','vi_do','kinh_do'],
      ['Số thứ tự depot','Số thứ tự điểm','Vĩ độ (độ)','Kinh độ (độ)'],
      ['1','1','10.77520','106.69860'],
      ['1','2','10.77520','106.69940'],
      ['1','3','10.77590','106.69940'],
      ['1','4','10.77590','106.69860']
    ]
  },
  thong_so:[],
  so_phan_ma:1,
  phien_ban_logic:'local-demo-v1'
};

function taoGoi(){
  return JSON.parse(JSON.stringify({
    du_lieu:GOI_DEMO.du_lieu,
    thong_so:GOI_DEMO.thong_so,
    so_phan_ma:GOI_DEMO.so_phan_ma,
    phien_ban_logic:GOI_DEMO.phien_ban_logic
  }));
}

function kiemTraBangBatBuoc(){
  const du_lieu=GOI_DEMO.du_lieu||{};
  for(const ten of TEN_BANG_BAT_BUOC){
    const b=du_lieu[ten];
    if(!Array.isArray(b)||b.length<3) throw new Error('Mock local thiếu hoặc rỗng bảng bắt buộc: '+ten);
  }
}
kiemTraBangBatBuoc();

window.MOCK_LOCAL_DEMO_API={
  async goi(hd){
    if(hd==='dang_nhap'||hd==='khoi_dong'||hd==='doi_mat_khau'){
      return {
        token:'local-demo-token',
        nguoi_dung:Object.assign({},NGUOI_DUNG_DEMO),
        phai_doi_mk:false,
        goi:taoGoi(),
        canh_bao_demo:'Đang chạy local demo mode: dữ liệu và mã tính toán là fixture, không kết nối Google Apps Script/Google Sheet.'
      };
    }
    if(hd==='tai_ma'){
      return {
        ten:KHOI_MA.ten,
        ma:KHOI_MA.ma,
        dai:KHOI_MA.dai,
        ks:KHOI_MA.ks,
        tep_dai:KHOI_MA.dai,
        tep_ks:KHOI_MA.ks,
        cuoi_tep:true
      };
    }
    if(hd==='dang_xuat') return {thanh_cong:true};
    throw new Error('Local demo chưa hỗ trợ hành động: '+hd);
  }
};
})();
