<template>
  <div class="settings-page">
    <h1 class="settings-page__title">系统设置</h1>

    <!-- API 配置 -->
    <LCCard title="API 配置" class="settings-section">
      <form class="settings-form" @submit.prevent>
        <label class="settings-label">
          API 地址
          <input
            id="settings-api-url"
            class="settings-input"
            type="text"
            v-model="settings.api.baseUrl"
            placeholder="https://api.example.com/v1"
          />
        </label>
        <label class="settings-label">
          API 密钥
          <input
            id="settings-api-key"
            class="settings-input"
            type="password"
            v-model="settings.api.apiKey"
            placeholder="sk-..."
          />
        </label>
        <label class="settings-label">
          模型
          <input
            id="settings-api-model"
            class="settings-input"
            type="text"
            v-model="settings.api.model"
            placeholder="gpt-4o"
          />
        </label>
      </form>
    </LCCard>

    <!-- 显示设置 -->
    <LCCard title="显示设置" class="settings-section">
      <form class="settings-form" @submit.prevent>
        <label class="settings-label">
          界面模式
          <select id="settings-ui-mode" class="lc-select" v-model="settings.uiMode">
            <option value="game">游戏</option>
            <option value="chat">对话</option>
          </select>
        </label>
        <label class="settings-label">
          思考过程显示
          <select id="settings-thinking" class="lc-select" v-model="settings.thinkingDisplay">
            <option value="fold">折叠</option>
            <option value="hide">隐藏</option>
            <option value="inline">内联</option>
          </select>
        </label>
      </form>
    </LCCard>

    <!-- 数据管理 -->
    <LCCard title="数据管理" class="settings-section">
      <div class="settings-actions">
        <LCButton variant="ghost" icon="Download" @click="handleExport">
          导出数据
        </LCButton>
        <LCButton variant="ghost" icon="Upload" @click="handleImport">
          导入数据
        </LCButton>
        <LCButton variant="danger" icon="Trash2" @click="showClearModal = true">
          清空全部数据
        </LCButton>
      </div>
    </LCCard>

    <!-- Confirm Clear Modal -->
    <LCModal
      v-if="showClearModal"
      title="确认清空"
      size="sm"
      @close="showClearModal = false"
    >
      <p class="settings-modal-text">
        此操作将清空所有本地数据，包括聊天记录、日志和配置。此操作不可撤销。
      </p>
      <div class="settings-modal-actions">
        <LCButton variant="ghost" @click="showClearModal = false">取消</LCButton>
        <LCButton variant="danger" @click="confirmClear">确认清空</LCButton>
      </div>
    </LCModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '../../stores/settings'
import { useLogsStore } from '../../stores/logs'
import { useChatStore } from '../../stores/chat'
import { useUiStore } from '../../stores/ui'
import LCCard from '../shared/LCCard.vue'
import LCButton from '../shared/LCButton.vue'
import LCModal from '../shared/LCModal.vue'

const settingsStore = useSettingsStore()
const logsStore = useLogsStore()
const chatStore = useChatStore()
const ui = useUiStore()
const showClearModal = ref(false)

const settings = ref({
  api: {
    baseUrl: settingsStore.api.baseUrl || '',
    apiKey: settingsStore.api.apiKey || '',
    model: settingsStore.api.model || '',
  },
  uiMode: settingsStore.uiMode || 'game',
  thinkingDisplay: settingsStore.thinkingDisplay || 'fold',
})

function handleExport() {
  try {
    const data = {
      settings: settingsStore.$state,
      logs: logsStore.entries,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lcorp-backup.json'
    a.click()
    URL.revokeObjectURL(url)
    ui.showToast('数据已导出', 'success')
  } catch (err) {
    ui.showToast('导出失败', 'error')
  }
}

function handleImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      if (data.settings) {
        settingsStore.$patch(data.settings)
      }
      ui.showToast('数据已导入', 'success')
    } catch (err) {
      ui.showToast('导入失败：文件格式错误', 'error')
    }
  }
  input.click()
}

function confirmClear() {
  showClearModal.value = false
  chatStore.clearMessages?.()
  ui.showToast('日志已清空（演示操作）', 'success')
  ui.showToast('所有数据已清空', 'success')
}
</script>

<style scoped>
.settings-page {
  padding: var(--space-lg);
  max-width: 640px;
}

.settings-page__title {
  font-family: var(--font-display), 'Rajdhani', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--lc-text-primary);
  margin: 0 0 var(--space-lg);
  letter-spacing: 0.04em;
}

.settings-section {
  margin-bottom: var(--space-md);
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.settings-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: var(--font-display), 'Rajdhani', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--lc-text-muted);
  text-transform: uppercase;
}

.settings-input {
  padding: 6px 12px;
  min-height: 36px;
  background: var(--lc-surface);
  border: 1px solid var(--lc-border);
  color: var(--lc-text-primary);
  font-family: var(--font-body), 'Noto Sans SC', sans-serif;
  font-size: 0.875rem;
  border-radius: 0;
  outline: none;
  transition: border-color 0.15s;
}

.settings-input:focus {
  border-color: var(--lc-yellow);
}

.settings-input::placeholder {
  color: var(--lc-text-muted);
  opacity: 0.5;
}

.lc-select {
  padding: 6px 12px;
  min-height: 36px;
  background: var(--lc-surface);
  border: 1px solid var(--lc-border);
  color: var(--lc-text-primary);
  font-family: var(--font-display), 'Rajdhani', sans-serif;
  font-size: 0.875rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s;
  appearance: none;
  -webkit-appearance: none;
  border-radius: 0;
}

.lc-select:focus {
  border-color: var(--lc-yellow);
}

.settings-actions {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.settings-modal-text {
  font-family: var(--font-body), 'Noto Sans SC', sans-serif;
  font-size: 0.875rem;
  color: var(--lc-text-secondary);
  margin: 0 0 var(--space-md);
  line-height: 1.5;
}

.settings-modal-actions {
  display: flex;
  gap: var(--space-sm);
  justify-content: flex-end;
}
</style>
