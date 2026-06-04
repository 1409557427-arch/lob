<script setup lang="ts">
import { computed } from 'vue'
import LCIcon from './LCIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    modelValue: false,
    size: 'md',
  },
)

const emit = defineEmits<{
  close: []
}>()

const visible = computed(() => props.modelValue)

const sizeWidth = computed(() => {
  switch (props.size) {
    case 'sm':
      return '400px'
    case 'lg':
      return '720px'
    default:
      return '560px'
  }
})

const handleOverlayClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="lc-modal-overlay" @click="handleOverlayClick">
        <div class="lc-modal" :style="{ maxWidth: sizeWidth }">
          <header class="lc-modal__header">
            <span class="lc-modal__screw"></span>
            <h2 v-if="title" class="lc-modal__title">{{ title }}</h2>
            <span v-else class="lc-modal__title lc-modal__title--empty"></span>
            <button class="lc-modal__close" @click="handleClose" aria-label="Close">
              <LCIcon name="X" :size="18" />
            </button>
          </header>
          <div class="lc-modal__body">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lc-modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 1000;
  padding: 20px;
}

.lc-modal {
  position: relative;
  width: 100%;
  background: var(--color-card, #1a1a2e);
  border: 1px solid var(--color-border-light, #333);
  clip-path: polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px);
  padding: 20px;
  box-shadow: 0 12px 60px rgba(0, 0, 0, 0.5);
}

.lc-modal__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border-light, #333);
}

.lc-modal__screw {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-text-muted, #666);
  flex-shrink: 0;
}

.lc-modal__title {
  flex: 1;
  margin: 0;
  font-family: var(--font-display, 'Inter', sans-serif);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text, #ddd);
}

.lc-modal__title--empty {
  visibility: hidden;
}

.lc-modal__close {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--color-text-muted, #888);
  cursor: pointer;
  padding: 4px;
  border-radius: 2px;
  transition: color 0.15s ease;
}

.lc-modal__close:hover {
  color: var(--color-danger, #e74c3c);
}

.lc-modal__body {
  color: var(--color-text, #ccc);
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Transition: modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.modal-enter-active .lc-modal,
.modal-leave-active .lc-modal {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-from .lc-modal {
  opacity: 0;
  transform: scale(0.95);
}

.modal-leave-to {
  opacity: 0;
}

.modal-leave-to .lc-modal {
  opacity: 0;
  transform: scale(0.95);
}
</style>
