# NEXT-STEPS — life-cost-tracker（生活費トラッカー）

> 更新日：2026-10-12 ／ 纯静态站，https://www.reveriel.com/life-cost-tracker/
> 本文档 = 产品迭代方案。三维度：①内容层（日语 SEO）②日本 ASP 联盟 ③裂变 / 继续滚工具。
> **本产品特有变量：已内置 DataLayer 抽象层**，方案中单列「何时接后端 / 存云端」路线。

---

## 0. 现状盘点（本次迭代前）

| 项目 | 状态 | 备注 |
| --- | --- | --- |
| 工具本体 | ✅ 完整 | 20 个日本缴费模板、到期四色高亮（≤7日黄/当日红/过期灰）、canvas 环形图、JSON 导入导出、.ics 导出 |
| 数据层 | ✅ **已抽象** | `script.js` §4 `DataLayer`：`read/write`（持久化）+ `serialize/deserialize/toRecord`（模型⇄JSON），业务逻辑与存储解耦 |
| canonical 绝对 URL | ✅ | `https://www.reveriel.com/life-cost-tracker/` |
| JSON-LD | ✅ | WebApplication + FAQPage |
| 反馈 FAB | ✅ | 右下固定，Google Form 带 `entry.1745177199=生活費トラッカー` |
| beacon token | ✅ | `6fc01bf3ac5e457ba1bd16b91e5b653e` |
| 互链 | ✅（本次增强） | 页脚链 适格请求书/领收书/医疗证明/AI仕事診断；SEO 段加教程内链 |
| **分享裂变** | ❌ **缺口** | 首页无分享块（矩阵内 mitsumori/ryoshusho 已有）。本方案 P1 补齐 |
| **隐私政策 / 运营者信息** | ❌→✅（本次补齐） | **ASP 落审主因，本次已修** |
| **内容层（教程页）** | ❌→✅（首篇） | 本次 1 篇，后续矩阵待铺 |
| **CTA 按钮不可见 Bug** | ⚠️→✅（本次修复） | 见 §1.1，属继承自矩阵 `guide.css` 的既有缺陷 |

**结论**：工具本体成熟度高于矩阵内其他站（有数据层抽象 + 20 模板）。本次迭代解决 **ASP 合规缺口 + 内容层 0→1**，
并顺手修复了一个会**直接吃掉 CTA 点击**的样式 Bug。

---

## 1. 本次已实施（硬性迭代，勿回退）

| 文件 | 变更 |
| --- | --- |
| `privacy.html` | 新增。日文隐私政策，**重点写清 `localStorage`（数据只存本机浏览器）、`.ics`/JSON 导出（端内生成不外传）、不收集个人信息 / 不上传服务器**；另含 Cloudflare Web Analytics（免 Cookie）、Google Form、Google Fonts、HTTPS、开示请求渠道 |
| `company.html` | 新增。运营者信息：**GUO XING / 大阪府大阪市**（不公开电话·门牌号，按需开示）+ Organization JSON-LD |
| `koteihi-minaoshi.html` | 新增。教程页「家計簿・固定費の見直し方ガイド」— 固定費 vs 変動費、4 步洗い出し、见直し优先顺序表、续做技巧；Article + FAQPage JSON-LD（4 问）；canonical 自身；复用 og:image；**首页 CTA ×4**（顶部 box / 中段 box / 尾部 foot / header 按钮）；互链 |
| `guide.css` | 新增（自矩阵复制 + 修 Bug，见 §1.1）。教程页 + 法务页共用，继承 `style.css` 变量，跟随暗色模式 |
| `index.html` | 页脚加「プライバシーポリシー / 運営者情報 / 家計簿・固定費の見直し方ガイド」链接；SEO 段补教程页内链 |
| `style.css` | 补 `@media print` 隐藏 `.feedback-fab`（原缺失，打印时会印出悬浮按钮）；补 `.seo a` 链接配色 |
| `sitemap.xml` | 补 3 个新 URL（koteihi-minaoshi / privacy / company） |
| `NEXT-STEPS.md` | 本文档 |

