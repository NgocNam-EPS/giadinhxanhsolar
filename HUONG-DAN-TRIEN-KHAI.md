# Hướng dẫn đưa website Gia Đình Xanh Solar lên mạng

Thư mục `website` gồm:

| File | Dùng để |
|---|---|
| `index.html` | Trang chủ |
| `assets/css/tokens.css` | Màu, chữ, khoảng cách (từ Design System) |
| `assets/css/components.css` | Nút, form, card... |
| `assets/css/site.css` | Bố cục trang chủ |
| `assets/js/main.js` | Công cụ ước tính tiết kiệm + gửi form. **Phần CẤU HÌNH ở đầu file** |
| `assets/js/i18n.js` | Bản dịch tiếng Anh và tiếng Trung, nút chọn ngôn ngữ |
| `assets/img/` | Logo, favicon, ảnh công trình, ảnh chia sẻ Facebook |
| `google-apps-script.gs` | Mã nhận form vào Google Sheets |

Xem thử trên máy: nhấp đúp `index.html`.

---

## 1. Đưa web lên mạng (miễn phí, khoảng 5 phút)

**Cách nhanh nhất: Netlify Drop**
1. Mở https://app.netlify.com/drop và đăng nhập (có thể dùng Google).
2. Kéo cả thư mục `website` thả vào trang.
3. Netlify cấp link dạng `ten-ngau-nhien.netlify.app`. Vào *Site configuration → Change site name* để đổi thành `giadinhxanhsolar.netlify.app`.
4. Lần sau sửa web: vào *Deploys*, kéo thả lại thư mục.

Cách khác: Vercel, GitHub Pages, Cloudflare Pages hoặc hosting đi kèm tên miền.

**Tên miền riêng** (nên có khi chạy quảng cáo): mua `giadinhxanhsolar.vn` hoặc `.com` tại nhà đăng ký tên miền Việt Nam, rồi trong Netlify vào *Domain management → Add a domain* và làm theo hướng dẫn trỏ DNS.

## 2. Nhận thông tin khách vào Google Sheets

Chưa làm bước này thì form chưa gửi được; khách sẽ được hướng sang gọi/Zalo.

1. Tạo Google Sheet mới, đặt tên "Khách hàng Gia Đình Xanh".
2. Menu **Tiện ích mở rộng → Apps Script**. Xóa code mẫu, dán toàn bộ nội dung `google-apps-script.gs`.
3. Muốn nhận email khi có khách: điền email vào dòng `var NOTIFY_EMAIL = '';`
4. Bấm **Lưu**, rồi **Triển khai → Tùy chọn triển khai mới**:
   - Loại: **Ứng dụng web**
   - Thực thi dưới dạng: **Tôi**
   - Người có quyền truy cập: **Bất kỳ ai**
5. Bấm Triển khai, cấp quyền khi được hỏi, sao chép **URL ứng dụng web** (dạng `https://script.google.com/macros/s/.../exec`).
6. Mở `assets/js/main.js`, dán URL vào dòng `GOOGLE_SCRIPT_URL: '',` (giữa hai dấu nháy).
7. Tải lại web lên Netlify, gửi thử một form, kiểm tra Sheet có dòng mới.

Mỗi khách là một dòng: thời gian, nguồn form, tên, số điện thoại, địa chỉ, tiền điện, loại mái, nhu cầu, gói quan tâm, kết quả ước tính, ghi chú, thông tin quảng cáo (UTM), và cột **Trạng thái** để đánh dấu đã gọi/đã khảo sát.

## 3. Gắn Meta Pixel cho quảng cáo Facebook

