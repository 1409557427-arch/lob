<script setup lang="ts">
import { useUiStore } from '../../stores/ui'
import LCIcon from './LCIcon.vue'

const ui = useUiStore()

const variantIcon: Record<string, string> = {
  info: 'Info',
  success: 'CircleCheck',
  warning: 'AlertTriangle',
  error: 'XCircle',
}

const getToastIcon = (variant: string): string => {
  return variantIcon[variant] ?? 'Info'
}

const getToastClass = (variant: string): string => {
  return `lc-toast--${variant ?? 'info'}`
}
</script>

<template>
  <TransitionGroup
    v-if="ui.toasts.length"
    name="toast"
    tag="div"
    class="lc-toast-container"
  >
    <div
      v-for="toast in ui.toasts"
      :key="toast.id"
      class="lc-toast"
      :class="getToastClass(toast.variant)"
    >
      <span class="lc-toast__dot" :class="`lc-toast__dot--${toast.variant ?? 'info'}`"></span>
      <span class="lc-toast__msg">{{ toast.message }}</span>
      <button class="lc-toast__dismiss" @click="ui.dismissToast(toast.id)" aria-label="Dismiss">
        <LCIcon name="X" :size="14" />
      </button>
    </div>
  </TransitionGroup>
</template>

<style scoped>
.lc-toast-container {
  position: fixed;
  top: 60px;
  right: 20px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.lc-toast {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  min-width: 260px;
  max-width: 380px;
  background: var(--color-card, #1a1a2e);
  border: 1px solid var(--color-border-light, #333);
  clip-path: polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 6px);
  pointer-events: auto;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
  font-family: var(--font-display, 'Inter', sans-serif);
  font-size: 0.8125rem;
}

/* Variant border colors */
.lc-toast--info {
  border-left: 3px solid #3498db;
}

.lc-toast--success {
  border-left: 3px solid #2ecc71;
}

.lc-toast--warning {
  border-left: 3px solid #f39c12;
}

.lc-toast--error {
  border-left: 3px solid #e74c3c;
}

.lc-toast__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.lc-toast__dot--info {
  background: #3498db;
}

.lc-toast__dot--success {
  background: #2ecc71;
}

.lc-toast__dot--warning {
  background: #f39c12;
}

.lc-toast__dot--error {
  background: #e74c3c;
}

.lc-toast__msg {
  flex: 1;
  color: var(--color-text, #ddd);
  line-height: 1.3;
}

.lc-toast__dismiss {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--color-text-muted, #888);
  cursor: pointer;
  padding: 2px;
  flex-shrink: 0;
  transition: color 0.15s ease;
}

.lc-toast__dismiss:hover {
  color: var(--color-text, #ddd);
}

/* Transition: toast */
.toast-enter-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.toast-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.toast-enter-from {
  transform: translateX(120%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(120%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
