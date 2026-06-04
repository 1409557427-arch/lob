<template>
  <div class="abnormalities-page">
    <h1 class="page-title">异想体管理</h1>
    <div class="abno-layout">
      <!-- Left: List -->
      <div class="abno-list-panel">
        <LCCard
          v-for="abno in abnormalitiesStore.abnormalities"
          :key="abno.subjectId"
          :title="undefined"
          clickable
          :class="['abno-list-card', { selected: selectedId === abno.subjectId }]"
          @click="selectedId = abno.subjectId"
        >
          <div class="abno-list-row">
            <LCTag :variant="riskVariant(abno.riskLevel)">{{ abno.riskLevel }}</LCTag>
            <span class="abno-list-id">{{ abno.subjectId }}</span>
            <span class="abno-list-name">{{ abno.name }}</span>
            <span class="abno-list-q">Q{{ abno.qliphothCounter }}</span>
          </div>
        </LCCard>
      </div>

      <!-- Right: Detail -->
      <div class="abno-detail-panel">
        <template v-if="selectedAbno">
          <!-- Card 1: Basic Info -->
          <LCCard>
            <div class="detail-header">
              <div class="detail-title-row">
                <LCTag :variant="riskVariant(selectedAbno.riskLevel)">{{ selectedAbno.riskLevel }}</LCTag>
                <span class="detail-name">{{ selectedAbno.name }}</span>
                <span class="detail-id">{{ selectedAbno.subjectId }}</span>
              </div>
              <div class="detail-stats">
                <div class="detail-stat">
                  <span class="detail-stat-label">Qliphoth 计数器</span>
                  <span class="detail-stat-value q-value">Q{{ selectedAbno.qliphothCounter }}</span>
                </div>
                <div class="detail-stat">
                  <span class="detail-stat-label">观察等级</span>
                  <LCProgress
                    :value="selectedAbno.observationLevel"
                    :max="4"
                    variant="default"
                    :label="`Lv.${selectedAbno.observationLevel}`"
                  />
                </div>
              </div>
            </div>
          </LCCard>

          <!-- Card 2: Work Preferences -->
          <LCCard title="工作偏好">
            <div class="work-prefs">
              <div
                v-for="work in workTypes"
                :key="work.key"
                class="work-pref-row"
              >
                <span class="work-label">{{ work.label }}</span>
                <div class="work-track">
                  <div
                    class="work-fill"
                    :style="{ width: `${(getWorkValue(work.key) / 5) * 100}%` }"
                  />
                </div>
                <span class="work-value">{{ getWorkValue(work.key) }}/5</span>
              </div>
            </div>
          </LCCard>

          <!-- Card 3: Attack Info -->
          <LCCard title="攻击信息">
            <div class="attack-info">
              <div class="attack-row">
                <span class="attack-label">攻击类型</span>
                <LCTag variant="danger">{{ selectedAbno.attackType || '未知' }}</LCTag>
              </div>
              <div class="attack-row">
                <span class="attack-label">弱点</span>
                <div class="attack-tags">
                  <LCTag
                    v-for="w in selectedAbno.weaknesses"
                    :key="w"
                    variant="warning"
                  >{{ w }}</LCTag>
                  <span v-if="!selectedAbno.weaknesses?.length" class="no-data">--</span>
                </div>
              </div>
              <div class="attack-row">
                <span class="attack-label">抗性</span>
                <div class="attack-tags">
                  <LCTag
                    v-for="r in selectedAbno.resistances"
                    :key="r"
                    variant="success"
                  >{{ r }}</LCTag>
                  <span v-if="!selectedAbno.resistances?.length" class="no-data">--</span>
                </div>
              </div>
            </div>
          </LCCard>

          <!-- Card 4: Description & Story -->
          <LCCard :title="`描述·观察 Lv.${selectedAbno.observationLevel}`">
            <div class="description-section">
              <p class="desc-text">{{ selectedAbno.description }}</p>
              <details v-if="selectedAbno.observationLevel >= 2" class="story-details">
                <summary class="story-summary">查看异想体故事</summary>
                <div class="story-content">
                  {{ selectedAbno.story || '暂无故事记录。' }}
                </div>
              </details>
            </div>
          </LCCard>

          <!-- Actions Bar -->
          <LCCard>
            <div class="actions-bar">
              <select v-model="selectedAgentId" class="lc-select">
                <option value="">选择员工...</option>
                <option
                  v-for="agent in availableAgents"
                  :key="agent.id"
                  :value="agent.id"
                >{{ agent.name }}</option>
              </select>
              <select v-model="selectedWorkType" class="lc-select">
                <option value="">选择工作类型...</option>
                <option value="instinct">本能</option>
                <option value="insight">洞察</option>
                <option value="attachment">沟通</option>
                <option value="repression">压迫</option>
              </select>
              <LCButton
                variant="primary"
                :disabled="!selectedAgentId || !selectedWorkType || working"
                @click="executeWork"
              >
                {{ working ? '工作中...' : '执行工作' }}
              </LCButton>
            </div>
          </LCCard>

          <!-- Work Result -->
          <LCCard v-if="lastResult" title="工作记录">
            <div class="work-result" :class="{ 'work-success': lastResult.success, 'work-fail': !lastResult.success }">
              <div class="work-result-header">
                <span class="work-result-icon">{{ lastResult.success ? '✓' : '✗' }}</span>
                <span class="work-result-title">{{ lastResult.success ? '工作完成' : '工作未达标' }}</span>
                <LCTag :variant="lastResult.success ? 'success' : 'warning'">
                  {{ lastResult.success ? '成功' : '失败' }}
                </LCTag>
              </div>
              <div class="work-result-body">
                <div class="work-result-stats">
                  <div class="work-stat"><span class="work-stat-label">员工</span><span>{{ lastResult.agentName }}</span></div>
                  <div class="work-stat"><span class="work-stat-label">工作</span><span>{{ lastResult.workLabel }}</span></div>
                  <div class="work-stat"><span class="work-stat-label">能量</span><span class="work-stat-energy">+{{ lastResult.energyGain }}</span></div>
                  <div class="work-stat"><span class="work-stat-label">经验</span><span class="work-stat-exp">+{{ lastResult.experienceGain }}</span></div>
                </div>
                <div class="work-narrative">
                  <p v-for="(line, i) in lastResult.narrative" :key="i">{{ line }}</p>
                </div>
                <div v-if="lastResult.neBoxDamage" class="work-nebox">
                  <LCIcon name="AlertTriangle" :size="14" />
                  <span>NE-Box 生成！{{ lastResult.agentName }} 受到 {{ lastResult.damageAmount }} 点精神损伤</span>
                </div>
              </div>
            </div>
          </LCCard>
        </template>

        <!-- Empty State -->
        <template v-else>
          <div class="empty-state">
            <LCIcon name="AlertCircle" :size="48" class="empty-icon" />
            <span class="empty-text">选择左侧异想体查看详情</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAbnormalitiesStore } from '../../stores/abnormalities'
