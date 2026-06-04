<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'
import LCTopBar from '@/components/layout/LCTopBar.vue'
import LCSidebar from '@/components/layout/LCSidebar.vue'
import LCAiDock from '@/components/layout/LCAiDock.vue'
import LCIcon from '@/components/shared/LCIcon.vue'

const ui = useUiStore()

const mainStyle = computed(() => ({
  marginTop: 'var(--topbar-height)',
  marginLeft: ui.sidebarCollapsed ? '56px' : 'var(--sidebar-width)',
  transition: 'margin-left var(--duration-normal) var(--ease-out-expo)',
  paddingBottom: ui.dockExpanded ? `calc(${ui.dockHeight}px + var(--space-md))` : '0',
}))
</script>

<template>
  <div class="lc-shell">
    <LCTopBar />
    <LCSidebar />

    <main class="shell-main" :style="mainStyle">
      <div class="shell-content">
        <slot />
      </div>
    </main>

    <LCAiDock />

    <!-- Floating dock toggle (visible when dock is collapsed) -->
    <button
      v-if="!ui.dockExpanded"
      class="dock-toggle-fab"
      @click="ui.toggleDock()"
      title="打开AI终端"
    >
      <LCIcon name="Terminal" :size="20" />
      <span class="fab-label">终端</span>
    </button>
  </div>
</template>

<style scoped>
.lc-shell {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--lc-surface);
}

.shell-main {
  padding: var(--space-lg);
  min-height: calc(100vh - var(--topbar-height));
  min-height: calc(100dvh - var(--topbar-height));
}

.shell-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* ---- Floating dock toggle ---- */
.dock-toggle-fab {
  position: fixed;
  bottom: var(--space-md);
  right: var(--space-md);
  z-index: 90;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--lc-card);
  color: var(--lc-text-terminal);
  border: 1px solid var(--lc-border-light);
  border-radius: 2px;
  cursor: pointer;
  clip-path: polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 6px);
  transition: all var(--duration-fast);
  font-family: var(--font-mono);
}

.dock-toggle-fab:hover {
  background: var(--lc-card-hover);
  border-color: var(--lc-green);
  box-shadow: 0 0 12px var(--lc-green-glow);
}

.fab-label {
  font-size: var(--text-sm);
}
</style>
