<script setup lang="ts">
import { computed } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

const props = defineProps<{
  name: string
  size?: number
  strokeWidth?: number
}>()

const size = computed(() => props.size ?? 18)
const strokeWidth = computed(() => props.strokeWidth ?? 1.5)

const iconComponent = computed(() => {
  const icons = LucideIcons as Record<string, unknown>
  return icons[props.name]
})
</script>

<template>
  <span class="lc-icon">
    <component :is="iconComponent" :size="size" :stroke-width="strokeWidth" />
  </span>
</template>

<style scoped>
.lc-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