import { useEmployeesStore } from '../../stores/employees'
import { useFacilityStore } from '../../stores/facility'
import { useUiStore } from '../../stores/ui'
import { generateWorkResult, type WorkResult } from '../../data/work-narratives'
import LCCard from '../shared/LCCard.vue'
import LCTag from '../shared/LCTag.vue'
import LCProgress from '../shared/LCProgress.vue'
import LCButton from '../shared/LCButton.vue'
import LCIcon from '../shared/LCIcon.vue'

const abnormalitiesStore = useAbnormalitiesStore()
const employeesStore = useEmployeesStore()
const facility = useFacilityStore()
const uiStore = useUiStore()

const selectedId = ref<string>('')
const selectedAgentId = ref<string>('')
const selectedWorkType = ref<string>('')
const lastResult = ref<WorkResult | null>(null)
const working = ref(false)

const selectedAbno = computed(() =>
  abnormalitiesStore.abnormalities.find(a => a.subjectId === selectedId.value) ?? null
)

const availableAgents = computed(() =>
  employeesStore.agents.filter(a => a.status === 'idle')
)

const VIRTUE_MAP: Record<string, string> = {
  instinct: 'fortitude',
  insight: 'prudence',
  attachment: 'temperance',
  repression: 'justice',
}

const workTypes = [
  { key: 'instinct', label: '本能' },
  { key: 'insight', label: '洞察' },
  { key: 'attachment', label: '沟通' },
  { key: 'repression', label: '压迫' },
]

