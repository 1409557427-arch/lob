<script setup lang="ts">
import { ref, nextTick, onUnmounted } from 'vue'
import { useChatStore } from '../../stores/chat'
import { useUiStore } from '../../stores/ui'
import { useFacilityStore } from '../../stores/facility'
import { useAbnormalitiesStore } from '../../stores/abnormalities'
import { useEmployeesStore } from '../../stores/employees'
import { useApiClient } from '../../composables/useApiClient'
import { ANGELA_SYSTEM_PROMPT } from '../../data/angela-prompt'
import type { ChatMessage } from '../../stores/chat'
import LCIcon from '../shared/LCIcon.vue'

const chat = useChatStore()
const ui = useUiStore()
const facility = useFacilityStore()
const abnormalities = useAbnormalitiesStore()
const employees = useEmployeesStore()
const api = useApiClient()

// ---- Input ----
const inputText = ref('')
const messagesEl = ref<HTMLElement | null>(null)

// ---- Build context for Angela ----
function buildContext(): string {
  const agents = employees.agents.map(a =>
    `  ${a.name} — ${a.status === 'idle' ? '待命' : a.status === 'working' ? '工作中' : a.status === 'panicked' ? '恐慌中' : '已死亡'}
    美德: 勇气 ${a.fortitude} 谨慎 ${a.prudence} 自律 ${a.temperance} 正义 ${a.justice}
    武器: ${a.weapon?.name || '无'} / 防具: ${a.suit?.name || '基础制服'}`
  ).join('\n')

  const abnos = abnormalities.abnormalities.map(a =>
    `  ${a.subjectId} ${a.name} — ${a.riskLevel}
    Q计数器: ${a.qliphothCounter}/${a.maxQliphoth}
    工作偏好: Instinct ${a.workPreferences.Instinct} Insight ${a.workPreferences.Insight} Attachment ${a.workPreferences.Attachment} Repression ${a.workPreferences.Repression}
    攻击: ${a.attackType}`
  ).join('\n')

  return `当前设施状态:
Day ${facility.day} | 能量 ${facility.energyCollected}/${facility.energyQuota}${facility.quotaMet ? ' (配额已满)' : ''} | Trumpet ${facility.trumpetLevel > 0 ? '等级' + facility.trumpetLevel : '正常'}${facility.activeBreach ? ' ⚠突破中' : ''}

员工:
${agents}

异想体:
${abnos}`
}

// ---- Scroll to bottom ----
async function scrollToBottom() {
  await nextTick()
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}

// ---- Send message ----
function handleSend() {
  const text = inputText.value.trim()
  if (!text || chat.isStreaming) return

  const userMsg: ChatMessage = {
    id: `msg-${Date.now()}-user`,
    role: 'user',
    content: text,
    timestamp: Date.now(),
  }
  chat.addMessage(userMsg)
  inputText.value = ''
  scrollToBottom()

  // Build messages array for API
  const context = buildContext()
  const apiMessages = [
    { role: 'system', content: ANGELA_SYSTEM_PROMPT },
    { role: 'system', content: context },
    ...chat.messages.slice(0, 20).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: text },
  ]

  // Start streaming from API
  chat.isStreaming = true
  chat.streamText = ''

  api.sendMessage(
    apiMessages,
    (partial) => { chat.streamText = partial; scrollToBottom() },
    (full) => {
      chat.isStreaming = false
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: full,
        timestamp: Date.now(),
      }
      chat.addMessage(assistantMsg)
      chat.streamText = ''
      scrollToBottom()
    },
    (err) => {
      chat.isStreaming = false
      const errMsg: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: `[错误] ${err}`,
        timestamp: Date.now(),
      }
      chat.addMessage(errMsg)
      chat.streamText = ''
      scrollToBottom()
    }
  )
}

// ---- Handle Enter key ----
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

// ---- Resize ----
const isResizing = ref(false)
const resizeStartY = ref(0)
const resizeStartH = ref(0)

