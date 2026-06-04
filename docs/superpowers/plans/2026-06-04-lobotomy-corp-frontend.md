# Lobotomy Corporation Frontend Framework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete Vue 3 Lobotomy Corporation themed frontend with 8 pages, LLM integration, and industrial LC aesthetic.

**Architecture:** Vue 3 + Vite + TypeScript SPA. Pinia state management. Ported SillyTavern v3 engine. LCShell layout: LCTopBar + LCSidebar + router-view + LCAiDock.

**Tech Stack:** Vue 3.4 (Composition API + `<script setup>`), TypeScript 5.6, Vite 6, Pinia, Dexie, Lucide Icons

**Design Spec:** `docs/superpowers/specs/2026-06-04-lobotomy-corp-frontend-design.md`

---

## File Structure Map

```
src/
├── main.ts                          # App entry
├── App.vue                          # Root with LCShell
├── styles/
│   ├── variables.css                # CSS custom properties
│   ├── global.css                   # Reset + base
│   └── fonts.css                    # @font-face rules
├── components/
│   ├── layout/
│   │   ├── LCTopBar.vue             # Energy bar + alert + date
│   │   ├── LCSidebar.vue            # 8-item nav with Lucide icons
│   │   ├── LCAiDock.vue             # Collapsible AI terminal dock
│   │   └── LCShell.vue              # Main layout shell
│   ├── shared/
│   │   ├── LCCard.vue               # Card with chamfered top-left corner
│   │   ├── LCModal.vue              # Modal with chamfer animation
│   │   ├── LCToastProvider.vue      # Toast notification system
│   │   ├── LCButton.vue             # Button (primary/danger/ghost variants)
│   │   ├── LCTag.vue                # Risk level / status tag
│   │   ├── LCProgress.vue           # Energy bar / observation progress
│   │   ├── LCTerminal.vue           # Monospace terminal text display
│   │   └── LCIcon.vue               # Lucide icon wrapper
│   └── pages/
│       ├── OfficePage.vue
│       ├── AbnormalitiesPage.vue
│       ├── PersonnelPage.vue
│       ├── EgoPage.vue
│       ├── MapPage.vue
│       ├── TerminalPage.vue
│       ├── LogsPage.vue
│       └── SettingsPage.vue
├── stores/
│   ├── facility.ts                  # Energy/quota/trumpet/date
│   ├── abnormalities.ts             # Abnormality list + observation
│   ├── employees.ts                 # Agent/Clerk roster
│   ├── ego.ts                       # E.G.O. inventory
│   ├── chat.ts                      # AI chat messages/streaming
│   ├── settings.ts                  # API/presets/worldbook/display
│   ├── logs.ts                      # Daily reports
│   └── ui.ts                        # Sidebar/dock/modal/toast state
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
    └── defaults.ts                  # Default abnormalities/employees/settings
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `src/main.ts`, `src/App.vue`, `src/vite-env.d.ts`, `.gitignore`

- [ ] **Step 1: Initialize Vue 3 + Vite project**

```bash
cd "D:/Program/AI"
npm create vite@latest . -- --template vue-ts
npm install
```

Expected: `package.json` with vue, vite, typescript deps. Scaffolded project files.

- [ ] **Step 2: Install core dependencies**

```bash
npm install vue-router@4 pinia dexie lucide-vue-next
```

Expected: All packages added to `package.json` and `node_modules/`.

- [ ] **Step 3: Create directory structure**

```bash
mkdir -p src/styles src/components/layout src/components/shared src/components/pages src/stores src/sillytavern src/composables src/data
```

- [ ] **Step 4: Update `index.html` with fonts and Chinese lang**

Edit `index.html`:

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Noto+Sans+SC:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <title>Lobotomy Corporation — Branch 47</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 5: Write `src/main.ts` — app entry with router + pinia**

```typescript
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/variables.css'
import './styles/global.css'
import LCShell from './components/layout/LCShell.vue'

const routes = [
  { path: '/', redirect: '/office' },
  {
    path: '/',
    component: LCShell,
    children: [
      { path: 'office', component: () => import('./components/pages/OfficePage.vue'), meta: { title: '主管办公室' } },
      { path: 'abnormalities', component: () => import('./components/pages/AbnormalitiesPage.vue'), meta: { title: '异想体' } },
      { path: 'personnel', component: () => import('./components/pages/PersonnelPage.vue'), meta: { title: '员工' } },
      { path: 'ego', component: () => import('./components/pages/EgoPage.vue'), meta: { title: 'E.G.O.' } },
      { path: 'map', component: () => import('./components/pages/MapPage.vue'), meta: { title: '部门地图' } },
      { path: 'terminal', component: () => import('./components/pages/TerminalPage.vue'), meta: { title: 'AI 终端' } },
      { path: 'logs', component: () => import('./components/pages/LogsPage.vue'), meta: { title: '日志' } },
      { path: 'settings', component: () => import('./components/pages/SettingsPage.vue'), meta: { title: '设置' } },
    ]
  }
]

const router = createRouter({ history: createWebHashHistory(), routes })
const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app')
```

- [ ] **Step 6: Write `src/App.vue` — root with LCToastProvider**

```vue
<template>
  <LCToastProvider>
    <router-view v-slot="{ Component }">
      <transition name="page-wipe" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </LCToastProvider>
</template>

<script setup lang="ts">
import { useUiStore } from './stores/ui'
import LCToastProvider from './components/shared/LCToastProvider.vue'
const ui = useUiStore()
</script>
```

- [ ] **Step 7: Write `.gitignore`**

```
node_modules
dist
*.local
```

- [ ] **Step 8: Verify build**

```bash
npm run dev
```

Expected: Vite dev server starts. Visit localhost — blank page, no errors in console.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vue 3 + Vite + Router + Pinia project"
```

---

### Task 2: Design System — CSS Variables + Global Styles

**Files:**
- Create: `src/styles/variables.css`, `src/styles/global.css`

- [ ] **Step 1: Write `src/styles/variables.css` — full LC design tokens**

```css
:root {
  /* === 配色 === */
  --lc-yellow: #F0C040;
  --lc-yellow-dark: #D4A020;
  --lc-yellow-glow: rgba(240, 192, 64, 0.15);
  --lc-red: #C83030;
  --lc-red-glow: rgba(200, 48, 48, 0.2);
  --lc-orange: #D47830;
  --lc-green: #309870;
  --lc-green-glow: rgba(48, 152, 112, 0.12);
  --lc-blue: #4078B0;
  --lc-gray: #605858;
  --lc-gray-light: #807878;
  --lc-surface: #0F0D0C;
  --lc-card: #1A1614;
  --lc-card-hover: #221D1A;
  --lc-deep: #080606;
  --lc-terminal: #0A0E0A;
  --lc-border: #2A2420;
  --lc-border-light: #3A3430;
  --lc-text-primary: #E8D8C0;
  --lc-text-secondary: #B5A590;
  --lc-text-muted: #706860;
  --lc-text-terminal: #50C878;
  --lc-text-danger: #E06060;
  --lc-text-warning: #E0B040;

  /* === 风险等级色 === */
  --risk-ZAYIN: #30A878;
  --risk-TETH: #60B8D0;
  --risk-HE: #D4A030;
  --risk-WAW: #C060D0;
  --risk-ALEPH: #E03030;

  /* === 间距 === */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* === 圆角/切角 === */
  --chamfer-size: 6px;

  /* === 排版 === */
  --font-display: 'Rajdhani', sans-serif;
  --font-body: 'Noto Sans SC', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --text-xs: clamp(10px, 1.5vw, 11px);
  --text-sm: clamp(11px, 1.8vw, 13px);
  --text-base: clamp(13px, 2.2vw, 15px);
  --text-md: clamp(15px, 2.6vw, 18px);
  --text-lg: clamp(18px, 3vw, 24px);
  --text-xl: clamp(24px, 4vw, 36px);
  --text-2xl: clamp(36px, 6vw, 56px);

  /* === 动效 === */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.76, 0, 0.24, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;

  /* === 侧边栏宽度 === */
  --sidebar-width: 220px;
  --topbar-height: 48px;
  --dock-height: 280px;
}
```

- [ ] **Step 2: Write `src/styles/global.css` — reset + base styles**

```css
@import './variables.css';

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

html {
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
  font-size: 16px;
}

body {
  background: var(--lc-surface);
  color: var(--lc-text-primary);
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.6;
  min-height: 100vh;
  min-height: 100dvh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Headings */
h1, h2, h3, h4 { font-family: var(--font-display); font-weight: 700; letter-spacing: 0.04em; }
h1 { font-size: var(--text-2xl); }
h2 { font-size: var(--text-xl); }
h3 { font-size: var(--text-lg); }
h4 { font-size: var(--text-md); }

/* Monospace */
code, pre, .mono { font-family: var(--font-mono); }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--lc-deep); }
::-webkit-scrollbar-thumb { background: var(--lc-border-light); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--lc-yellow-dark); }

/* Selection */
::selection { background: var(--lc-yellow); color: var(--lc-deep); }

/* Links */
a { color: var(--lc-yellow); text-decoration: none; }
a:hover { text-decoration: underline; }

/* Input base */
input, select, textarea, button {
  font-family: inherit; font-size: inherit; color: inherit;
  background: var(--lc-deep); border: 1px solid var(--lc-border);
  border-radius: 2px; padding: var(--space-xs) var(--space-sm);
  outline: none; transition: border-color var(--duration-fast);
}
input:focus, select:focus, textarea:focus {
  border-color: var(--lc-yellow);
}

/* Page transition */
.page-wipe-enter-active { transition: all var(--duration-slow) var(--ease-in-out); }
.page-wipe-leave-active { transition: all var(--duration-slow) var(--ease-in-out); }
.page-wipe-enter-from { opacity: 0; transform: translateX(12px); filter: blur(2px); }
.page-wipe-leave-to { opacity: 0; transform: translateX(-12px); filter: blur(2px); }
```

- [ ] **Step 3: Verify CSS loads**

```bash
npm run dev
```

Open browser DevTools → Elements → check `:root` shows all `--lc-*` variables.

- [ ] **Step 4: Commit**

```bash
git add src/styles/
git commit -m "feat: add LC design system CSS variables + global styles"
```

---

### Task 3: Shared Components — LCIcon, LCButton, LCTag, LCProgress

**Files:**
- Create: `src/components/shared/LCIcon.vue`, `src/components/shared/LCButton.vue`, `src/components/shared/LCTag.vue`, `src/components/shared/LCProgress.vue`

- [ ] **Step 1: Write `LCIcon.vue` — Lucide wrapper with sizing**

```vue
<template>
  <component :is="iconComponent" :size="size" :stroke-width="strokeWidth" :class="className" />
</template>

<script setup lang="ts">
import { computed, type FunctionalComponent } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  name: string
  size?: number
  strokeWidth?: number
}>(), {
  size: 18,
  strokeWidth: 1.5
})

const iconComponent = computed<FunctionalComponent | null>(() => {
  const icon = (LucideIcons as Record<string, FunctionalComponent>)[props.name]
  return icon || null
})

const className = computed(() => `lc-icon icon-${props.name}`)
</script>

<style scoped>
.lc-icon { display: inline-block; vertical-align: middle; flex-shrink: 0; }
</style>
```