function getWorkValue(key: string): number {
  if (!selectedAbno.value?.workPreferences) return 0
  const mapped: Record<string, number> = {}
  for (const [k, v] of Object.entries(selectedAbno.value.workPreferences)) {
    mapped[k.toLowerCase()] = v
  }
  return mapped[key] ?? 0
}

function getVirtueLabel(key: string): string {
  const labels: Record<string, string> = { instinct: '勇气', insight: '谨慎', attachment: '自律', repression: '正义' }
  return labels[key] || key
}

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

function executeWork() {
  const agent = employeesStore.agents.find(a => a.id === selectedAgentId.value)
  if (!agent || !selectedAbno.value || !selectedWorkType.value) return

  working.value = true
  agent.status = 'working'

  const workPrefKey = selectedWorkType.value.charAt(0).toUpperCase() + selectedWorkType.value.slice(1)
  const workPref = selectedAbno.value.workPreferences[workPrefKey] || 1
  const virtueKey = VIRTUE_MAP[selectedWorkType.value]
  const agentVirtue = (agent as any)[virtueKey] || 1

  const result = generateWorkResult(
    agent.name,
    selectedAbno.value.name,
    selectedWorkType.value,
    workTypes.find(w => w.key === selectedWorkType.value)?.label || selectedWorkType.value,
    workPref,
    agentVirtue,
  )

  lastResult.value = result

  // Apply effects after short delay
  setTimeout(() => {
    facility.collectEnergy(result.energyGain)
    agent.experience += result.experienceGain
    agent.status = 'idle'
    working.value = false

    if (result.neBoxDamage) {
      uiStore.showToast(`${agent.name} 受到精神损伤 (-${result.damageAmount} SP)`, 'error')
    } else if (result.success) {
      uiStore.showToast(`${result.workLabel}工作成功！能量 +${result.energyGain}`, 'success')
    } else {
      uiStore.showToast(`${result.workLabel}工作失败 能量 +${result.energyGain}`, 'warning')
    }
  }, 2200)
}
</script>

<style scoped>
.abno-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--space-md);
  align-items: start;
}

.abno-list-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  max-height: calc(100vh - 160px);
  overflow-y: auto;
}

.abno-list-card {
  cursor: pointer;
  transition: border-color 0.2s;
}

.abno-list-card.selected {
  border-color: var(--lc-yellow);
}

.abno-list-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) 0;
}

.abno-list-id {
  font-family: var(--font-mono);
  color: var(--lc-text-muted);
  font-size: 12px;
  min-width: 55px;
}

