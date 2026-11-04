/* Gia Đình Xanh Solar: đa ngôn ngữ VI / EN / 中文 (giản thể)
   - Tiếng Việt là nội dung gốc trong index.html.
   - EN và ZH lấy từ từ điển STATIC bên dưới, theo khóa data-i18n.
   - DYNAMIC: câu do JavaScript tạo ra (công cụ ước tính, thông báo form), có đủ 3 ngôn ngữ.
   Sửa bản dịch: tìm đúng khóa và sửa chữ trong dấu nháy. */
(function () {
  'use strict';

  var LANGS = { vi: 'vi', en: 'en', zh: 'zh-CN' };
  var STORE_KEY = 'gdx-lang';

  var META = {
    vi: { title: 'Gia Đình Xanh Solar | Lắp điện mặt trời mái nhà, báo giá miễn phí',
          desc: 'Lắp điện mặt trời mái nhà cho gia đình. Ước tính tiền tiết kiệm theo hóa đơn điện, khảo sát mái miễn phí, báo giá trọn gói. Gọi hoặc Zalo 0762 252 595.' },
    en: { title: 'Gia Đình Xanh Solar | Rooftop solar installation, free quote',
          desc: 'Rooftop solar for homes in Vietnam. Estimate your savings from your electricity bill, get a free roof survey and an all-inclusive quote. Call or Zalo 0762 252 595.' },
    zh: { title: 'Gia Đình Xanh Solar | 屋顶太阳能安装，免费报价',
          desc: '越南家庭屋顶太阳能安装。按电费估算节省金额，免费屋顶勘测，全包报价。电话或 Zalo：0762 252 595。' }
  };

  var STATIC = {
    en: {
      'skip': 'Skip to main content',
      'nav.brandAria': 'Gia Đình Xanh Solar, back to top',
      'nav.aria': 'Main navigation',
      'nav.est': 'Estimate', 'nav.pkg': 'Packages', 'nav.proj': 'Projects', 'nav.proc': 'Process', 'nav.faq': 'FAQ',
      'hdr.hotline': 'Quotes & Zalo', 'hdr.fbAria': 'Gia Đình Xanh Solar on Facebook', 'hdr.cta': 'Get a quote',
      'lang.aria': 'Choose language',

      'hero.eyebrow': 'Rooftop solar for families',
      'hero.title': 'Let your roof pay the power bill',
      'hero.lead': 'Tell us your monthly electricity bill. Gia Đình Xanh engineers will size the right system, estimate your savings and send an all-inclusive quote via Zalo.',
      'q.billLabel': 'Average monthly electricity bill',
      'chip.b1': 'Under 1M ₫', 'chip.b2': '1 – 2M ₫', 'chip.b3': '2 – 4M ₫', 'chip.b4': 'Over 4M ₫',
      'q.phoneLabel': 'Phone number', 'q.phonePh': 'Your phone number', 'q.submit': 'Get a free quote',
      'q.note': 'An engineer will call you back during working hours. Your details are used only to advise you.',
      'hero.t1': 'Free roof survey', 'hero.t2': 'All-inclusive, itemised quote', 'hero.t3': 'We handle the utility paperwork',
      'hero.imgAlt': '18 solar panels installed by Gia Đình Xanh on a metal townhouse roof, drone photo',
      'hero.badgeLabel': 'Example: bill of 2.3M ₫/month',
      'hero.badgeNote': 'saved each month with a ~3.5 kWp system',

      'tier.eyebrow': 'Why bills climb so fast',
      'tier.title': 'The more you use, the more each kWh costs',
      'tier.lead': 'Household electricity in Vietnam is billed in 6 tiers. From the 401st kWh, each kWh costs almost twice the first tier. Solar cuts this most expensive part first.',
      'tier.caption': 'Prices before VAT per Decision 1279/QĐ-BCT of 9 May 2025. Bills add 8% VAT.',
      'tier.aria': 'Chart of the 6 electricity price tiers: tier 1 is 1,984 ₫ and tier 6 is 3,460 ₫ per kWh',
      'tier.from401': '401+', 'tier.axis': '₫/kWh',

      'calc.eyebrow': 'Savings calculator',
      'calc.title': 'How much could your home save?',
      'calc.lead': 'Drag the slider to your latest electricity bill. Results use the current EVN tariff.',
      'calc.billLabel': 'Monthly bill (incl. VAT)', 'calc.min': '500K ₫', 'calc.max': '10M ₫',
      'calc.exact': 'Or enter the exact amount', 'calc.hint': 'The amount on your bill or in the EVN app.',
      'calc.region': 'Region', 'calc.south': 'South', 'calc.central': 'Central', 'calc.north': 'North',
      'calc.day': 'How much power does your home use during the day?',
      'calc.d1': 'Little, out at work all day', 'calc.d2': 'Moderate', 'calc.d3': 'A lot, someone home or a business',
      'calc.saveLabel': 'Monthly savings', 'calc.kwpLabel': 'Recommended size', 'calc.kwhLabel': 'Output', 'calc.costLabel': 'Indicative cost',
      'calc.before': 'Before', 'calc.after': 'After',
      'calc.cta': 'Get an exact quote for this system',
      'calc.caption': 'Estimate based on the 6-tier tariff (Decision 1279/QĐ-BCT) plus 8% VAT, average output per kWp by region, and about 75% of solar power used directly in the home. Income from selling surplus power is not included. Cost is indicative for a grid-tied system; the exact figure follows an engineer\'s roof survey.',

      'pkg.eyebrow': 'Transparent pricing',
      'pkg.title': 'Choose a package by your monthly bill',
      'pkg.lead': 'All-inclusive prices cover panels, inverter, mounting frame, cabling, switchboard, installation and utility paperwork.',
      'badge.grid': 'Grid-tied', 'badge.popular': 'Most families\' choice', 'badge.hybrid': 'Hybrid with storage',
      'pkg.p1': '3.5 kWp package', 'pkg.p2': '5.2 kWp package', 'pkg.p3': '8.1 kWp + 10 kWh battery',
      'pkg.price1': '≈ 42M ₫', 'pkg.price2': '≈ 58.5M ₫', 'pkg.price3': '≈ 132M ₫', 'pkg.allin': 'all-inclusive',
      'pkg.billFit': 'Suits bills of', 'pkg.panels': 'Panels', 'pkg.output': 'Output (South)', 'pkg.area': 'Roof area', 'pkg.extra': 'Extra',
      'pkg.v1': '1 – 1.8M ₫', 'pkg.v2': '1.8 – 3M ₫', 'pkg.v3': 'Over 3M ₫',
      'pkg.n6': '6 × 580 Wp', 'pkg.n9': '9 × 580 Wp', 'pkg.n14': '14 × 580 Wp',
      'pkg.o1': '≈ 440 kWh/month', 'pkg.o2': '≈ 660 kWh/month', 'pkg.o3': '≈ 1,020 kWh/month',
      'pkg.backup': 'Power during outages', 'pkg.cta': 'Get a quote for this package',
      'pkg.caption': 'Indicative prices; they vary with roof type, cable runs and equipment brand. The exact quote follows the survey.',

      'quote.eyebrow': 'Sample quote', 'quote.title': 'Every item lists its price and warranty',
      'quote.lead': 'This is how we present a quote for the 5.2 kWp package. There are no costs outside this table.',
      'quote.cta': 'Get a quote for my home',
      'quote.th1': 'Item', 'quote.th2': 'Specification', 'quote.th3': 'Qty', 'quote.th4': 'Amount (₫)',
      'quote.r1': 'Mono 580 Wp solar panel', 'quote.w12': '12-year warranty',
      'quote.r2': '5 kW grid-tied inverter', 'quote.w10': '10-year warranty',
      'quote.r3': 'Aluminium frame and fittings', 'quote.s3': 'To suit roof type',
      'quote.r4': 'DC/AC cabling, switchboard', 'quote.s4': 'With surge protection',
      'quote.r5': 'Labour, utility paperwork', 'quote.s5': 'All-inclusive',
      'quote.total': 'Total (incl. VAT)',
      'quote.a1': '27,900,000', 'quote.a2': '14,500,000', 'quote.a3': '6,800,000', 'quote.a4': '4,300,000', 'quote.a5': '5,000,000', 'quote.atotal': '58,500,000',

      'proj.eyebrow': 'Completed projects', 'proj.title': 'Installed on real homes',
      'proj.lead': 'Drone photos taken after handover. See our newest projects on Facebook.',
      'proj.fb': 'See more on Facebook',
      'proj.n18': '18 panels', 'proj.n20': '20 panels', 'proj.n30': '30 panels',
      'proj.t1': 'Garden house, metal roof', 'proj.d1': 'Two rows of 8 + 10 panels with a maintenance walkway',
      'proj.t2': 'Townhouse, metal roof', 'proj.d2': 'Laid out around the AC units, no shading',
      'proj.t3': 'Tube house, metal roof', 'proj.d3': 'Four rows of 5 panels across two joined roofs',
      'proj.t4': 'Workshop, metal roof', 'proj.d4': 'Two continuous rows powering daytime production',
      'proj.alt1': 'Garden house with a metal roof and 18 solar panels, seen from above',
      'proj.alt2': 'Townhouse metal roof with 18 solar panels placed between AC units',
      'proj.alt3': 'Tube house metal roof with 20 solar panels in four rows',
      'proj.alt4': 'Workshop metal roof with about 30 solar panels in two rows',

      'why.eyebrow': 'Our commitments', 'why.title': 'We install it as if it were our own home',
      'why.h1': 'Free on-site survey', 'why.p1': 'An engineer measures the roof and checks the structure and sun direction before quoting.',
      'why.h2': 'Itemised quotes', 'why.p2': 'Equipment, quantities and warranties are written into the quote and the contract. No surprise costs.',
      'why.h3': 'Utility paperwork handled', 'why.p3': 'We help register the system and fit a two-way meter if you want to sell surplus power.',
      'why.h4': 'Support after installation', 'why.p4': 'We show you how to track output on your phone, clean the panels and claim warranty.',

      'proc.eyebrow': '4-step process', 'proc.title': 'From electricity bill to a solar roof',
      'proc.d1': 'Day 1', 'proc.h1': 'Share your bill', 'proc.p1': 'Leave your number or send a photo of your bill on Zalo. Get a preliminary quote.',
      'proc.d2': 'Day 2–3', 'proc.h2': 'Roof survey', 'proc.p2': 'An engineer measures the roof, checks the structure and chooses where the inverter goes.',
      'proc.d3': 'Day 4–6', 'proc.h3': 'Installation', 'proc.p3': '1–2 days of tidy work depending on size, keeping the roof waterproofing intact.',
      'proc.d4': 'Day 7', 'proc.h4': 'Handover', 'proc.p4': 'Test run, a walkthrough of the monitoring app on your phone, and warranty activation.',

      'faq.eyebrow': 'Frequently asked questions', 'faq.title': 'Quick answers before you install',
      'faq.q1': 'Do I need a permit for rooftop solar?',
      'faq.a1': 'Households installing a self-consumption system under 100 kW are exempt from an electricity operating licence. To sell surplus power you need a two-way meter; we help with the paperwork at your local power company.',
      'faq.q2': 'Can I sell surplus power to EVN?',
      'faq.a2': 'Yes. Under the rules amended in June 2026, households in detached homes connected to the low-voltage grid may sell up to 50% of surplus output to the grid with a two-way meter. The purchase price is published by the buyer under the regulations. Because it is lower than the price you pay for power, systems should be designed mainly for use in the home.',
      'faq.q3': 'Can panels go on a metal roof? Will it leak?',
      'faq.a3': 'Yes, most of our projects are metal roofs. The frame is fixed to the purlins with dedicated brackets, and every drill point gets a rubber seal and waterproof sealant.',
      'faq.q4': 'What is the difference between grid-tied and hybrid?',
      'faq.a4': 'A grid-tied system costs less and pays back faster, but shuts down for safety when the grid goes out. A hybrid system has a battery, so you can use solar power in the evening and keep power during outages, at a higher cost.',
      'faq.q5': 'What about rainy or cloudy days?',
      'faq.a5': 'The panels still generate, just less. Any shortfall comes from the grid automatically, with no interruption at home. The savings on this page are a yearly average.',
      'faq.q6': 'How long until it pays for itself?',
      'faq.a6': 'It depends on your bill and how much power you use during the day. The calculator above works it out for your home. Homes with high daytime use pay back fastest.',
      'faq.q7': 'Do you offer instalment payments?',
      'faq.a7': 'Please ask our engineer on 0762 252 595 when you receive your quote about the payment options currently available.',

      'cta.eyebrow': 'Book a free survey', 'cta.title': 'Get a quote for your roof',
      'cta.lead': 'Answer a few short questions. An engineer will call you back, book a survey and send an all-inclusive quote via Zalo.',
      'cta.call': 'Call 0762 252 595', 'cta.zalo': 'Message on Zalo with a bill photo',
      'f.name': 'Full name', 'f.namePh': 'Your name', 'f.phone': 'Phone / Zalo',
      'f.addr': 'Installation address', 'f.addrPh': 'Ward, district, province or city',
      'f.addrHint': 'The area is enough for us to estimate and schedule a survey.',
      'f.bill': 'Monthly electricity bill',
      'f.roof': 'Roof type', 'f.roof1': 'Metal sheet', 'f.roof2': 'Flat concrete', 'f.roof3': 'Tiled', 'f.roof4': 'Not sure',
      'f.building': 'Property type', 'f.b1': 'Family home', 'f.b2': 'Rental rooms', 'f.b3': 'Shop or café', 'f.b4': 'Workshop or factory',
      'f.need': 'What you need', 'f.n1': 'Lower my bill', 'f.n2': 'Power during outages', 'f.n3': 'I need advice',
      'f.note': 'Notes', 'f.notePh': 'Best time to call, roof size, other questions...',
      'f.submit': 'Request a free survey',
      'f.privacy': 'Gia Đình Xanh keeps your details private and uses them only to advise on installation.',

      'foot.tagline': 'Green energy – Peaceful living', 'foot.quote': 'Get a quote', 'foot.callZalo': 'Call or message on Zalo', 'foot.connect': 'Connect',
      'mbar.aria': 'Quick contact', 'mbar.call': 'Call'
    },

    zh: {
      'skip': '跳至主要内容',
      'nav.brandAria': 'Gia Đình Xanh Solar，返回顶部',
      'nav.aria': '主导航',
      'nav.est': '节省估算', 'nav.pkg': '安装套餐', 'nav.proj': '工程案例', 'nav.proc': '流程', 'nav.faq': '常见问题',
      'hdr.hotline': '报价 & Zalo', 'hdr.fbAria': 'Gia Đình Xanh Solar 的 Facebook 主页', 'hdr.cta': '获取报价',
      'lang.aria': '选择语言',

      'hero.eyebrow': '家庭屋顶太阳能',
      'hero.title': '让屋顶为全家发电省钱',
      'hero.lead': '告诉我们您每月的电费，Gia Đình Xanh 工程师将为您算好合适的系统容量和节省金额，并通过 Zalo 发送全包报价。',
      'q.billLabel': '每月平均电费',
      'chip.b1': '100万盾以下', 'chip.b2': '100–200万盾', 'chip.b3': '200–400万盾', 'chip.b4': '400万盾以上',
      'q.phoneLabel': '电话号码', 'q.phonePh': '您的电话号码', 'q.submit': '免费获取报价',
      'q.note': '工程师将在工作时间内回电。您的信息仅用于咨询。',
      'hero.t1': '免费屋顶勘测', 'hero.t2': '全包报价，逐项列明', 'hero.t3': '代办电力公司手续',
      'hero.imgAlt': 'Gia Đình Xanh 在联排住宅铁皮屋顶上安装的18块太阳能板（无人机拍摄）',
      'hero.badgeLabel': '示例：每月电费230万盾',
      'hero.badgeNote': '每月可节省（约3.5 kWp系统）',

      'tier.eyebrow': '电费为何涨得快',
      'tier.title': '用电越多，每度电越贵',
      'tier.lead': '越南居民用电按6级阶梯计价。从第401度起，每度电的价格接近第一级的两倍。太阳能优先抵消这部分最贵的电。',
      'tier.caption': '价格未含增值税，依据2025年5月9日第1279/QĐ-BCT号决定。电费单另加8%增值税。',
      'tier.aria': '6级电价图：第1级每度1,984盾，第6级每度3,460盾',
      'tier.from401': '401以上', 'tier.axis': '盾/度',

      'calc.eyebrow': '节省计算器',
      'calc.title': '您家能省多少钱？',
      'calc.lead': '把滑块拖到您最近一期的电费金额。结果按越南电力集团（EVN）现行电价计算。',
      'calc.billLabel': '每月电费（含增值税）', 'calc.min': '50万盾', 'calc.max': '1000万盾',
      'calc.exact': '或输入准确金额', 'calc.hint': '电费单或 EVN 应用上显示的金额。',
      'calc.region': '地区', 'calc.south': '南部', 'calc.central': '中部', 'calc.north': '北部',
      'calc.day': '白天家里用电多吗？',
      'calc.d1': '少，白天都上班', 'calc.d2': '一般', 'calc.d3': '多，有人在家或做生意',
      'calc.saveLabel': '每月节省', 'calc.kwpLabel': '建议容量', 'calc.kwhLabel': '发电量', 'calc.costLabel': '参考费用',
      'calc.before': '安装前', 'calc.after': '安装后',
      'calc.cta': '获取该系统的准确报价',
      'calc.caption': '估算依据6级电价（第1279/QĐ-BCT号决定）加8%增值税、各地区每kWp平均发电量，并假设约75%的太阳能电直接自用。未计入余电上网收益。费用为并网系统参考价，准确金额以工程师实地勘测为准。',

      'pkg.eyebrow': '透明报价',
      'pkg.title': '按每月电费选择套餐',
      'pkg.lead': '全包价格已包含太阳能板、逆变器、支架、电缆、配电箱、安装及电力公司手续。',
      'badge.grid': '并网', 'badge.popular': '多数家庭之选', 'badge.hybrid': '混合储能',
      'pkg.p1': '3.5 kWp 套餐', 'pkg.p2': '5.2 kWp 套餐', 'pkg.p3': '8.1 kWp + 10 kWh 电池',
      'pkg.price1': '≈ 4,200万盾', 'pkg.price2': '≈ 5,850万盾', 'pkg.price3': '≈ 1.32亿盾', 'pkg.allin': '全包',
      'pkg.billFit': '适合电费', 'pkg.panels': '太阳能板', 'pkg.output': '发电量（南部）', 'pkg.area': '屋顶面积', 'pkg.extra': '特点',
      'pkg.v1': '100–180万盾', 'pkg.v2': '180–300万盾', 'pkg.v3': '300万盾以上',
      'pkg.n6': '6块 580 Wp', 'pkg.n9': '9块 580 Wp', 'pkg.n14': '14块 580 Wp',
      'pkg.o1': '≈ 440 度/月', 'pkg.o2': '≈ 660 度/月', 'pkg.o3': '≈ 1,020 度/月',
      'pkg.backup': '停电时仍有电', 'pkg.cta': '获取此套餐报价',
      'pkg.caption': '以上为参考价格，会因屋顶类型、布线距离和设备品牌而变化。准确报价在勘测后提供。',

      'quote.eyebrow': '报价样本', 'quote.title': '每个项目都列明价格和保修',
      'quote.lead': '这是我们为5.2 kWp套餐出具报价的方式。表格之外没有任何额外费用。',
      'quote.cta': '为我家获取报价',
      'quote.th1': '项目', 'quote.th2': '规格', 'quote.th3': '数量', 'quote.th4': '金额（盾）',
      'quote.r1': '580 Wp 单晶太阳能板', 'quote.w12': '保修12年',
      'quote.r2': '5 kW 并网逆变器', 'quote.w10': '保修10年',
      'quote.r3': '铝合金支架及配件', 'quote.s3': '按屋顶类型',
      'quote.r4': '直流/交流电缆、配电箱', 'quote.s4': '含防雷浪涌保护',
      'quote.r5': '人工及电力手续', 'quote.s5': '全包',
      'quote.total': '合计（含增值税）',
      'quote.a1': '27,900,000', 'quote.a2': '14,500,000', 'quote.a3': '6,800,000', 'quote.a4': '4,300,000', 'quote.a5': '5,000,000', 'quote.atotal': '58,500,000',

      'proj.eyebrow': '工程案例', 'proj.title': '真实屋顶上的安装',
      'proj.lead': '交付后无人机拍摄。更多新工程请看我们的 Facebook 主页。',
      'proj.fb': '在 Facebook 查看更多',
      'proj.n18': '18块太阳能板', 'proj.n20': '20块太阳能板', 'proj.n30': '30块太阳能板',
      'proj.t1': '花园住宅 · 铁皮屋顶', 'proj.d1': '两排8 + 10块，预留检修通道',
      'proj.t2': '联排住宅 · 铁皮屋顶', 'proj.d2': '避开空调外机布置，无遮挡',
      'proj.t3': '竖屋 · 铁皮屋顶', 'proj.d3': '两段相连屋顶上四排，每排5块',
      'proj.t4': '厂房 · 铁皮屋顶', 'proj.d4': '两排连续布置，供白天生产用电',
      'proj.alt1': '安装18块太阳能板的花园住宅铁皮屋顶（俯拍）',
      'proj.alt2': '联排住宅铁皮屋顶，18块太阳能板布置在空调外机之间',
      'proj.alt3': '竖屋铁皮屋顶，20块太阳能板分四排',
      'proj.alt4': '厂房铁皮屋顶，约30块太阳能板分两排',

      'why.eyebrow': '我们的承诺', 'why.title': '像为自己家安装一样用心',
      'why.h1': '免费上门勘测', 'why.p1': '报价前工程师会上屋顶测量，检查结构和日照方向。',
      'why.h2': '逐项列明的报价', 'why.p2': '设备、数量和保修都写入报价单和合同，没有额外费用。',
      'why.h3': '代办电力手续', 'why.p3': '协助系统登记；如需出售余电，可协助更换双向电表。',
      'why.h4': '安装后持续服务', 'why.p4': '指导您用手机查看发电量、清洁太阳能板及办理保修。',

      'proc.eyebrow': '四步流程', 'proc.title': '从电费单到太阳能屋顶',
      'proc.d1': '第1天', 'proc.h1': '提供电费', 'proc.p1': '留下电话，或通过 Zalo 发送电费单照片，获取初步报价。',
      'proc.d2': '第2–3天', 'proc.h2': '屋顶勘测', 'proc.p2': '工程师上门测量屋顶、检查结构，确定逆变器位置。',
      'proc.d3': '第4–6天', 'proc.h3': '安装', 'proc.p3': '根据容量施工1–2天，整洁施工，保持屋顶防水完好。',
      'proc.d4': '第7天', 'proc.h4': '交付', 'proc.p4': '试运行，指导用手机查看发电量，激活保修。',

      'faq.eyebrow': '常见问题', 'faq.title': '安装前快速解答',
      'faq.q1': '安装屋顶太阳能需要许可吗？',
      'faq.a1': '家庭安装100 kW以下的自发自用系统，免办电力经营许可证。如需出售余电，须安装双向电表，我们协助您向当地电力公司办理手续。',
      'faq.q2': '余电可以卖给 EVN 吗？',
      'faq.a2': '可以。根据2026年6月修订的规定，接入低压电网的独立住宅家庭可安装双向电表，将最多50%的余电上网出售。收购价格由购电方按规定公布。由于售电价格低于购电价格，系统应以家庭自用为主进行设计。',
      'faq.q3': '铁皮屋顶可以安装吗？会漏水吗？',
      'faq.a3': '可以，我们的大部分工程都是铁皮屋顶。支架用专用挂件固定在檩条上，每个钻孔点都配有橡胶垫圈和防水胶。',
      'faq.q4': '并网系统和混合系统有什么区别？',
      'faq.a4': '并网系统价格较低、回本较快，但电网停电时会为安全自动停止。混合系统配有储能电池，晚上也能用太阳能电，停电时仍有电，但费用较高。',
      'faq.q5': '下雨或阴天怎么办？',
      'faq.a5': '太阳能板仍会发电，只是较少。不足部分自动由电网补充，家中用电不会中断。本页显示的节省金额为全年平均值。',
      'faq.q6': '多久能回本？',
      'faq.a6': '取决于电费和白天用电习惯。上方的计算器可为您家估算。白天用电多的家庭回本最快。',
      'faq.q7': '支持分期付款吗？',
      'faq.a7': '获取报价时请致电 0762 252 595 咨询工程师，了解目前可用的付款方式。',

      'cta.eyebrow': '预约免费勘测', 'cta.title': '为您的屋顶获取报价',
      'cta.lead': '回答几个简短问题。工程师会回电预约勘测，并通过 Zalo 发送全包报价。',
      'cta.call': '致电 0762 252 595', 'cta.zalo': 'Zalo 留言并发送电费单照片',
      'f.name': '姓名', 'f.namePh': '您的姓名', 'f.phone': '电话 / Zalo',
      'f.addr': '安装地址', 'f.addrPh': '坊/社、郡/县、省/市',
      'f.addrHint': '只需填写区域，便于工程师估算和安排勘测。',
      'f.bill': '每月电费',
      'f.roof': '屋顶类型', 'f.roof1': '铁皮屋顶', 'f.roof2': '混凝土平顶', 'f.roof3': '瓦屋顶', 'f.roof4': '不确定',
      'f.building': '建筑类型', 'f.b1': '家庭住宅', 'f.b2': '出租房', 'f.b3': '商店、餐饮', 'f.b4': '厂房',
      'f.need': '需求', 'f.n1': '降低电费', 'f.n2': '停电时仍有电', 'f.n3': '需要咨询',
      'f.note': '备注', 'f.notePh': '方便通话的时间、屋顶面积、其他问题……',
      'f.submit': '提交免费勘测申请',
      'f.privacy': 'Gia Đình Xanh 承诺对您的信息保密，仅用于安装咨询。',

      'foot.tagline': '绿色能源 · 安宁生活', 'foot.quote': '获取报价', 'foot.callZalo': '电话或 Zalo 留言', 'foot.connect': '联系我们',
      'mbar.aria': '快速联系', 'mbar.call': '致电'
    }
  };

  var DYNAMIC = {
    vi: {
      newBill: 'Hóa đơn còn khoảng {bill} ({kwh} kWh/tháng hiện tại)',
      panels: '{n} tấm pin {wp} Wp',
      area: 'Cần khoảng {m} m² mái trống nắng',
      payback: 'Hoàn vốn khoảng {y} năm',
      paybackNa: 'Cần khảo sát để tính',
      kwhMonth: 'kWh/tháng',
      errPhone: 'Số điện thoại cần đủ 10 chữ số, ví dụ 0762 252 595.',
      errName: 'Vui lòng cho biết tên để kỹ sư tiện xưng hô.',
      contact: 'Vui lòng gọi <a href="tel:0762252595">0762 252 595</a> hoặc <a href="https://zalo.me/0762252595" target="_blank" rel="noopener">nhắn Zalo</a>.',
      maint: 'Form đang bảo trì, thông tin chưa gửi được. ',
      net: 'Mạng đang chập chờn nên chưa gửi được. Anh/chị thử lại. ',
      sending: 'Đang gửi...',
      okQuick: '<b>Đã nhận số {phone}.</b> Kỹ sư Gia Đình Xanh sẽ gọi lại trong giờ làm việc. Muốn được báo giá sát hơn, anh/chị <a href="#bao-gia">trả lời thêm vài câu</a>.',
      okSurvey: '<b>Cảm ơn anh/chị {name}!</b> Kỹ sư sẽ gọi số {phone} để hẹn lịch khảo sát. Có thể gửi trước ảnh hóa đơn điện qua <a href="https://zalo.me/0762252595" target="_blank" rel="noopener">Zalo 0762 252 595</a>.'
    },
    en: {
      newBill: 'Bill drops to about {bill} (currently {kwh} kWh/month)',
      panels: '{n} panels × {wp} Wp',
      area: 'Needs about {m} m² of sunny roof',
      payback: 'Pays back in about {y} years',
      paybackNa: 'Needs a survey to calculate',
      kwhMonth: 'kWh/month',
      errPhone: 'Please enter a valid phone number, e.g. 0762 252 595.',
      errName: 'Please tell us your name.',
      contact: 'Please call <a href="tel:0762252595">0762 252 595</a> or <a href="https://zalo.me/0762252595" target="_blank" rel="noopener">message us on Zalo</a>.',
      maint: 'The form is under maintenance and your details were not sent. ',
      net: 'The connection dropped and your details were not sent. Please try again. ',
      sending: 'Sending...',
      okQuick: '<b>Got it: {phone}.</b> A Gia Đình Xanh engineer will call you back during working hours. For a closer quote, <a href="#bao-gia">answer a few more questions</a>.',
      okSurvey: '<b>Thank you, {name}!</b> An engineer will call {phone} to book your survey. You can send a photo of your bill in advance via <a href="https://zalo.me/0762252595" target="_blank" rel="noopener">Zalo 0762 252 595</a>.'
    },
    zh: {
      newBill: '电费降至约{bill}（目前每月{kwh}度）',
      panels: '{n}块 {wp} Wp 太阳能板',
      area: '需约{m}平方米无遮挡屋顶',
      payback: '约{y}年回本',
      paybackNa: '需勘测后计算',
      kwhMonth: '度/月',
      errPhone: '请输入有效的电话号码，例如 0762 252 595。',
      errName: '请填写您的姓名。',
      contact: '请致电 <a href="tel:0762252595">0762 252 595</a> 或 <a href="https://zalo.me/0762252595" target="_blank" rel="noopener">Zalo 留言</a>。',
      maint: '表单维护中，信息未能发送。',
      net: '网络不稳定，信息未能发送，请重试。',
      sending: '发送中……',
      okQuick: '<b>已收到号码 {phone}。</b>Gia Đình Xanh 工程师将在工作时间内回电。如需更精准的报价，请<a href="#bao-gia">再回答几个问题</a>。',
      okSurvey: '<b>谢谢您，{name}！</b>工程师将致电 {phone} 预约勘测。您也可以先通过 <a href="https://zalo.me/0762252595" target="_blank" rel="noopener">Zalo 0762 252 595</a> 发送电费单照片。'
    }
  };

  /* ---------- Định dạng tiền theo ngôn ngữ ---------- */
  var NF = {
    vi: new Intl.NumberFormat('vi-VN'),
    en: new Intl.NumberFormat('en-US'),
    zh: new Intl.NumberFormat('en-US')
  };
  var NF1 = {
    vi: new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    en: new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    zh: new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  };

  var current = 'vi';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  var api = {
    get lang() { return current; },
    esc: esc,
    t: function (key, vars) {
      var s = (DYNAMIC[current] && DYNAMIC[current][key]) || DYNAMIC.vi[key] || key;
      if (vars) s = s.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ''; });
      return s;
    },
    num: function (v) { return NF[current].format(v); },
    num1: function (v) { return NF1[current].format(v); },
    /* Số tiền đầy đủ: trả về [số, đơn vị] */
    money: function (v) {
      var n = Math.round(v / 1000) * 1000;
      if (current === 'vi') return [NF.vi.format(n), 'đ'];
      if (current === 'en') return [NF.en.format(n), ' ₫'];
      return [NF.zh.format(n), ' 盾'];
    },
    /* Số tiền lớn rút gọn: 41,8 triệu / 41.8M ₫ / 4,180万盾 */
    big: function (v) {
      if (current === 'vi') return [NF1.vi.format(v / 1e6).replace(/,0$/, ''), 'triệu'];
      if (current === 'en') return [NF1.en.format(v / 1e6).replace(/\.0$/, ''), 'M ₫'];
      return [NF.zh.format(Math.round(v / 1e4)), '万盾'];
    },
    set: setLang
  };

  /* ---------- Áp dụng bản dịch lên trang ---------- */
  function applyStatic(lang) {
    var dict = STATIC[lang] || {};
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (el.dataset.i18nVi == null) el.dataset.i18nVi = el.textContent;
      var key = el.getAttribute('data-i18n');
      el.textContent = lang === 'vi' ? el.dataset.i18nVi : (dict[key] != null ? dict[key] : el.dataset.i18nVi);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'), attr = p[0].trim(), key = (p[1] || '').trim();
        if (!attr || !key) return;
        var store = 'i18nVi' + attr.replace(/[^a-z]/gi, '');
        if (el.dataset[store] == null) el.dataset[store] = el.getAttribute(attr) || '';
        el.setAttribute(attr, lang === 'vi' ? el.dataset[store] : (dict[key] != null ? dict[key] : el.dataset[store]));
      });
    });
  }

  function setLang(lang, opts) {
    if (!LANGS[lang]) lang = 'vi';
    current = lang;
    document.documentElement.lang = LANGS[lang];
    applyStatic(lang);
    document.title = META[lang].title;
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', META[lang].desc);
    document.querySelectorAll('.lang-switch [data-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    if (!opts || opts.save !== false) { try { localStorage.setItem(STORE_KEY, lang); } catch (e) {} }
    document.dispatchEvent(new CustomEvent('gdx:lang', { detail: { lang: lang } }));
  }

  window.GDXI18N = api;

  /* Chọn ngôn ngữ ban đầu: ?lang=en|zh|vi trong link > lựa chọn đã lưu > tiếng Việt */
  function initial() {
    var p = new URLSearchParams(location.search).get('lang');
    if (p && LANGS[p.toLowerCase()]) return p.toLowerCase();
    try { var s = localStorage.getItem(STORE_KEY); if (s && LANGS[s]) return s; } catch (e) {}
    return 'vi';
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.lang-switch [data-lang]');
    if (b) setLang(b.getAttribute('data-lang'));
  });

  var first = initial();
  if (first !== 'vi') setLang(first, { save: !!new URLSearchParams(location.search).get('lang') });
  else current = 'vi';
})();