function onResizeMouseDown(e: MouseEvent) {
  isResizing.value = true
  resizeStartY.value = e.clientY
  resizeStartH.value = ui.dockHeight
  document.addEventListener('mousemove', onResizeMouseMove)
  document.addEventListener('mouseup', onResizeMouseUp)
  e.preventDefault()
}

function onResizeMouseMove(e: MouseEvent) {
  if (!isResizing.value) return
  const dy = resizeStartY.value - e.clientY
  const newH = Math.min(600, Math.max(160, resizeStartH.value + dy))
  ui.dockHeight = newH
}

function onResizeMouseUp() {
  isResizing.value = false
  document.removeEventListener('mousemove', onResizeMouseMove)
  document.removeEventListener('mouseup', onResizeMouseUp)
}

// ---- Clear chat ----
function handleClear() {
  chat.clearMessages()
}

// ---- Lifecycle ----
onUnmounted(() => {
  api.abort()
  document.removeEventListener('mousemove', onResizeMouseMove)
  document.removeEventListener('mouseup', onResizeMouseUp)
})
</script>

<template>
  <div
    v-if="ui.dockExpanded"
    class="lc-ai-dock"
    :style="{ height: ui.dockHeight + 'px', left: ui.sidebarCollapsed ? '56px' : 'var(--sidebar-width)' }"
  >
    <!-- Resize handle -->
    <div class="dock-resize-handle" @mousedown="onResizeMouseDown" />

    <!-- Header -->
    <div class="dock-header">
      <div class="dock-header-left">
        <span class="dock-screws">
          <span class="screw-dot" />
          <span class="screw-dot" />
          <span class="screw-dot" />
        </span>
        <span class="dock-title">AI 终端 · Angela</span>
      </div>
      <div class="dock-header-right">
        <button
          class="dock-header-btn"
          title="清空对话"
          @click="handleClear"
        >
          <LCIcon name="Trash2" :size="14" />
        </button>
        <button
          class="dock-header-btn"
          title="收起终端"
          @click="ui.toggleDock()"
        >
          <LCIcon name="Minus" :size="14" />
        </button>
      </div>
    </div>

    <!-- Messages area -->
    <div ref="messagesEl" class="dock-messages">
      <!-- Empty state: Angela greeting from character card -->
      <div v-if="chat.messages.length === 0 && !chat.isStreaming" class="dock-empty">
        <p>早上好，主管。</p>
        <p>今日的能量配额为 Lv.4 — {{ facility.energyQuota }} 单位。</p>
        <p>目前设施内存有 4 个异想体。风险管理等级概况：ZAYIN ×1，TETH ×1，HE ×1，WAW ×1。</p>
        <p>请在开始工作前确认各部门的人员分配。记住，无论发生什么，能量配额必须完成。</p>
        <p class="dock-empty-motto">祝您管理顺利。</p>
        <p class="dock-empty-hint">— Angela</p>
      </div>

      <!-- Rendered messages -->
      <div
        v-for="msg in chat.messages"
        :key="msg.id"
        class="dock-msg"
        :class="msg.role"
      >
        <span class="msg-role">{{ msg.role === 'user' ? '主管' : 'ANGELA' }}</span>
        <span class="msg-sep">|</span>
        <span class="msg-content">{{ msg.content }}</span>
      </div>

      <!-- Streaming state -->
      <div v-if="chat.isStreaming" class="dock-msg assistant streaming">
        <span class="msg-role">ANGELA</span>
        <span class="msg-sep">|</span>
        <span class="msg-content">
          {{ chat.streamText }}
          <span class="stream-cursor">_</span>
        </span>
      </div>
    </div>

    <!-- Input bar -->
    <div class="dock-input-bar">
      <span class="input-chevron">&gt;</span>
      <input
        v-model="inputText"
        class="dock-input"
        type="text"
        placeholder="输入指令..."
        :disabled="chat.isStreaming"
        @keydown="onKeydown"
      />
      <button
        class="dock-send-btn"
        :disabled="!inputText.trim() || chat.isStreaming"
        @click="handleSend"
      >
        发送
      </button>
    </div>
  </div>
