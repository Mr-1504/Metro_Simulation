# Metro_Simulation — Mô phỏng chạy tàu Đường sắt đô thị (bản web)

Trang tĩnh chạy trên GitHub Pages: https://lehtung.github.io/Metro_Simulation/

Kho này chỉ chứa **lớp giao diện** (HTML, CSS) và **khung** đăng nhập / gọi máy chủ. Mã tính toán, dữ liệu 5 tuyến,
bộ thông số và tài khoản nằm trên Google Apps Script + Google Sheet của Ban Quản lý, chỉ được gửi về trình duyệt sau khi đăng nhập.

Tệp duy nhất cần sửa khi triển khai: `js/khung/cau-hinh.js` → dán địa chỉ Web App của Apps Script vào `API_URL`.

Các tệp trong kho được **sinh tự động** bởi `07_TRIEN_KHAI_WEB/cong_cu/dung_ban_web.mjs` trong gói bàn giao — không sửa tay
ở đây, hãy sửa mã nguồn rồi dựng lại (xem `HUONG_DAN_TRIEN_KHAI.md` trong gói bàn giao).

## Chạy local demo an toàn (không cần Google Apps Script/Sheet)

### Khởi chạy

Tại thư mục repository:

```bash
python -m http.server 8000
```

Mở trình duyệt: `http://localhost:8000` (hoặc `http://127.0.0.1:8000`).

### Mock mode hoạt động khi nào?

- Mock local **chỉ tự bật** khi hostname là `localhost` hoặc `127.0.0.1`.
- Trên GitHub Pages / production, ứng dụng vẫn dùng `API_URL` thật và luồng xác thực thật như trước.

### Mock mode làm gì?

- Bỏ qua form đăng nhập bằng tài khoản local demo (`quan_tri`) để vào ứng dụng nhanh.
- Cung cấp fixture dữ liệu local cho các bảng bắt buộc:
  - `DL_TUYEN`, `DL_GA`, `DL_DUONG_CONG`, `DL_TRAC_DOC`, `DL_GHI`,
    `DL_HAN_CHE`, `DL_HINH_HOC_TUYEN`, `DL_DEPOT`, `DL_DEPOT_TOA_DO`.
- Cung cấp mã logic demo tối thiểu để ứng dụng phát sự kiện `app:san-sang` và khởi động giao diện.
- Cung cấp luồng mô phỏng offline mức demo cho các thao tác chính (TÍNH TOÁN, chuyển tab kết quả, bảng/biểu đồ mẫu, xuất CSV/SVG mức cơ bản).

### Giới hạn của local demo

- Đây là dữ liệu mô phỏng/offline để phát triển UI và kiểm tra luồng khởi động.
- Các phép tính và báo cáo trong offline demo là kết quả giả lập, không thay thế kiểm chứng nghiệp vụ trên backend thật.
- Không chứa và không yêu cầu bất kỳ credential/secret của backend gốc.

### Cảnh báo production

- Không dùng mock mode để triển khai production.
- Không thay đổi `API_URL` production bằng dữ liệu mock.
