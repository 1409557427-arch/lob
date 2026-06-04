<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import LCIcon from '@/components/shared/LCIcon.vue'

const route = useRoute()
const ui = useUiStore()

const navItems = [
  { path: '/office',       label: '主管办公室', icon: 'LayoutDashboard' },
  { path: '/abnormalities', label: '异想体',     icon: 'FlaskConical' },
  { path: '/personnel',     label: '员工',       icon: 'Users' },
  { path: '/ego',           label: 'E.G.O.',     icon: 'Swords' },
  { path: '/map',           label: '部门地图',   icon: 'Map' },
  { path: '/terminal',      label: 'AI终端',     icon: 'Terminal' },
  { path: '/logs',          label: '日志',       icon: 'ScrollText' },
  { path: '/settings',      label: '设置',       icon: 'Settings' },
]

function isActive(path: string): boolean {
  if (path === '/office') return route.path === '/office' || route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <nav class="lc-sidebar" :class="{ collapsed: ui.sidebarCollapsed }">
    <!-- Logo -->
    <div class="sidebar-logo">
      <svg
        class="logo-svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Outer circle -->
        <circle cx="16" cy="16" r="15" stroke="currentColor" stroke-width="1.5" />
        <!-- Inner circle -->
        <circle cx="16" cy="16" r="3" stroke="currentColor" stroke-width="1" />
        <!-- Crosshair lines -->
        <line x1="16" y1="1" x2="16" y2="11" stroke="currentColor" stroke-width="1" />
        <line x1="16" y1="21" x2="16" y2="31" stroke="currentColor" stroke-width="1" />
        <line x1="1" y1="16" x2="11" y2="16" stroke="currentColor" stroke-width="1" />
        <line x1="21" y1="16" x2="31" y2="16" stroke="currentColor" stroke-width="1" />
        <!-- Diagonal ticks -->
        <line x1="5.5" y1="5.5" x2="8" y2="8" stroke="currentColor" stroke-width="0.75" />
        <line x1="26.5" y1="5.5" x2="24" y2="8" stroke="currentColor" stroke-width="0.75" />
        <line x1="5.5" y1="26.5" x2="8" y2="24" stroke="currentColor" stroke-width="0.75" />
        <line x1="26.5" y1="26.5" x2="24" y2="24" stroke="currentColor" stroke-width="0.75" />
      </svg>
      <span v-show="!ui.sidebarCollapsed" class="logo-text">LobotomyCorp</span>
    </div>

    <!-- Nav items -->
    <ul class="nav-list">
      <li v-for="item in navItems" :key="item.path">
        <router-link
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          <LCIcon :name="item.icon" :size="18" />
          <span class="nav-label">{{ item.label }}</span>
        </router-link>
      </li>
    </ul>

    <!-- Footer: collapse toggle -->
    <div class="sidebar-footer">
      <button
        class="collapse-btn"
        @click="ui.toggleSidebar()"
        :title="ui.sidebarCollapsed ? '展开侧栏' : '收起侧栏'"
      >
        <LCIcon :name="ui.sidebarCollapsed ? 'PanelRight' : 'PanelLeft'" :size="18" />
      </button>
    </div>
  </nav>
</template>

<style scoped>
.lc-sidebar {
  position: fixed;
  top: var(--topbar-height);
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: var(--lc-deep);
  border-right: 1px solid var(--lc-border);
  display: flex;
  flex-direction: column;
  z-index: 99;
  transition: width var(--duration-normal) var(--ease-out-expo);
  overflow: hidden;
}

.lc-sidebar.collapsed {
  width: 56px;
}

/* ---- Logo ---- */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-bottom: 1px solid var(--lc-border);
  flex-shrink: 0;
  min-height: 60px;
}

.logo-svg {
  color: var(--lc-yellow);
  flex-shrink: 0;
}

.logo-text {
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--lc-yellow);
  letter-spacing: 0.06em;
  white-space: nowrap;
}

/* ---- Nav list ---- */
.nav-list {
  list-style: none;
  padding: var(--space-sm);
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  color: var(--lc-text-secondary);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  text-decoration: none;
  border-radius: 2px;
  border: 1px solid transparent;
  clip-path: polygon(4px 0, 100% 0, 100% 100%, 0 100%, 0 4px);
  transition: all var(--duration-fast);
  white-space: nowrap;
  overflow: hidden;
}

.nav-item:hover {
  background: var(--lc-card);
  border-color: var(--lc-border-light);
  color: var(--lc-text-primary);
}

.nav-item.active {
  color: var(--lc-yellow);
  border-color: var(--lc-yellow);
  text-shadow: 0 0 6px var(--lc-yellow-glow);
  box-shadow: 0 0 8px var(--lc-yellow-glow);
}

.nav-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ---- Footer ---- */
.sidebar-footer {
  padding: var(--space-sm);
  border-top: 1px solid var(--lc-border);
  flex-shrink: 0;
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: var(--space-sm);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 2px;
  color: var(--lc-text-muted);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.collapse-btn:hover {
  background: var(--lc-card);
  border-color: var(--lc-border-light);
  color: var(--lc-text-primary);
}
</style>
