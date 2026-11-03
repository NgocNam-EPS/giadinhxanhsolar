/* Gia Đình Xanh Solar: công cụ ước tính + form khảo sát */
(function () {
  'use strict';

  /* ================= CẤU HÌNH =================
     GOOGLE_SCRIPT_URL: dán link Web App của Google Apps Script (xem HUONG-DAN-TRIEN-KHAI.md).
     Để trống thì form không gửi được và sẽ hướng khách gọi / nhắn Zalo. */
  var CONFIG = {
    GOOGLE_SCRIPT_URL: '',
    HOTLINE: '0762 252 595',
    ZALO_URL: 'https://zalo.me/0762252595',
    VAT: 0.08,                       // VAT điện sinh hoạt đang áp dụng
    PANEL_WP: 580,                   // công suất 1 tấm pin
    PANEL_AREA: 2.6,                 // m² mái cho mỗi tấm (gồm khoảng hở)
    SELF_USE: 0.75,                  // tỉ lệ điện mặt trời dùng trực tiếp trong nhà
    SELL_PRICE: 0,                   // đ/kWh bán điện dư; để 0 = không tính vào tiết kiệm
    PRICE_PER_KWP: [                 // chi phí hòa lưới tham khảo (đ/kWp) theo quy mô
      [4, 12000000], [6, 11200000], [10, 10500000], [Infinity, 9800000]
    ]
  };

  // Biểu giá điện sinh hoạt 6 bậc, chưa VAT (QĐ 1279/QĐ-BCT ngày 09/5/2025)
  var TIERS = [[50, 1984], [50, 2050], [100, 2380], [100, 2998], [100, 3350], [Infinity, 3460]];

  function costOf(kwh) {
    var rest = Math.max(0, kwh), total = 0;
    for (var i = 0; i < TIERS.length && rest > 0; i++) {
      var use = Math.min(rest, TIERS[i][0]);
      total += use * TIERS[i][1]; rest -= use;
    }
    return total;
  }
  function kwhFromBill(billWithVat) {
    var pre = billWithVat / (1 + CONFIG.VAT), kwh = 0;
    for (var i = 0; i < TIERS.length; i++) {
      var block = TIERS[i][0] * TIERS[i][1];
      if (pre <= block) return kwh + pre / TIERS[i][1];
      pre -= block; kwh += TIERS[i][0];
    }
    return kwh;
  }
  function pricePerKwp(kwp) {
    for (var i = 0; i < CONFIG.PRICE_PER_KWP.length; i++) if (kwp <= CONFIG.PRICE_PER_KWP[i][0]) return CONFIG.PRICE_PER_KWP[i][1];
    return CONFIG.PRICE_PER_KWP[CONFIG.PRICE_PER_KWP.length - 1][1];
  }

  function estimate(bill, yieldPerDay, dayShare) {
    var kwh = kwhFromBill(bill);
    var monthlyPerKwp = yieldPerDay * 30;
    var target = kwh * dayShare;
    var panels = Math.max(4, Math.min(60, Math.round((target / monthlyPerKwp) / (CONFIG.PANEL_WP / 1000))));
    var kwp = panels * CONFIG.PANEL_WP / 1000;
    var prod = kwp * monthlyPerKwp;
    var selfUsed = Math.min(prod * CONFIG.SELF_USE, kwh);
    var surplus = Math.min(prod - selfUsed, prod * 0.5);
    var newKwh = kwh - selfUsed;
    var newBill = costOf(newKwh) * (1 + CONFIG.VAT);
    var save = Math.max(0, bill - newBill) + surplus * CONFIG.SELL_PRICE;
    var cost = kwp * pricePerKwp(kwp);
    return {
      kwh: kwh, panels: panels, kwp: kwp, prod: prod, newBill: newBill, save: save, cost: cost,
      area: panels * CONFIG.PANEL_AREA, payback: save > 0 ? cost / (save * 12) : null
    };
  }

  var fmt = new Intl.NumberFormat('vi-VN');
  var fmt1 = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  function money(v) { return fmt.format(Math.round(v / 1000) * 1000); }
  function trieu(v) { return fmt1.format(v / 1e6); }
  function $(id) { return document.getElementById(id); }

  /* ---------- Chip chọn một ---------- */
  function selectChip(chip) {
    var group = chip.closest('.gdx-chips');
    group.querySelectorAll('.gdx-chip').forEach(function (c) {
      var on = c === chip;
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
      c.setAttribute('aria-checked', on ? 'true' : 'false');
    });
  }
  document.querySelectorAll('.gdx-chips[role="radiogroup"]').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var chip = e.target.closest('.gdx-chip');
      if (!chip) return;
      selectChip(chip);
      group.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
  function chipValue(scope, name) {
    var g = scope.querySelector('.gdx-chips[data-name="' + name + '"]');
    var on = g && g.querySelector('.gdx-chip[aria-pressed="true"]');
    return on ? on.getAttribute('data-value') : '';
  }
  function chipSelectByValue(scope, name, value) {
    var g = scope.querySelector('.gdx-chips[data-name="' + name + '"]');
    if (!g) return;
    var chip = g.querySelector('.gdx-chip[data-value="' + value + '"]');
    if (chip) selectChip(chip);
  }
  function billRangeLabel(bill) {
    if (bill < 1e6) return 'Dưới 1 triệu';
    if (bill < 2e6) return '1 – 2 triệu';
    if (bill <= 4e6) return '2 – 4 triệu';
    return 'Trên 4 triệu';
  }

  /* ---------- Công cụ ước tính ---------- */
  var range = $('billRange'), input = $('billInput'), last = null;
  function currentChip(id, attr, fallback) {
    var c = document.querySelector('#' + id + ' .gdx-chip[aria-pressed="true"]');
    return c ? parseFloat(c.getAttribute(attr)) : fallback;
  }
  function render(bill) {
    var r = estimate(bill, currentChip('regionChips', 'data-yield', 4.2), currentChip('dayChips', 'data-day', 0.6));
    last = { bill: bill, r: r };
    $('billOut').textContent = fmt.format(bill) + 'đ';
    $('rSave').innerHTML = money(r.save) + '<small>đ</small>';
    $('rSaveNote').textContent = 'Hóa đơn còn khoảng ' + money(r.newBill) + 'đ (' + fmt.format(Math.round(r.kwh)) + ' kWh/tháng hiện tại)';
    $('rKwp').innerHTML = fmt1.format(r.kwp) + '<small>kWp</small>';
    $('rPanels').textContent = r.panels + ' tấm pin ' + CONFIG.PANEL_WP + ' Wp';
    $('rKwh').innerHTML = fmt.format(Math.round(r.prod / 10) * 10) + '<small>kWh/tháng</small>';
    $('rArea').textContent = 'Cần khoảng ' + Math.ceil(r.area) + ' m² mái trống nắng';
    $('rCost').innerHTML = '≈ ' + trieu(r.cost) + '<small>triệu</small>';
    $('rPayback').textContent = r.payback ? 'Hoàn vốn khoảng ' + fmt1.format(r.payback) + ' năm' : 'Cần khảo sát để tính';
    $('cBefore').textContent = money(bill) + 'đ';
    $('cAfter').textContent = money(r.newBill) + 'đ';
    $('barBefore').style.width = '100%';
    $('barAfter').style.width = Math.max(4, Math.min(100, r.newBill / bill * 100)) + '%';
  }
  function parseMoney(s) { var n = parseInt(String(s).replace(/[^\d]/g, ''), 10); return isNaN(n) ? 0 : n; }

  if (range && input) {
    range.addEventListener('input', function () { input.value = fmt.format(+range.value); render(+range.value); });
    input.addEventListener('input', function () {
      var v = parseMoney(input.value);
      if (v >= 100000 && v <= 200000000) { range.value = Math.min(10000000, Math.max(500000, v)); render(v); }
    });
    input.addEventListener('blur', function () {
      var v = parseMoney(input.value);
      if (v < 100000) v = +range.value;
      input.value = fmt.format(v);
    });
    $('regionChips').addEventListener('change', function () { render(parseMoney(input.value) || +range.value); });
    $('dayChips').addEventListener('change', function () { render(parseMoney(input.value) || +range.value); });
    render(+range.value);
  }

  // Số liệu ví dụ trên hero tính bằng cùng công thức
  var hero = $('heroSave');
  if (hero) hero.textContent = '≈ ' + trieu(estimate(2300000, 4.2, 0.6).save).replace(/,0$/, '') + ' triệu';

  /* ---------- Đưa dữ liệu ước tính / gói vào form ---------- */
  var survey = $('surveyForm');
  function goToSurvey() {
    document.getElementById('bao-gia').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    setTimeout(function () { $('sName').focus({ preventScroll: true }); }, 500);
  }
  var calcCta = $('calcCta');
  if (calcCta) calcCta.addEventListener('click', function () {
    if (!last) return;
    $('sEstimate').value = 'Hóa đơn ' + fmt.format(last.bill) + 'đ; đề xuất ' + fmt1.format(last.r.kwp) + ' kWp (' + last.r.panels + ' tấm); tiết kiệm ≈ ' + money(last.r.save) + 'đ/tháng';
    chipSelectByValue(survey, 'bill', billRangeLabel(last.bill));
    goToSurvey();
  });
  document.querySelectorAll('[data-package]').forEach(function (a) {
    a.addEventListener('click', function () { $('sPackage').value = a.getAttribute('data-package'); });
  });

  /* ---------- Gửi form ---------- */
  function normPhone(s) { return String(s).replace(/[^\d+]/g, '').replace(/^\+?84/, '0'); }
  function validPhone(s) { return /^0(3|5|7|8|9)\d{8}$/.test(normPhone(s)); }
  function setError(inputEl, msg) {
    var field = inputEl.closest('.gdx-field'), hint = field.querySelector('.gdx-hint');
    field.classList.toggle('gdx-field--error', !!msg);
    inputEl.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (hint) {
      if (!hint.dataset.default) hint.dataset.default = hint.textContent;
      hint.textContent = msg || hint.dataset.default;
      hint.hidden = !msg && !hint.dataset.default;
    }
  }
  function status(form, kind, html) {
    var box = form.querySelector('.form-status');
    box.hidden = false;
    box.className = 'form-status form-status--' + kind;
    box.innerHTML = html;
  }
  function utm() {
    var p = new URLSearchParams(location.search), out = [];
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'fbclid'].forEach(function (k) { if (p.get(k)) out.push(k + '=' + p.get(k)); });
    return out.join('&');
  }
  function send(form, data, okMsg) {
    var btn = form.querySelector('button[type="submit"]');
    var contact = 'Gọi <a href="tel:0762252595">' + CONFIG.HOTLINE + '</a> hoặc <a href="' + CONFIG.ZALO_URL + '" target="_blank" rel="noopener">nhắn Zalo</a>.';
    if (!CONFIG.GOOGLE_SCRIPT_URL) {
      console.warn('[Gia Đình Xanh] Chưa cấu hình GOOGLE_SCRIPT_URL trong assets/js/main.js');
      status(form, 'err', 'Form đang bảo trì, thông tin chưa gửi được. Anh/chị vui lòng ' + contact);
      return;
    }
    data.time = new Date().toLocaleString('vi-VN');
    data.page = location.href.split('?')[0];
    data.utm = utm();
    btn.disabled = true;
    var oldText = btn.textContent; btn.textContent = 'Đang gửi...';
    fetch(CONFIG.GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(data) })
      .then(function () {
        status(form, 'ok', okMsg);
        form.reset && form.reset();
        if (window.fbq) window.fbq('track', 'Lead');
        if (window.gtag) window.gtag('event', 'generate_lead');
      })
      .catch(function () {
        status(form, 'err', 'Mạng đang chập chờn nên chưa gửi được. Anh/chị thử lại, hoặc ' + contact);
      })
      .then(function () { btn.disabled = false; btn.textContent = oldText; });
  }

  var quick = $('quickForm');
  if (quick) quick.addEventListener('submit', function (e) {
    e.preventDefault();
    var ph = $('qPhone');
    if (!validPhone(ph.value)) { setError(ph, 'Số điện thoại cần đủ 10 chữ số, ví dụ 0762 252 595.'); ph.focus(); return; }
    setError(ph, '');
    send(quick, { source: 'Form nhanh (hero)', phone: normPhone(ph.value), bill: chipValue(quick, 'bill') },
      '<b>Đã nhận số ' + ph.value + '.</b> Kỹ sư Gia Đình Xanh sẽ gọi lại trong giờ làm việc. Muốn được báo giá sát hơn, anh/chị <a href="#bao-gia">trả lời thêm vài câu</a>.');
  });

  if (survey) survey.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('sName'), ph = $('sPhone'), bad = null;
    if (!name.value.trim()) { setError(name, 'Vui lòng cho biết tên để kỹ sư tiện xưng hô.'); bad = bad || name; } else setError(name, '');
    if (!validPhone(ph.value)) { setError(ph, 'Số điện thoại cần đủ 10 chữ số, ví dụ 0762 252 595.'); bad = bad || ph; } else setError(ph, '');
    if (bad) { bad.focus(); return; }
    send(survey, {
      source: 'Form khảo sát',
      name: name.value.trim(), phone: normPhone(ph.value), address: $('sAddress').value.trim(),
      bill: chipValue(survey, 'bill'), roof: chipValue(survey, 'roof'), building: chipValue(survey, 'building'),
      need: chipValue(survey, 'need'), note: $('sNote').value.trim(),
      package: $('sPackage').value, estimate: $('sEstimate').value
    }, '<b>Cảm ơn anh/chị ' + name.value.trim() + '!</b> Kỹ sư sẽ gọi số ' + ph.value + ' để hẹn lịch khảo sát. Có thể gửi trước ảnh hóa đơn điện qua <a href="' + CONFIG.ZALO_URL + '" target="_blank" rel="noopener">Zalo ' + CONFIG.HOTLINE + '</a>.');
  });

  var y = $('year'); if (y) y.textContent = new Date().getFullYear();
})();