</template>

<style scoped>
.lc-ai-dock {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 95;
  background: var(--lc-terminal);
  border-top: 1px solid rgba(80, 200, 120, 0.25);
  display: flex;
  flex-direction: column;
  transition: left var(--duration-normal) var(--ease-out-expo);
}

/* ---- Resize handle ---- */
.dock-resize-handle {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  transform: translateY(-50%);
  cursor: ns-resize;
  z-index: 5;
}

.dock-resize-handle::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 3px;
  border-radius: 2px;
  background: var(--lc-border-light);
  transition: background var(--duration-fast), width var(--duration-fast);
}

.dock-resize-handle:hover::after {
  background: var(--lc-green);
  width: 60px;
}

/* ---- Header ---- */
.dock-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-xs) var(--space-md);
  border-bottom: 1px solid rgba(80, 200, 120, 0.12);
  flex-shrink: 0;
  user-select: none;
}

.dock-header-left {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.dock-screws {
  display: flex;
  gap: 4px;
}

.screw-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--lc-text-muted);
}

.dock-title {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  color: var(--lc-text-terminal);
  letter-spacing: 0.05em;
}

.dock-header-right {
  display: flex;
  gap: 2px;
}

.dock-header-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 2px;
  color: var(--lc-text-muted);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.dock-header-btn:hover {
  background: rgba(80, 200, 120, 0.08);
  border-color: rgba(80, 200, 120, 0.2);
  color: var(--lc-text-terminal);
}

/* ---- Messages ---- */
.dock-messages {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-sm) var(--space-md);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: 1.7;
}

.dock-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  min-height: 100%;
  gap: 6px;
}

.dock-empty p {
  color: var(--lc-text-secondary);
  line-height: 1.7;
}
.dock-empty p:first-child {
  font-weight: 600;
  color: var(--lc-yellow);
}
.dock-empty-motto {
  color: var(--lc-text-terminal) !important;
  font-style: italic;
  margin-top: 4px !important;
}
.dock-empty-hint {
  color: var(--lc-text-muted) !important;
  font-size: 10px;
}

.dock-msg {
  margin-bottom: var(--space-xs);
  white-space: pre-wrap;
  word-break: break-word;
}

.msg-role {
  font-weight: 600;
}

.dock-msg.user .msg-role {
  color: var(--lc-yellow);
}

.dock-msg.assistant .msg-role {
  color: var(--lc-text-terminal);
}

.msg-sep {
  color: var(--lc-border-light);
  margin: 0 var(--space-xs);
  user-select: none;
}

.msg-content {
  color: var(--lc-text-secondary);
}

.dock-msg.assistant .msg-content {
  color: var(--lc-text-terminal);
}

/* ---- Streaming cursor ---- */
.stream-cursor {
  color: var(--lc-text-terminal);
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* ---- Input bar ---- */
.dock-input-bar {
  display: flex;
  align-items: center;
  padding: var(--space-xs) var(--space-md);
  border-top: 1px solid rgba(80, 200, 120, 0.12);
  gap: var(--space-sm);
  flex-shrink: 0;
}

.input-chevron {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--lc-text-terminal);
  font-weight: 700;
  user-select: none;
  flex-shrink: 0;
}

.dock-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: var(--space-xs) 0;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--lc-text-terminal);
  outline: none;
}

.dock-input::placeholder {
  color: var(--lc-text-muted);
}

.dock-input:focus {
  border-color: transparent;
}

.dock-send-btn {
  flex-shrink: 0;
  padding: var(--space-xs) var(--space-md);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--lc-text-terminal);
  background: rgba(80, 200, 120, 0.1);
  border: 1px solid rgba(80, 200, 120, 0.25);
  border-radius: 2px;
  cursor: pointer;
  transition: all var(--duration-fast);
}

.dock-send-btn:hover:not(:disabled) {
  background: rgba(80, 200, 120, 0.18);
  border-color: rgba(80, 200, 120, 0.4);
}

.dock-send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
