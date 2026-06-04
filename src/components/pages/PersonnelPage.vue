<template>
  <div class="personnel-page">
    <h1 class="page-title">员工管理</h1>

    <div class="agent-grid">
      <LCCard
        v-for="agent in employeesStore.agents"
        :key="agent.id"
        :title="agent.name"
        :class="['agent-card', { 'agent-dead': agent.status === 'dead' }]"
      >
        <div class="agent-status-row">
          <LCTag :variant="statusVariant(agent.status)">{{ statusLabel(agent.status) }}</LCTag>
          <span class="agent-exp">EXP {{ agent.experience ?? 0 }}</span>
        </div>

        <!-- Virtue Bars -->
        <div class="virtue-bars">
          <div class="virtue-row">
            <span class="virtue-key">FORT</span>
            <div class="virtue-track">
              <div
                class="virtue-fill"
                :style="{ width: `${((agent.fortitude ?? 0) / 120) * 100}%` }"
              />
            </div>
            <span class="virtue-val">Lv.{{ agent.fortitude ?? 1 }}</span>
          </div>
          <div class="virtue-row">
            <span class="virtue-key">PRUD</span>
            <div class="virtue-track">
              <div
                class="virtue-fill"
                :style="{ width: `${((agent.prudence ?? 0) / 120) * 100}%` }"
              />
            </div>
            <span class="virtue-val">Lv.{{ agent.prudence ?? 1 }}</span>
          </div>
          <div class="virtue-row">
            <span class="virtue-key">TEMP</span>
            <div class="virtue-track">
              <div
                class="virtue-fill"
                :style="{ width: `${((agent.temperance ?? 0) / 120) * 100}%` }"
              />
            </div>
            <span class="virtue-val">Lv.{{ agent.temperance ?? 1 }}</span>
          </div>
          <div class="virtue-row">
            <span class="virtue-key">JUST</span>
            <div class="virtue-track">
              <div
                class="virtue-fill"
                :style="{ width: `${((agent.justice ?? 0) / 120) * 100}%` }"
              />
            </div>
            <span class="virtue-val">Lv.{{ agent.justice ?? 1 }}</span>
          </div>
        </div>

        <!-- Equipment -->
        <div class="equipment-section">
          <div class="equip-row">
            <span class="equip-type">武器</span>
            <span class="equip-name">{{ agent.weapon?.name ?? '--' }}</span>
            <LCTag v-if="agent.weapon?.grade" variant="default" size="small">
              {{ agent.weapon.grade }}
            </LCTag>
          </div>
          <div class="equip-row">
            <span class="equip-type">防具</span>
            <span class="equip-name">{{ agent.suit?.name ?? '--' }}</span>
            <LCTag v-if="agent.suit?.grade" variant="default" size="small">
              {{ agent.suit.grade }}
            </LCTag>
          </div>
        </div>

        <!-- HP & SP status replaced with fortitude/prudence virtue bars above -->
      </LCCard>
    </div>

    <!-- 文职人员 Section -->
    <div class="clerks-section">
      <h2 class="section-title">文职人员</h2>
      <div class="clerk-summary">
        <LCCard>
          <div class="clerk-info">
            <div class="clerk-stat">
              <span class="clerk-label">在岗文员</span>
              <span class="clerk-value">{{ employeesStore.clerks.length }}</span>
            </div>
            <div class="clerk-names">
              <span
                v-for="clerk in employeesStore.clerks"
                :key="clerk.id"
                class="clerk-name"
              >{{ clerk.name }}</span>
              <span v-if="employeesStore.clerks.length === 0" class="no-clerks">暂无文职人员</span>
            </div>
          </div>
        </LCCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEmployeesStore } from '../../stores/employees'
import LCCard from '../shared/LCCard.vue'
import LCTag from '../shared/LCTag.vue'
import LCProgress from '../shared/LCProgress.vue'

const employeesStore = useEmployeesStore()

function statusVariant(status: string): string {
  switch (status) {
    case 'idle': return 'success'
    case 'working': return 'warning'
    case 'panicked': return 'danger'
    case 'dead': return 'default'
    default: return 'default'
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case 'idle': return '待命'
    case 'working': return '工作中'
    case 'panicked': return '恐慌'
    case 'dead': return '已死亡'
    default: return status
  }
}
</script>

<style scoped>
.agent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-md);
}

.agent-card {
  transition: opacity 0.2s;
}

.agent-card.agent-dead {
  opacity: 0.5;
}

.agent-status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-sm);
}

.agent-exp {
  font-family: var(--font-mono);
  color: var(--lc-text-muted);
  font-size: 13px;
}

/* Virtue Bars */
.virtue-bars {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: var(--space-md);
}

.virtue-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.virtue-key {
  font-family: var(--font-mono);
  color: var(--lc-text-secondary);
  font-size: 12px;
  width: 32px;
  flex-shrink: 0;
}

.virtue-track {
  flex: 1;
  height: 3px;
  background: var(--lc-border);
  border-radius: 2px;
  overflow: hidden;
}

.virtue-fill {
  height: 100%;
  background: var(--lc-yellow);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.virtue-val {
  font-family: var(--font-mono);
  color: var(--lc-text-muted);
  font-size: 12px;
  min-width: 36px;
  text-align: right;
}

/* Equipment */
.equipment-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-sm) 0;
  border-top: 1px solid var(--lc-border);
  border-bottom: 1px solid var(--lc-border);
  margin-bottom: var(--space-sm);
}

.equip-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.equip-type {
  font-family: var(--font-body);
  color: var(--lc-text-muted);
  font-size: 12px;
  min-width: 28px;
}

.equip-name {
  font-family: var(--font-body);
  color: var(--lc-text-primary);
  font-size: 13px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Clerks Section */
.clerks-section {
  margin-top: var(--space-lg);
}

.section-title {
  font-family: var(--font-display);
  color: var(--lc-text-primary);
  font-size: 22px;
  margin: 0 0 var(--space-md) 0;
}

.clerk-summary {
  max-width: 600px;
}

.clerk-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.clerk-stat {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.clerk-label {
  color: var(--lc-text-secondary);
  font-family: var(--font-body);
  font-size: 14px;
}

.clerk-value {
  font-family: var(--font-mono);
  color: var(--lc-text-primary);
  font-size: 18px;
  font-weight: 600;
}

.clerk-names {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.clerk-name {
  font-family: var(--font-body);
  color: var(--lc-text-secondary);
  font-size: 13px;
  padding: 2px var(--space-sm);
  background: var(--lc-surface);
  border-radius: 4px;
}

.no-clerks {
  color: var(--lc-text-muted);
  font-size: 13px;
}
</style>
