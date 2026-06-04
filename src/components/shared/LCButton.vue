<script setup lang="ts">
import LCIcon from './LCIcon.vue'

defineProps<{
  id?: string
  variant?: 'primary' | 'danger' | 'ghost' | 'icon'
  icon?: string
  active?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<template>
  <button
    :id="id"
    class="lc-btn"
    :class="[
      `lc-btn--${variant ?? 'primary'}`,
      { 'lc-btn--active': active, 'lc-btn--icon-only': variant === 'icon' },
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <LCIcon v-if="icon" :name="icon" :size="variant === 'icon' ? 20 : 16" class="lc-btn__icon" />
    <span v-if="$slots.default" class="lc-btn__text">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.lc-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 20px;
  border: 2px solid transparent;
  background: var(--color-accent, #f5c518);
  color: var(--color-deep, #111);
  font-family: var(--font-display, 'Inter', sans-serif);
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  clip-path: polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 6px);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.2s ease;
  user-select: none;
}

.lc-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 0 12px rgba(245, 197, 24, 0.35), 0 4px 16px rgba(0, 0, 0, 0.3);
}

.lc-btn:active:not(:disabled) {
  transform: translateY(0);
}

.lc-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Variant: danger */
.lc-btn--danger {
  background: var(--color-deep, #111);
  color: var(--color-danger, #e74c3c);
  border-color: var(--color-danger, #e74c3c);
}

.lc-btn--danger:hover:not(:disabled) {
  box-shadow: 0 0 12px rgba(231, 76, 60, 0.35), 0 4px 16px rgba(0, 0, 0, 0.3);
}

/* Variant: ghost */
.lc-btn--ghost {
  background: transparent;
  color: var(--color-text, #ddd);
  border-color: transparent;
}

.lc-btn--ghost:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.08);
}

/* Variant: icon */
.lc-btn--icon {
  padding: 6px;
}

.lc-btn--icon-only {
  padding: 6px;
  min-width: unset;
}

/* Active state */
.lc-btn--active {
  box-shadow: 0 0 14px rgba(245, 197, 24, 0.5);
}

.lc-btn__icon {
  line-height: 0;
}

.lc-btn__text {
  line-height: 1;
}
</style>