.abno-list-name {
  color: var(--lc-text-primary);
  font-family: var(--font-body);
  font-size: 14px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.abno-list-q {
  font-family: var(--font-mono);
  color: var(--lc-yellow);
  font-size: 13px;
  font-weight: 600;
}

/* Detail Panel */
.abno-detail-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.detail-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.detail-title-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.detail-name {
  color: var(--lc-text-primary);
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
}

.detail-id {
  font-family: var(--font-mono);
  color: var(--lc-text-muted);
  font-size: 14px;
}

.detail-stats {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.detail-stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.detail-stat-label {
  color: var(--lc-text-secondary);
  font-family: var(--font-body);
  font-size: 13px;
}

.detail-stat-value.q-value {
  font-family: var(--font-mono);
  color: var(--lc-yellow);
  font-size: 24px;
  font-weight: 700;
}

/* Work Preferences */
.work-prefs {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.work-pref-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.work-label {
  font-family: var(--font-body);
  color: var(--lc-text-secondary);
  font-size: 13px;
  width: 90px;
  flex-shrink: 0;
}

.work-track {
  flex: 1;
  height: 4px;
  background: var(--lc-border);
  border-radius: 2px;
  overflow: hidden;
}

.work-fill {
  height: 100%;
  background: var(--lc-yellow);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.work-value {
  font-family: var(--font-mono);
  color: var(--lc-text-primary);
  font-size: 14px;
  font-weight: 600;
  min-width: 35px;
  text-align: right;
}

/* Attack Info */
.attack-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.attack-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.attack-label {
  font-family: var(--font-body);
  color: var(--lc-text-secondary);
  font-size: 13px;
  min-width: 80px;
}

.attack-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.no-data {
  color: var(--lc-text-muted);
  font-size: 13px;
}

/* Description */
.description-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.desc-text {
  color: var(--lc-text-secondary);
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.7;
  margin: 0;
}

.story-details {
  border-top: 1px solid var(--lc-border);
  padding-top: var(--space-md);
}

.story-summary {
  font-family: var(--font-body);
  color: var(--lc-yellow);
  font-size: 13px;
  cursor: pointer;
  user-select: none;
}

.story-content {
  margin-top: var(--space-sm);
  padding: var(--space-md);
  background: var(--lc-surface);
  border-radius: 4px;
  color: var(--lc-text-secondary);
  font-family: var(--font-body);
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
}

/* Work Result */
.work-result { display: flex; flex-direction: column; gap: var(--space-sm); }
.work-result-header { display: flex; align-items: center; gap: var(--space-sm); padding-bottom: var(--space-sm); border-bottom: 1px solid var(--lc-border); }
.work-result-icon { font-size: 20px; font-weight: 700; }
.work-success .work-result-icon { color: var(--lc-green); }
.work-fail .work-result-icon { color: var(--lc-red); }
.work-result-title { flex: 1; font-family: var(--font-display); font-size: var(--text-base); letter-spacing: 0.04em; }
.work-result-body { display: flex; flex-direction: column; gap: var(--space-sm); }
.work-result-stats { display: flex; flex-wrap: wrap; gap: var(--space-md); padding: var(--space-xs) 0; }
.work-stat { display: flex; align-items: center; gap: var(--space-xs); font-size: var(--text-sm); }
.work-stat-label { color: var(--lc-text-muted); font-family: var(--font-mono); font-size: var(--text-xs); }
.work-stat-energy { color: var(--lc-yellow); font-family: var(--font-mono); font-weight: 700; }
.work-stat-exp { color: var(--lc-blue); font-family: var(--font-mono); font-weight: 700; }
.work-narrative { background: var(--lc-surface); padding: var(--space-sm) var(--space-md); border-radius: 2px; font-size: var(--text-sm); color: var(--lc-text-secondary); line-height: 1.8; }
.work-narrative p { margin: 0; }
.work-narrative p + p { margin-top: var(--space-xs); }
.work-nebox { display: flex; align-items: center; gap: var(--space-xs); padding: var(--space-xs) var(--space-sm); background: var(--lc-red-glow); border: 1px solid var(--lc-red); color: var(--lc-red); font-size: var(--text-xs); font-family: var(--font-mono); border-radius: 2px; }

/* Actions Bar */
.actions-bar {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.lc-select {
  background: var(--lc-surface);
  color: var(--lc-text-primary);
  border: 1px solid var(--lc-border);
  border-radius: 4px;
  padding: 6px var(--space-sm);
  font-family: var(--font-body);
  font-size: 13px;
  outline: none;
  cursor: pointer;
}

.lc-select:focus {
  border-color: var(--lc-yellow);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px var(--space-lg);
  gap: var(--space-md);
}

.empty-icon {
  color: var(--lc-text-muted);
}

.empty-text {
  color: var(--lc-text-muted);
  font-family: var(--font-body);
  font-size: 15px;
}
</style>
