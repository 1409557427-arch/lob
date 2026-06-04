<template>
  <div class="map-page">
    <h1 class="map-page__title">部门地图</h1>
    <div class="map-grid">
      <LCCard
        v-for="dept in departments"
        :key="dept.name"
        :title="dept.name"
        :danger="dept.hasBreach"
      >
        <template v-if="dept.cells.length === 0">
          <p class="map-empty">暂无收容单元</p>
        </template>
        <div v-else class="map-dept-grid">
          <div
            v-for="cell in dept.cells"
            :key="cell.id"
            class="map-cell"
            :class="{ 'map-cell--breached': cell.breached }"
          >
            <span class="map-cell__id">{{ cell.subjectId }}</span>
            <span class="map-cell__name">{{ cell.name }}</span>
            <div class="map-cell__meta">
              <LCTag :variant="riskVariant(cell.risk)">{{ cell.risk }}</LCTag>
              <span class="map-cell__qliphoth">Q: {{ cell.qliphoth }}</span>
            </div>
          </div>
        </div>
      </LCCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFacilityStore } from '../../stores/facility'
import LCCard from '../shared/LCCard.vue'
import LCTag from '../shared/LCTag.vue'

const facility = useFacilityStore()
import { useAbnormalitiesStore } from '../../stores/abnormalities'

const abnoStore = useAbnormalitiesStore()

const deptNames = ['控制部', '安保部', '情报部', '福利部']

interface Cell {
  id: string
  subjectId: string
  name: string
  risk: string
  qliphoth: number
  breached: boolean
}

interface Department {
  name: string
  cells: Cell[]
  hasBreach: boolean
}

const departments = computed<Department[]>(() => {
  const abnos = abnoStore.abnormalities
  const cells = abnos.map((a, i) => ({
    id: a.id,
    subjectId: a.subjectId,
    name: a.name,
    risk: a.riskLevel,
    qliphoth: a.qliphothCounter,
    breached: false,
  }))
  // Distribute abnormalities across departments (max 2 per dept)
  const result: Department[] = []
  let idx = 0
  for (const name of deptNames) {
    const deptCells = cells.slice(idx, idx + 2)
    result.push({
      name,
      cells: deptCells,
      hasBreach: deptCells.some(c => c.breached) || facility.activeBreach,
    })
    idx += 2
  }
  return result
})

function riskVariant(risk: string): string {
  const map: Record<string, string> = {
    ZAYIN: 'default',
    TETH: 'warning',
    HE: 'warning',
    WAW: 'danger',
    ALEPH: 'danger',
  }
  return map[risk] || 'default'
}
</script>

<style scoped>
.map-page {
  padding: var(--space-lg);
}

.map-page__title {
  font-family: var(--font-display), 'Rajdhani', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--lc-text-primary);
  margin: 0 0 var(--space-lg);
  letter-spacing: 0.04em;
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

.map-dept-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.map-empty {
  color: var(--lc-text-muted);
  font-family: var(--font-body), 'Noto Sans SC', sans-serif;
  font-size: 0.875rem;
  margin: 0;
  font-style: italic;
}

.map-cell {
  min-width: 120px;
  background: var(--lc-surface);
  border: 1px solid var(--lc-border);
  clip-path: polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px);
  padding: var(--space-sm);
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.map-cell--breached {
  border-color: var(--lc-red);
  background: rgba(220, 38, 38, 0.08);
  box-shadow: 0 0 8px rgba(220, 38, 38, 0.3);
  animation: breach-cell-pulse 1s infinite;
}

@keyframes breach-cell-pulse {
  0% {
    box-shadow: 0 0 8px rgba(220, 38, 38, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.6);
  }
  100% {
    box-shadow: 0 0 8px rgba(220, 38, 38, 0.3);
  }
}

.map-cell__id {
  font-family: var(--font-mono), 'JetBrains Mono', monospace;
  font-size: 0.8125rem;
  color: var(--lc-text-primary);
  font-weight: 600;
}
.map-cell__name {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--lc-text-secondary);
}

.map-cell__meta {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.map-cell__qliphoth {
  font-family: var(--font-mono), 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--lc-text-muted);
}
</style>
