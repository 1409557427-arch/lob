<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value?: number
    max?: number
    variant?: 'default' | 'warning' | 'danger'
    striped?: boolean
    label?: string
    duration?: number
  }>(),
  {
    value: 0,
    max: 100,
    variant: 'default',
    striped: false,
    duration: 800,
  },
)

const clampPercent = computed(() => {
  const pct = props.max > 0 ? (props.value / props.max) * 100 : 0
  return Math.min(100, Math.max(0, pct))
})

const fillStyle = computed(() => ({
  width: `${clampPercent.value}%`,
  transition: `width ${props.duration}ms ease`,
}))

const fillColor = computed(() => {
  switch (props.variant) {
    case 'warning':
      return 'var(--color-warning, #f39c12)'
    case 'danger':
      return 'var(--color-danger, #e74c3c)'
    default:
      return 'var(--color-accent, #f5c518)'
  }
})
</script>

<template>
  <div class="lc-progress">
    <div v-if="label" class="lc-progress__label">{{ label }}</div>
    <div class="lc-progress__track">
      <div
        class="lc-progress__fill"
        :class="[`lc-progress__fill--${variant}`, { 'lc-progress__fill--striped': striped && variant === 'danger' }]"
        :style="fillStyle"
      >
        <div v-if="striped && variant === 'danger'" class="lc-progress__stripes"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lc-progress {
  width: 100%;
}

.lc-progress__label {
  margin-bottom: 4px;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.75rem;
  color: var(--color-text, #ddd);
  letter-spacing: 0.03em;
}

.lc-progress__track {
  width: 100%;
  height: 6px;
  background: var(--color-deep, #111);
  border-radius: 1px;
  overflow: hidden;
  position: relative;
}

.lc-progress__fill {
  height: 100%;
  border-radius: 1px;
  position: relative;
  overflow: hidden;
}

.lc-progress__fill--default {
  background: var(--color-accent, #f5c518);
}

.lc-progress__fill--warning {
  background: var(--color-warning, #f39c12);
}

.lc-progress__fill--danger {
  background: var(--color-danger, #e74c3c);
}

.lc-progress__stripes {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.45),
    rgba(0, 0, 0, 0.45) 4px,
    transparent 4px,
    transparent 10px
  );
  animation: stripe-flow 1s linear infinite;
}

@keyframes stripe-flow {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 14px 0;
  }
}
</style>
