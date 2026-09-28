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
const MA_LOGIC_DEMO=`(function(){
  'use strict';
  window.App=window.App||{};
  var DEMO_NOTE='[Local Demo] Đang dùng lõi mô phỏng giả lập offline (không thay thế kết quả backend thật).';
  var zoom=1;
  function $(id){ return document.getElementById(id); }
  function toast(msg){
    try{
      if(window.App&&typeof window.App.toast==='function'&&window.App.toast!==toast){ return window.App.toast(msg); }
      console.info(msg);
    }catch(e){}
  }
  if(typeof window.App.toast!=='function') window.App.toast=toast;
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }
  function num(id,macDinh){
    var e=$(id); if(!e) return macDinh;
    var v=Number(e.value); return isFinite(v)?v:macDinh;
  }
  function lineDemo(){
    var core=window.CORE||{}, lines=core.lines||{}, keys=Object.keys(lines);
    var k=keys[0]; if(!k) return null;
    var l=lines[k]||{};
    return {ma:k,ten:l.ten||'Tuyến demo',ga:l.ga||[],chieuDai:Number(l.chieu_dai_m)||10000,vkt:Number(l.van_toc_khai_thac_kmh)||80};
  }
  function setHTML(id,html){ var e=$(id); if(e) e.innerHTML=html; }
  function tab(n){
    for(var i=1;i<=8;i++){
      var p=$('p'+i), t=$('t'+i);
      if(p) p.classList.toggle('u-an',i!==n);
      if(t) t.classList.toggle('on',i===n);
    }
  }
  function veBieuDoChayTau(dl){
    var pts=[]; var m=dl.tongThoiGianPhut;
    for(var i=0;i<=10;i++){ var x=30+i*72, y=220-Math.sin((i/10)*Math.PI)*150; pts.push(x+','+y); }
    setHTML('chart1',
      '<svg viewBox="0 0 780 260" style="width:100%;height:auto;border:1px solid #ddd;background:#fff">'+
      '<text x="12" y="22" font-size="13">Biểu đồ chạy tàu (demo offline)</text>'+
      '<polyline fill="none" stroke="#1f77b4" stroke-width="3" points="'+pts.join(' ')+'"></polyline>'+
      '<text x="12" y="248" font-size="12">Thời gian hành trình: '+dl.tongThoiGianPhut.toFixed(1)+' phút · Vận tốc TB: '+dl.vtb.toFixed(1)+' km/h</text>'+
      '</svg>');
  }
  function veBieuDoThoiGian(dl){
    var rows=dl.ga.map(function(g,i){ return '<tr><td>'+esc(g.ma)+'</td><td>'+esc(g.ten)+'</td><td>'+g.t+'</td></tr>'; }).join('');
    setHTML('chart2',
      '<div class="scroll"><table><thead><tr><th>Ga</th><th>Tên</th><th>Tới ga (phút)</th></tr></thead><tbody>'+rows+'</tbody></table></div>');
  }
  function veBangChiTiet(dl){
    var rows=dl.ga.map(function(g,i){
      return '<tr><td>'+(i+1)+'</td><td>'+esc(g.ma)+'</td><td>'+esc(g.ten)+'</td><td>'+g.s0+'</td><td>'+g.s1+'</td><td>'+g.t+'</td></tr>';
    }).join('');
    setHTML('tbl','<thead><tr><th>#</th><th>Mã ga</th><th>Tên ga</th><th>s0 (m)</th><th>s1 (m)</th><th>Thời gian tới (phút)</th></tr></thead><tbody>'+rows+'</tbody>');
  }
  function taoDuLieuKetQua(){
    var l=lineDemo();
    if(!l) return null;
    var vkt=Math.max(20,num('vk',l.vkt));
    var dwell=Math.max(10,num('dw',25));
    var ga=l.ga.length||3;
    var tgChay=(l.chieuDai/1000)/vkt*60;
    var tgDung=(Math.max(ga-1,1)*dwell)/60;
    var tong=tgChay+tgDung+1.5;
    var ds=(l.ga.length?l.ga:[{ma:'T1-G01',ten:'Ga đầu',s0:0,s1:100},{ma:'T1-G02',ten:'Ga giữa',s0:4800,s1:4940},{ma:'T1-G03',ten:'Ga cuối',s0:9880,s1:10000}]).map(function(g,i,arr){
      return {ma:g.ma||('G'+(i+1)),ten:g.ten||('Ga '+(i+1)),s0:Math.round(g.s0||0),s1:Math.round(g.s1||0),t:(tong*(i/Math.max(arr.length-1,1))).toFixed(1)};
    });
    return {line:l,ga:ds,tongThoiGianPhut:tong,vtb:(l.chieuDai/1000)/(tong/60)};
  }
  function run(){
    var dl=taoDuLieuKetQua();
    if(!dl){ toast('[Local Demo] Chưa có dữ liệu tuyến để mô phỏng.'); return; }
    setHTML('msg','<div class="note">'+DEMO_NOTE+'</div>');
    setHTML('kpi',
      '<div><b>Tuyến</b><br>'+esc(dl.line.ten)+'</div>'+
      '<div><b>Ga</b><br>'+dl.ga.length+'</div>'+
      '<div><b>Tổng thời gian</b><br>'+dl.tongThoiGianPhut.toFixed(1)+' phút</div>'+
      '<div><b>Vận tốc trung bình</b><br>'+dl.vtb.toFixed(1)+' km/h</div>');
    veBieuDoChayTau(dl); veBieuDoThoiGian(dl); veBangChiTiet(dl);
    setHTML('revsum','đã chạy demo offline');
    setHTML('revbody','<p class="note">'+DEMO_NOTE+'</p>');
    setHTML('chkbody','<ul><li>Dữ liệu tuyến: hợp lệ cho demo local.</li><li>Mô phỏng: chạy bằng lõi giả lập.</li></ul>');
    tab(1);
    toast('Đã chạy mô phỏng demo offline.');
  }
  function zoomBy(f){ zoom=Math.max(0.4,Math.min(3,zoom*f)); var c=$('chart1'); if(c){ c.style.transform='scale('+zoom.toFixed(2)+')'; c.style.transformOrigin='top left'; } var z=$('zinfo'); if(z) z.textContent='Zoom x'+zoom.toFixed(2); }
  function zoomReset(){ zoom=1; var c=$('chart1'); if(c){ c.style.transform=''; } var z=$('zinfo'); if(z) z.textContent=''; }
  function taiText(ten,noiDung,loai){
    var blob=new Blob([noiDung],{type:loai||'text/plain;charset=utf-8'});
    var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=ten; a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); },2000);
  }
  function expCSV(){
    var rows=[['ga','ten_ga','thoi_gian_phut']];
    var b=$('tbl'); if(b){ Array.prototype.slice.call(b.querySelectorAll('tbody tr')).forEach(function(r){ var c=r.querySelectorAll('td'); if(c.length>=6) rows.push([c[1].textContent,c[2].textContent,c[5].textContent]); }); }
    taiText('ket-qua-demo.csv',rows.map(function(r){ return r.join(','); }).join('\\n'),'text/csv;charset=utf-8');
  }
  function expSVG(){ var svg=$('chart1')&&$('chart1').querySelector('svg'); if(!svg){ toast('[Local Demo] Chưa có biểu đồ để xuất.'); return; } taiText('bieu-do-demo.svg',svg.outerHTML,'image/svg+xml;charset=utf-8'); }
  function expPDF(){ toast('[Local Demo] Xuất PDF chưa khả dụng offline. Hãy dùng CSV/SVG trong demo local.'); }
  function sweep(){ setHTML('tbs','<thead><tr><th>V_khai_thac (km/h)</th><th>T_hanh_trinh (phút)</th></tr></thead><tbody><tr><td>70</td><td>12.8</td></tr><tr><td>80</td><td>11.4</td></tr><tr><td>90</td><td>10.5</td></tr></tbody>'); setHTML('n_sw',DEMO_NOTE); tab(4); }
  function sens(){ setHTML('tbn','<thead><tr><th>Tham số</th><th>Mức</th><th>T_hanh_trinh (phút)</th></tr></thead><tbody><tr><td>Dừng đỗ</td><td>-10%</td><td>10.8</td></tr><tr><td>Dừng đỗ</td><td>+10%</td><td>12.1</td></tr></tbody>'); setHTML('n_sn',DEMO_NOTE); tab(5); }
  function benchRun(){ setHTML('bench_out','<div class="note">'+DEMO_NOTE+'</div><table><thead><tr><th>Tuyến mẫu</th><th>Công bố</th><th>Demo</th></tr></thead><tbody><tr><td>Tuyến A</td><td>18.0</td><td>18.4</td></tr><tr><td>Tuyến B</td><td>22.5</td><td>21.9</td></tr></tbody></table>'); var s=$('bench_st'); if(s) s.textContent='Đã chạy kiểm chứng demo offline'; tab(8); }
  function onPat(){ toast('[Local Demo] Đã áp dụng phương án dừng đỗ (demo).'); }
  function chkAll(v){ toast('[Local Demo] '+(v?'Chọn':'Bỏ chọn')+' toàn bộ ga (demo).'); }
  function chkIC(){ toast('[Local Demo] Chọn ga trung chuyển (demo).'); }
  function optimise(){ toast('[Local Demo] Tối ưu demo đã hoàn tất.'); run(); }
  function setAW(){ toast('[Local Demo] Đã cập nhật thông số đoàn tàu (demo).'); }
  function loadXlsx(){ toast('[Local Demo] Nạp Excel offline chưa hỗ trợ đầy đủ, đang dùng dữ liệu fixture.'); }
  function check(){ setHTML('chkbody','<ul><li>Không phát hiện lỗi cấu trúc trong fixture demo local.</li></ul>'); var c=$('chkbox'); if(c) c.open=true; toast('Kiểm tra dữ liệu demo hoàn tất.'); }
  function expXlsxKQ(){ toast('[Local Demo] Xuất Excel kết quả chưa khả dụng offline.'); }
  window.run=window.run||run;
  window.tab=window.tab||tab;
  window.zoomBy=window.zoomBy||zoomBy;
  window.zoomReset=window.zoomReset||zoomReset;
  window.expCSV=window.expCSV||expCSV;
  window.expSVG=window.expSVG||expSVG;
  window.expPDF=window.expPDF||expPDF;
  window.sweep=window.sweep||sweep;
  window.sens=window.sens||sens;
  window.benchRun=window.benchRun||benchRun;
  window.onPat=window.onPat||onPat;
  window.chkAll=window.chkAll||chkAll;
  window.chkIC=window.chkIC||chkIC;
  window.optimise=window.optimise||optimise;
  window.setAW=window.setAW||setAW;
  window.loadXlsx=window.loadXlsx||loadXlsx;
  window.check=window.check||check;
  window.expXlsxKQ=window.expXlsxKQ||expXlsxKQ;
  if(typeof window.App.exportData!=='function') window.App.exportData=function(){ toast('[Local Demo] Chưa có dữ liệu xuất chuẩn backend.'); };
  if(typeof window.App.exportResults!=='function') window.App.exportResults=function(){ expCSV(); };
  if(typeof window.App.check!=='function') window.App.check=check;
  if(typeof window.App.report!=='function') window.App.report=function(phanHe){ toast('[Local Demo] Báo cáo '+phanHe+' chưa khả dụng offline.'); };
  setTimeout(run,0);
  document.dispatchEvent(new Event('app:san-sang'));
})();`;

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
