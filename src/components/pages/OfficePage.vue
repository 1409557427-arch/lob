<template>
  <div class="office-page">
    <h1 class="page-title">主管办公室</h1>
    <div class="office-grid">
      <!-- 今日能量配额 -->
      <LCCard title="今日能量配额">
        <div class="quota-section">
          <LCProgress
            :value="facilityStore.energyCollected"
            :max="facilityStore.energyQuota"
            :variant="facilityStore.energyQuota - facilityStore.energyCollected > 0 ? 'default' : 'default'"
            :label="`${facilityStore.energyCollected} / ${facilityStore.energyQuota}`"
          />
          <div class="stat-row">
            <template v-if="facilityStore.energyQuota - facilityStore.energyCollected > 0">
              <span class="stat-label">剩余配额</span>
              <span class="stat-value">{{ facilityStore.energyQuota - facilityStore.energyCollected }}</span>
            </template>
            <template v-else>
              <span class="stat-label">配额已完成</span>
              <LCIcon name="CheckCircle" :size="16" class="success-icon" />
            </template>
          </div>
        </div>
      </LCCard>

      <!-- 警报状态 -->
      <LCCard title="警报状态" :danger="facilityStore.trumpetLevel > 0">
        <div class="alert-section">
          <div class="alert-row">
            <span class="stat-label">警报等级</span>
            <LCTag :variant="facilityStore.trumpetLevel > 0 ? 'danger' : 'default'">
              {{ facilityStore.trumpetLevel > 0 ? `等级 ${facilityStore.trumpetLevel}` : '无警报' }}
            </LCTag>
          </div>
          <div class="alert-row">
            <span class="stat-label">突破异想体</span>
            <span class="stat-value danger">{{ facilityStore.breachedCount }}</span>
          </div>
          <div class="alert-row">
            <span class="stat-label">员工死亡</span>
            <span class="stat-value danger">{{ facilityStore.totalDeaths }}</span>
          </div>
        </div>
      </LCCard>

      <!-- E.G.O. 库存概览 -->
      <LCCard title="E.G.O. 库存概览" clickable @click="$router.push('/ego')">
        <div class="ego-overview">
          <div class="overview-row">
            <LCIcon name="Sword" :size="18" />
            <span class="stat-label">武器</span>
            <span class="stat-value">{{ egoStore.weapons.length }}</span>
          </div>
          <div class="overview-row">
            <LCIcon name="Shield" :size="18" />
            <span class="stat-label">防具</span>
            <span class="stat-value">{{ egoStore.suits.length }}</span>
          </div>
        </div>
      </LCCard>

      <!-- 员工状态 -->
      <LCCard title="员工状态" clickable @click="$router.push('/personnel')">
        <div class="personnel-overview">
          <div class="overview-row">
            <LCIcon name="Users" :size="18" />
            <span class="stat-label">员工总数</span>
            <span class="stat-value">{{ employeesStore.agents.length }}</span>
          </div>
          <div class="overview-row">
            <LCIcon name="Coffee" :size="18" />
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
            <span class="abno-q">Q{{ abno.qliphothCounter }}</span>
          </div>
        </div>
      </LCCard>

      <!-- 本日公告 -->
      <LCCard title="本日公告">
        <div class="announcements">
          <div v-if="announcements.length === 0" class="announcement-empty">暂无公告</div>
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

      <!-- 操作区 -->
      <LCCard title="今日操作">
        <div class="action-section">
          <div class="action-row">
            <LCButton variant="ghost" icon="Zap" @click="collectWorkEnergy" :disabled="facilityStore.quotaMet">
              {{ facilityStore.quotaMet ? '今日配额已完成' : '模拟工作 (+30 能量)' }}
            </LCButton>
          </div>
          <div class="action-divider" />
          <div class="action-row">
            <LCButton
              variant="primary"
              icon="SkipForward"
              :disabled="!facilityStore.quotaMet"
              @click="endDay"
              class="end-day-btn"
            >
              结束这一天
            </LCButton>
            <span class="end-day-hint">完成能量配额后可结束今日工作</span>
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

import { useLogsStore } from '../../stores/logs'
import { useUiStore } from '../../stores/ui'
import LCButton from '../shared/LCButton.vue'

const facilityStore = useFacilityStore()
const abnormalitiesStore = useAbnormalitiesStore()
const employeesStore = useEmployeesStore()
const egoStore = useEgoStore()
const logsStore = useLogsStore()
const ui = useUiStore()

const idleCount = computed(() =>
  employeesStore.agents.filter(a => a.status === 'idle').length
)

function riskVariant(risk: string): string {
  switch (risk) {
    case 'ZAYIN': return 'default'
    case 'TETH': return 'default'
    case 'HE': return 'warning'
    case 'WAW': return 'danger'
    case 'ALEPH': return 'danger'
    default: return 'default'
  }
}

function collectWorkEnergy() {
  facilityStore.collectEnergy(30)
  logsStore.entries.push({
    id: crypto.randomUUID(),
    day: facilityStore.day,
    type: 'success',
    message: `能量收集 +30。当前 ${facilityStore.energyCollected}/${facilityStore.energyQuota}`,
    timestamp: Date.now()
  })
  if (facilityStore.quotaMet) {
    ui.showToast('今日配额已完成！可以结束这一天。', 'success')
  } else {
    ui.showToast('能量 +30 单位', 'info')
  }
}

function endDay() {
  if (!facilityStore.quotaMet) return
  const day = facilityStore.day
  facilityStore.advanceDay()
  logsStore.entries.push({
    id: crypto.randomUUID(),
    day: day,
    type: 'success',
    message: `Day ${day} 结束。配额已完成。`,
    timestamp: Date.now()
  })
  ui.showToast(`Day ${day} 结束！欢迎来到 Day ${facilityStore.day}`, 'success')
}

const announcements = [
  { source: 'Angela', text: '今日能量配额 ' + facilityStore.energyQuota + ' 单位。请合理分配工作。' },
  { source: '情报部', text: '异想体 ' + (abnormalitiesStore.abnormalities[0]?.subjectId || '---') + ' 情绪状态稳定，可按计划工作。' },
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

.action-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}
.action-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}
.action-divider {
  height: 1px;
  background: var(--lc-border);
}
.end-day-btn { min-width: 180px; }
.end-day-btn:not(:disabled) {
  background: var(--lc-yellow);
  color: var(--lc-deep);
  border-color: var(--lc-yellow);
  animation: end-day-glow 2s ease-in-out infinite;
}
@keyframes end-day-glow {
  0%, 100% { box-shadow: 0 0 8px var(--lc-yellow-glow); }
  50% { box-shadow: 0 0 24px rgba(240,192,64,0.5); }
}
.end-day-hint {
  font-size: var(--text-xs);
  color: var(--lc-text-muted);
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