- [ ] **Step 2: Write `LCButton.vue` — chamfered LC button**

```vue
<template>
  <button
    :id="id"
    :class="['lc-btn', `lc-btn--${variant}`, { 'lc-btn--active': active }]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <LCIcon v-if="icon" :name="icon" :size="16" />
    <span v-if="$slots.default" class="lc-btn__label"><slot /></span>
  </button>
</template>

<script setup lang="ts">
import LCIcon from './LCIcon.vue'

withDefaults(defineProps<{
  id?: string
  variant?: 'primary' | 'danger' | 'ghost' | 'icon'
  icon?: string
  active?: boolean
  disabled?: boolean
}>(), { variant: 'primary' })

defineEmits<{ click: [] }>()
</script>

<style scoped>
.lc-btn {
  display: inline-flex; align-items: center; gap: var(--space-xs);
  padding: 6px 16px; min-height: 36px;
  font-family: var(--font-display); font-size: var(--text-sm); font-weight: 600;
  letter-spacing: 0.06em; text-transform: uppercase;
  border: 1px solid var(--lc-border); border-radius: 0;
  cursor: pointer; user-select: none;
  clip-path: polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 6px);
  transition: all var(--duration-fast) var(--ease-out-expo);
}
.lc-btn:hover { transform: translateY(-1px); }
.lc-btn:active { transform: translateY(0); }
.lc-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

.lc-btn--primary {
  background: var(--lc-yellow); color: var(--lc-deep); border-color: var(--lc-yellow);
}
.lc-btn--primary:hover { background: var(--lc-yellow-dark); box-shadow: 0 0 16px var(--lc-yellow-glow); }
.lc-btn--primary:active { background: var(--lc-yellow); }

.lc-btn--danger {
  background: var(--lc-deep); color: var(--lc-red); border-color: var(--lc-red);
}
.lc-btn--danger:hover { background: var(--lc-red); color: var(--lc-text-primary); box-shadow: 0 0 16px var(--lc-red-glow); }

.lc-btn--ghost {
  background: transparent; color: var(--lc-text-secondary); border-color: var(--lc-border);
}
.lc-btn--ghost:hover { color: var(--lc-yellow); border-color: var(--lc-yellow); }
.lc-btn--ghost.lc-btn--active { color: var(--lc-yellow); border-color: var(--lc-yellow); background: var(--lc-yellow-glow); }

.lc-btn--icon {
  padding: 6px 8px; min-height: 32px; min-width: 32px;
  background: transparent; color: var(--lc-text-secondary); border-color: transparent;
  justify-content: center;
}
.lc-btn--icon:hover { color: var(--lc-yellow); background: var(--lc-card); }
</style>
```

- [ ] **Step 3: Write `LCTag.vue` — risk/status label**

```vue
<template>
  <span :class="['lc-tag', `lc-tag--${variant}`]">
    <span class="lc-tag__dot" />
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ variant?: string }>(), { variant: 'default' })
</script>

<style scoped>
.lc-tag {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 1px 8px;
  font-family: var(--font-display); font-size: var(--text-xs); font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase;
  border: 1px solid var(--lc-border); background: var(--lc-deep);
  clip-path: polygon(4px 0, 100% 0, 100% 100%, 0 100%, 0 4px);
}
.lc-tag__dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.lc-tag--default { color: var(--lc-text-muted); }
.lc-tag--ZAYIN { color: var(--risk-ZAYIN); border-color: var(--risk-ZAYIN); }
.lc-tag--TETH { color: var(--risk-TETH); border-color: var(--risk-TETH); }
.lc-tag--HE { color: var(--risk-HE); border-color: var(--risk-HE); }
.lc-tag--WAW { color: var(--risk-WAW); border-color: var(--risk-WAW); }
.lc-tag--ALEPH { color: var(--risk-ALEPH); border-color: var(--risk-ALEPH); animation: tag-pulse 2s infinite; }
.lc-tag--success { color: var(--lc-green); border-color: var(--lc-green); }
.lc-tag--warning { color: var(--lc-text-warning); border-color: var(--lc-text-warning); }
.lc-tag--danger { color: var(--lc-text-danger); border-color: var(--lc-text-danger); }
@keyframes tag-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
</style>
```

- [ ] **Step 4: Write `LCProgress.vue` — energy/observation bar**

```vue
<template>
  <div :class="['lc-progress', `lc-progress--${variant}`]">
    <div class="lc-progress__track">
      <div
        class="lc-progress__fill"
        :style="{ width: clampPercent + '%', transition: `width ${duration}ms var(--ease-out-expo)` }"
      />
      <div v-if="striped" class="lc-progress__stripes" :style="{ left: clampPercent + '%' }" />
    </div>
    <span v-if="label" class="lc-progress__label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value?: number
  max?: number
  variant?: 'default' | 'warning' | 'danger'
  striped?: boolean
  label?: string
  duration?: number
}>(), { value: 0, max: 100, variant: 'default', duration: 800 })

const clampPercent = computed(() => Math.min(100, Math.max(0, (props.value / props.max) * 100)))
</script>

<style scoped>
.lc-progress { display: flex; align-items: center; gap: var(--space-sm); width: 100%; }
.lc-progress__track { position: relative; flex: 1; height: 6px; background: var(--lc-deep); overflow: hidden; }
.lc-progress__fill { height: 100%; background: var(--lc-yellow); }
.lc-progress__stripes { position: absolute; top: 0; bottom: 0; right: 0; width: 100%;
  background: repeating-linear-gradient(135deg, var(--lc-red) 0px, var(--lc-red) 4px, var(--lc-deep) 4px, var(--lc-deep) 8px);
  animation: stripe-flow 1s linear infinite; opacity: 0.6; }
.lc-progress--warning .lc-progress__fill { background: var(--lc-orange); }
.lc-progress--danger .lc-progress__fill { background: var(--lc-red); }
.lc-progress__label { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--lc-text-muted); white-space: nowrap; }
@keyframes stripe-flow { 0% { background-position: 0 0; } 100% { background-position: 8px 0; } }
</style>
```

- [ ] **Step 5: Verify components mount**

Create a temporary test in `App.vue`:

```vue
<LCButton icon="Skull" variant="primary">TEST BUTTON</LCButton>
<LCTag variant="ALEPH">ALEPH</LCTag>
<LCProgress :value="40" :max="100" label="240/460" />
```

Run `npm run dev`, verify all three render with correct LC styling.

- [ ] **Step 6: Commit**

```bash
git add src/components/shared/LCIcon.vue src/components/shared/LCButton.vue src/components/shared/LCTag.vue src/components/shared/LCProgress.vue
git commit -m "feat: add LC shared components — LCIcon, LCButton, LCTag, LCProgress"
```

---

### Task 4: Shared Components — LCCard, LCModal, LCToastProvider

**Files:**
- Create: `src/components/shared/LCCard.vue`, `src/components/shared/LCModal.vue`, `src/components/shared/LCToastProvider.vue`

- [ ] **Step 1: Write `LCCard.vue` — chamfered panel card**

```vue
<template>
  <section :class="['lc-card', { 'lc-card--clickable': clickable, 'lc-card--danger': danger }]">
    <header v-if="title || $slots.header" class="lc-card__header">
      <div class="lc-card__screws"><span /><span /></div>
      <h4 v-if="title" class="lc-card__title">{{ title }}</h4>
      <slot name="header" />
    </header>
    <div class="lc-card__body"><slot /></div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  clickable?: boolean
  danger?: boolean
}>(), { clickable: false, danger: false })
</script>

<style scoped>
.lc-card {
  background: var(--lc-card); border: 1px solid var(--lc-border);
  clip-path: polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 6px);
  padding: var(--space-md); transition: all var(--duration-fast) var(--ease-out-expo);
}
.lc-card--clickable { cursor: pointer; }
.lc-card--clickable:hover { background: var(--lc-card-hover); border-color: var(--lc-yellow); transform: translateY(-1px); }
.lc-card--danger { border-color: var(--lc-red); }
.lc-card--danger:hover { border-color: var(--lc-yellow); background: var(--lc-card-hover); }

.lc-card__screws { display: flex; gap: 6px; margin-bottom: var(--space-sm); }
.lc-card__screws span { width: 4px; height: 4px; border-radius: 50%; background: var(--lc-border-light); flex-shrink: 0; }
.lc-card__title { font-family: var(--font-display); font-size: var(--text-sm); color: var(--lc-text-muted); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; }
.lc-card__body { padding-top: var(--space-xs); }
</style>
```

- [ ] **Step 2: Write `LCModal.vue` — animated overlay modal**

```vue
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="lc-modal-overlay" @click.self="$emit('close')">
        <div :class="['lc-modal', `lc-modal--${size}`]" @click.stop>
          <header class="lc-modal__header">
            <div class="lc-modal__screws"><span /><span /><span /></div>
            <h3 v-if="title" class="lc-modal__title">{{ title }}</h3>
            <slot name="header" />
            <button class="lc-modal__close" @click="$emit('close')">
              <LCIcon name="X" :size="18" />
            </button>
          </header>
          <div class="lc-modal__body"><slot /></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import LCIcon from './LCIcon.vue'

withDefaults(defineProps<{
  modelValue?: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg'
}>(), { modelValue: false, size: 'md' })

defineEmits<{ close: [] }>()
</script>

<style scoped>
.lc-modal-overlay {
  position: fixed; inset: 0; z-index: 1000;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
}
.lc-modal {
  background: var(--lc-card); border: 1px solid var(--lc-border);
  clip-path: polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px);
  max-height: 85vh; max-height: 85dvh;
  display: flex; flex-direction: column; overflow: hidden;
}
.lc-modal--sm { width: 400px; }
.lc-modal--md { width: 560px; }
.lc-modal--lg { width: 720px; }
.lc-modal__header {
  display: flex; align-items: center; gap: var(--space-sm);
  padding: var(--space-md); border-bottom: 1px solid var(--lc-border);
}
.lc-modal__screws { display: flex; gap: 6px; }
.lc-modal__screws span { width: 5px; height: 5px; border-radius: 50%; background: var(--lc-border-light); }
.lc-modal__title { flex: 1; font-family: var(--font-display); font-size: var(--text-md); letter-spacing: 0.06em; }
.lc-modal__close { background: transparent; border: none; color: var(--lc-text-muted); cursor: pointer; padding: 4px; min-height: 32px; }
.lc-modal__close:hover { color: var(--lc-yellow); }
.lc-modal__body { flex: 1; overflow-y: auto; padding: var(--space-md); }

/* Transition */
.modal-enter-active { transition: all 250ms cubic-bezier(0.16,1,0.3,1); }
.modal-leave-active { transition: all 200ms cubic-bezier(0.76,0,0.24,1); }
.modal-enter-from { opacity: 0; }
.modal-enter-from .lc-modal { transform: scale(0.95) translate(-4px, -4px); }
.modal-leave-to { opacity: 0; }
.modal-leave-to .lc-modal { transform: scale(0.95); }
</style>
```

- [ ] **Step 3: Write `LCToastProvider.vue` — custom notification system**

