# Lobotomy Corporation 前端框架设计文档

**创建日期:** 2026-06-04
**技术栈:** Vue 3 + TypeScript + Vite
**设计理念:** 脑叶公司工业美学 — 黄黑条纹、扁平化、左上倒角、警示标识

---

## 1. 项目概述

基于 Lobotomy Corporation 世界观的 LLM 交互游戏前端框架。玩家扮演第 47 号支部主管（X），在 AI 秘书 Angela 辅助下管理异想体收容设施。

### 1.1 核心交互模式
- **混合交互:** 左侧管理面板 + 右侧 AI 对话终端
- **8 个主页面:** 办公室 / 异想体 / 员工 / E.G.O. / 地图 / 终端 / 日志 / 设置
- **底部 AI Dock:** 全局可折叠，流式输出 Angela 对话

### 1.2 技术决策
- Vue 3 Composition API + TypeScript + Vite
- Pinia 状态管理（设施状态、异想体、员工、E.G.O.）
- 移植 SillyTavern Web v3 引擎（流式 XML 解析、世界书、变量系统）
- Lucide Icons（676 个 SVG 图标，无 emoji）
- 全中文界面

---

## 2. 设计系统

### 2.1 配色

| Token | Hex | 用途 |
|-------|-----|------|
| --lc-yellow | #F0C040 | 主强调色、活跃状态 |
| --lc-yellow-dark | #D4A020 | 条纹暗色 |
| --lc-red | #C83030 | 危险、ALEPH 等级 |
| --lc-orange | #D47830 | 警告、WAW 等级 |
| --lc-green | #309870 | 安全、ZAYIN 等级 |
| --lc-blue | #4078B0 | 信息、数据读数 |
| --lc-gray-dead | #605858 | 死亡/禁用 |
| --lc-surface | #0F0D0C | 页面底色 |
| --lc-card | #1A1614 | 卡片面板 |
| --lc-deep | #080606 | 深层背景 |
| --lc-terminal | #0A0E0A | 终端底色 |
| --lc-border | #2A2420 | 分割线/边框 |

### 2.2 排版

| 用途 | 字体 | Weight |
|------|------|--------|
| 页面标题 | Rajdhani | 700 |
| 面板标签 | Rajdhani | 500 |
| 正文 | Noto Sans SC | 400 |
| 终端/数据 | JetBrains Mono | 400 |
| 警报/强调 | Rajdhani | 800 |

### 2.3 核心 Motif

- **左上倒角:** `clip-path: polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 6px)` 应用于卡片和按钮
- **黄黑条纹:** `repeating-linear-gradient(135deg, #F0C040 0px, #F0C040 4px, #0F0D0C 4px, #0F0D0C 8px)` 危险/警报状态
- **工业铭牌:** 面板 header 带 4px 圆角螺丝孔装饰
- **数据翻牌:** 数字变化时 3D 翻牌动画

### 2.4 动效

| 动效 | Duration | Easing |
|------|----------|--------|
| 页面切换 | 300ms | cubic-bezier(0.76,0,0.24,1) |
| 卡片 hover | 200ms | ease-out |
| 警报脉冲 | 1.5s loop | ease-in-out |
| Modal 弹入 | 250ms | cubic-bezier(0.16,1,0.3,1) |
| 终端打字 | 50ms/char | linear |
| 条纹流动 | 2s loop | linear |
| 数字翻转 | 400ms | cubic-bezier(0.4,0,0.2,1) |

### 2.5 组件层级

```
LCApp (根)
├── LCTopBar (能量槽 + 警报 + 日期 + 配额)
├── LCSidebar (8 项导航 + 子菜单)
├── LCAiDock (底部可折叠终端)
│   ├── LCMessageList (流式对话)
│   ├── LCThinkingFold (思考折叠)
│   └── LCInputBar (指令输入)
├── 页面组件
│   ├── OfficePage (仪表盘网格)
│   ├── AbnormalitiesPage (列表+详情)
│   ├── PersonnelPage (Agent/Clerk 管理)
│   ├── EgoPage (武器/防具/提取)
│   ├── MapPage (部门鸟瞰)
│   ├── TerminalPage (全屏终端)
│   ├── LogsPage (时间线)
│   └── SettingsPage (配置表单)
├── LCModal (通用模态框)
├── LCToast (自定义通知)
├── LCAlertBar (顶部警报横幅)
└── LCConfirmDialog (确认对话框)
```

---

## 3. 页面详细设计

### 3.1 主管办公室 (OfficePage)
- 上半区: 3 列网格 — [能量进度] [警报状态] [E.G.O. 概览]
- 下半区: 2 列网格 — [员工状态] [异想体速览]
- 右侧边栏: 今日公告/通知列表
- 各卡片点击跳转对应详情页

### 3.2 异想体管理 (AbnormalitiesPage)
- 左侧: 异想体列表（按风险排序，ALEPH → ZAYIN）
- 右侧: 选中异想体详情面板
  - 编号/名称/风险等级/Qliphoth 计数器
  - 工作偏好五边形雷达图 (Instinct/Insight/Attachment/Repression)
  - 攻击类型标签 + 弱点/抗性
  - 观察等级进度条
  - 故事文本（可折叠）
  - 操作区: 选择代理 + 选择工作类型 + 执行按钮

