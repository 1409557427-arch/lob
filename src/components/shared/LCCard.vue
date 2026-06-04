<script setup lang="ts">
defineProps<{
  title?: string
  clickable?: boolean
  danger?: boolean
}>()
</script>

<template>
  <div
    class="lc-card"
    :class="{
      'lc-card--clickable': clickable,
      'lc-card--danger': danger,
    }"
  >
    <header v-if="title" class="lc-card__header">
      <span class="lc-card__screw"></span>
      <h3 class="lc-card__title">{{ title }}</h3>
      <span class="lc-card__screw"></span>
    </header>
    <div class="lc-card__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.lc-card {
  background: var(--color-card, #1a1a2e);
  border: 1px solid var(--color-border-light, #333);
  clip-path: polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 6px);
  padding: 16px;
  transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease,
    box-shadow 0.15s ease;
}

.lc-card--clickable {
  cursor: pointer;
}

.lc-card--clickable:hover {
  background: var(--color-card-hover, #222240);
  border-color: var(--color-accent, #f5c518);
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.lc-card--danger {
  border-color: var(--color-danger, #e74c3c);
}

.lc-card--danger.lc-card--clickable:hover {
  border-color: var(--color-accent, #f5c518);
}

.lc-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border-light, #333);
}

.lc-card__screw {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-text-muted, #666);
  flex-shrink: 0;
}

.lc-card__title {
  flex: 1;
  margin: 0;
  font-family: var(--font-display, 'Inter', sans-serif);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text, #ddd);
}

.lc-card__body {
  color: var(--color-text, #ccc);
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>