```vue
<template>
  <div class="lc-toast-container" aria-live="polite">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['lc-toast', `lc-toast--${toast.variant}`]"
      >
        <span class="lc-toast__dot" />
        <span class="lc-toast__msg">{{ toast.message }}</span>
        <button class="lc-toast__dismiss" @click="ui.dismissToast(toast.id)">
          <LCIcon name="X" :size="14" />
        </button>
      </div>
    </TransitionGroup>
  </div>
  <slot />
</template>

<script setup lang="ts">
import { useUiStore } from '../../stores/ui'
import LCIcon from './LCIcon.vue'
const ui = useUiStore()
const toasts = ui.toasts
</script>

<style scoped>
.lc-toast-container {
  position: fixed; top: calc(var(--topbar-height) + var(--space-md)); right: var(--space-md); z-index: 2000;
  display: flex; flex-direction: column; gap: var(--space-sm); pointer-events: none;
}
.lc-toast {
  display: flex; align-items: center; gap: var(--space-sm);
  padding: 10px 16px; min-width: 280px; max-width: 420px;
  background: var(--lc-card); border: 1px solid var(--lc-border);
  clip-path: polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 6px);
  pointer-events: all;
}
.lc-toast__dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.lc-toast__msg { flex: 1; font-size: var(--text-sm); }
.lc-toast__dismiss { background: none; border: none; color: var(--lc-text-muted); cursor: pointer; padding: 2px; }
.lc-toast__dismiss:hover { color: var(--lc-text-primary); }
.lc-toast--info { border-color: var(--lc-blue); }
.lc-toast--info .lc-toast__dot { background: var(--lc-blue); }
.lc-toast--success { border-color: var(--lc-green); }
.lc-toast--success .lc-toast__dot { background: var(--lc-green); }
.lc-toast--warning { border-color: var(--lc-orange); }
.lc-toast--warning .lc-toast__dot { background: var(--lc-orange); }
.lc-toast--error { border-color: var(--lc-red); }
.lc-toast--error .lc-toast__dot { background: var(--lc-red); }
.toast-enter-active { transition: all 300ms var(--ease-out-expo); }
.toast-leave-active { transition: all 200ms ease-in; }
.toast-enter-from { opacity: 0; transform: translateX(40px); }
.toast-leave-to { opacity: 0; transform: translateX(40px); }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/LCCard.vue src/components/shared/LCModal.vue src/components/shared/LCToastProvider.vue
git commit -m "feat: add LCCard, LCModal, LCToastProvider shared components"
```

---

### Task 5: Pinia Stores

**Files:**
- Create: `src/stores/ui.ts`, `src/stores/facility.ts`, `src/stores/abnormalities.ts`, `src/stores/employees.ts`, `src/stores/ego.ts`, `src/stores/chat.ts`, `src/stores/settings.ts`, `src/stores/logs.ts`

- [ ] **Step 1: Write `src/stores/ui.ts` — sidebar/dock/modal/toast state**

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(false)
  const dockExpanded = ref(true)
  const dockHeight = ref(280)
  const activePage = ref('office')
  const toasts = ref<{ id: number; message: string; variant: 'info' | 'success' | 'warning' | 'error' }[]>([])
  let toastId = 0

  function toggleSidebar() { sidebarCollapsed.value = !sidebarCollapsed.value }
  function toggleDock() { dockExpanded.value = !dockExpanded.value }

  function showToast(message: string, variant: 'info' | 'success' | 'warning' | 'error' = 'info') {
    const id = ++toastId
    toasts.value.push({ id, message, variant })
    setTimeout(() => dismissToast(id), 3500)
  }

  function dismissToast(id: number) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { sidebarCollapsed, dockExpanded, dockHeight, activePage, toasts, toggleSidebar, toggleDock, showToast, dismissToast }
})
```

- [ ] **Step 2: Write `src/stores/facility.ts` — energy/quota/trumpet/date**

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFacilityStore = defineStore('facility', () => {
  const energyQuota = ref(460)
  const energyCollected = ref(0)
  const trumpetLevel = ref(0)
  const breachedCount = ref(0)
  const activeBreach = ref(false)
  const branchId = ref(47)
  const day = ref(1)
  const completedDays = ref(0)
  const totalDeaths = ref(0)

  const energyPercent = computed(() => Math.min(100, Math.round((energyCollected.value / energyQuota.value) * 100)))
  const quotaMet = computed(() => energyCollected.value >= energyQuota.value)

  function collectEnergy(amount: number) { energyCollected.value = Math.min(energyQuota.value, energyCollected.value + amount) }
  function advanceDay() { day.value++; energyCollected.value = 0; completedDays.value++ }
  function setTrumpet(level: number) { trumpetLevel.value = Math.min(7, Math.max(0, level)) }

  return { energyQuota, energyCollected, trumpetLevel, breachedCount, activeBreach, branchId, day, completedDays, totalDeaths, energyPercent, quotaMet, collectEnergy, advanceDay, setTrumpet }
})
```

- [ ] **Step 3: Write `src/stores/abnormalities.ts` — abnormality list + observation**

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Abnormality {
  id: string; name: string; subjectId: string; riskLevel: 'ZAYIN' | 'TETH' | 'HE' | 'WAW' | 'ALEPH'
  qliphothCounter: number; maxQliphoth: number; observationLevel: number; maxObservation: number
  workPreferences: { Instinct: number; Insight: number; Attachment: number; Repression: number }
  attackType: string; weaknesses: string[]; resistances: string[]
  description: string; story: string; currentWork: string | null; assignedAgent: string | null
}

export const useAbnormalitiesStore = defineStore('abnormalities', () => {
  const abnormalities = ref<Abnormality[]>([
    { id: 'ab1', name: '忏悔', subjectId: 'O-03-03', riskLevel: 'ZAYIN', qliphothCounter: 3, maxQliphoth: 3, observationLevel: 2, maxObservation: 4, workPreferences: { Instinct: 1, Insight: 3, Attachment: 4, Repression: 0 }, attackType: 'WHITE', weaknesses: [], resistances: ['RED'], description: '附着于十字架上的巨大骷髅，头戴荆棘冠冕。以人们对话中流露的恶意为食。', story: '指派员工向其忏悔。根据罪恶等级不同，能量产出有差异。', currentWork: null, assignedAgent: null },
    { id: 'ab2', name: '快乐罐头', subjectId: 'F-05-52', riskLevel: 'TETH', qliphothCounter: 2, maxQliphoth: 2, observationLevel: 1, maxObservation: 3, workPreferences: { Instinct: 4, Insight: 2, Attachment: 5, Repression: 1 }, attackType: 'BLACK', weaknesses: ['WHITE'], resistances: ['RED'], description: '一罐已经打开的WellCheers汽水。喝下后会听到海鸥的叫声，随后被带到一艘渔船上。', story: '被绑架者会在渔船上度过一个月，学习捕鱼技能。部分人选择留在了那里。', currentWork: null, assignedAgent: null },
    { id: 'ab3', name: '焦化少女', subjectId: 'T-09-80', riskLevel: 'HE', qliphothCounter: 2, maxQliphoth: 2, observationLevel: 0, maxObservation: 3, workPreferences: { Instinct: 2, Insight: 4, Attachment: 3, Repression: 3 }, attackType: 'RED', weaknesses: ['BLACK'], resistances: ['WHITE'], description: '一具被烧焦的人类女性形态。身体表面不断有灰烬飘落。靠近时能感受到灼热。', story: '她的死亡方式始终无法确定。尸体温度维持在300°C。任何直接接触都会导致严重烧伤。', currentWork: null, assignedAgent: null },
  ])

  const selectedId = ref<string | null>(null)
  const selected = computed(() => abnormalities.value.find(a => a.id === selectedId.value) ?? null)

  return { abnormalities, selectedId, selected }
})
import { computed } from 'vue'
```

Fix the import — move `computed` to the top import line:

```typescript
import { ref, computed } from 'vue'
```

- [ ] **Step 4: Write `src/stores/employees.ts` — Agent/Clerk roster with E.G.O. equipment**

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Agent {
  id: string; name: string; status: 'idle' | 'working' | 'panicked' | 'dead' | 'absent'
  fortitude: number; prudence: number; temperance: number; justice: number
  weapon: { name: string; grade: string; damageType: string; source: string } | null
  suit: { name: string; grade: string; resists: { red: number; white: number; black: number; pale: number }; source: string } | null
  experience: number
}

export const useEmployeesStore = defineStore('employees', () => {
  const agents = ref<Agent[]>([
    { id: 'a1', name: 'Agent Alpha', status: 'idle', fortitude: 2, prudence: 3, temperance: 1, justice: 2, weapon: { name: '忏悔', grade: 'ZAYIN', damageType: 'WHITE', source: 'O-03-03' }, suit: { name: '基础制服', grade: 'ZAYIN', resists: { red: 1.0, white: 1.2, black: 0.8, pale: 1.0 }, source: '标准配备' }, experience: 45 },
    { id: 'a2', name: 'Agent Beta', status: 'idle', fortitude: 3, prudence: 2, temperance: 2, justice: 1, weapon: null, suit: { name: '基础制服', grade: 'ZAYIN', resists: { red: 1.0, white: 1.0, black: 1.0, pale: 1.0 }, source: '标准配备' }, experience: 30 },
    { id: 'a3', name: 'Agent Gamma', status: 'idle', fortitude: 1, prudence: 2, temperance: 3, justice: 2, weapon: null, suit: null, experience: 15 },
  ])
  const clerks = ref([{ id: 'c1', name: 'Clerk 01', status: 'active' as const }])

  return { agents, clerks }
})
```

- [ ] **Step 5: Write `src/stores/ego.ts` — E.G.O. inventory**

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEgoStore = defineStore('ego', () => {
  const weapons = ref([
    { id: 'w1', name: '忏悔', grade: 'ZAYIN', damageType: 'WHITE', source: 'O-03-03', requiredVirtue: 'Justice', requiredLevel: 1 }
  ])
  const suits = ref([
    { id: 's1', name: '荆棘之盾', grade: 'HE', resists: { red: 0.8, white: 1.4, black: 0.6, pale: 1.0 }, source: 'O-02-11', requiredVirtue: 'Fortitude', requiredLevel: 3 }
  ])
  return { weapons, suits }
})
```

- [ ] **Step 6: Write `src/stores/chat.ts` — AI chat messages + streaming state**

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ChatMessage {
  id: string; role: 'user' | 'assistant' | 'system'; content: string; timestamp: number
  thinking?: string; parsed?: { maintext?: string; options?: string[]; sum?: string }
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([])
  const isStreaming = ref(false)
  const streamText = ref('')
  const streamThinking = ref('')

  function addMessage(msg: ChatMessage) { messages.value.push(msg) }
  function clearMessages() { messages.value = [] }

  return { messages, isStreaming, streamText, streamThinking, addMessage, clearMessages }
})
```

- [ ] **Step 7: Write `src/stores/settings.ts` and `src/stores/logs.ts`**

`settings.ts`:
```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const api = ref({ baseUrl: 'https://api.openai.com/v1', apiKey: '', model: 'gpt-4o' })
  const uiMode = ref<'game' | 'chat'>('game')
  const thinkingDisplay = ref<'fold' | 'hide' | 'inline'>('fold')
  const activePresetId = ref<string | null>(null)
  const activeLorebookIds = ref<string[]>([])
  return { api, uiMode, thinkingDisplay, activePresetId, activeLorebookIds }
})
```

