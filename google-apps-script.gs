/**
 * Gia Đình Xanh Solar: nhận form báo giá từ website và ghi vào Google Sheets.
 * Cách cài: xem HUONG-DAN-TRIEN-KHAI.md, mục 2.
 *
 * NOTIFY_EMAIL: email nhận thông báo mỗi khi có khách mới (để trống nếu không cần).
 */
var NOTIFY_EMAIL = '';
var SHEET_NAME = 'Khách hàng';
var COLUMNS = [
  ['time', 'Thời gian'], ['source', 'Nguồn form'], ['name', 'Họ tên'], ['phone', 'Số điện thoại'],
  ['address', 'Địa chỉ'], ['bill', 'Tiền điện/tháng'], ['roof', 'Loại mái'], ['building', 'Công trình'],
  ['need', 'Nhu cầu'], ['package', 'Gói quan tâm'], ['estimate', 'Kết quả ước tính'], ['note', 'Ghi chú'],
  ['utm', 'Quảng cáo (UTM)'], ['page', 'Trang']
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var p = (e && e.parameter) || {};
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(COLUMNS.map(function (c) { return c[1]; }).concat(['Trạng thái']));
      sh.getRange(1, 1, 1, COLUMNS.length + 1).setFontWeight('bold').setBackground('#e6f3e0');
      sh.setFrozenRows(1);
    }
    var row = COLUMNS.map(function (c) { return String(p[c[0]] || '').slice(0, 1000); });
    // Ghi số điện thoại dạng chữ để giữ số 0 đầu
    row[3] = "'" + row[3];
    sh.appendRow(row.concat(['Mới']));

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: 'Khách mới: ' + (p.name || 'Chưa có tên') + ' – ' + (p.phone || ''),
        body: COLUMNS.map(function (c) { return c[1] + ': ' + (p[c[0]] || ''); }).join('\n')
      });
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
