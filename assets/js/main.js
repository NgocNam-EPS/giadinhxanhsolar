/* Gia Đình Xanh Solar: công cụ ước tính + form khảo sát (dùng i18n.js cho VI / EN / 中文) */
(function () {
  'use strict';

  /* ================= CẤU HÌNH =================
     GOOGLE_SCRIPT_URL: link Web App của Google Apps Script (xem HUONG-DAN-TRIEN-KHAI.md).
     Để trống thì form không gửi được và sẽ hướng khách gọi / nhắn Zalo. */
  var CONFIG = {
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxPOBPA8CFzwE-7t1_npAOkfOZdDihD9N1y6w8O7VX6ywapDA1cS0fZ0yhncTkTENUpAA/exec',
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

  var I = window.GDXI18N;
  var LANG_TAG = { vi: '', en: ' [EN]', zh: ' [中文]' };

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

  // Định dạng tiếng Việt cố định cho dữ liệu gửi về Google Sheets
  var fmtVi = new Intl.NumberFormat('vi-VN');
  var fmtVi1 = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  function moneyVi(v) { return fmtVi.format(Math.round(v / 1000) * 1000); }

  function $(id) { return document.getElementById(id); }
  function moneyText(v) { var m = I.money(v); return m[0] + m[1]; }
  function moneyHtml(v) { var m = I.money(v); return m[0] + '<small>' + m[1].trim() + '</small>'; }
  function bigHtml(v) { var b = I.big(v); return '≈ ' + b[0] + '<small>' + b[1] + '</small>'; }

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
  // Giá trị gửi về Sheet luôn là tiếng Việt (data-value), bất kể khách xem ngôn ngữ nào
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
  function parseMoney(s) { var n = parseInt(String(s).replace(/[^\d]/g, ''), 10); return isNaN(n) ? 0 : n; }
  function currentBill() { return parseMoney(input.value) || +range.value; }

  function render(bill) {
    var r = estimate(bill, currentChip('regionChips', 'data-yield', 4.2), currentChip('dayChips', 'data-day', 0.6));
    last = { bill: bill, r: r };
    $('billOut').textContent = I.num(bill) + I.money(0)[1];
    $('rSave').innerHTML = moneyHtml(r.save);
    $('rSaveNote').textContent = I.t('newBill', { bill: moneyText(r.newBill), kwh: I.num(Math.round(r.kwh)) });
    $('rKwp').innerHTML = I.num1(r.kwp) + '<small>kWp</small>';
    $('rPanels').textContent = I.t('panels', { n: r.panels, wp: CONFIG.PANEL_WP });
    $('rKwh').innerHTML = I.num(Math.round(r.prod / 10) * 10) + '<small>' + I.t('kwhMonth') + '</small>';
    $('rArea').textContent = I.t('area', { m: Math.ceil(r.area) });
    $('rCost').innerHTML = bigHtml(r.cost);
    $('rPayback').textContent = r.payback ? I.t('payback', { y: I.num1(r.payback) }) : I.t('paybackNa');
    $('cBefore').textContent = moneyText(bill);
    $('cAfter').textContent = moneyText(r.newBill);
    $('barBefore').style.width = '100%';
    $('barAfter').style.width = Math.max(4, Math.min(100, r.newBill / bill * 100)) + '%';
  }
  function renderHero() {
    var hero = $('heroSave');
    if (!hero) return;
    var b = I.big(estimate(2300000, 4.2, 0.6).save);
    hero.textContent = '≈ ' + b[0] + (I.lang === 'vi' ? ' ' : '') + b[1];
  }

  if (range && input) {
    range.addEventListener('input', function () { input.value = I.num(+range.value); render(+range.value); });
    input.addEventListener('input', function () {
      var v = parseMoney(input.value);
      if (v >= 100000 && v <= 200000000) { range.value = Math.min(10000000, Math.max(500000, v)); render(v); }
    });
    input.addEventListener('blur', function () {
      var v = parseMoney(input.value);
      if (v < 100000) v = +range.value;
      input.value = I.num(v);
    });
    $('regionChips').addEventListener('change', function () { render(currentBill()); });
    $('dayChips').addEventListener('change', function () { render(currentBill()); });
    input.value = I.num(+range.value);
    render(+range.value);
  }
  renderHero();

  // Đổi ngôn ngữ: vẽ lại các con số theo định dạng mới, cập nhật thông báo lỗi đang hiện
  document.addEventListener('gdx:lang', function () {
    if (range && input) { var v = currentBill(); input.value = I.num(v); render(v); }
    renderHero();
    document.querySelectorAll('.gdx-field--error').forEach(function (f) {
      var el = f.querySelector('.gdx-input');
      if (el) setError(el, I.t(el.id === 'sName' ? 'errName' : 'errPhone'));
    });
  });

  /* ---------- Đưa dữ liệu ước tính / gói vào form ---------- */
  var survey = $('surveyForm');
  function goToSurvey() {
    document.getElementById('bao-gia').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    setTimeout(function () { $('sName').focus({ preventScroll: true }); }, 500);
  }
  var calcCta = $('calcCta');
  if (calcCta) calcCta.addEventListener('click', function () {
    if (!last) return;
    $('sEstimate').value = 'Hóa đơn ' + fmtVi.format(last.bill) + 'đ; đề xuất ' + fmtVi1.format(last.r.kwp) + ' kWp (' + last.r.panels + ' tấm); tiết kiệm ≈ ' + moneyVi(last.r.save) + 'đ/tháng';
    chipSelectByValue(survey, 'bill', billRangeLabel(last.bill));
    goToSurvey();
  });
  document.querySelectorAll('[data-package]').forEach(function (a) {
    a.addEventListener('click', function () { $('sPackage').value = a.getAttribute('data-package'); });
  });

  /* ---------- Gửi form ---------- */
  function normPhone(s) {
    var d = String(s).replace(/[^\d+]/g, '');
    return /^\+?84/.test(d) ? d.replace(/^\+?84/, '0') : d;
  }
  // Số Việt Nam 10 chữ số, hoặc số quốc tế dạng +mã nước (cho khách nước ngoài)
  function validPhone(s) { var p = normPhone(s); return /^0(3|5|7|8|9)\d{8}$/.test(p) || /^\+\d{8,15}$/.test(p); }
  function setError(inputEl, msg) {
    var field = inputEl.closest('.gdx-field'), hint = field.querySelector('.gdx-hint');
    field.classList.toggle('gdx-field--error', !!msg);
    inputEl.setAttribute('aria-invalid', msg ? 'true' : 'false');
    // Các ô có báo lỗi (tên, số điện thoại) dùng ô gợi ý trống, ẩn sẵn
    if (hint) { hint.textContent = msg || ''; hint.hidden = !msg; }
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
  function send(form, data, okHtml) {
    var btn = form.querySelector('button[type="submit"]');
    if (!CONFIG.GOOGLE_SCRIPT_URL) {
      console.warn('[Gia Đình Xanh] Chưa cấu hình GOOGLE_SCRIPT_URL trong assets/js/main.js');
      status(form, 'err', I.t('maint') + I.t('contact'));
      return;
    }
    data.source = data.source + LANG_TAG[I.lang];
    data.time = new Date().toLocaleString('vi-VN');
    data.page = location.href.split('?')[0];
    data.utm = utm();
    btn.disabled = true;
    var oldText = btn.textContent; btn.textContent = I.t('sending');
    fetch(CONFIG.GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(data) })
      .then(function () {
        status(form, 'ok', okHtml);
        form.reset && form.reset();
        if (window.fbq) window.fbq('track', 'Lead');
        if (window.gtag) window.gtag('event', 'generate_lead');
      })
      .catch(function () { status(form, 'err', I.t('net') + I.t('contact')); })
      .then(function () { btn.disabled = false; btn.textContent = oldText; });
  }

  var quick = $('quickForm');
  if (quick) quick.addEventListener('submit', function (e) {
    e.preventDefault();
    var ph = $('qPhone');
    if (!validPhone(ph.value)) { setError(ph, I.t('errPhone')); ph.focus(); return; }
    setError(ph, '');
    send(quick, { source: 'Form nhanh (hero)', phone: normPhone(ph.value), bill: chipValue(quick, 'bill') },
      I.t('okQuick', { phone: I.esc(ph.value) }));
  });

  if (survey) survey.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('sName'), ph = $('sPhone'), bad = null;
    if (!name.value.trim()) { setError(name, I.t('errName')); bad = bad || name; } else setError(name, '');
    if (!validPhone(ph.value)) { setError(ph, I.t('errPhone')); bad = bad || ph; } else setError(ph, '');
    if (bad) { bad.focus(); return; }
    send(survey, {
      source: 'Form khảo sát',
      name: name.value.trim(), phone: normPhone(ph.value), address: $('sAddress').value.trim(),
      bill: chipValue(survey, 'bill'), roof: chipValue(survey, 'roof'), building: chipValue(survey, 'building'),
      need: chipValue(survey, 'need'), note: $('sNote').value.trim(),
      package: $('sPackage').value, estimate: $('sEstimate').value
    }, I.t('okSurvey', { name: I.esc(name.value.trim()), phone: I.esc(ph.value) }));
  });

  var y = $('year'); if (y) y.textContent = new Date().getFullYear();
})();