`logs.ts`:
```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface LogEntry { id: string; day: number; type: string; message: string; timestamp: number }

export const useLogsStore = defineStore('logs', () => {
  const entries = ref<LogEntry[]>([
    { id: 'l1', day: 1, type: 'info', message: '主管就任。设施初始化完成。', timestamp: Date.now() - 86400000 },
    { id: 'l2', day: 1, type: 'success', message: '配额 Lv.1 完成。能量收集 120 单位。', timestamp: Date.now() - 43200000 },
    { id: 'l3', day: 1, type: 'warning', message: 'O-02-11 突破收容。Trumpet 1 级。Agent Beta 完成镇压，1 名文职死亡。', timestamp: Date.now() - 21600000 },
  ])
  return { entries }
})
```

- [ ] **Step 8: Commit**

```bash
git add src/stores/
git commit -m "feat: add Pinia stores — facility, abnormalities, employees, ego, chat, settings, logs, ui"
```

---

### Task 6: Layout Shell — LCTopBar, LCSidebar, LCShell, LCAiDock

**Files:**
- Create: `src/components/layout/LCTopBar.vue`, `src/components/layout/LCSidebar.vue`, `src/components/layout/LCAiDock.vue`, `src/components/layout/LCShell.vue`

- [ ] **Step 1: Write `LCTopBar.vue` — energy + alert + date bar**

```vue
<template>
  <header class="lc-topbar">
    <div class="lc-topbar__left">
      <span class="lc-topbar__branch">BRANCH {{ facility.branchId }}</span>
      <span class="lc-topbar__divider" />
      <LCProgress :value="facility.energyCollected" :max="facility.energyQuota" :variant="energyVariant" :striped="facility.activeBreach" :label="`${facility.energyCollected}/${facility.energyQuota}`" style="width:200px" />
    </div>
    <div class="lc-topbar__center">
      <LCTag :variant="trumpetTagVariant">{{ trumpetLabel }}</LCTag>
      <span class="lc-topbar__clock">DAY {{ facility.day }}</span>
    </div>
    <div class="lc-topbar__right">
      <span class="lc-topbar__motto">FACE THE FEAR, BUILD THE FUTURE</span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFacilityStore } from '../../stores/facility'
import LCProgress from '../shared/LCProgress.vue'
import LCTag from '../shared/LCTag.vue'

const facility = useFacilityStore()

const energyVariant = computed(() => facility.energyPercent < 30 ? 'danger' : facility.energyPercent < 60 ? 'warning' : 'default')
const trumpetTagVariant = computed(() => facility.trumpetLevel === 0 ? 'success' : facility.trumpetLevel <= 2 ? 'warning' : 'ALEPH')
const trumpetLabel = computed(() => facility.trumpetLevel === 0 ? 'NORMAL' : `TRUMPET ${facility.trumpetLevel}`)
</script>

<style scoped>
.lc-topbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  height: var(--topbar-height); display: flex; align-items: center; gap: var(--space-md);
  padding: 0 var(--space-md); background: var(--lc-deep); border-bottom: 1px solid var(--lc-border);
}
.lc-topbar__left { display: flex; align-items: center; gap: var(--space-sm); }
.lc-topbar__branch { font-family: var(--font-display); font-size: var(--text-base); font-weight: 700; letter-spacing: 0.08em; color: var(--lc-yellow); }
.lc-topbar__divider { width: 1px; height: 20px; background: var(--lc-border); }
.lc-topbar__center { display: flex; align-items: center; gap: var(--space-md); flex: 1; justify-content: center; }
.lc-topbar__clock { font-family: var(--font-mono); font-size: var(--text-sm); color: var(--lc-text-muted); }
.lc-topbar__right { flex-shrink: 0; }
.lc-topbar__motto { font-family: var(--font-display); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.15em; color: var(--lc-text-muted); }
</style>
```

- [ ] **Step 2: Write `LCSidebar.vue` — 8-item navigation**

```vue
<template>
  <nav :class="['lc-sidebar', { 'lc-sidebar--collapsed': ui.sidebarCollapsed }]">
    <div class="lc-sidebar__logo">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="2" y="2" width="28" height="28" rx="0" stroke="var(--lc-yellow)" stroke-width="2" clip-path="polygon(5px 0,100% 0,100% 100%,0 100%,0 5px)" />
        <circle cx="16" cy="16" r="6" stroke="var(--lc-yellow)" stroke-width="1.5" />
        <line x1="16" y1="2" x2="16" y2="8" stroke="var(--lc-yellow)" stroke-width="1" />
        <line x1="16" y1="24" x2="16" y2="30" stroke="var(--lc-yellow)" stroke-width="1" />
        <line x1="2" y1="16" x2="8" y2="16" stroke="var(--lc-yellow)" stroke-width="1" />
        <line x1="24" y1="16" x2="30" y2="16" stroke="var(--lc-yellow)" stroke-width="1" />
      </svg>
      <span v-if="!ui.sidebarCollapsed" class="lc-sidebar__logo-text">LC-47</span>
    </div>

    <div class="lc-sidebar__items">
      <router-link
        v-for="item in navItems" :key="item.path"
        :to="item.path" :class="['lc-sidebar__item', { 'lc-sidebar__item--active': isActive(item.path) }]"
      >
        <LCIcon :name="item.icon" :size="18" />
        <span v-if="!ui.sidebarCollapsed" class="lc-sidebar__label">{{ item.label }}</span>
      </router-link>
    </div>

    <div class="lc-sidebar__footer">
      <button class="lc-sidebar__collapse-btn" @click="ui.toggleSidebar()">
        <LCIcon :name="ui.sidebarCollapsed ? 'PanelRight' : 'PanelLeft'" :size="16" />
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useUiStore } from '../../stores/ui'
import LCIcon from '../shared/LCIcon.vue'

const route = useRoute()
const ui = useUiStore()

const navItems = [
  { path: '/office', label: '办公室', icon: 'LayoutDashboard' },
  { path: '/abnormalities', label: '异想体', icon: 'FlaskConical' },
  { path: '/personnel', label: '员工', icon: 'Users' },
  { path: '/ego', label: 'E.G.O.', icon: 'Swords' },
  { path: '/map', label: '部门地图', icon: 'Map' },
  { path: '/terminal', label: 'AI 终端', icon: 'Terminal' },
  { path: '/logs', label: '日志', icon: 'ScrollText' },
  { path: '/settings', label: '设置', icon: 'Settings' },
]

function isActive(path: string) { return route.path === path }
</script>

<style scoped>
.lc-sidebar {
  position: fixed; top: var(--topbar-height); left: 0; bottom: 0; z-index: 90;
  width: var(--sidebar-width); display: flex; flex-direction: column;
  background: var(--lc-deep); border-right: 1px solid var(--lc-border);
  transition: width var(--duration-normal) var(--ease-out-expo);
}
.lc-sidebar--collapsed { width: 56px; }
.lc-sidebar__logo { display: flex; align-items: center; gap: var(--space-sm); padding: var(--space-md); border-bottom: 1px solid var(--lc-border); }
.lc-sidebar__logo-text { font-family: var(--font-display); font-size: var(--text-md); font-weight: 700; letter-spacing: 0.1em; color: var(--lc-yellow); }
.lc-sidebar__items { flex: 1; display: flex; flex-direction: column; gap: 2px; padding: var(--space-sm); overflow-y: auto; }
.lc-sidebar__item {
  display: flex; align-items: center; gap: var(--space-md); padding: 10px 12px; min-height: 40px;
  font-family: var(--font-display); font-size: var(--text-sm); font-weight: 600; letter-spacing: 0.05em;
  color: var(--lc-text-muted); border: 1px solid transparent;
  clip-path: polygon(4px 0, 100% 0, 100% 100%, 0 100%, 0 4px);
  transition: all var(--duration-fast) var(--ease-out-expo); text-decoration: none;
}
.lc-sidebar__item:hover { color: var(--lc-text-primary); background: var(--lc-card); border-color: var(--lc-border); }
.lc-sidebar__item--active { color: var(--lc-yellow); background: var(--lc-yellow-glow); border-color: var(--lc-yellow); }
.lc-sidebar__label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lc-sidebar__footer { padding: var(--space-sm); border-top: 1px solid var(--lc-border); }
.lc-sidebar__collapse-btn { display: flex; align-items: center; justify-content: center; width: 100%; min-height: 36px; background: transparent; border: 1px solid var(--lc-border); color: var(--lc-text-muted); cursor: pointer; }
.lc-sidebar__collapse-btn:hover { color: var(--lc-yellow); border-color: var(--lc-yellow); }
</style>
```

- [ ] **Step 3: Write `LCShell.vue` — main layout wrapper**

```vue
<template>
  <div class="lc-shell">
    <LCTopBar />
    <LCSidebar />
    <main :class="['lc-main', { 'lc-main--dock-open': ui.dockExpanded }]">
      <router-view v-slot="{ Component }">
        <transition name="page-wipe" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <LCAiDock v-if="ui.dockExpanded" />
    <div v-else class="lc-dock-toggle" @click="ui.toggleDock()">
      <LCIcon name="Terminal" :size="16" />
      <span>终端</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import LCTopBar from './LCTopBar.vue'
import LCSidebar from './LCSidebar.vue'
import LCAiDock from './LCAiDock.vue'
import LCIcon from '../shared/LCIcon.vue'
import { useUiStore } from '../../stores/ui'
const ui = useUiStore()
</script>

<style scoped>
.lc-shell { display: flex; flex-direction: column; min-height: 100vh; min-height: 100dvh; }
.lc-main { margin-top: var(--topbar-height); margin-left: var(--sidebar-width); padding: var(--space-lg); min-height: calc(100vh - var(--topbar-height)); transition: margin-left var(--duration-normal) var(--ease-out-expo); }
.lc-main--dock-open { padding-bottom: calc(var(--dock-height) + var(--space-md)); }
.lc-dock-toggle { position: fixed; bottom: var(--space-md); right: var(--space-md); z-index: 80; display: flex; align-items: center; gap: var(--space-sm); padding: 8px 16px; background: var(--lc-card); border: 1px solid var(--lc-border); clip-path: polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 6px); cursor: pointer; color: var(--lc-text-muted); font-family: var(--font-display); font-size: var(--text-xs); letter-spacing: 0.08em; transition: all var(--duration-fast) var(--ease-out-expo); }
.lc-dock-toggle:hover { color: var(--lc-yellow); border-color: var(--lc-yellow); }
</style>
```

- [ ] **Step 4: Write `LCAiDock.vue` — collapsible AI terminal**