**合规红线（务必保持）**：运营者仅披露「GUO XING / 大阪府大阪市」；**不公开电话、详细地址**；邮箱仅「被要求时」经反馈表单提供。

### 1.1 本次顺带修复：CTA 按钮文字不可见（跨站 Bug）

`guide.css` 里的通用链接规则 `.guide a { color: var(--c-accent) }`（以及 `.legal a`）会**盖过** `.btn-primary` 的 `color`（选择器权重 `.guide a` (0,1,1) > `.btn-primary` (0,1,0)），
导致 CTA 按钮变成「紫底紫字」——文字与背景同色、肉眼不可见。headless 实测：

```
修复前： text="今すぐ無料で使う" color=rgb(79,70,229) bg=rgb(79,70,229)   ← 不可见
修复后： text="今すぐ無料で使う" color=rgb(255,255,255) bg=rgb(79,70,229) ← 正常
```

已在 `guide.css` 末尾追加更高权重的修正规则（`.guide/.legal a.btn-primary`）。
⚠️ **同一 Bug 存在于矩阵内其他站的 `guide.css` / `legal.css`**（实测受影响：`mitsumori-pdf`、`ryoshusho-pdf`、`chumonsho-pdf`、`sofu-jo`），
这些站的教程页/法务页 CTA 按钮目前也是隐形的，建议逐个复用同一段修正。

---

## 2. 三维度迭代优先级

### 🥇 P0 — ASP 联盟落地（本周，收益最关键）

ASP 已具备提交条件（隐私 / 运营者页就位）。

1. **提交审核**：A8.net / バリューコマース / もしもアフィリエイト 主账号 + 本站站点登记。
   - 站点信息页填 `company.html`、隐私填 `privacy.html`、反馈填 Google Form。
   - 站点类别：生活・家計 / ファイナンス・ツール。
2. **选品（与「固定费管理」场景强相关，按佣金 × 转化优先级）**：

   | 优先 | 品类 | 代表案件 | 与本站的契合点 |
   | --- | --- | --- | --- |
   | 1 | **电力·燃气 切换** | エネチェンジ / 新电力系 | 「電気代・ガス代」是本站第一大模板类目，切换即降固定费，佣金高 |
   | 2 | **光回线 / 格安SIM** | 各回线比较 ASP 案件 | 「通信」类目直接对应，见直し文脉天然贴合 |
   | 3 | **家计 App / 家计簿 SaaS** | マネーフォワード 家計簿、Zaim 等 | 工具用户 ≈ 有家计意识人群，画像精准（注意与本站定位做区隔，摆「云端备份/自动连携」场景位） |
   | 4 | **保险见直し / 无料一括相谈** | 保险窗口系 | 「保険・年金」类目对应，单价高 |
   | 5 | **不需要品买取 / 引越し** | — | 见直し延伸（次要） |

3. **广告位**：
   - 教程页 `koteihi-minaoshi.html` 正文中段 + 「见直し优先顺序」表后各 1 个（原生卡片）。
   - 首页 SEO 段下方 1 个（次要，避免影响工具主体验）。
   - **原则**：工具页保留存与转化，教程页承载变现。
4. **合规**：所有联盟链接加 `rel="sponsored nofollow"`；加 `.pr-ad` 样式标注「PR / 広告」。

> 完成标准：至少 1 个 ASP 通过审核 + 教程页挂上 2 个已在库联盟组件。

---

### 🥈 P1 — 内容层：日语 SEO how-to 长尾（2–4 周持续）

`koteihi-minaoshi.html` 是内容层样板。按关键词量与商业价值排序，继续铺：

