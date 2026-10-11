/* =========================================================
   生活費トラッカー — script.js
   純粋なフロントエンドのみ。外部通信は行いません。
   データは localStorage にのみ保存されます。
   ========================================================= */

(function () {
  'use strict';

  /* =========================================================
     1. 文言（中文 / 日本語）
     ========================================================= */

  var I18N = {
    brandName:   { zh: '生活费追踪器', ja: '生活費トラッカー' },
    tagline:     { zh: '定期缴费管理・防止漏缴', ja: '定期支払い管理・支払い忘れ防止' },
    btnLang:     { zh: '日本語', ja: '中文' },
    ariaLang:    { zh: '切换语言', ja: '表示言語を切り替える' },

    dashTitle:   { zh: '每月固定支出，一目了然', ja: '毎月の固定費を、ひと目で' },
    dashLead:    { zh: '把电费、燃气、水费、房租、年金、保险、订阅服务等定期缴费集中到一处，到期前自动提醒。',
                   ja: '電気・ガス・水道・家賃・年金・保険・サブスクなど、定期的に発生する支払いをひとつの画面にまとめて管理。支払日が近づくと色でお知らせします。' },

    statThisMonth:    { zh: '本月应缴', ja: '今月の支払い' },
    statThisMonthSub: { zh: '含已过期未缴', ja: '期限切れを含む' },
    statNextMonth:    { zh: '下月应缴', ja: '来月の支払い' },
    statNextMonthSub: { zh: '按缴费周期推算', ja: '周期から算出' },
    statYear:         { zh: '全年固定支出', ja: '年間の固定費' },
    statYearSub:      { zh: '未来 12 个月合计', ja: '今後12か月の合計' },

    privacyNote: { zh: '数据仅保存在本浏览器（localStorage），不会发送到任何服务器。建议定期导出 JSON 备份。',
                   ja: 'データはお使いのブラウザ（localStorage）にのみ保存され、サーバーへ送信されません。定期的な JSON の書き出しをおすすめします。' },

    listTitle:      { zh: '缴费项', ja: '支払い項目' },
    sortNote:       { zh: '按下次缴费日排序', ja: '次回の支払日が近い順' },
    itemCount:      { zh: '共 {n} 项', ja: '全 {n} 件' },
    btnAdd:         { zh: '添加缴费项', ja: '支払い項目を追加' },
    btnTemplates:   { zh: '从模板添加', ja: 'テンプレートから追加' },
    btnClearSample: { zh: '清空示例数据', ja: 'サンプルを消す' },
    emptyState:     { zh: '还没有缴费项。点击「添加缴费项」，或从模板一键添加。',
                      ja: 'まだ支払い項目がありません。「支払い項目を追加」またはテンプレートから追加してください。' },
    presetNote:     { zh: '点击即可添加，金额与日期之后可随时修改。',
                      ja: 'クリックで追加できます。金額と日付は後から変更できます。' },

    formTitleAdd:  { zh: '添加缴费项', ja: '支払い項目を追加' },
    formTitleEdit: { zh: '编辑缴费项', ja: '支払い項目を編集' },
    lblName:       { zh: '名称', ja: '名称' },
    lblCategory:   { zh: '分类', ja: 'カテゴリ' },
    lblCycle:      { zh: '缴费周期', ja: '支払いの周期' },
    lblAmount:     { zh: '金额（日元）', ja: '金額（円）' },
    phAmount:      { zh: '例：6,000', ja: '例：6,000' },
    helpAmount:    { zh: '全角数字会自动转换，自动加千分位。', ja: '全角数字は自動で半角に変換し、3桁区切りで表示します。' },
    lblNextDate:   { zh: '下次缴费日', ja: '次回の支払日' },
    lblNote:       { zh: '备注（可选）', ja: 'メモ（任意）' },
    phNote:        { zh: '例：口座振替', ja: '例：口座振替' },
    btnSave:       { zh: '保存', ja: '保存' },
    btnCancel:     { zh: '取消', ja: 'キャンセル' },
    errName:       { zh: '请输入名称', ja: '名称を入力してください' },
    errAmount:     { zh: '请输入大于 0 的金额', ja: '0 より大きい金額を入力してください' },
    errDate:       { zh: '请选择下次缴费日', ja: '次回の支払日を選択してください' },

    'cat.utility':      { zh: '水电燃气', ja: '公共料金' },
    'cat.housing':      { zh: '住房', ja: '住居' },
    'cat.insurance':    { zh: '保险・年金', ja: '保険・年金' },
    'cat.telecom':      { zh: '通信', ja: '通信' },
    'cat.subscription': { zh: '订阅服务', ja: 'サブスク' },
    'cat.other':        { zh: '其他', ja: 'その他' },

    'cycle.monthly':    { zh: '每月', ja: '毎月' },
    'cycle.bimonthly':  { zh: '隔月', ja: '隔月' },
    'cycle.quarterly':  { zh: '每季度', ja: '四半期' },
    'cycle.semiannual': { zh: '每半年', ja: '半年' },
    'cycle.yearly':     { zh: '每年', ja: '毎年' },
    'cycle.once':       { zh: '一次性', ja: '単発' },

    dueLabel:    { zh: '下次缴费日', ja: '次回の支払日' },
    daysToday:   { zh: '今天到期', ja: '本日が期限' },
    daysSoon:    { zh: '还有 {n} 天', ja: 'あと {n} 日' },
    daysFuture:  { zh: '还有 {n} 天', ja: 'あと {n} 日' },
    daysOverdue: { zh: '已过期 {n} 天', ja: '{n} 日超過' },
    pillDone:    { zh: '已结束', ja: '完了' },
    perYear:     { zh: '年额 {v}', ja: '年間 {v}' },
    perMonth:    { zh: '月均 {v}', ja: '月あたり {v}' },

    btnPaid:     { zh: '已缴', ja: '支払い済み' },
    btnEdit:     { zh: '编辑', ja: '編集' },
    btnDelete:   { zh: '删除', ja: '削除' },

    toastAdded:    { zh: '已添加「{name}」', ja: '「{name}」を追加しました' },
    toastAddedTpl: { zh: '已从模板添加「{name}」', ja: 'テンプレートから「{name}」を追加しました' },
    toastSaved:    { zh: '已保存', ja: '保存しました' },
    toastDeleted:  { zh: '已删除', ja: '削除しました' },
    toastPaid:     { zh: '已标记为已缴，下次缴费日已自动推进到 {date}', ja: '支払い済みにしました。次回の支払日を {date} に繰り上げました' },
    toastPaidOnce: { zh: '已标记为已缴（一次性项目，不再重复）', ja: '支払い済みにしました（単発のため次回はありません）' },
    toastCleared:  { zh: '示例数据已清空', ja: 'サンプルを削除しました' },
    toastNoSample: { zh: '当前没有示例数据', ja: 'サンプルはありません' },
    toastImported: { zh: '已导入 {n} 条记录', ja: '{n} 件を読み込みました' },
    toastExportIcsEmpty: { zh: '没有可导出的缴费项', ja: '書き出せる支払い項目がありません' },
    toastExported: { zh: '已导出文件', ja: 'ファイルを書き出しました' },

    confirmDelete: { zh: '确定删除「{name}」吗？此操作不可撤销。', ja: '「{name}」を削除しますか？この操作は取り消せません。' },
    confirmImport: { zh: '导入会覆盖当前全部数据，确定继续吗？', ja: '読み込むと現在のデータはすべて置き換わります。続けますか？' },
    errImport:     { zh: '文件格式不正确，导入失败。', ja: 'ファイル形式が正しくないため読み込めませんでした。' },

    chartTitle:   { zh: '分类占比', ja: 'カテゴリ別の割合' },
    chartMonthly: { zh: '每月', ja: '月あたり' },
    chartYearly:  { zh: '全年', ja: '年あたり' },
    chartEmpty:   { zh: '还没有可统计的数据。', ja: '集計できるデータがありません。' },
    chartTotal:   { zh: '合计', ja: '合計' },
    chartFootMonthly: { zh: '按周期折算的每月平均金额', ja: '周期ごとに月あたりへ換算した金額' },
    chartFootYearly:  { zh: '未来 12 个月的合计金额', ja: '今後12か月の合計金額' },

    dataTitle:     { zh: '数据管理', ja: 'データ管理' },
    helpExport:    { zh: '数据只存在本浏览器里。清除浏览器数据会丢失记录，建议定期导出备份。',
                     ja: 'データはブラウザ内にのみ保存されます。ブラウザのデータを消すと記録も消えるため、定期的な書き出しをおすすめします。' },
    btnExportJson: { zh: '导出 JSON', ja: 'JSON を書き出す' },
    btnImportJson: { zh: '导入 JSON', ja: 'JSON を読み込む' },
    btnExportIcs:  { zh: '导出 .ics 日历', ja: '.ics カレンダーを書き出す' },
    icsHelp:       { zh: '把 .ics 导入 Google／Apple 日历，就能在手机上收到到期提醒。',
                     ja: '書き出した .ics を Google カレンダーや Apple カレンダーに読み込むと、スマートフォンでも期限前に通知を受け取れます。' },

    icsCalName: { zh: '生活费追踪器', ja: '生活費トラッカー' },
    icsPaid:    { zh: '定期缴费', ja: '定期支払い' },

    footerNote: { zh: '生活费追踪器 — 在浏览器中管理日本定期缴费、防止漏缴的免费工具',
                  ja: '生活費トラッカー — ブラウザだけで動く、定期支払いの管理と支払い忘れ防止ツール' }
  };

  var lang = 'zh';

  function t(key, vars) {
    var entry = I18N[key];
    var s = (entry && entry[lang]) ? entry[lang] : key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
      });
    }
    return s;
  }

  /* =========================================================
     2. 定数
     ========================================================= */

  var STORE_KEY = 'lct.data.v1';
  var LANG_KEY  = 'lct.lang.v1';
  var SCHEMA_ID = 'life-cost-tracker/v1';

  var CATS = ['utility', 'housing', 'insurance', 'telecom', 'subscription', 'other'];

  /** 支払い周期 → 何か月ごとか（単発は null） */
  var CYCLE_MONTHS = {
    monthly: 1,
    bimonthly: 2,
    quarterly: 3,
    semiannual: 6,
    yearly: 12
  };
  var CYCLE_KEYS = ['monthly', 'bimonthly', 'quarterly', 'semiannual', 'yearly', 'once'];

  var DUE_SOON_DAYS = 7;

  /** 日本の暮らしでよくある定期支払いのテンプレート（金額は目安） */
  var PRESETS = [
    { id: 'denki',   name: { zh: '电费',            ja: '電気代' },              amount: 6000,  category: 'utility',      cycle: 'monthly' },
    { id: 'gas',     name: { zh: '燃气费',          ja: 'ガス代' },              amount: 4500,  category: 'utility',      cycle: 'monthly' },
    { id: 'suido',   name: { zh: '自来水费',        ja: '水道代' },              amount: 3500,  category: 'utility',      cycle: 'bimonthly' },
    { id: 'nhk',     name: { zh: 'NHK 收视费',      ja: 'NHK受信料' },           amount: 1225,  category: 'utility',      cycle: 'monthly' },
    { id: 'net',     name: { zh: '网络宽带',        ja: 'インターネット回線' },   amount: 4400,  category: 'telecom',      cycle: 'monthly' },
    { id: 'mobile',  name: { zh: '手机费',          ja: '携帯電話料金' },         amount: 7000,  category: 'telecom',      cycle: 'monthly' },
    { id: 'yachin',  name: { zh: '房租',            ja: '家賃' },                amount: 85000, category: 'housing',      cycle: 'monthly' },
    { id: 'kanri',   name: { zh: '物业管理费',      ja: '管理費・共益費' },       amount: 8000,  category: 'housing',      cycle: 'monthly' },
    { id: 'nenkin',  name: { zh: '国民年金',        ja: '国民年金' },            amount: 17000, category: 'insurance',    cycle: 'monthly' },
    { id: 'kokuho',  name: { zh: '国民健康保险',    ja: '国民健康保険' },         amount: 32000, category: 'insurance',    cycle: 'monthly' },
    { id: 'jumin',   name: { zh: '居民税（普通征收）', ja: '住民税（普通徴収）' },  amount: 42500, category: 'other',        cycle: 'quarterly' },
    { id: 'kasa',    name: { zh: '火灾・地震保险',  ja: '火災保険・地震保険' },   amount: 20000, category: 'insurance',    cycle: 'yearly' },
    { id: 'jidosha', name: { zh: '汽车保险',        ja: '自動車保険' },           amount: 60000, category: 'insurance',    cycle: 'yearly' },
    { id: 'card',    name: { zh: '信用卡年费',      ja: 'クレジットカード年会費' }, amount: 13750, category: 'other',       cycle: 'yearly' },
    { id: 'netflix', name: { zh: 'Netflix',        ja: 'Netflix' },             amount: 1490,  category: 'subscription', cycle: 'monthly' },
    { id: 'spotify', name: { zh: 'Spotify Premium', ja: 'Spotify Premium' },     amount: 980,   category: 'subscription', cycle: 'monthly' },
    { id: 'yt',      name: { zh: 'YouTube Premium', ja: 'YouTube Premium' },     amount: 1280,  category: 'subscription', cycle: 'monthly' },
    { id: 'prime',   name: { zh: 'Amazon Prime',   ja: 'Amazonプライム' },        amount: 600,   category: 'subscription', cycle: 'monthly' },
    { id: 'icloud',  name: { zh: 'iCloud+',        ja: 'iCloud+' },             amount: 400,   category: 'subscription', cycle: 'monthly' },
    { id: 'shinbun', name: { zh: '报纸订阅',        ja: '新聞購読料' },           amount: 4400,  category: 'subscription', cycle: 'monthly' }
  ];

  var PRESET_MAP = {};
  PRESETS.forEach(function (p) { PRESET_MAP[p.id] = p; });

  /* =========================================================
     3. 汎用ユーティリティ
     ========================================================= */

  function $(id) { return document.getElementById(id); }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function isoOf(d) {
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function isoOfYMD(y, m0, d) { return y + '-' + pad2(m0 + 1) + '-' + pad2(d); }

  function todayDate() {
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }

  function todayISO() { return isoOf(todayDate()); }

  function parseISO(s) {
    if (typeof s !== 'string') return null;
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3];
    if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
    var dt = new Date(y, mo - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
    return dt;
  }

  function daysInMonth(y, m0) { return new Date(y, m0 + 1, 0).getDate(); }

  function diffDays(from, to) { return Math.round((to.getTime() - from.getTime()) / 86400000); }

  /**
   * 月末を自動調整しつつ n か月後の日付を返す。
   * anchorDay は元の「日」（例：毎月31日払い）を保持するために使う。
   * 2026-01-31 の毎月払い → 2026-02-28（うるう年なら 02-29）
   */
  function addMonthsISO(iso, n, anchorDay) {
    var dt = parseISO(iso);
    if (!dt) return null;
    var y = dt.getFullYear();
    var m0 = dt.getMonth();
    var day = (anchorDay >= 1 && anchorDay <= 31) ? anchorDay : dt.getDate();
    var total = m0 + n;
    var ty = y + Math.floor(total / 12);
    var tm = ((total % 12) + 12) % 12;
    var td = Math.min(day, daysInMonth(ty, tm));
    return isoOfYMD(ty, tm, td);
  }

  function comma(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function yen(n) { return '¥' + comma(Math.round(n)); }

  function fmtDateJa(iso) {
    var dt = parseISO(iso);
    if (!dt) return '—';
    return dt.getFullYear() + '年' + (dt.getMonth() + 1) + '月' + dt.getDate() + '日';
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function genId() {
    return 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  /** カテゴリ色は CSS 変数から取得（ライト／ダークで自動的に切り替わる） */
  function cssVar(name, fallback) {
    try {
      var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    } catch (e) { return fallback; }
  }

  function catColor(cat) {
    return cssVar('--cat-' + cat, '#64748b');
  }

  function catName(cat) { return t('cat.' + cat); }

  function cycleName(cycle) { return t('cycle.' + cycle); }

  function nameOf(item) {
    if (item.preset && PRESET_MAP[item.preset]) return PRESET_MAP[item.preset].name[lang];
    return item.name;
  }

  /* ---- 金額入力：全角→半角、記号除去、3桁区切り ---- */

  function digitsOf(raw) {
    var s = String(raw == null ? '' : raw);
    // 全角数字・全角コンマ・全角ピリオドを半角化
    s = s.replace(/[０-９]/g, function (c) {
      return String.fromCharCode(c.charCodeAt(0) - 0xfee0);
    });
    s = s.replace(/[，．]/g, function (c) {
      return c === '，' ? ',' : '.';
    });
    s = s.replace(/[^\d]/g, '');           // 円・¥・カンマ・空白などを除去
    s = s.replace(/^0+(?=\d)/, '');        // 先頭の 0 を落とす
    return s;
  }

  function formatAmount(raw) {
    var d = digitsOf(raw);
    return d ? comma(d) : '';
  }

  function amountValue(raw) {
    var d = digitsOf(raw);
    return d ? parseInt(d, 10) : 0;
  }

  function setCaretByDigits(el, digitIndex) {
    var v = el.value;
    if (digitIndex <= 0) { el.setSelectionRange(0, 0); return; }
    var count = 0, pos = v.length;
    for (var i = 0; i < v.length; i++) {
      if (v.charCodeAt(i) >= 48 && v.charCodeAt(i) <= 57) {
        count++;
        if (count === digitIndex) { pos = i + 1; break; }
      }
    }
    try { el.setSelectionRange(pos, pos); } catch (e) { /* noop */ }
  }

  /* =========================================================
     4. データ層（Data Layer）
     ---------------------------------------------------------
     いまは localStorage。将来バックエンド API へ移行するときは、
     DataLayer.read / DataLayer.write の2つだけを差し替えれば
     業務ロジック（集計・描画・書き出し）はそのまま使える。

     データモデル（1件分・すべて JSON に落とせる素の値）:
       {
         id:       String        安定した一意 ID
         name:     String        ユーザーが付けた名称
         preset:   String|null   テンプレート由来ならその ID（名称の多言語表示に使う）
         amount:   Number        金額（円・整数）
         category: String        utility | housing | insurance | telecom | subscription | other
         cycle:    String        monthly | bimonthly | quarterly | semiannual | yearly | once
         nextDate: String|null   'YYYY-MM-DD'（null = 支払い完了・繰り返しなし）
         anchor:   Number        1-31。月末調整の基準日（毎月31日払いを保持する）
         note:     String        メモ（空文字可）
       }

     ストア全体（localStorage / 書き出し JSON で共通の形）:
       {
         schema:     'life-cost-tracker/v1',
         version:    1,
         exportedAt: String（ISO 8601）
         items:      [ 上記モデルの配列 ]
       }
     ========================================================= */

  var SCHEMA_VERSION = 1;
  var memoryFallback = null;   // localStorage が使えない環境向けの退避先

  var DataLayer = {
    /* --- 永続化バックエンド（ここだけが環境依存） --- */
    read: function () {
      try {
        if (window.localStorage) {
          var raw = window.localStorage.getItem(STORE_KEY);
          if (raw !== null) return raw;
        }
      } catch (e) { /* プライベートモード等で使えない場合は退避先へ */ }
      return memoryFallback;
    },
    write: function (raw) {
      memoryFallback = raw;
      try {
        if (window.localStorage) window.localStorage.setItem(STORE_KEY, raw);
      } catch (e) { /* 容量超過などは無視（退避先には残る） */ }
    },

    /* --- モデル ⇄ 素の JSON --- */
    toRecord: function (item) {
      return {
        id: item.id,
        name: item.name,
        preset: item.preset,
        amount: item.amount,
        category: item.category,
        cycle: item.cycle,
        nextDate: item.nextDate,
        anchor: item.anchor,
        note: item.note
      };
    },

    serialize: function (list, exportedAt) {
      return {
        schema: SCHEMA_ID,
        version: SCHEMA_VERSION,
        exportedAt: exportedAt || new Date().toISOString(),
        items: (list || []).map(DataLayer.toRecord)
      };
    },

    deserialize: function (payload) {
      if (!payload) return null;
      // 配列そのもの（旧形式・手書き JSON）も受け付ける
      if (Array.isArray(payload)) return payload.map(normalizeItem).filter(Boolean);
      if (!Array.isArray(payload.items)) return null;
      return payload.items.map(normalizeItem).filter(Boolean);
    }
  };

  /** 保存済みデータを読み出す。未初期化なら null を返す。 */
  function loadData() {
    var raw = DataLayer.read();
    if (raw === null) return null;
    var parsed = null;
    try { parsed = JSON.parse(raw); } catch (e) { parsed = null; }
    var list = DataLayer.deserialize(parsed);
    return list === null ? [] : list;
  }

  /** 与えられた配列（省略時は現在の items）を保存する。 */
  function saveData(list) {
    DataLayer.write(JSON.stringify(DataLayer.serialize(list || items)));
  }

  /** 保存して再描画する（変更系の共通処理） */
  function commit(list) {
    if (list) items = list;
    saveData(items);
    renderAll();
  }

  /* =========================================================
     5. 状態
     ========================================================= */

  var items = [];
  var editingId = null;
  var chartMode = 'monthly';   // 'monthly' | 'yearly'
  var hoverIdx = -1;
  var chartSegs = [];
  var chartGeom = { size: 0, cx: 0, cy: 0, inner: 0, outer: 0 };
  var toastTimer = null;

  function normalizeItem(raw) {
    if (!raw || typeof raw !== 'object') return null;

    var preset = (typeof raw.preset === 'string' && PRESET_MAP[raw.preset]) ? raw.preset : null;
    var name = (typeof raw.name === 'string') ? raw.name.trim().slice(0, 60) : '';
    if (!name && preset) name = PRESET_MAP[preset].name.ja;
    if (!name) return null;

    if (!preset) preset = presetByName(name);

    // 手書き・旧形式の JSON 対策。文字列（全角数字や「¥6,000」形式）も数値化する
    var amount = (typeof raw.amount === 'string')
      ? amountValue(raw.amount)
      : Math.round(Number(raw.amount));
    if (!isFinite(amount) || amount < 0) amount = 0;

    var category = (CATS.indexOf(raw.category) >= 0) ? raw.category : 'other';
    var cycle = (CYCLE_KEYS.indexOf(raw.cycle) >= 0) ? raw.cycle : 'monthly';
    var nextDate = parseISO(raw.nextDate) ? raw.nextDate : null;

    var anchor = parseInt(raw.anchor, 10);
    if (!(anchor >= 1 && anchor <= 31)) anchor = nextDate ? parseInt(nextDate.slice(8, 10), 10) : 1;

    return {
      id: (typeof raw.id === 'string' && raw.id) ? raw.id : genId(),
      name: name,
      preset: preset,
      amount: amount,
      category: category,
      cycle: cycle,
      nextDate: nextDate,
      anchor: anchor,
      note: (typeof raw.note === 'string') ? raw.note.trim().slice(0, 80) : '',
      sample: !!raw.sample
    };
  }

  /** 入力された名称がテンプレート名（中日どちらか）と一致すればテンプレート扱いにする */
  function presetByName(name) {
    var n = String(name).trim();
    for (var i = 0; i < PRESETS.length; i++) {
      if (PRESETS[i].name.zh === n || PRESETS[i].name.ja === n) return PRESETS[i].id;
    }
    return null;
  }

  /* =========================================================
     6. 日付計算（周期から occurrence を生成）
     ========================================================= */

  /** [start, end]（ISO 文字列・両端含む）に含まれる支払日を列挙する */
  function occurrences(item, startISO, endISO) {
    var out = [];
    if (!item.nextDate) return out;

    var step = CYCLE_MONTHS[item.cycle];
    var cur = item.nextDate;
    var guard = 0;

    if (!step) {                                   // 単発
      if (cur >= startISO && cur <= endISO) out.push(cur);
      return out;
    }

    while (cur < startISO && guard++ < 600) {
      cur = addMonthsISO(cur, step, item.anchor);
      if (!cur) return out;
    }
    guard = 0;
    while (cur <= endISO && guard++ < 600) {
      out.push(cur);
      cur = addMonthsISO(cur, step, item.anchor);
      if (!cur) break;
    }
    return out;
  }

  function rangeThisMonth() {
    var t = todayDate();
    return {
      start: isoOfYMD(t.getFullYear(), t.getMonth(), 1),
      end: isoOfYMD(t.getFullYear(), t.getMonth(), daysInMonth(t.getFullYear(), t.getMonth()))
    };
  }

  function rangeNextMonth() {
    var t = todayDate();
    var y = t.getFullYear(), m0 = t.getMonth() + 1;
    var ty = y + Math.floor(m0 / 12), tm = ((m0 % 12) + 12) % 12;
    return { start: isoOfYMD(ty, tm, 1), end: isoOfYMD(ty, tm, daysInMonth(ty, tm)) };
  }

  function rangeNext12Months() {
    var t = todayDate();
    var end = new Date(t.getFullYear(), t.getMonth() + 12, t.getDate());
    end.setDate(end.getDate() - 1);
    return { start: isoOf(t), end: isoOf(end) };
  }

  function sumInRange(range) {
    var total = 0;
    items.forEach(function (it) {
      var n = occurrences(it, range.start, range.end).length;
      if (n) total += n * it.amount;
    });
    return total;
  }

  /** 年間（今後12か月）の合計。単発も1回分だけ含む。 */
  function annualTotal() { return sumInRange(rangeNext12Months()); }

  function dueStatus(item) {
    if (!item.nextDate) return { key: 'done', days: null };
    var d = diffDays(todayDate(), parseISO(item.nextDate));
    if (d < 0) return { key: 'overdue', days: d };
    if (d === 0) return { key: 'today', days: 0 };
    if (d <= DUE_SOON_DAYS) return { key: 'soon', days: d };
    return { key: 'upcoming', days: d };
  }

  /* =========================================================
     7. 初期サンプル
     ========================================================= */

  function seedSamples() {
    var t = todayDate();
    function d(offset) {
      var x = new Date(t.getFullYear(), t.getMonth(), t.getDate() + offset);
      return isoOf(x);
    }
    function mk(presetId, amount, offset, note) {
      var p = PRESET_MAP[presetId];
      var iso = d(offset);
      return normalizeItem({
        preset: presetId,
        name: p.name.ja,
        amount: amount,
        category: p.category,
        cycle: p.cycle,
        nextDate: iso,
        anchor: parseInt(iso.slice(8, 10), 10),
        note: note || '',
        sample: true
      });
    }
    return [
      mk('yachin', 85000, 0, '口座振替'),        // 本日が期限
      mk('denki', 6000, 5, '口座振替'),          // 7日以内
      mk('netflix', 1490, -2, 'クレジットカード'), // 期限切れ
      mk('kokuho', 32000, 18, '納付書')          // 通常
    ];
  }

  /* =========================================================
     8. レンダリング
     ========================================================= */

  function applyI18n() {
    document.documentElement.lang = (lang === 'zh') ? 'zh-CN' : 'ja';

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (I18N[key]) el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-ph');
      if (I18N[key]) el.setAttribute('placeholder', t(key));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      if (I18N[key]) el.setAttribute('aria-label', t(key));
    });

    var langBtn = $('langBtn');
    if (langBtn) langBtn.textContent = t('btnLang');

    var formTitle = $('formTitle');
    if (formTitle) formTitle.textContent = t(editingId ? 'formTitleEdit' : 'formTitleAdd');
  }

  function renderAll() {
    applyI18n();
    renderKpis();
    renderList();
    renderChartShell();
    drawChart();
  }

  function renderKpis() {
    $('statThisMonth').textContent = yen(sumInRange(rangeThisMonth()));
    $('statNextMonth').textContent = yen(sumInRange(rangeNextMonth()));
    $('statYear').textContent = yen(annualTotal());
  }

  function dueText(item) {
    var st = dueStatus(item);
    if (st.key === 'done') return { cls: 'pill-done', text: t('pillDone') };
    if (st.key === 'overdue') return { cls: 'pill-overdue', text: t('daysOverdue', { n: Math.abs(st.days) }) };
    if (st.key === 'today') return { cls: 'pill-today', text: t('daysToday') };
    return { cls: 'pill-soon', text: (st.key === 'soon' ? t('daysSoon', { n: st.days }) : t('daysFuture', { n: st.days })) };
  }

  function renderList() {
    var list = $('itemList');
    var t12 = rangeNext12Months();

    var sorted = items.slice().sort(function (a, b) {
      if (!a.nextDate && !b.nextDate) return nameOf(a).localeCompare(nameOf(b));
      if (!a.nextDate) return 1;
      if (!b.nextDate) return -1;
      if (a.nextDate < b.nextDate) return -1;
      if (a.nextDate > b.nextDate) return 1;
      return nameOf(a).localeCompare(nameOf(b));
    });

    var meta = $('listMeta');
    if (meta) meta.textContent = t('sortNote') + ' ・ ' + t('itemCount', { n: items.length });

    var html = sorted.map(function (it) {
      var st = dueStatus(it);
      var cls = 'item-card';
      if (st.key === 'soon') cls += ' is-soon';
      else if (st.key === 'today') cls += ' is-today';
      else if (st.key === 'overdue') cls += ' is-overdue';
      else if (st.key === 'done') cls += ' is-done';

      var pill = dueText(it);
      var occYear = occurrences(it, t12.start, t12.end).length;
      var yearAmt = occYear * it.amount;

      var metaBits = [
        '<span class="item-amount">' + esc(yen(it.amount)) + '</span>',
        '<span>' + esc(cycleName(it.cycle)) + '</span>',
        '<span class="item-due">' + esc(t('dueLabel')) + ' <b>' + esc(fmtDateJa(it.nextDate)) + '</b></span>',
        '<span class="pill ' + pill.cls + '">' + esc(pill.text) + '</span>'
      ].join('');

      var sub = '';
      if (it.cycle === 'once') {
        sub = '';
      } else if (it.cycle === 'monthly') {
        sub = '<p class="item-note">' + esc(t('perYear', { v: yen(yearAmt) })) + '</p>';
      } else {
        sub = '<p class="item-note">' + esc(t('perMonth', { v: yen(Math.round(yearAmt / 12)) })) + ' ・ ' +
              esc(t('perYear', { v: yen(yearAmt) })) + '</p>';
      }

      return '<article class="' + cls + '" data-id="' + esc(it.id) + '">' +
        '<div class="item-main">' +
          '<div class="item-top">' +
            '<span class="item-name">' + esc(nameOf(it)) + '</span>' +
            '<span class="badge" data-cat="' + esc(it.category) + '">' + esc(catName(it.category)) + '</span>' +
          '</div>' +
          (it.note ? '<p class="item-note">' + esc(it.note) + '</p>' : '') +
          '<div class="item-meta">' + metaBits + '</div>' +
          sub +
        '</div>' +
        '<div class="item-actions">' +
          '<button type="button" class="btn btn-primary btn-sm" data-act="paid">' + esc(t('btnPaid')) + '</button>' +
          '<button type="button" class="btn btn-outline btn-sm" data-act="edit">' + esc(t('btnEdit')) + '</button>' +
          '<button type="button" class="btn btn-danger-ghost btn-sm" data-act="del">' + esc(t('btnDelete')) + '</button>' +
        '</div>' +
      '</article>';
    }).join('');

    list.innerHTML = html;
    $('emptyState').hidden = items.length > 0;
    $('clearSampleBtn').hidden = !items.some(function (i) { return i.sample; });
  }

  /* ---- テンプレート ---- */

  function renderTemplates() {
    $('tplGrid').innerHTML = PRESETS.map(function (p) {
      return '<button type="button" class="tpl-btn" data-preset="' + esc(p.id) + '">' +
        '<span class="tpl-name">' + esc(p.name[lang]) + '</span>' +
        '<span class="tpl-meta">' + esc(cycleName(p.cycle)) + '・' + esc(yen(p.amount)) + '</span>' +
      '</button>';
    }).join('');
  }

  /* =========================================================
     9. グラフ（ドーナツ）
     ========================================================= */

  function chartData() {
    var t12 = rangeNext12Months();
    var totals = {};
    CATS.forEach(function (c) { totals[c] = 0; });

    items.forEach(function (it) {
      var n = occurrences(it, t12.start, t12.end).length;
      if (n) totals[it.category] += n * it.amount;
    });

    var div = (chartMode === 'yearly') ? 1 : 12;
    var segs = CATS
      .map(function (c) { return { cat: c, value: totals[c] / div }; })
      .filter(function (s) { return s.value > 0; });
    segs.sort(function (a, b) { return b.value - a.value; });
    return segs;
  }

  function renderChartShell() {
    var segs = chartData();
    var total = segs.reduce(function (a, s) { return a + s.value; }, 0);
    var legend = $('chartLegend');

    $('chartEmpty').hidden = total > 0;
    $('chartFoot').innerHTML = total > 0
      ? esc(chartMode === 'yearly' ? t('chartFootYearly') : t('chartFootMonthly'))
      : '';

    legend.innerHTML = segs.map(function (s) {
      var pct = total > 0 ? (s.value / total * 100) : 0;
      return '<li>' +
        '<span class="sw" style="background:' + esc(catColor(s.cat)) + '"></span>' +
        '<span class="lg-name">' + esc(catName(s.cat)) + '</span>' +
        '<span class="lg-amt">' + esc(yen(s.value)) + '</span>' +
        '<span class="lg-pct">' + esc(pct.toFixed(1)) + '%</span>' +
      '</li>';
    }).join('');

    return total;
  }

  function textOnFill(hex) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var r = parseInt(h.slice(0, 2), 16) / 255;
    var g = parseInt(h.slice(2, 4), 16) / 255;
    var b = parseInt(h.slice(4, 6), 16) / 255;
    function lin(c) { return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
    var L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    return L > 0.25 ? '#101018' : '#ffffff';
  }

  function drawChart() {
    var canvas = $('chart');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');

    var cssSize = Math.round(canvas.clientWidth) || 240;
    if (cssSize < 40) return;
    var dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(cssSize * dpr);
    canvas.height = Math.round(cssSize * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssSize, cssSize);

    var css = getComputedStyle(document.body);
    var fontStack = css.fontFamily || 'sans-serif';
    var inkColor = cssVar('--c-text', '#16162a');
    var faintColor = cssVar('--c-text-faint', '#86869f');
    var surface = cssVar('--c-surface', '#ffffff');

    var cx = cssSize / 2, cy = cssSize / 2;
    var outer = cssSize / 2 - 3;
    var inner = outer * 0.645;
    chartGeom = { size: cssSize, cx: cx, cy: cy, inner: inner, outer: outer };

    var segs = chartData();
    var total = segs.reduce(function (a, s) { return a + s.value; }, 0);

    chartSegs = [];
    if (total <= 0) { ctx.clearRect(0, 0, cssSize, cssSize); return; }

    var gap = segs.length > 1 ? 2 / outer : 0;   // 2px の隙間（surface 色が透ける）
    var a = -Math.PI / 2;

    segs.forEach(function (s, i) {
      var span = (s.value / total) * Math.PI * 2;
      var a0 = a;
      var a1 = a + span;
      a = a1;

      var g = (span > gap * 3) ? gap / 2 : 0;
      var s0 = a0 + g;
      var s1 = a1 - g;
      if (s1 <= s0) { s0 = a0; s1 = a1; }

      var color = catColor(s.cat);
      var isHover = (i === hoverIdx);
      var rOut = isHover ? outer : outer - 1;

      ctx.beginPath();
      ctx.arc(cx, cy, rOut, s0, s1, false);
      ctx.arc(cx, cy, inner, s1, s0, true);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      chartSegs.push({ cat: s.cat, value: s.value, pct: s.value / total * 100, a0: a0, a1: a1, color: color });

      // 直接ラベル（8% 以上のスライスにのみ。凡例が主、これは補助）
      var pct = s.value / total * 100;
      if (pct >= 8 && span > 0.34) {
        var mid = (a0 + a1) / 2;
        var lr = inner + (outer - inner) * 0.5;
        var lx = cx + Math.cos(mid) * lr;
        var ly = cy + Math.sin(mid) * lr;
        ctx.fillStyle = textOnFill(color);
        ctx.font = '600 ' + Math.max(10, Math.round(cssSize * 0.045)) + 'px ' + fontStack;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(Math.round(pct) + '%', lx, ly);
      }
    });

    // 中央の合計
    var maxW = (inner - 6) * 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = faintColor;
    ctx.font = '500 ' + Math.max(10, Math.round(cssSize * 0.055)) + 'px ' + fontStack;
    ctx.fillText(t('chartTotal'), cx, cy - cssSize * 0.1);

    var value = yen(total);
    var fs = Math.round(cssSize * 0.105);
    var minFs = 9;
    do {
      ctx.font = '700 ' + fs + 'px ' + fontStack;
      if (ctx.measureText(value).width <= maxW) break;
      fs -= 1;
    } while (fs > minFs);
    ctx.fillStyle = inkColor;
    ctx.fillText(value, cx, cy + cssSize * 0.025);

    // ホバー時は外周にリングを描いて視認性を上げる
    if (hoverIdx >= 0 && chartSegs[hoverIdx]) {
      ctx.beginPath();
      ctx.arc(cx, cy, inner - 2, -Math.PI / 2, Math.PI * 1.5, false);
      ctx.strokeStyle = surface;
      ctx.lineWidth = 0;
      ctx.stroke();
    }
  }

  function showTip(evt, seg) {
    var tip = $('chartTip');
    var wrap = $('chart').parentNode;
    var r = wrap.getBoundingClientRect();
    tip.textContent = catName(seg.cat) + ' · ' + yen(seg.value) + ' · ' + seg.pct.toFixed(1) + '%';
    tip.style.left = Math.round(evt.clientX - r.left) + 'px';
    tip.style.top = Math.round(evt.clientY - r.top) + 'px';
    tip.hidden = false;
  }

  function hideTip() { $('chartTip').hidden = true; }

  function bindChartHover() {
    var canvas = $('chart');
    if (!canvas) return;

    canvas.addEventListener('pointermove', function (e) {
      if (!chartSegs.length) return;
      var r = canvas.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      var dx = x - chartGeom.cx, dy = y - chartGeom.cy;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var idx = -1;

      if (dist >= chartGeom.inner && dist <= chartGeom.outer + 2) {
        var ang = Math.atan2(dy, dx) + Math.PI / 2;
        while (ang < 0) ang += Math.PI * 2;
        while (ang >= Math.PI * 2) ang -= Math.PI * 2;
        for (var i = 0; i < chartSegs.length; i++) {
          if (ang >= chartSegs[i].a0 && ang < chartSegs[i].a1) { idx = i; break; }
        }
      }

      if (idx !== hoverIdx) { hoverIdx = idx; drawChart(); }
      if (idx >= 0) showTip(e, chartSegs[idx]); else hideTip();
    });

    canvas.addEventListener('pointerleave', function () {
      if (hoverIdx !== -1) { hoverIdx = -1; drawChart(); }
      hideTip();
    });
  }

  /* =========================================================
     10. 書き出し / 読み込み
     ========================================================= */

  function stampForName(d) {
    return d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate()) + '-' + pad2(d.getHours()) + pad2(d.getMinutes());
  }

  function download(filename, text, mime) {
    var blob = new Blob([text], { type: mime });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      if (a.parentNode) a.parentNode.removeChild(a);
      URL.revokeObjectURL(url);
    }, 2000);
  }

  function exportJSON() {
    // 書き出しはデータ層のシリアライズをそのまま使う（ストアと同一スキーマ）
    var payload = DataLayer.serialize(items, new Date().toISOString());
    download('life-cost-tracker-' + stampForName(new Date()) + '.json',
      JSON.stringify(payload, null, 2), 'application/json');
    toast(t('toastExported'));
  }

  function importJSONFile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var data = null;
      try { data = JSON.parse(String(reader.result)); } catch (e) { data = null; }

      var next = DataLayer.deserialize(data);
      if (next === null) { toast(t('errImport')); return; }
      if (!window.confirm(t('confirmImport'))) return;

      commit(next);
      cancelForm();
      toast(t('toastImported', { n: next.length }));
    };
    reader.onerror = function () { toast(t('errImport')); };
    reader.readAsText(file);
  }

  /* ---- .ics ---- */

  function cpBytes(cp) {
    return cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4;
  }

  /** RFC 5545 の 75 オクテット折り返し（UTF-8 の文字境界を壊さない） */
  function foldLine(line) {
    var chars = Array.from(String(line));
    var out = [];
    var cur = '';
    var used = 0;
    for (var i = 0; i < chars.length; i++) {
      var b = cpBytes(chars[i].codePointAt(0));
      if (used + b > 75) {
        out.push(cur);
        cur = ' ' + chars[i];
        used = 1 + b;
      } else {
        cur += chars[i];
        used += b;
      }
    }
    out.push(cur);
    return out.join('\r\n');
  }

  function icsEsc(s) {
    return String(s == null ? '' : s)
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\r?\n/g, '\\n');
  }

  function icsStamp(d) {
    return d.getUTCFullYear() + pad2(d.getUTCMonth() + 1) + pad2(d.getUTCDate()) + 'T' +
      pad2(d.getUTCHours()) + pad2(d.getUTCMinutes()) + pad2(d.getUTCSeconds()) + 'Z';
  }

  function compactDate(iso) { return iso.replace(/-/g, ''); }

  function rruleOf(item) {
    var step = CYCLE_MONTHS[item.cycle];
    if (!step) return null;                        // 単発は繰り返さない

    // UNTIL は「今後12か月」の末日。ただし初回の次回分が UNTIL を超えないよう下限をそろえる
    var until = rangeNext12Months().end;
    var second = addMonthsISO(item.nextDate, step, item.anchor);
    if (second && second > until) until = second;

    var freq = 'FREQ=MONTHLY';
    var interval = (step === 12) ? null : step;
    if (step === 12) freq = 'FREQ=YEARLY';

    return freq +
      (interval && interval > 1 ? ';INTERVAL=' + interval : '') +
      ';UNTIL=' + compactDate(until);
  }

  function buildICS() {
    var lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//reveriel.com//life-cost-tracker//JA',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:' + icsEsc(t('icsCalName'))
    ];

    var stamp = icsStamp(new Date());
    var host = 'life-cost-tracker.reveriel.com';

    items.forEach(function (it) {
      if (!it.nextDate) return;

      lines.push('BEGIN:VEVENT');
      lines.push('UID:' + icsEsc(it.id + '-' + compactDate(it.nextDate)) + '@' + host);
      lines.push('DTSTAMP:' + stamp);
      lines.push('DTSTART;VALUE=DATE:' + compactDate(it.nextDate));
      lines.push('SUMMARY:' + icsEsc(nameOf(it) + '（' + yen(it.amount) + '）'));
      lines.push('CATEGORIES:' + icsEsc(catName(it.category)));

      var desc = [cycleName(it.cycle), it.note].filter(Boolean).join(' / ');
      if (desc) lines.push('DESCRIPTION:' + icsEsc(desc));

      var rule = rruleOf(it);
      if (rule) lines.push('RRULE:' + rule);

      lines.push('TRANSP:TRANSPARENT');
      lines.push('BEGIN:VALARM');
      lines.push('TRIGGER:-P2D');
      lines.push('ACTION:DISPLAY');
      lines.push('DESCRIPTION:' + icsEsc(nameOf(it)));
      lines.push('END:VALARM');
      lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');
    return lines.map(foldLine).join('\r\n') + '\r\n';
  }

  function exportICS() {
    var has = items.some(function (it) { return !!it.nextDate; });
    if (!has) { toast(t('toastExportIcsEmpty')); return; }
    download('life-cost-tracker-' + stampForName(new Date()) + '.ics',
      buildICS(), 'text/calendar;charset=utf-8');
    toast(t('toastExported'));
  }

  /* =========================================================
     11. フォーム操作
     ========================================================= */

  function showForm(item) {
    editingId = item ? item.id : null;
    $('formTitle').textContent = t(editingId ? 'formTitleEdit' : 'formTitleAdd');

    $('fName').value = item ? nameOf(item) : '';
    $('fCategory').value = item ? item.category : 'utility';
    $('fCycle').value = item ? item.cycle : 'monthly';
    $('fAmount').value = item ? comma(item.amount) : '';
    $('fDate').value = item ? (item.nextDate || '') : defaultNextDate();
    $('fNote').value = item ? item.note : '';

    clearErrors();
    $('itemForm').hidden = false;
    $('tplPanel').hidden = true;
    $('fName').focus();
  }

  function defaultNextDate() {
    var t = todayDate();
    var d = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 7);
    return isoOf(d);
  }

  function cancelForm() {
    editingId = null;
    $('itemForm').hidden = true;
    $('itemForm').reset();
    clearErrors();
    $('formTitle').textContent = t('formTitleAdd');
  }

  function clearErrors() {
    ['errName', 'errAmount', 'errDate'].forEach(function (id) {
      var el = $(id);
      if (el) el.hidden = true;
    });
    ['fName', 'fAmount', 'fDate'].forEach(function (id) {
      var el = $(id);
      if (el) el.removeAttribute('aria-invalid');
    });
  }

  function submitForm(e) {
    if (e) e.preventDefault();
    clearErrors();

    var name = $('fName').value.trim();
    var amount = amountValue($('fAmount').value);
    var dateISO = $('fDate').value;
    var ok = true;

    if (!name) { $('errName').hidden = false; $('fName').setAttribute('aria-invalid', 'true'); ok = false; }
    if (amount <= 0) { $('errAmount').hidden = false; $('fAmount').setAttribute('aria-invalid', 'true'); ok = false; }
    if (!parseISO(dateISO)) { $('errDate').hidden = false; $('fDate').setAttribute('aria-invalid', 'true'); ok = false; }
    if (!ok) return;

    var data = {
      name: name,
      preset: presetByName(name),
      amount: amount,
      category: $('fCategory').value,
      cycle: $('fCycle').value,
      nextDate: dateISO,
      anchor: parseInt(dateISO.slice(8, 10), 10),
      note: $('fNote').value.trim()
    };

    if (editingId) {
      var idx = items.findIndex(function (i) { return i.id === editingId; });
      if (idx >= 0) {
        data.id = items[idx].id;
        data.sample = items[idx].sample;
        items[idx] = normalizeItem(data);
      }
      toast(t('toastSaved'));
    } else {
      var it = normalizeItem(data);
      items.push(it);
      toast(t('toastAdded', { name: nameOf(it) }));
    }

    commit();
    cancelForm();
  }

  function addPreset(presetId) {
    var p = PRESET_MAP[presetId];
    if (!p) return;
    var dateISO = defaultNextDate();
    var it = normalizeItem({
      preset: p.id,
      name: p.name.ja,
      amount: p.amount,
      category: p.category,
      cycle: p.cycle,
      nextDate: dateISO,
      anchor: parseInt(dateISO.slice(8, 10), 10),
      note: ''
    });
    commit(items.concat([it]));
    toast(t('toastAddedTpl', { name: p.name[lang] }));
  }

  function markPaid(id) {
    var it = items.find(function (i) { return i.id === id; });
    if (!it) return;
    var step = CYCLE_MONTHS[it.cycle];
    if (!step) {
      it.nextDate = null;
      commit();
      toast(t('toastPaidOnce'));
      return;
    }
    var next = addMonthsISO(it.nextDate, step, it.anchor);
    it.nextDate = next;
    commit();
    toast(t('toastPaid', { date: fmtDateJa(next) }));
  }

  function deleteItem(id) {
    var it = items.find(function (i) { return i.id === id; });
    if (!it) return;
    if (!window.confirm(t('confirmDelete', { name: nameOf(it) }))) return;
    commit(items.filter(function (i) { return i.id !== id; }));
    cancelForm();
    toast(t('toastDeleted'));
  }

  function clearSamples() {
    var before = items.length;
    items = items.filter(function (i) { return !i.sample; });
    if (items.length === before) { toast(t('toastNoSample')); return; }
    commit();
    cancelForm();
    toast(t('toastCleared'));
  }

  function toast(msg) {
    var el = $('toast');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 2800);
  }

  function setLang(next) {
    lang = (next === 'ja') ? 'ja' : 'zh';
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* noop */ }
    renderTemplates();
    renderAll();
  }

  /* =========================================================
     12. イベント登録
     ========================================================= */

  function bindEvents() {
    $('langBtn').addEventListener('click', function () {
      setLang(lang === 'zh' ? 'ja' : 'zh');
    });

    $('addBtn').addEventListener('click', function () {
      if (!$('itemForm').hidden && !editingId) { cancelForm(); return; }
      showForm(null);
    });

    $('tplBtn').addEventListener('click', function () {
      var p = $('tplPanel');
      p.hidden = !p.hidden;
      if (!p.hidden) $('itemForm').hidden = true;
    });

    $('tplGrid').addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-preset]') : null;
      if (!btn) return;
      addPreset(btn.getAttribute('data-preset'));
    });

    $('itemForm').addEventListener('submit', submitForm);
    $('cancelBtn').addEventListener('click', cancelForm);

    $('fAmount').addEventListener('input', function () {
      var el = this;
      var caret = el.selectionStart || 0;
      var before = el.value.slice(0, caret);
      var digitsBefore = (before.match(/\d/g) || []).length;
      el.value = formatAmount(el.value);
      setCaretByDigits(el, digitsBefore);
    });

    $('fAmount').addEventListener('blur', function () {
      this.value = formatAmount(this.value);
    });

    $('itemList').addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-act]') : null;
      if (!btn) return;
      var card = btn.closest('.item-card');
      if (!card) return;
      var id = card.getAttribute('data-id');
      var act = btn.getAttribute('data-act');
      if (act === 'paid') markPaid(id);
      else if (act === 'edit') {
        var it = items.find(function (i) { return i.id === id; });
        if (it) { showForm(it); $('itemForm').scrollIntoView({ block: 'nearest' }); }
      } else if (act === 'del') deleteItem(id);
    });

    $('clearSampleBtn').addEventListener('click', clearSamples);

    $('segMonthly').addEventListener('click', function () {
      chartMode = 'monthly';
      $('segMonthly').classList.add('is-active');
      $('segYearly').classList.remove('is-active');
      hoverIdx = -1;
      renderChartShell();
      drawChart();
    });
    $('segYearly').addEventListener('click', function () {
      chartMode = 'yearly';
      $('segYearly').classList.add('is-active');
      $('segMonthly').classList.remove('is-active');
      hoverIdx = -1;
      renderChartShell();
      drawChart();
    });

    $('exportJsonBtn').addEventListener('click', exportJSON);
    $('exportIcsBtn').addEventListener('click', exportICS);
    $('importJsonBtn').addEventListener('click', function () { $('importFile').click(); });
    $('importFile').addEventListener('change', function () {
      var f = this.files && this.files[0];
      if (f) importJSONFile(f);
      this.value = '';
    });

    var rt = null;
    window.addEventListener('resize', function () {
      if (rt) clearTimeout(rt);
      rt = setTimeout(function () { hoverIdx = -1; drawChart(); }, 140);
    });

    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onTheme = function () { hoverIdx = -1; renderChartShell(); drawChart(); };
      if (mq.addEventListener) mq.addEventListener('change', onTheme);
      else if (mq.addListener) mq.addListener(onTheme);
    }
  }

  /* =========================================================
     13. 初期化
     ========================================================= */

  function init() {
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved === 'ja' || saved === 'zh') lang = saved;
    } catch (e) { /* noop */ }

    var stored = loadData();
    if (stored === null) {
      items = seedSamples();      // 初回のみサンプルを投入
      saveData(items);
    } else {
      items = stored;
    }

    renderTemplates();
    bindEvents();
    bindChartHover();
    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* テスト用のフック（読み取り専用の内部公開） */
  window.__lct = {
    addMonthsISO: addMonthsISO,
    occurrences: occurrences,
    digitsOf: digitsOf,
    formatAmount: formatAmount,
    amountValue: amountValue,
    buildICS: buildICS,
    seedSamples: seedSamples,
    dueStatus: dueStatus,
    getItems: function () { return items; },
    setItems: function (next) { commit(next); },
    loadData: loadData,
    saveData: saveData,
    serialize: function (list) { return DataLayer.serialize(list || items); },
    deserialize: function (payload) { return DataLayer.deserialize(payload); },
    setLang: setLang,
    getLang: function () { return lang; },
    chartData: chartData,
    renderAll: renderAll
  };
})();