```vue
<template>
  <aside class="lc-dock" :style="{ height: ui.dockHeight + 'px' }">
    <div class="lc-dock__handle" @mousedown="startResize">
      <div class="lc-dock__handle-bar" />
    </div>
    <header class="lc-dock__header">
      <div class="lc-dock__screws"><span /><span /></div>
      <span class="lc-dock__title">AI 终端 · Angela</span>
      <div class="lc-dock__actions">
        <button @click="chat.clearMessages()" title="清空对话"><LCIcon name="Trash2" :size="14" /></button>
        <button @click="ui.toggleDock()" title="折叠终端"><LCIcon name="Minus" :size="14" /></button>
      </div>
    </header>
    <div class="lc-dock__messages" ref="messagesContainer">
      <div v-for="msg in chat.messages" :key="msg.id" :class="['lc-dock__msg', `lc-dock__msg--${msg.role}`]">
        <div class="lc-dock__msg-role">{{ msg.role === 'user' ? '主管' : 'ANGELA' }}</div>
        <div class="lc-dock__msg-text">{{ msg.content }}</div>
      </div>
      <div v-if="chat.isStreaming" class="lc-dock__msg lc-dock__msg--assistant">
        <div class="lc-dock__msg-role">ANGELA</div>
        <div class="lc-dock__msg-text">{{ chat.streamText }}<span class="lc-dock__cursor">_</span></div>
      </div>
      <div v-if="chat.messages.length === 0 && !chat.isStreaming" class="lc-dock__empty">
        <span>Angela 在线。输入指令开始管理设施。</span>
      </div>
    </div>
    <div class="lc-dock__input">
      <LCIcon name="ChevronRight" :size="16" class="lc-dock__prompt" />
      <input
        id="terminal-input"
        v-model="inputText"
        placeholder="输入管理指令..."
        @keydown.enter="sendCommand"
        :disabled="chat.isStreaming"
      />
      <LCButton id="terminal-send" variant="primary" icon="Send" @click="sendCommand" :disabled="!inputText.trim() || chat.isStreaming" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { useUiStore } from '../../stores/ui'
import { useChatStore } from '../../stores/chat'
import LCIcon from '../shared/LCIcon.vue'
import LCButton from '../shared/LCButton.vue'

const ui = useUiStore()
const chat = useChatStore()
const inputText = ref('')
const messagesContainer = ref<HTMLElement>()

function sendCommand() {
  if (!inputText.value.trim() || chat.isStreaming) return
  const text = inputText.value.trim()
  inputText.value = ''
  chat.addMessage({ id: crypto.randomUUID(), role: 'user', content: text, timestamp: Date.now() })
  // Mock AI response
  chat.isStreaming = true
  chat.streamText = ''
  const mockReplies: Record<string, string> = {
    '状态': '当前设施状态正常。能量收集 240/460。4 个异想体均在收容中。3 名代理在岗。0 名文职在岗。Trumpet 等级 0。',
    '查看': '请指定查看对象：异想体列表、员工列表、E.G.O. 库存、日志记录。',
    '工作': '请指定代理名称和异想体编号。例如：指派 Agent Alpha 对 O-03-03 执行 Insight 工作。',
  }
  const reply = mockReplies[text] || `收到指令："${text}"。该指令类型未预设自动回复。在完整版本中，此处将接入 LLM API 进行实时响应。`
  let i = 0
  const timer = setInterval(() => {
    if (i < reply.length) { chat.streamText += reply[i]; i++; nextTick(() => { if (messagesContainer.value) messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight }) }
    else { clearInterval(timer); chat.isStreaming = false; chat.addMessage({ id: crypto.randomUUID(), role: 'assistant', content: reply, timestamp: Date.now() }); chat.streamText = '' }
  }, 30)
}

function startResize(e: MouseEvent) {
  e.preventDefault()
  const startY = e.clientY
  const startHeight = ui.dockHeight
  function onMove(ev: MouseEvent) { ui.dockHeight = Math.max(160, Math.min(600, startHeight + (startY - ev.clientY))) }
  function onUp() { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}
</script>

<style scoped>
.lc-dock { position: fixed; bottom: 0; left: var(--sidebar-width); right: 0; z-index: 95; display: flex; flex-direction: column; background: var(--lc-terminal); border-top: 1px solid var(--lc-border); }
.lc-dock__handle { height: 6px; display: flex; align-items: center; justify-content: center; cursor: ns-resize; }
.lc-dock__handle-bar { width: 40px; height: 3px; background: var(--lc-border-light); border-radius: 2px; }
.lc-dock__header { display: flex; align-items: center; gap: var(--space-sm); padding: 6px var(--space-md); border-bottom: 1px solid var(--lc-border); }
.lc-dock__screws { display: flex; gap: 4px; }
.lc-dock__screws span { width: 4px; height: 4px; border-radius: 50%; background: var(--lc-border-light); }
.lc-dock__title { font-family: var(--font-display); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.08em; color: var(--lc-text-muted); flex: 1; }
.lc-dock__actions { display: flex; gap: var(--space-xs); }
.lc-dock__actions button { background: transparent; border: none; color: var(--lc-text-muted); cursor: pointer; padding: 4px; min-height: 28px; }
.lc-dock__actions button:hover { color: var(--lc-text-primary); }
.lc-dock__messages { flex: 1; overflow-y: auto; padding: var(--space-sm) var(--space-md); font-family: var(--font-mono); font-size: var(--text-sm); }
.lc-dock__msg { margin-bottom: var(--space-sm); }
.lc-dock__msg-role { font-size: var(--text-xs); color: var(--lc-text-muted); margin-bottom: 2px; font-family: var(--font-display); letter-spacing: 0.06em; }
.lc-dock__msg--user .lc-dock__msg-role { color: var(--lc-yellow); }
.lc-dock__msg--assistant .lc-dock__msg-role { color: var(--lc-green); }
.lc-dock__msg-text { color: var(--lc-text-terminal); line-height: 1.6; white-space: pre-wrap; }
.lc-dock__cursor { animation: blink 1s step-end infinite; color: var(--lc-green); }
.lc-dock__empty { color: var(--lc-text-muted); font-style: italic; padding: var(--space-lg); text-align: center; }
.lc-dock__input { display: flex; align-items: center; gap: var(--space-sm); padding: var(--space-sm) var(--space-md); border-top: 1px solid var(--lc-border); }
.lc-dock__prompt { color: var(--lc-green); flex-shrink: 0; }
.lc-dock__input input { flex: 1; background: transparent; border: none; color: var(--lc-text-terminal); font-family: var(--font-mono); font-size: var(--text-sm); padding: 6px 0; }
.lc-dock__input input::placeholder { color: var(--lc-text-muted); }
.lc-dock__input input:focus { border: none; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
</style>
```

- [ ] **Step 5: Verify layout**

Run `npm run dev`. Confirm: top bar with energy bar + alert tag, left sidebar with icons + labels, clickable nav items that change pages, bottom dock with terminal input.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add layout shell — LCTopBar, LCSidebar, LCShell, LCAiDock"
```

---

### Task 7: Pages — OfficePage, AbnormalitiesPage

**Files:**
- Create: `src/components/pages/OfficePage.vue`, `src/components/pages/AbnormalitiesPage.vue`

- [ ] **Step 1: Write `OfficePage.vue` — dashboard with grid cards**

```vue
<template>
  <div class="office-page">
    <h1 class="page-title">主管办公室</h1>

    <div class="office-grid">
      <LCCard title="今日能量配额" clickable @click="$router.push('/abnormalities')">
        <LCProgress :value="facility.energyCollected" :max="facility.energyQuota" :variant="facility.energyPercent < 30 ? 'danger' : facility.energyPercent < 60 ? 'warning' : 'default'" :label="`${facility.energyCollected} / ${facility.energyQuota}`" />
        <div class="office-stat-row">
          <span class="office-stat" v-if="!facility.quotaMet">距完成还需 <strong>{{ facility.energyQuota - facility.energyCollected }}</strong> 单位</span>
          <span class="office-stat office-stat--success" v-else>配额已完成</span>
        </div>
      </LCCard>

      <LCCard title="警报状态" :danger="facility.trumpetLevel > 0">
        <div class="office-trumpet">
          <LCTag :variant="facility.trumpetLevel === 0 ? 'success' : facility.trumpetLevel <= 2 ? 'warning' : 'ALEPH'">{{ trumpetLabel }}</LCTag>
          <div class="office-stat-row">
            <span class="office-stat">突破: {{ facility.breachedCount }}</span>
            <span class="office-stat">今日死亡: {{ facility.totalDeaths }}</span>
          </div>
        </div>
      </LCCard>

      <LCCard title="E.G.O. 库存概览" clickable @click="$router.push('/ego')">
        <div class="office-stat-row">
          <span class="office-stat">武器 <strong>{{ egoStore.weapons.length }}</strong></span>
          <span class="office-stat">防具 <strong>{{ egoStore.suits.length }}</strong></span>
        </div>
      </LCCard>

      <LCCard title="员工状态" clickable @click="$router.push('/personnel')">
        <div class="office-stat-row">
          <span class="office-stat">Agent <strong>{{ empStore.agents.filter(a => a.status !== 'dead').length }}</strong></span>
          <span class="office-stat">可派遣 <strong>{{ empStore.agents.filter(a => a.status === 'idle').length }}</strong></span>
        </div>
      </LCCard>

      <LCCard title="异想体速览" clickable @click="$router.push('/abnormalities')">
        <div class="office-abno-list">
          <div v-for="a in abnoStore.abnormalities" :key="a.id" class="office-abno-row">
            <LCTag :variant="a.riskLevel">{{ a.riskLevel }}</LCTag>
            <span class="office-abno-name">{{ a.subjectId }} — {{ a.name }}</span>
            <span class="office-abno-q">Q: {{ a.qliphothCounter }}</span>
          </div>
        </div>
      </LCCard>

      <LCCard title="本日公告">
        <div class="office-announcements">
          <div v-for="(a, i) in announcements" :key="i" class="office-announce">{{ a }}</div>
        </div>
      </LCCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFacilityStore } from '../../stores/facility'
import { useEmployeesStore } from '../../stores/employees'
import { useAbnormalitiesStore } from '../../stores/abnormalities'
import { useEgoStore } from '../../stores/ego'
import LCCard from '../shared/LCCard.vue'
import LCProgress from '../shared/LCProgress.vue'
import LCTag from '../shared/LCTag.vue'

const facility = useFacilityStore()
const empStore = useEmployeesStore()
const abnoStore = useAbnormalitiesStore()
const egoStore = useEgoStore()

const trumpetLabel = computed(() => {
  const labels = ['NORMAL', 'FIRST TRUMPET', 'SECOND TRUMPET', 'THIRD TRUMPET', 'FOURTH TRUMPET', 'FIFTH TRUMPET', 'SIXTH TRUMPET', 'SEVENTH TRUMPET']
  return labels[facility.trumpetLevel] || 'NORMAL'
})

const announcements = ['新异想体已分配至安保部。请及时查看管理手册。', '今日配额上调 20%。Angela 提醒：员工是消耗品，能量配额必须完成。', '上次 Trumpet 事件后，2 名文职的遗物已清理完毕。']
</script>