| 优先 | 计划页面 | 目标长尾词 | 关联 CTA / 变现 |
| --- | --- | --- | --- |
| 1 | `koteihi-ichiran.html` | 固定費 一覧 見直し / 固定費 項目 | 首页 + 电力·通信 ASP |
| 2 | `denki-gas-minaoshi.html` | 電気代 見直し / ガス 乗り換え | 首页 + 电力 ASP（高佣金） |
| 3 | `subsc-minaoshi.html` | サブスク 見直し / 契約 一覧 管理 | 首页 + 家计 App |
| 4 | `tsushinhi-minaoshi.html` | 通信費 見直し / 格安SIM 乗り換え | 首页 + 回线 ASP |
| 5 | `nenkin-hoken-memo.html` | 国民年金 支払い / 国民健康保険 納付 | 首页（制度解说型） |
| 6 | `hikkoshi-fixed-cost.html` | 引っ越し 固定費 / 一人暮らし 固定費 目安 | 首页 + 引越し ASP |

**每页统一规范**（对齐 `product-site-checklist`）：
- `<title>` + meta description 含目标长尾词；canonical 指向自身绝对 URL。
- `Article` + `FAQPage` JSON-LD；`og:type=article`；`og:image` 复用 `og-image.png`。
- **1200+ 日文字**正文；页首 / 中 / 尾 ≥3 处首页 CTA；面包屑 + 「あわせて読みたい」互链。

> 完成标准：内容层 ≥5 页，且至少 2 页有自然展现（GSC 曝光 > 0）。

---

### 🥉 P2 — 裂变玩法 + DataLayer 后端路线（本产品专属重点）

#### P2-a 裂变玩法（本站当前为零，优先补）

| 玩法 | 说明 | 落地方式 | 优先级 |
| --- | --- | --- | --- |
| **分享块（与矩阵对齐）** | 首页加 X / LINE / 复制链接 / 保存图片 分享块，文案如「我家的固定费是每月 ¥XX，你的呢？」——**把个人化数字当作分享钩子**（本产品独有优势） | 复用 mitsumori/ryoshusho 的 `#shareBlock` 结构 + `script.js` | ★★★ |
| **「固定費診断」分享图** | 把 KPI（本月/全年固定费 + 类目环形图）canvas 导出为分享图，图内嵌站点 URL | 由已有 canvas 直接 `toDataURL()`，零新依赖 | ★★★ |
| **合租/家庭对照** | 「夫婦・ルームシェアで固定費を分担」话术，鼓励把链接发给同住者共同登记（一对多拉新） | 分享文案 + 教程页「二人暮らしの固定費」 | ★★ |
| **教程页二次裂变** | 教程页底部加「この記事をシェア」 | 复用首页分享组件 | ★★ |
| **追踪参数** | 分享链接带 `?ref=share`，用 beacon / 表单字段区分来源，评估裂变系数 | Cloudflare Analytics + Form 字段 | ★ |

#### P2-b DataLayer → 接后端 / 存云端：何时接、怎么接

**现状**：`script.js` §4 已把「持久化」收敛到两个方法：

```js
DataLayer.read()  → String|null      // 目前：localStorage.getItem(STORE_KEY) → 退避 memoryFallback
DataLayer.write(raw)                 // 目前：localStorage.setItem(...)
```

其余全部业务逻辑（集计、描画、`.ics`、JSON 导入导出）只依赖 `loadData()/saveData()`，**不直接碰 localStorage**。
导出/导入用的 `serialize/deserialize` 已有 `schema: 'life-cost-tracker/v1'` + `version` 字段 —— 这就是未来的 API 契约雏形。

**触发条件（满足任一才接后端，避免过早复杂化）**：
1. 用户明确要求「换手机 / 换浏览器后数据还在」（本地存储的最大痛点，也是当前 FAQ 已自曝的弱点）。
2. .ics 之外出现「到期邮件 / LINE 推送提醒」需求（本地无法发通知）。
3. 出现多设备 / 家庭共享需求（一台设备存不下共享语义）。
4. 矩阵内已有 ≥3 个站需要同一套账号体系（届时统一做，而非本产品单干）。