### 3.3 员工管理 (PersonnelPage)
- Agent 卡片网格 (3-4 列)
- 每张卡片: 名称/状态/四维属性条/E.G.O. 装备/经验进度
- 操作: 派遣/训练/装备/解雇
- Clerk 列表（简化，仅状态显示）

### 3.4 E.G.O. 装备库 (EgoPage)
- 标签切换: [已装备] / [库存武器] / [库存防具] / [提取]
- 武器列表: 名称/等级/伤害类型/来源异想体/需求
- 防具列表: 名称/等级/RWBP 抗性四维/来源异想体/需求
- 提取界面: 选择异想体 → 消耗 PE-Box → 确认提取

### 3.5 部门地图 (MapPage)
- 鸟瞰网格: 4 个部门 (控制/安保/情报/福利)
- 每个部门: 2-3 个收容单元 + 员工图标
- 点击单元: 弹出异想体迷你详情
- 突破的异想体: 红色闪烁 + 条纹覆盖

### 3.6 AI 终端 (TerminalPage)
- 全屏终端界面（绿色 monospace 文字）
- Angela 流式回复 + 思考过程折叠
- 快速指令按钮: [执行工作] [查看状态] [紧急处理] [继续剧情]
- 输入框带光标闪烁

### 3.7 日志与记录 (LogsPage)
- 垂直时间线布局
- 每日摘要节点: 配额完成状态/死亡数/异想体变动/事件
- 折叠式详情展开

### 3.8 系统设置 (SettingsPage)
- API 配置 (主/次)
- 预设管理 (采样参数/Prompt/排序)
- 世界书管理 (导入/激活/编辑条目)
- 显示: UI 模式/主题/思考展示方式
- 数据: 导出/导入/清空

---

## 4. 状态管理 (Pinia)

```
facilityStore     — 设施状态 (能量/配额/Trumpet/日期)
abnormalitiesStore — 异想体列表/观察等级/工作记录
employeesStore    — Agent/Clerk 列表/E.G.O. 装备
egoStore          — 武器/防具库存
chatStore         — AI 对话历史/流式状态
settingsStore     — API 配置/世界书/预设/显示
logStore          — 每日记录/事件
uiStore           — 侧边栏/模态框/Toast/Dock 状态
```

---

## 5. 文件结构

```
src/
├── main.ts
├── App.vue
├── styles/
│   ├── variables.css        (CSS 自定义属性)
│   ├── typography.css       (字体系统)
│   ├── animations.css       (动效)
│   └── global.css           (重置)
├── components/
│   ├── layout/
│   │   ├── LCTopBar.vue
│   │   ├── LCSidebar.vue
│   │   ├── LCAiDock.vue
│   │   └── LCShell.vue      (主骨架)
│   ├── shared/
│   │   ├── LCCard.vue
│   │   ├── LCModal.vue
│   │   ├── LCToast.vue
│   │   ├── LCAlertBar.vue
│   │   ├── LCButton.vue
│   │   ├── LCTable.vue
│   │   ├── LCTag.vue
│   │   ├── LCProgress.vue
│   │   ├── LCTerminal.vue
│   │   └── LCConfirmDialog.vue
│   ├── pages/
│   │   ├── OfficePage.vue
│   │   ├── AbnormalitiesPage.vue
│   │   ├── PersonnelPage.vue
│   │   ├── EgoPage.vue
│   │   ├── MapPage.vue
│   │   ├── TerminalPage.vue
│   │   ├── LogsPage.vue
│   │   └── SettingsPage.vue
│   └── icons/
│       └── LCIcon.vue       (Lucide 封装)
├── stores/
│   ├── facility.ts
│   ├── abnormalities.ts
│   ├── employees.ts
│   ├── ego.ts
│   ├── chat.ts
│   ├── settings.ts
│   ├── logs.ts
│   └── ui.ts
├── sillytavern/
│   ├── types.ts
│   ├── database.ts
│   ├── lorebook-engine.ts
│   ├── prompt-assembler.ts
│   ├── variables.ts
│   ├── stream-parser.ts
│   ├── vars-merger.ts
│   ├── api-router.ts
│   ├── api-tools.ts
│   ├── importer.ts
│   └── index.ts
├── composables/
│   ├── useSillytavern.ts
│   ├── useStreamParser.ts
│   └── useApiRouter.ts
└── data/
    └── defaults.ts          (默认异想体/员工/设置数据)
```

---

## 6. 性能优化

- 路由懒加载 (defineAsyncComponent)
- 异想体列表虚拟滚动 (>10 个时)
- CSS 动画使用 transform/opacity (GPU 合成)
- 图标按需加载 (tree-shaking)
- 字体子集化 (仅加载用到的字形)
- 关键 CSS 内联

---

## 7. 自检清单

- [x] 无占位符 — 所有页面有具体内容
- [x] 无 emoji — 全部使用 Lucide SVG 图标
- [x] 全中文 — logo 除外
- [x] 黄黑条纹 + 左上倒角 Motif 贯穿
- [x] 8 个页面完整设计
- [x] 微交互动效规范明确
- [x] 内联 Toast/通知系统
- [x] 现代字体栈 (Rajdhani + Noto Sans SC + JetBrains Mono)
- [x] 语义化 ID 命名
- [x] LLM 接入预案 (SillyTavern 引擎移植)
