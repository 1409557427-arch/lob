<template>
  <div class="office-page">
    <h1 class="page-title">主管办公室</h1>
    <div class="office-grid">
      <!-- 今日能量配额 -->
      <LCCard title="今日能量配额">
        <div class="quota-section">
          <LCProgress
            :value="facilityStore.energyUsed"
            :max="facilityStore.energyMax"
            :variant="facilityStore.energyRemaining > 0 ? 'default' : 'success'"
            :label="`${facilityStore.energyUsed} / ${facilityStore.energyMax}`"
          />
          <div class="stat-row">
            <template v-if="facilityStore.energyRemaining > 0">
              <span class="stat-label">剩余配额</span>
              <span class="stat-value">{{ facilityStore.energyRemaining }}</span>
            </template>
            <template v-else>
              <span class="stat-label">配额已完成</span>
              <LCIcon name="check-circle" :size="16" class="success-icon" />
            </template>
          </div>
        </div>
      </LCCard>

      <!-- 警报状态 -->
      <LCCard title="警报状态" :danger="facilityStore.trumpetLevel > 0">
        <div class="alert-section">
          <div class="alert-row">
            <span class="stat-label">警报等级</span>
            <LCTag :variant="facilityStore.trumpetLevel > 0 ? 'danger' : 'success'">
              {{ facilityStore.trumpetLevel > 0 ? `等级 ${facilityStore.trumpetLevel}` : '无警报' }}
            </LCTag>
          </div>
          <div class="alert-row">
            <span class="stat-label">突破异想体</span>
            <span class="stat-value danger">{{ facilityStore.breachedCount }}</span>
          </div>
          <div class="alert-row">
            <span class="stat-label">员工死亡</span>
            <span class="stat-value danger">{{ facilityStore.deathCount }}</span>
          </div>
        </div>
      </LCCard>

      <!-- E.G.O. 库存概览 -->
      <LCCard title="E.G.O. 库存概览" clickable @click="$router.push('/ego')">
        <div class="ego-overview">
          <div class="overview-row">
            <LCIcon name="sword" :size="18" />
            <span class="stat-label">武器</span>
            <span class="stat-value">{{ egoStore.weapons.length }}</span>
          </div>
          <div class="overview-row">
            <LCIcon name="shield" :size="18" />
            <span class="stat-label">防具</span>
            <span class="stat-value">{{ egoStore.suits.length }}</span>
          </div>
        </div>
      </LCCard>

      <!-- 员工状态 -->
      <LCCard title="员工状态" clickable @click="$router.push('/personnel')">
        <div class="personnel-overview">
          <div class="overview-row">
            <LCIcon name="users" :size="18" />
            <span class="stat-label">员工总数</span>
            <span class="stat-value">{{ employeesStore.agents.length }}</span>
          </div>
          <div class="overview-row">
            <LCIcon name="coffee" :size="18" />
            <span class="stat-label">待命中</span>
            <span class="stat-value">{{ idleCount }}</span>
          </div>
        </div>
      </LCCard>

      <!-- 异想体速览 -->
      <LCCard title="异想体速览" clickable @click="$router.push('/abnormalities')">
        <div class="abno-list">
          <div
            v-for="abno in abnormalitiesStore.abnormalities"
            :key="abno.subjectId"
            class="abno-row"
          >
            <LCTag :variant="riskVariant(abno.riskLevel)">{{ abno.riskLevel }}</LCTag>
            <span class="abno-id">{{ abno.subjectId }}</span>
            <span class="abno-name">{{ abno.name }}</span>
            <span class="abno-q">Q{{ abno.qCounter }}</span>
          </div>
        </div>
      </LCCard>

      <!-- 本日公告 -->
      <LCCard title="本日公告">
        <div class="announcements">
          <div
            v-for="(ann, idx) in announcements"
            :key="idx"
            class="announcement-item"
          >
            <span class="ann-source">[{{ ann.source }}]</span>
            <span class="ann-text">{{ ann.text }}</span>
          </div>
        </div>
      </LCCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFacilityStore } from '../../stores/facility'
import { useAbnormalitiesStore } from '../../stores/abnormalities'
import { useEmployeesStore } from '../../stores/employees'
import { useEgoStore } from '../../stores/ego'
import LCCard from '../shared/LCCard.vue'
import LCTag from '../shared/LCTag.vue'
import LCProgress from '../shared/LCProgress.vue'
import LCIcon from '../shared/LCIcon.vue'

const facilityStore = useFacilityStore()
const abnormalitiesStore = useAbnormalitiesStore()
const employeesStore = useEmployeesStore()
const egoStore = useEgoStore()

const idleCount = computed(() =>
  employeesStore.agents.filter(a => a.status === 'idle').length
)

function riskVariant(risk: string): string {
  switch (risk) {
    case 'ZAYIN': return 'success'
    case 'TETH': return 'default'
    case 'HE': return 'warning'
    case 'WAW': return 'danger'
    case 'ALEPH': return 'danger'
    default: return 'default'
  }
}

const announcements = [
  { source: 'Sephirah', text: '今日配额充足，请合理分配工作。' },
  { source: '情报部', text: '异想体 O-01-04 情绪状态不稳定，建议加强观察。' },
  { source: '福利部', text: '新 E.G.O. 武器已到库，请到装备部领取。' },
]
</script>

<style scoped>
.office-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--space-md);
}

.quota-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.stat-row {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.stat-label {
  color: var(--lc-text-secondary);
  font-family: var(--font-body);
  font-size: 14px;
}

.stat-value {
  color: var(--lc-text-primary);
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: 600;
}

.stat-value.danger {
  color: var(--lc-red);
}

.success-icon {
  color: var(--lc-green);
}

.alert-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.alert-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ego-overview,
.personnel-overview {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.overview-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--lc-text-secondary);
}

.abno-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.abno-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) 0;
  border-bottom: 1px solid var(--lc-border);
}

.abno-row:last-child {
  border-bottom: none;
}

.abno-id {
  font-family: var(--font-mono);
  color: var(--lc-text-muted);
  font-size: 13px;
  min-width: 60px;
}

.abno-name {
  color: var(--lc-text-primary);
  font-family: var(--font-body);
  font-size: 14px;
  flex: 1;
}

.abno-q {
  font-family: var(--font-mono);
  color: var(--lc-yellow);
  font-size: 13px;
  font-weight: 600;
}

.announcements {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.announcement-item {
  display: flex;
  gap: var(--space-sm);
  padding: var(--space-sm);
  border-left: 3px solid var(--lc-yellow);
  background: rgba(240, 192, 64, 0.04);
}

.ann-source {
  font-family: var(--font-mono);
  color: var(--lc-yellow);
  font-size: 12px;
  white-space: nowrap;
}

.ann-text {
  color: var(--lc-text-secondary);
  font-family: var(--font-body);
  font-size: 13px;
  line-height: 1.5;
}
</style>