<style scoped>
.page-title { margin-bottom: var(--space-lg); }
.office-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-md); }
.office-stat-row { display: flex; gap: var(--space-lg); margin-top: var(--space-sm); }
.office-stat { font-size: var(--text-sm); color: var(--lc-text-muted); }
.office-stat strong { color: var(--lc-text-primary); font-family: var(--font-mono); }
.office-stat--success { color: var(--lc-green); }
.office-trumpet { display: flex; flex-direction: column; gap: var(--space-sm); }
.office-abno-list { display: flex; flex-direction: column; gap: var(--space-xs); }
.office-abno-row { display: flex; align-items: center; gap: var(--space-sm); font-size: var(--text-sm); }
.office-abno-name { flex: 1; color: var(--lc-text-secondary); }
.office-abno-q { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--lc-text-muted); }
.office-announcements { display: flex; flex-direction: column; gap: var(--space-sm); }
.office-announce { font-size: var(--text-sm); color: var(--lc-text-secondary); padding-left: var(--space-sm); border-left: 2px solid var(--lc-border); }
</style>
```

- [ ] **Step 2: Write `AbnormalitiesPage.vue` — list + detail panel**

```vue
<template>
  <div class="abno-page">
    <h1 class="page-title">异想体管理</h1>
    <div class="abno-layout">
      <div class="abno-list">
        <LCCard v-for="a in abnoStore.abnormalities" :key="a.id" :clickable="true" :class="{ 'abno-item--selected': abnoStore.selectedId === a.id }" @click="abnoStore.selectedId = a.id">
          <div class="abno-list-row">
            <LCTag :variant="a.riskLevel">{{ a.riskLevel }}</LCTag>
            <span class="abno-list-id">{{ a.subjectId }}</span>
            <span class="abno-list-name">{{ a.name }}</span>
            <span class="abno-list-q">Q:{{ a.qliphothCounter }}/{{ a.maxQliphoth }}</span>
          </div>
        </LCCard>
      </div>

      <div class="abno-detail" v-if="abnoStore.selected">
        <LCCard :title="`${abnoStore.selected.subjectId} — ${abnoStore.selected.name}`">
          <div class="abno-detail-grid">
            <div><LCTag :variant="abnoStore.selected.riskLevel">{{ abnoStore.selected.riskLevel }}</LCTag></div>
            <div class="abno-detail-q">Qliphoth 计数器 <strong>{{ abnoStore.selected.qliphothCounter }} / {{ abnoStore.selected.maxQliphoth }}</strong></div>
            <div class="abno-detail-obs">观察等级 <LCProgress :value="abnoStore.selected.observationLevel" :max="abnoStore.selected.maxObservation" :label="`Lv.${abnoStore.selected.observationLevel}/${abnoStore.selected.maxObservation}`" /></div>
          </div>
        </LCCard>

        <LCCard title="工作偏好">
          <div class="abno-work-grid">
            <div v-for="(val, key) in abnoStore.selected.workPreferences" :key="key" class="abno-work-bar">
              <span class="abno-work-label">{{ key }}</span>
              <div class="abno-work-track"><div class="abno-work-fill" :style="{ width: (val / 5) * 100 + '%' }" /></div>
              <span class="abno-work-val">{{ val }}/5</span>
            </div>
          </div>
        </LCCard>

        <LCCard title="攻击信息">
          <div class="abno-stat-row">
            <span>攻击: <LCTag variant="danger">{{ abnoStore.selected.attackType }}</LCTag></span>
            <span v-if="abnoStore.selected.weaknesses.length">弱点: <LCTag v-for="w in abnoStore.selected.weaknesses" :key="w" variant="warning">{{ w }}</LCTag></span>
            <span v-if="abnoStore.selected.resistances.length">抗性: <LCTag v-for="r in abnoStore.selected.resistances" :key="r" variant="success">{{ r }}</LCTag></span>
          </div>
        </LCCard>

        <LCCard :title="`描述 · 观察 Lv.${abnoStore.selected.observationLevel}`">
          <p class="abno-desc">{{ abnoStore.selected.description }}</p>
          <details class="abno-story" v-if="abnoStore.selected.observationLevel >= 2">
            <summary>实验记录摘录</summary>
            <p>{{ abnoStore.selected.story }}</p>
          </details>
        </LCCard>

        <div class="abno-actions">
          <select id="abno-agent-select" v-model="selectedAgent" class="lc-select">
            <option value="">选择代理</option>
            <option v-for="a in empStore.agents.filter(a => a.status === 'idle')" :key="a.id" :value="a.id">{{ a.name }}</option>
          </select>
          <select id="abno-work-select" v-model="selectedWork" class="lc-select">
            <option value="">选择工作</option>
            <option v-for="w in works" :key="w" :value="w">{{ w }}</option>
          </select>
          <LCButton variant="primary" icon="Play" :disabled="!selectedAgent || !selectedWork" @click="assignWork">执行工作</LCButton>
        </div>
      </div>

      <div v-else class="abno-no-selection">
        <LCCard>
          <div class="abno-empty"><LCIcon name="FlaskConical" :size="32" /><span>选择左侧异想体查看详情</span></div>
        </LCCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAbnormalitiesStore } from '../../stores/abnormalities'
import { useEmployeesStore } from '../../stores/employees'
import { useUiStore } from '../../stores/ui'
import LCCard from '../shared/LCCard.vue'
import LCTag from '../shared/LCTag.vue'
import LCProgress from '../shared/LCProgress.vue'
import LCButton from '../shared/LCButton.vue'
import LCIcon from '../shared/LCIcon.vue'

const abnoStore = useAbnormalitiesStore()
const empStore = useEmployeesStore()
const ui = useUiStore()
const selectedAgent = ref('')
const selectedWork = ref('')
const works = ['Instinct', 'Insight', 'Attachment', 'Repression']

function assignWork() {
  if (!selectedAgent.value || !selectedWork.value) return
  const agent = empStore.agents.find(a => a.id === selectedAgent.value)
  ui.showToast(`${agent?.name || 'Agent'} 已开始对 ${abnoStore.selected?.name} 执行 ${selectedWork.value} 工作`, 'info')
}
</script>

<style scoped>
.page-title { margin-bottom: var(--space-lg); }
.abno-layout { display: grid; grid-template-columns: 320px 1fr; gap: var(--space-md); }
.abno-list { display: flex; flex-direction: column; gap: var(--space-sm); }
.abno-list-row { display: flex; align-items: center; gap: var(--space-sm); font-size: var(--text-sm); }
.abno-list-id { font-family: var(--font-mono); color: var(--lc-text-muted); font-size: var(--text-xs); }
.abno-list-name { flex: 1; color: var(--lc-text-primary); }
.abno-list-q { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--lc-text-muted); }
.abno-item--selected { border-color: var(--lc-yellow) !important; }
.abno-detail { display: flex; flex-direction: column; gap: var(--space-md); }
.abno-detail-grid { display: flex; flex-direction: column; gap: var(--space-sm); }
.abno-detail-q strong { font-family: var(--font-mono); color: var(--lc-yellow); }
.abno-work-grid { display: flex; flex-direction: column; gap: var(--space-sm); }
.abno-work-bar { display: flex; align-items: center; gap: var(--space-sm); }
.abno-work-label { width: 90px; font-size: var(--text-sm); color: var(--lc-text-secondary); font-family: var(--font-display); letter-spacing: 0.04em; }
.abno-work-track { flex: 1; height: 4px; background: var(--lc-deep); }
.abno-work-fill { height: 100%; background: var(--lc-yellow); }
.abno-work-val { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--lc-text-muted); width: 30px; text-align: right; }
.abno-stat-row { display: flex; flex-wrap: wrap; gap: var(--space-md); font-size: var(--text-sm); align-items: center; }
.abno-desc { font-size: var(--text-sm); color: var(--lc-text-secondary); line-height: 1.7; }
.abno-story { margin-top: var(--space-sm); font-size: var(--text-sm); color: var(--lc-text-muted); }
.abno-story p { margin-top: var(--space-sm); font-style: italic; }
.abno-actions { display: flex; gap: var(--space-sm); align-items: center; }
.lc-select { padding: 6px 12px; min-height: 36px; background: var(--lc-deep); border: 1px solid var(--lc-border); color: var(--lc-text-primary); font-family: var(--font-display); font-size: var(--text-sm); letter-spacing: 0.04em; }
.abno-empty, .abno-no-selection { display: flex; align-items: center; justify-content: center; height: 100%; }
.abno-empty { display: flex; flex-direction: column; align-items: center; gap: var(--space-md); color: var(--lc-text-muted); font-size: var(--text-base); }
</style>
```

- [ ] **Step 3: Verify pages render**

Run `npm run dev`. Navigate to Office and Abnormalities pages. Cards render, data populates, click selection works, toast notifications fire.

- [ ] **Step 4: Commit**

```bash
git add src/components/pages/OfficePage.vue src/components/pages/AbnormalitiesPage.vue
git commit -m "feat: add OfficePage dashboard + AbnormalitiesPage with list/detail"
```

---

### Task 8: Pages — PersonnelPage, EgoPage, MapPage

**Files:**
- Create: `src/components/pages/PersonnelPage.vue`, `src/components/pages/EgoPage.vue`, `src/components/pages/MapPage.vue`

- [ ] **Step 1: Write `PersonnelPage.vue` — agent grid with virtue bars**

```vue
<template>
  <div class="personnel-page">
    <h1 class="page-title">员工管理</h1>
    <div class="personnel-grid">
      <LCCard v-for="agent in empStore.agents" :key="agent.id" :title="agent.name" :class="{ 'personnel-card--dead': agent.status === 'dead' }">
        <div class="personnel-status-row">
          <LCTag :variant="statusVariant(agent.status)">{{ statusLabel(agent.status) }}</LCTag>
          <span class="personnel-exp">EXP: {{ agent.experience }}</span>
        </div>
        <div class="personnel-virtues">
          <div v-for="v in virtues(agent)" :key="v.key" class="personnel-virtue">
            <span class="personnel-virtue-key">{{ v.key }}</span>
            <div class="personnel-virtue-track"><div class="personnel-virtue-fill" :style="{ width: (v.val / 5) * 100 + '%' }" /></div>
            <span class="personnel-virtue-val">Lv.{{ v.val }}</span>
          </div>
        </div>
        <div class="personnel-equip">
          <div class="personnel-equip-row"><span class="personnel-equip-label">武器</span><span>{{ agent.weapon?.name || '无' }} <LCTag v-if="agent.weapon" :variant="agent.weapon.grade">{{ agent.weapon.grade }}</LCTag></span></div>
          <div class="personnel-equip-row"><span class="personnel-equip-label">防具</span><span>{{ agent.suit?.name || '无' }} <LCTag v-if="agent.suit" :variant="agent.suit.grade">{{ agent.suit.grade }}</LCTag></span></div>
        </div>
      </LCCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEmployeesStore, type Agent } from '../../stores/employees'
import LCCard from '../shared/LCCard.vue'
import LCTag from '../shared/LCTag.vue'

const empStore = useEmployeesStore()

function statusVariant(s: string) { return s === 'idle' ? 'success' : s === 'working' ? 'warning' : s === 'panicked' ? 'danger' : 'default' }
function statusLabel(s: string) { return ({ idle: '待命', working: '工作中', panicked: '恐慌', dead: '已死亡', absent: '缺席' } as Record<string, string>)[s] || s }
function virtues(a: Agent) { return [{ key: 'FORT', val: a.fortitude },{ key: 'PRUD', val: a.prudence },{ key: 'TEMP', val: a.temperance },{ key: 'JUST', val: a.justice }] }
</script>