1. Vào Meta Events Manager, tạo Pixel, lấy **Pixel ID** (dãy số).
2. Trong `index.html`, tìm khối `META PIXEL` ở phần `<head>`: xóa dòng `<!-- ===== META PIXEL` và dòng `===== HẾT META PIXEL ===== -->`, thay `YOUR_PIXEL_ID` bằng ID của bạn.
3. Trang tự gửi sự kiện **Lead** mỗi khi khách gửi form thành công. Dùng sự kiện này để tối ưu quảng cáo theo khách để lại số điện thoại.
4. Link quảng cáo nên gắn UTM, ví dụ `https://giadinhxanhsolar.vn/?utm_source=facebook&utm_campaign=thang11`. Thông tin này được ghi vào cột "Quảng cáo (UTM)" trong Sheet.

## 4. Cần kiểm tra và chỉnh trước khi chạy quảng cáo

Các nội dung dưới đây là số liệu tham khảo hoặc mặc định. Hãy sửa theo thực tế của công ty:

- **Giá các gói** (≈ 42 / 58,5 / 132 triệu) và **bảng báo giá mẫu** trong `index.html`: thay bằng giá và thương hiệu thiết bị thật.
- **Bảo hành** (tấm pin 12 năm, inverter 10 năm): sửa theo hãng bạn dùng.
- **Chi phí/kWp trong công cụ ước tính**: dòng `PRICE_PER_KWP` trong `main.js`. Giá thấp thì thời gian hoàn vốn hiển thị sẽ ngắn hơn thực tế.
- **Sản lượng mỗi kWp theo vùng** (Nam 4,2 / Trung 4,0 / Bắc 3,3 kWh/kWp/ngày): chỉnh theo số liệu công trình thật.
- **Quy trình 4 bước và số ngày**: sửa theo cách đội thi công làm.
- **Công trình thực tế**: thêm địa điểm, công suất kWp; có thể thay/thêm ảnh trong `assets/img/`.
- **Giá điện**: theo Quyết định 1279/QĐ-BCT (09/5/2025), VAT 8%. Khi EVN đổi giá, sửa mảng `TIERS` và `VAT` trong `main.js`, và bảng 6 bậc trong `index.html`.
- **Mục hỏi đáp về bán điện dư** (tối đa 50%, quy định sửa đổi 06/2026): nên kiểm tra lại số hiệu nghị định khi công bố chính thức.
- Chưa có mục **đánh giá của khách hàng**. Khi có nhận xét thật (kèm tên, khu vực, sự đồng ý của khách), thêm vào sau phần Công trình.

## 5. Đa ngôn ngữ (VI / EN / 中文)

- Nút **VI / EN / 中文** ở đầu trang. Trang nhớ ngôn ngữ khách đã chọn cho lần sau.
- Link mở thẳng một ngôn ngữ (dùng cho quảng cáo nhắm người nước ngoài):
  - Tiếng Anh: `https://giadinhxanhsolar.vn/?lang=en`
  - Tiếng Trung: `https://giadinhxanhsolar.vn/?lang=zh`
- Tiếng Việt là nội dung gốc trong `index.html`. Bản dịch nằm trong `assets/js/i18n.js`: phần `STATIC.en`, `STATIC.zh` cho chữ trên trang; phần `DYNAMIC` cho chữ của công cụ ước tính và thông báo form.
- **Khi sửa một câu tiếng Việt** trong `index.html`, nhớ sửa câu tương ứng (cùng khóa `data-i18n`) trong `i18n.js` cho tiếng Anh và tiếng Trung.
- Dữ liệu gửi về Google Sheets vẫn bằng tiếng Việt. Cột "Nguồn form" có thêm `[EN]` hoặc `[中文]` để biết khách xem trang bằng ngôn ngữ nào.
- Khách nước ngoài có thể nhập số điện thoại quốc tế dạng `+86...`, `+1...`.
- Tiếng Trung dùng chữ giản thể (简体). Nên nhờ người bản ngữ đọc lại bản dịch trước khi chạy quảng cáo bằng tiếng Trung.

## 6. Liên hệ đang dùng trên web

- Hotline/Zalo: 0762 252 595 (`tel:0762252595`, `https://zalo.me/0762252595`)
- Facebook: https://www.facebook.com/giadinhxanhsolar
