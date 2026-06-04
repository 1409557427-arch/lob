<script setup lang="ts">
import { computed } from 'vue'
import { useFacilityStore } from '@/stores/facility'
import LCIcon from '@/components/shared/LCIcon.vue'

const facility = useFacilityStore()

const energyPercent = computed(() => facility.energyPercent)
const energyBarColor = computed(() => {
  const p = energyPercent.value
  if (p >= 100) return 'var(--lc-green)'
  if (p >= 60) return 'var(--lc-yellow)'
  if (p >= 30) return 'var(--lc-orange)'
  return 'var(--lc-red)'
})

const trumpetLabel = computed(() => {
  const lv = facility.trumpetLevel
  if (lv === 0) return '无警报'
  if (lv === 1) return '一级警报'
  if (lv === 2) return '二级警报'
  if (lv === 3) return '三级警报'
  return `${lv}级警报`
})

const trumpetVariant = computed(() => {
  const lv = facility.trumpetLevel
  if (lv === 0) return 'safe'
  if (lv <= 2) return 'warning'
  return 'danger'
})
</script>

<template>
  <header class="lc-topbar">
    <!-- Left: Branch ID + Energy -->
    <div class="topbar-left">
      <span class="branch-id">BRANCH {{ facility.branchId }}</span>
      <span class="divider-pipe">|</span>
      <div class="energy-bar-wrap">
        <div class="energy-bar-track">
          <div
            class="energy-bar-fill"
            :style="{ width: energyPercent + '%', background: energyBarColor }"
          />
        </div>
        <span class="energy-label">{{ facility.energyCollected }} / {{ facility.energyQuota }}</span>
      </div>
    </div>

    <!-- Center: Trumpet + Day -->
    <div class="topbar-center">
      <span class="divider-pipe">|</span>
      <span class="trumpet-tag" :class="trumpetVariant">
        <LCIcon name="Siren" :size="13" />
        {{ trumpetLabel }}
      </span>
      <span class="divider-pipe">|</span>
      <span class="day-label">DAY {{ facility.day }}</span>
      <span class="divider-pipe">|</span>
    </div>

    <!-- Right: Motto -->
    <div class="topbar-right">
      <span class="motto">FACE THE FEAR, BUILD THE FUTURE</span>
    </div>
  </header>
</template>

<style scoped>
.lc-topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--topbar-height);
  z-index: 100;
  background: var(--lc-deep);
  border-bottom: 1px solid var(--lc-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-md);
  gap: var(--space-sm);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-shrink: 0;
}

.branch-id {
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--lc-yellow);
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.divider-pipe {
  color: var(--lc-border-light);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  user-select: none;
}

.energy-bar-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.energy-bar-track {
  width: 200px;
  height: 8px;
  background: var(--lc-card);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--lc-border);
}

.energy-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width var(--duration-slow) var(--ease-out-expo);
  min-width: 0;
}

.energy-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--lc-text-secondary);
  white-space: nowrap;
}

.topbar-center {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-shrink: 0;
}

.trumpet-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 2px var(--space-sm);
  border-radius: 2px;
  white-space: nowrap;
}

.trumpet-tag.safe {
  background: var(--lc-green-glow);
  color: var(--lc-green);
  border: 1px solid rgba(48, 152, 112, 0.3);
}

.trumpet-tag.warning {
  background: var(--lc-yellow-glow);
  color: var(--lc-yellow);
  border: 1px solid rgba(240, 192, 64, 0.3);
}

.trumpet-tag.danger {
  background: var(--lc-red-glow);
  color: var(--lc-red);
  border: 1px solid rgba(200, 48, 48, 0.3);
  animation: trumpet-pulse 1.5s ease-in-out infinite;
}

@keyframes trumpet-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.day-label {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--lc-text-primary);
  white-space: nowrap;
}

.topbar-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.motto {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  color: var(--lc-text-muted);
  letter-spacing: 0.08em;
  white-space: nowrap;
}
</style>