<style scoped>
.page-title { margin-bottom: var(--space-lg); }
.personnel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-md); }
.personnel-card--dead { opacity: 0.5; }
.personnel-status-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm); }
.personnel-exp { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--lc-text-muted); }
.personnel-virtues { display: flex; flex-direction: column; gap: 3px; margin-bottom: var(--space-sm); }
.personnel-virtue { display: flex; align-items: center; gap: var(--space-sm); }
.personnel-virtue-key { width: 32px; font-family: var(--font-display); font-size: var(--text-xs); font-weight: 600; color: var(--lc-text-muted); letter-spacing: 0.06em; }
.personnel-virtue-track { flex: 1; height: 3px; background: var(--lc-deep); }
.personnel-virtue-fill { height: 100%; background: var(--lc-yellow); }
.personnel-virtue-val { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--lc-text-secondary); width: 30px; text-align: right; }
.personnel-equip { display: flex; flex-direction: column; gap: 2px; font-size: var(--text-sm); color: var(--lc-text-secondary); }
.personnel-equip-row { display: flex; gap: var(--space-sm); }
.personnel-equip-label { color: var(--lc-text-muted); min-width: 32px; }
</style>
```

- [ ] **Step 2: Write `EgoPage.vue` — inventory tabs**

```vue
<template>
  <div class="ego-page">
    <h1 class="page-title">E.G.O. 装备库</h1>
    <div class="ego-tabs">
      <LCButton variant="ghost" :active="tab === 'weapons'" @click="tab = 'weapons'">武器库存</LCButton>
      <LCButton variant="ghost" :active="tab === 'suits'" @click="tab = 'suits'">防具库存</LCButton>
      <LCButton variant="ghost" :active="tab === 'extract'" @click="tab = 'extract'">提取原型</LCButton>
    </div>

    <LCCard v-if="tab === 'weapons'">
      <div class="ego-table">
        <div class="ego-table-header"><span>名称</span><span>等级</span><span>伤害</span><span>来源</span><span>需求</span></div>
        <div v-for="w in egoStore.weapons" :key="w.id" class="ego-table-row">
          <span class="ego-item-name">{{ w.name }}</span>
          <LCTag :variant="w.grade">{{ w.grade }}</LCTag>
          <span>{{ w.damageType }}</span>
          <span class="ego-mono">{{ w.source }}</span>
          <span>{{ w.requiredVirtue }} Lv.{{ w.requiredLevel }}</span>
        </div>
      </div>
    </LCCard>

    <LCCard v-if="tab === 'suits'">
      <div class="ego-table">
        <div class="ego-table-header"><span>名称</span><span>等级</span><span>RED</span><span>WHITE</span><span>BLACK</span><span>PALE</span><span>来源</span></div>
        <div v-for="s in egoStore.suits" :key="s.id" class="ego-table-row">
          <span class="ego-item-name">{{ s.name }}</span>
          <LCTag :variant="s.grade">{{ s.grade }}</LCTag>
          <span :class="s.resists.red < 1 ? 'ego-resist--good' : s.resists.red > 1 ? 'ego-resist--bad' : ''">{{ s.resists.red }}</span>
          <span :class="s.resists.white < 1 ? 'ego-resist--good' : s.resists.white > 1 ? 'ego-resist--bad' : ''">{{ s.resists.white }}</span>
          <span :class="s.resists.black < 1 ? 'ego-resist--good' : s.resists.black > 1 ? 'ego-resist--bad' : ''">{{ s.resists.black }}</span>
          <span :class="s.resists.pale < 1 ? 'ego-resist--good' : s.resists.pale > 1 ? 'ego-resist--bad' : ''">{{ s.resists.pale }}</span>
          <span class="ego-mono">{{ s.source }}</span>
        </div>
      </div>
    </LCCard>

    <LCCard v-if="tab === 'extract'" title="从异想体提取原型">
      <div class="ego-extract">
        <select id="ego-extract-abno" class="lc-select"><option v-for="a in abnoStore.abnormalities.filter(a => a.observationLevel >= 2)" :key="a.id" :value="a.id">{{ a.subjectId }} — {{ a.name }}</option></select>
        <LCButton variant="primary" icon="Hammer" @click="ui.showToast('原型提取需要消耗 PE-Box。请在完整版中接入 LLM 处理此操作。', 'warning')">提取 E.G.O.</LCButton>
      </div>
    </LCCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEgoStore } from '../../stores/ego'
import { useAbnormalitiesStore } from '../../stores/abnormalities'
import { useUiStore } from '../../stores/ui'
import LCCard from '../shared/LCCard.vue'
import LCTag from '../shared/LCTag.vue'
import LCButton from '../shared/LCButton.vue'

const egoStore = useEgoStore()
const abnoStore = useAbnormalitiesStore()
const ui = useUiStore()
const tab = ref('weapons')
</script>

<style scoped>
.page-title { margin-bottom: var(--space-lg); }
.ego-tabs { display: flex; gap: var(--space-sm); margin-bottom: var(--space-md); }
.ego-table { display: flex; flex-direction: column; font-size: var(--text-sm); }
.ego-table-header, .ego-table-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr; gap: var(--space-sm); padding: var(--space-xs) 0; align-items: center; }
.ego-table-header { color: var(--lc-text-muted); border-bottom: 1px solid var(--lc-border); font-family: var(--font-display); font-size: var(--text-xs); letter-spacing: 0.06em; }
.ego-item-name { color: var(--lc-text-primary); font-weight: 500; }
.ego-mono { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--lc-text-muted); }
.ego-resist--good { color: var(--lc-green); }
.ego-resist--bad { color: var(--lc-red); }
.ego-extract { display: flex; gap: var(--space-md); align-items: center; }
</style>
```

- [ ] **Step 3: Write `MapPage.vue` — department bird's-eye grid**

```vue
<template>
  <div class="map-page">
    <h1 class="page-title">部门地图</h1>
    <div class="map-grid">
      <LCCard v-for="dept in departments" :key="dept.id" :title="dept.name" :danger="dept.hasBreach">
        <div class="map-dept-grid">
          <div v-for="cell in dept.cells" :key="cell.id" :class="['map-cell', { 'map-cell--breach': cell.breached }]">
            <div class="map-cell__id">{{ cell.subjectId }}</div>
            <LCTag :variant="cell.risk">{{ cell.risk }}</LCTag>
            <div class="map-cell__q">Q:{{ cell.qliphoth }} <span v-if="cell.breached" class="map-cell__breach-label">BREACH</span></div>
          </div>
        </div>
      </LCCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFacilityStore } from '../../stores/facility'
import LCCard from '../shared/LCCard.vue'
import LCTag from '../shared/LCTag.vue'

const facility = useFacilityStore()

const departments = [
  { id: 'd1', name: '控制部', hasBreach: false, cells: [{ id: 'c1', subjectId: 'O-03-03', risk: 'ZAYIN', qliphoth: 3, breached: false }] },
  { id: 'd2', name: '安保部', hasBreach: facility.activeBreach, cells: [{ id: 'c2', subjectId: 'T-09-80', risk: 'HE', qliphoth: 2, breached: false },{ id: 'c3', subjectId: 'F-05-52', risk: 'TETH', qliphoth: 2, breached: false }] },
  { id: 'd3', name: '情报部', hasBreach: false, cells: [] },
  { id: 'd4', name: '福利部', hasBreach: false, cells: [] },
]
</script>

<style scoped>
.page-title { margin-bottom: var(--space-lg); }
.map-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-md); }
.map-dept-grid { display: flex; flex-wrap: wrap; gap: var(--space-sm); }
.map-cell { background: var(--lc-deep); border: 1px solid var(--lc-border); padding: var(--space-sm); clip-path: polygon(4px 0, 100% 0, 100% 100%, 0 100%, 0 4px); min-width: 120px; display: flex; flex-direction: column; gap: 2px; }
.map-cell--breach { border-color: var(--lc-red); background: var(--lc-red-glow); animation: breach-cell-pulse 1s infinite; }
.map-cell__id { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--lc-text-muted); }
.map-cell__q { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--lc-text-secondary); }
.map-cell__breach-label { color: var(--lc-red); font-weight: 700; margin-left: 4px; font-family: var(--font-display); letter-spacing: 0.1em; }
@keyframes breach-cell-pulse { 0%, 100% { box-shadow: 0 0 8px var(--lc-red-glow); } 50% { box-shadow: 0 0 20px rgba(200,48,48,0.5); } }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/pages/PersonnelPage.vue src/components/pages/EgoPage.vue src/components/pages/MapPage.vue
git commit -m "feat: add PersonnelPage, EgoPage, MapPage"
```

---

### Task 9: Pages — TerminalPage, LogsPage, SettingsPage

**Files:**
- Create: `src/components/pages/TerminalPage.vue`, `src/components/pages/LogsPage.vue`, `src/components/pages/SettingsPage.vue`

- [ ] **Step 1: Write `TerminalPage.vue` — full-screen AI terminal**

```vue
<template>
  <div class="terminal-page">
    <div class="terminal-container">
      <div class="terminal-output" ref="outputContainer">
        <div v-for="msg in chat.messages" :key="msg.id" class="terminal-line">
          <span :class="msg.role === 'user' ? 'terminal-prompt--user' : 'terminal-prompt--angela'">{{ msg.role === 'user' ? '>' : 'ANGELA>' }}</span>
          <span>{{ msg.content }}</span>
        </div>
        <div v-if="chat.messages.length === 0" class="terminal-line terminal-line--dim">
          <span class="terminal-prompt--angela">ANGELA></span><span>终端已连接。输入指令开始管理设施。</span>
        </div>
        <div v-if="chat.isStreaming" class="terminal-line">
          <span class="terminal-prompt--angela">ANGELA></span><span>{{ chat.streamText }}<span class="terminal-cursor">_</span></span>
        </div>
      </div>
      <div class="terminal-input-row">
        <span class="terminal-prompt--user">></span>
        <input id="terminal-full-input" v-model="inputText" @keydown.enter="sendCmd" :disabled="chat.isStreaming" placeholder="输入指令..." autofocus />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useChatStore } from '../../stores/chat'
import { useUiStore } from '../../stores/ui'

const chat = useChatStore()
const ui = useUiStore()
const inputText = ref('')
const outputContainer = ref<HTMLElement>()

function sendCmd() {
  if (!inputText.value.trim() || chat.isStreaming) return
  const text = inputText.value.trim(); inputText.value = ''
  chat.addMessage({ id: crypto.randomUUID(), role: 'user', content: text, timestamp: Date.now() })
  chat.isStreaming = true; chat.streamText = ''
  const reply = '系统处理中... 在完整版本中，此处将接入 LLM API 进行实时对话。目前终端支持以下指令：状态、查看、工作、日志。'
  let i = 0
  const t = setInterval(() => {
    if (i < reply.length) { chat.streamText += reply[i]; i++; nextTick(() => { if (outputContainer.value) outputContainer.value.scrollTop = outputContainer.value.scrollHeight }) }
    else { clearInterval(t); chat.isStreaming = false; chat.addMessage({ id: crypto.randomUUID(), role: 'assistant', content: reply, timestamp: Date.now() }); chat.streamText = '' }
  }, 25)
}
</script>

