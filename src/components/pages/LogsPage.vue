<template>
  <div class="logs-page">
    <h1 class="logs-page__title">日志与记录</h1>
    <div v-if="logsStore.entries.length === 0" class="logs-empty">
      暂无日志记录。
    </div>
    <div v-else class="logs-timeline">
      <div
        v-for="log in logsStore.entries"
        :key="log.id"
        class="logs-entry"
      >
        <div
          class="logs-entry__dot"
          :class="`logs-entry__dot--${log.type || 'info'}`"
        ></div>
        <div class="logs-entry__content">
          <div class="logs-entry__header">
            <span class="logs-entry__day">{{ log.day ? `DAY ${log.day}` : '' }}</span>
            <span class="logs-entry__time">{{ formatTime(log.timestamp) }}</span>
          </div>
          <p class="logs-entry__message">{{ log.message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLogsStore } from '../../stores/logs'

const logsStore = useLogsStore()
function formatTime(ts: number) { return new Date(ts).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }
</script>

<style scoped>
.logs-page {
  padding: var(--space-lg);
}

.logs-page__title {
  font-family: var(--font-display), 'Rajdhani', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--lc-text-primary);
  margin: 0 0 var(--space-lg);
  letter-spacing: 0.04em;
}

.logs-empty {
  color: var(--lc-text-muted);
  font-family: var(--font-body), 'Noto Sans SC', sans-serif;
  font-size: 0.875rem;
  font-style: italic;
}

.logs-timeline {
  position: relative;
  padding-left: var(--space-lg);
}

.logs-timeline::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--lc-border);
}

.logs-entry {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.logs-entry__dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--lc-border);
  border: 2px solid var(--lc-card);
  flex-shrink: 0;
  margin-top: 4px;
  z-index: 1;
}

.logs-entry__dot--success {
  background: var(--lc-green);
  border-color: var(--lc-card);
}

.logs-entry__dot--warning {
  background: #f59e0b;
  border-color: var(--lc-card);
}

.logs-entry__dot--error {
  background: var(--lc-red);
  border-color: var(--lc-card);
}

.logs-entry__dot--info {
  background: var(--lc-border);
  border-color: var(--lc-card);
}

.logs-entry__content {
  flex: 1;
  min-width: 0;
}

.logs-entry__header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: 4px;
}

.logs-entry__day {
  font-family: var(--font-display), 'Rajdhani', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--lc-yellow);
  letter-spacing: 0.04em;
}

.logs-entry__time {
  font-family: var(--font-mono), 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--lc-text-muted);
}

.logs-entry__message {
  font-family: var(--font-body), 'Noto Sans SC', sans-serif;
  font-size: 0.875rem;
  color: var(--lc-text-secondary);
  margin: 0;
  line-height: 1.5;
}
</style>
