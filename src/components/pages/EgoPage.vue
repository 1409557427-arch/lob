<template>
  <div class="ego-page">
    <h1 class="page-title">E.G.O. 装备库</h1>

    <!-- Tab Buttons -->
    <div class="ego-tabs">
      <LCButton
        variant="ghost"
        :active="activeTab === 'weapons'"
        @click="activeTab = 'weapons'"
      >
        武器
      </LCButton>
      <LCButton
        variant="ghost"
        :active="activeTab === 'suits'"
        @click="activeTab = 'suits'"
      >
        防具
      </LCButton>
      <LCButton
        variant="ghost"
        :active="activeTab === 'extract'"
        @click="activeTab = 'extract'"
      >
        提取
      </LCButton>
    </div>

    <!-- Weapons Tab -->
    <div v-if="activeTab === 'weapons'" class="tab-content">
      <div class="ego-table">
        <div class="ego-table-header">
          <span>名称</span>
          <span>等级</span>
          <span>伤害</span>
          <span>来源</span>
          <span>需求</span>
        </div>
        <div
          v-for="w in egoStore.weapons"
          :key="w.id"
          class="ego-table-row"
        >
          <span class="ego-name">{{ w.name }}</span>
          <span><LCTag variant="default">{{ w.grade }}</LCTag></span>
          <span class="ego-damage">{{ w.damageType }}</span>
          <span class="ego-mono">{{ w.source }}</span>
          <span class="ego-requirement">{{ `${w.requiredVirtue} Lv.${w.requiredLevel}` }}</span>
        </div>
        <div v-if="egoStore.weapons.length === 0" class="ego-empty">
          暂无武器数据
        </div>
      </div>
    </div>

    <!-- Suits Tab -->
    <div v-if="activeTab === 'suits'" class="tab-content">
      <div class="ego-table">
        <div class="ego-table-header ego-suit-header">
          <span>名称</span>
          <span>等级</span>
          <span>RED</span>
          <span>WHITE</span>
          <span>BLACK</span>
          <span>PALE</span>
          <span>来源</span>
        </div>
        <div
          v-for="s in egoStore.suits"
          :key="s.id"
          class="ego-table-row ego-suit-row"
        >
          <span class="ego-name">{{ s.name }}</span>
          <span><LCTag variant="default">{{ s.grade }}</LCTag></span>
          <span :class="resistClass(s.resists.red)">{{ s.resists.red }}</span>
          <span :class="resistClass(s.resists.white)">{{ s.resists.white }}</span>
          <span :class="resistClass(s.resists.black)">{{ s.resists.black }}</span>
          <span :class="resistClass(s.resists.pale)">{{ s.resists.pale }}</span>
          <span class="ego-mono">{{ s.source }}</span>
        </div>
        <div v-if="egoStore.suits.length === 0" class="ego-empty">
          暂无防具数据
        </div>
      </div>
    </div>

    <!-- Extract Tab -->
    <div v-if="activeTab === 'extract'" class="tab-content">
      <LCCard title="从异想体提取原型">
        <div class="extract-section">
          <p class="extract-desc">
            选择观察等级达到2级以上的异想体，消耗PE-Box提取对应的E.G.O.装备原型。
          </p>
          <div class="extract-form">
            <select v-model="extractAbnoId" class="lc-select">
              <option value="">选择异想体...</option>
              <option
                v-for="abno in extractableAbnos"
                :key="abno.subjectId"
                :value="abno.subjectId"
              >{{ abno.subjectId }} {{ abno.name }}</option>
            </select>
            <LCButton
              variant="primary"
              :disabled="!extractAbnoId"
              @click="extractEgo"
            >
              <LCIcon name="hammer" :size="14" />
              提取 E.G.O.
            </LCButton>
          </div>
        </div>
      </LCCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEgoStore } from '../../stores/ego'
import { useAbnormalitiesStore } from '../../stores/abnormalities'
import { useUiStore } from '../../stores/ui'
import LCCard from '../shared/LCCard.vue'
import LCTag from '../shared/LCTag.vue'
import LCButton from '../shared/LCButton.vue'
import LCIcon from '../shared/LCIcon.vue'

const egoStore = useEgoStore()
const abnormalitiesStore = useAbnormalitiesStore()
const uiStore = useUiStore()

const activeTab = ref<string>('weapons')
const extractAbnoId = ref<string>('')

const extractableAbnos = computed(() =>
  abnormalitiesStore.abnormalities.filter(a => (a.observationLevel ?? 0) >= 2)
)

function resistClass(value: number): string {
  if (value < 1) return 'resist-low'
  if (value > 1) return 'resist-high'
  return 'resist-neutral'
}

function extractEgo() {
  const abno = abnormalitiesStore.abnormalities.find(a => a.subjectId === extractAbnoId.value)
  uiStore.showToast(`从 ${abno?.name ?? '未知异想体'} 提取E.G.O.需要消耗PE-Box，是否继续？`, 'warning')
}
</script>

<style scoped>
.ego-tabs {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.tab-content {
  width: 100%;
}

/* Table */
.ego-table {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--lc-border);
  border-radius: 4px;
  overflow: hidden;
}

.ego-table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  border-bottom: 1px solid var(--lc-border);
  font-family: var(--font-display);
  font-size: 11px;
  text-transform: uppercase;
  color: var(--lc-text-muted);
  padding: var(--space-sm) var(--space-md);
  background: var(--lc-surface);
  letter-spacing: 0.5px;
}

.ego-suit-header {
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1.5fr;
}

.ego-table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--lc-border);
  align-items: center;
}

.ego-suit-row {
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1.5fr;
}

.ego-table-row:last-child {
  border-bottom: none;
}

.ego-table-row:hover {
  background: rgba(240, 192, 64, 0.03);
}

.ego-name {
  font-family: var(--font-body);
  color: var(--lc-text-primary);
  font-size: 14px;
}

.ego-damage {
  font-family: var(--font-body);
  color: var(--lc-text-secondary);
  font-size: 13px;
}

.ego-mono {
  font-family: var(--font-mono);
  color: var(--lc-text-muted);
  font-size: 12px;
}

.ego-requirement {
  font-family: var(--font-body);
  color: var(--lc-text-secondary);
  font-size: 13px;
}

/* Resist Colors */
.resist-low {
  color: var(--lc-green);
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 600;
}

.resist-high {
  color: var(--lc-red);
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 600;
}

.resist-neutral {
  color: var(--lc-text-secondary);
  font-family: var(--font-mono);
  font-size: 14px;
}

.ego-empty {
  padding: var(--space-lg);
  text-align: center;
  color: var(--lc-text-muted);
  font-family: var(--font-body);
  font-size: 14px;
}

/* Extract Tab */
.extract-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.extract-desc {
  color: var(--lc-text-secondary);
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.extract-form {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.lc-select {
  background: var(--lc-surface);
  color: var(--lc-text-primary);
  border: 1px solid var(--lc-border);
  border-radius: 4px;
  padding: 8px var(--space-md);
  font-family: var(--font-body);
  font-size: 14px;
  outline: none;
  cursor: pointer;
  min-width: 280px;
}

.lc-select:focus {
  border-color: var(--lc-yellow);
}
</style>
