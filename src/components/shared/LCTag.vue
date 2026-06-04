<script setup lang="ts">
defineProps<{
  variant?: string
}>()
</script>

<template>
  <span class="lc-tag" :class="[`lc-tag--${variant ?? 'default'}`]">
    <span class="lc-tag__dot"></span>
    <span class="lc-tag__text"><slot /></span>
  </span>
</template>

<style scoped>
.lc-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 10px;
  font-family: var(--font-display, 'Inter', sans-serif);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  clip-path: polygon(4px 0, 100% 0, 100% 100%, 0 100%, 0 4px);
  background: var(--color-card, #1a1a2e);
  border: 1px solid var(--color-border-light, #333);
  color: var(--color-text, #ccc);
  line-height: 1.4;
}

.lc-tag__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

/* Variant: default */
.lc-tag--default {
  color: var(--color-text-muted, #888);
  border-color: var(--color-text-muted, #888);
}

/* Variant: ZAYIN */
.lc-tag--ZAYIN {
  color: #5dade2;
  border-color: #5dade2;
}

/* Variant: TETH */
.lc-tag--TETH {
  color: #52be80;
  border-color: #52be80;
}

/* Variant: HE */
.lc-tag--HE {
  color: #f4d03f;
  border-color: #f4d03f;
}

/* Variant: WAW */
.lc-tag--WAW {
  color: #e67e22;
  border-color: #e67e22;
}

/* Variant: ALEPH */
.lc-tag--ALEPH {
  color: #e74c3c;
  border-color: #e74c3c;
  animation: tag-pulse 2s infinite;
}

/* Variant: success */
.lc-tag--success {
  color: #2ecc71;
  border-color: #2ecc71;
}

/* Variant: warning */
.lc-tag--warning {
  color: #f39c12;
  border-color: #f39c12;
}

/* Variant: danger */
.lc-tag--danger {
  color: #e74c3c;
  border-color: #e74c3c;
}

@keyframes tag-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