**路线（分三步，不破坏纯静态优势）**：

| 阶段 | 做法 | 改动面 | 保留的纯静态性 |
| --- | --- | --- | --- |
| **Step 1 增强本地（先做，成本≈0）** | 补「云端备份」占位入口 + 强化 JSON 导出引导（如下载文件名带日期、导出后提示） | 仅 UI | 100% 静态 |
| **Step 2 可选登录同步** | 保持匿名可用；登录后 `DataLayer.read/write` 换成「本地优先 + 后台同步到 API」。**只替换这两个方法**，`serialize/deserialize` 直接作为 API 的 body | 替换 §4 两个方法 + 加 auth 模块 | 静态站 + 外部 API（仍可纯静态部署，API 独立） |
| **Step 3 多端 / 提醒** | 后端定时任务读同一 `items` 模型，发到期邮件 / LINE；`nextDate`+`cycle` 已能推算未来 1 年，服务端可复用同一套集计逻辑 | 新增后端服务 | 前端仍静态 |

**关键约束（设计时就要守住）**：
- **数据模型冻结**：`{id, name, preset, amount, category, cycle, nextDate, anchor, note}` 已是可 JSON 化的素值，**不要改成依赖浏览器对象的类型**；新增字段一律走 `schema version` 升级 + `deserialize` 兼容旧版。
- **`id` 稳定性**：后端合并本地/云端数据时靠 `id` 去重，`id` 必须客户端生成且永不变。
- **隐私叙事不能崩**：`privacy.html` 现在写的是「不送服务器」。一旦接后端，**必须同步改写**为「匿名可用；仅在你主动开启同步时上传，可随时删除」——否则是自我打脸 + 合规风险。这是接后端时的**第一优先工作项**。
- **迁移路径**：Step 2 上线时，首次登录提供「把本机数据合并到云端」一键操作（用现有 `deserialize` 读本地 → POST）。

#### P2-c 继续滚工具

- 与矩阵内 `japan-invoice-pdf` / `ryoshusho-pdf` 做「家计 → 事业」动线内链（个人事业主既管生活固定费也开票）。
- 小功能候选：**缴费提醒的浏览器通知**（Notification API，仍无需后端）、**固定费月别趋势图**（复用已有 canvas 层）。
- **反馈闭环**：定期看 Google Form 里 `生活費トラッカー` 来源条目，把高频需求回灌工具与选题。

---

## 3. 排期建议

| 周 | 动作 |
| --- | --- |
| W1 | 提交 ASP 审核；补首页**分享块**（裂变 0→1）；铺教程页 #1（固定費 一覧） |
| W2 | ASP 复核补件；教程页 #1/#2 挂联盟位；铺 #2（電気代 見直し） |
| W3 | 铺 #3（サブスク）、#4（通信費）；GSC 提交新 sitemap，观察收录 |
| W4 | 铺 #5、#6；上线 `?ref=share` 追踪；评估是否触发 P2-b 的 Step 2 |
| 持续 | 同步修矩阵内其他站的 §1.1 CTA 按钮 Bug |

---

## 4. 未决 / 需确认

- **兑换提现主体**：ASP 收款主体与 `GUO XING` 名义是否一致（需与运营者确认）。
- **邮箱披露策略**：当前仅「要求时提供」。若某 ASP 强制要求公开联系邮箱，再评估是否在 `company.html` 增列统一邮箱。
- **接后端的时机**：见 P2-b 的四条触发条件；**建议在教程页累计 ≥5 篇、有稳定自然流量前不接**，先把纯静态的 SEO 与联盟收益跑出来。
- **教程页命名**：本篇用 `koteihi-minaoshi.html`。若后续 ≥5 篇，建议统一前缀或改目录（如 `guide/koteihi-ichiran.html`），届时需同步 301 / sitemap。