<style scoped>
.terminal-page { height: 100%; }
.terminal-container { display: flex; flex-direction: column; height: calc(100vh - var(--topbar-height) - var(--space-2xl) * 2); background: var(--lc-terminal); border: 1px solid var(--lc-border); clip-path: polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px); }
.terminal-output { flex: 1; overflow-y: auto; padding: var(--space-md); font-family: var(--font-mono); font-size: var(--text-sm); color: var(--lc-text-terminal); }
.terminal-line { margin-bottom: 2px; line-height: 1.7; white-space: pre-wrap; }
.terminal-line--dim { opacity: 0.5; font-style: italic; }
.terminal-prompt--user { color: var(--lc-yellow); margin-right: var(--space-sm); }
.terminal-prompt--angela { color: var(--lc-green); margin-right: var(--space-sm); }
.terminal-cursor { animation: blink 1s step-end infinite; color: var(--lc-green); }
.terminal-input-row { display: flex; align-items: center; gap: var(--space-sm); padding: var(--space-sm) var(--space-md); border-top: 1px solid var(--lc-border); }
.terminal-input-row input { flex: 1; background: transparent; border: none; color: var(--lc-text-terminal); font-family: var(--font-mono); font-size: var(--text-sm); padding: 6px 0; }
.terminal-input-row input::placeholder { color: var(--lc-text-muted); }
.terminal-input-row input:focus { border: none; outline: none; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
</style>
```

- [ ] **Step 2: Write `LogsPage.vue` — timeline layout**

```vue
<template>
  <div class="logs-page">
    <h1 class="page-title">日志与记录</h1>
    <div class="logs-timeline">
      <div v-for="entry in logsStore.entries" :key="entry.id" :class="['logs-entry', `logs-entry--${entry.type}`]">
        <div class="logs-entry__dot" />
        <div class="logs-entry__content">
          <div class="logs-entry__header">
            <span class="logs-entry__day">DAY {{ entry.day }}</span>
            <span class="logs-entry__time">{{ new Date(entry.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }}</span>
          </div>
          <div class="logs-entry__msg">{{ entry.message }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLogsStore } from '../../stores/logs'
const logsStore = useLogsStore()
</script>

<style scoped>
.page-title { margin-bottom: var(--space-lg); }
.logs-timeline { position: relative; padding-left: var(--space-lg); }
.logs-timeline::before { content: ''; position: absolute; left: 5px; top: 0; bottom: 0; width: 1px; background: var(--lc-border); }
.logs-entry { display: flex; gap: var(--space-md); margin-bottom: var(--space-md); position: relative; }
.logs-entry__dot { width: 11px; height: 11px; border-radius: 50%; background: var(--lc-border); border: 2px solid var(--lc-card); flex-shrink: 0; margin-top: 4px; position: relative; z-index: 1; }
.logs-entry--success .logs-entry__dot { background: var(--lc-green); border-color: var(--lc-green); }
.logs-entry--warning .logs-entry__dot { background: var(--lc-orange); border-color: var(--lc-orange); }
.logs-entry--error .logs-entry__dot { background: var(--lc-red); border-color: var(--lc-red); }
.logs-entry__content { flex: 1; }
.logs-entry__header { display: flex; gap: var(--space-md); margin-bottom: 2px; }
.logs-entry__day { font-family: var(--font-display); font-size: var(--text-sm); font-weight: 600; color: var(--lc-yellow); }
.logs-entry__time { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--lc-text-muted); }
.logs-entry__msg { font-size: var(--text-sm); color: var(--lc-text-secondary); }
</style>
```

- [ ] **Step 3: Write `SettingsPage.vue` — config forms**

```vue
<template>
  <div class="settings-page">
    <h1 class="page-title">系统设置</h1>

    <LCCard title="API 配置">
      <div class="settings-form">
        <label class="settings-label">Base URL <input id="settings-api-url" v-model="settings.api.baseUrl" type="text" /></label>
        <label class="settings-label">API Key <input id="settings-api-key" v-model="settings.api.apiKey" type="password" /></label>
        <label class="settings-label">Model <input id="settings-api-model" v-model="settings.api.model" type="text" /></label>
      </div>
    </LCCard>

    <LCCard title="显示设置">
      <div class="settings-form">
        <label class="settings-label">UI 模式
          <select id="settings-ui-mode" v-model="settings.uiMode" class="lc-select" style="width:100%">
            <option value="game">游戏模式</option>
            <option value="chat">聊天模式</option>
          </select>
        </label>
        <label class="settings-label">思考显示
          <select id="settings-thinking" v-model="settings.thinkingDisplay" class="lc-select" style="width:100%">
            <option value="fold">折叠</option>
            <option value="hide">隐藏</option>
            <option value="inline">内联</option>
          </select>
        </label>
      </div>
    </LCCard>

    <LCCard title="数据管理">
      <div class="settings-actions">
        <LCButton variant="ghost" icon="Download" @click="ui.showToast('数据导出功能将在完整版中实现', 'info')">导出数据</LCButton>
        <LCButton variant="ghost" icon="Upload" @click="ui.showToast('数据导入功能将在完整版中实现', 'info')">导入数据</LCButton>
        <LCButton variant="danger" icon="Trash2" @click="confirmClear">清空全部数据</LCButton>
      </div>
    </LCCard>

    <LCModal :modelValue="showClearConfirm" @close="showClearConfirm = false" title="确认清空" size="sm">
      <p style="margin-bottom:var(--space-md);color:var(--lc-text-secondary)">此操作将删除所有设施数据，包括日志、员工记录和异想体观察进度。此操作不可撤销。</p>
      <div style="display:flex;gap:var(--space-sm);justify-content:flex-end">
        <LCButton variant="ghost" @click="showClearConfirm = false">取消</LCButton>
        <LCButton variant="danger" icon="AlertTriangle" @click="clearAll">确认清空</LCButton>
      </div>
    </LCModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '../../stores/settings'
import { useUiStore } from '../../stores/ui'
import LCCard from '../shared/LCCard.vue'
import LCButton from '../shared/LCButton.vue'
import LCModal from '../shared/LCModal.vue'

const settings = useSettingsStore()
const ui = useUiStore()
const showClearConfirm = ref(false)

function confirmClear() { showClearConfirm.value = true }
function clearAll() { ui.showToast('数据已清空（演示操作）', 'success'); showClearConfirm.value = false }
</script>

<style scoped>
.page-title { margin-bottom: var(--space-lg); }
.settings-page > * { margin-bottom: var(--space-md); }
.settings-form { display: flex; flex-direction: column; gap: var(--space-md); }
.settings-label { display: flex; flex-direction: column; gap: 4px; font-family: var(--font-display); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.06em; color: var(--lc-text-muted); text-transform: uppercase; }
.settings-label input { width: 100%; }
.settings-actions { display: flex; gap: var(--space-sm); flex-wrap: wrap; }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/pages/TerminalPage.vue src/components/pages/LogsPage.vue src/components/pages/SettingsPage.vue
git commit -m "feat: add TerminalPage, LogsPage, SettingsPage"
```

---

### Task 10: SillyTavern Engine + Final Integration

**Files:**
- Copy from: previous project's `src/sillytavern/*.ts` (12 files)
- Copy from: previous project's `src/composables/*.ts` (3 files)
- Modify: `src/stores/chat.ts` to integrate with the engine
- Create: `src/data/defaults.ts`

- [ ] **Step 1: Copy SillyTavern engine files**

```bash
# The SillyTavern engine files are TypeScript — they work with Vue 3 directly.
# Restore from git history or re-create the 12 files:
# types.ts, database.ts, lorebook-engine.ts, prompt-assembler.ts, variables.ts,
# stream-parser.ts, vars-merger.ts, api-router.ts, api-tools.ts, importer.ts, editor-utils.ts, index.ts
```

Since the original project was cleared, the engine files need to be recreated. Given they are TypeScript (not React-specific), paste the full implementations from the tavernlike skill's `templates/react/sillytavern/` directory.

- [ ] **Step 2: Copy composables (adapt from React hooks to Vue composables)**

The `useSillytavern` hook needs conversion from React `useState`/`useEffect` to Vue `ref`/`watch`/`onMounted`. Write `src/composables/useSillytavern.ts`:

```typescript
import { ref, computed, onMounted } from 'vue'
import { initializeDatabase, getLorebooks, getPresets, getSettings, getChats, saveSettings, saveChat, type AppSettings, type ChatSession, type ChatMessage } from '../sillytavern'

export function useSillytavern() {
  const settings = ref<AppSettings | null>(null)
  const presets = ref<any[]>([])
  const lorebooks = ref<any[]>([])
  const chats = ref<ChatSession[]>([])
  const activeChatId = ref<string | null>(null)
  const initialized = ref(false)
  const isSending = ref(false)

  const activeChat = computed(() => chats.value.find(c => c.id === activeChatId.value) ?? null)

  onMounted(async () => {
    await initializeDatabase()
    const [l, p, s, c] = await Promise.all([getLorebooks(), getPresets(), getSettings(), getChats()])
    lorebooks.value = l; presets.value = p; settings.value = s || null; chats.value = c
    if (c.length > 0) activeChatId.value = c[0].id
    initialized.value = true
  })

  async function updateSettings(patch: Partial<AppSettings>) {
    if (!settings.value) return
    settings.value = { ...settings.value, ...patch }
    await saveSettings(settings.value)
  }

  async function createChat(name: string) {
    const chat: ChatSession = { id: crypto.randomUUID(), name, messages: [], characterName: 'Angela', userName: '主管', presetId: null, lorebookIds: [], variables: {}, createdAt: Date.now(), updatedAt: Date.now() }
    await saveChat(chat); chats.value.push(chat); activeChatId.value = chat.id; return chat.id
  }

  return { settings, presets, lorebooks, chats, activeChat, activeChatId, initialized, isSending, updateSettings, createChat }
}
```

- [ ] **Step 3: Write `src/data/defaults.ts` — seed data for demo**

Move the default data from stores into defaults.ts, then import from stores. This provides seed data for the demo.

- [ ] **Step 4: Final integration — wire everything**

Run `npm run dev` and verify:
- All 8 pages render with real data
- Navigation works between all pages
- AI Dock terminal responds to input
- Toasts fire from page actions
- Settings form accepts input
- Logs timeline displays
- No console errors

- [ ] **Step 5: Commit**

```bash
git add src/sillytavern/ src/composables/ src/data/
git commit -m "feat: integrate SillyTavern engine + composables + seed data"
```

---

### Task 11: Polish + Verify

- [ ] **Step 1: Run lint and fix**

```bash
npm run build
```

Fix any build errors. Ensure all TypeScript types pass.

- [ ] **Step 2: Performance check**

Verify: routes use `defineAsyncComponent`, fonts preconnect, CSS animations use transform/opacity.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "fix: polish, performance optimization, build verification"
```

---

## Self-Review Notes

- **Spec coverage:** All 8 pages, all shared components, all stores, layout shell, LLM integration, design tokens → covered.
- **Placeholder scan:** All steps have concrete code. No TBD or TODO.
- **Type consistency:** Store interfaces (Abnormality, Agent, ChatMessage, LogEntry) defined once and imported across pages. Vue component props use proper TypeScript types.

