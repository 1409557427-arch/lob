<script setup lang="ts">
import { ref, nextTick, watch, onUnmounted } from 'vue'
import { useChatStore } from '../../stores/chat'
import { useUiStore } from '../../stores/ui'
import { useFacilityStore } from '../../stores/facility'
import type { ChatMessage } from '../../stores/chat'
import LCIcon from '../shared/LCIcon.vue'

const chat = useChatStore()
const ui = useUiStore()
const facility = useFacilityStore()

// ---- Input ----
const inputText = ref('')
const messagesEl = ref<HTMLElement | null>(null)
let mockTimer: ReturnType<typeof setInterval> | null = null
let mockTimeout: ReturnType<typeof setTimeout> | null = null

// ---- Mock AI response generator ----
function generateMockReply(userMessage: string): string {
  const msg = userMessage.toLowerCase()
  if (msg.includes('状态')) {
    return `设施状态报告：\n> 当前能源收集：${facility.energyCollected} / ${facility.energyQuota} (${facility.energyPercent}%)\n> 已过天数：${facility.completedDays}\n> 当前日：DAY ${facility.day}\n> 警报等级：${facility.trumpetLevel}\n> 突破异常数：${facility.breachedCount}\n> 员工死亡数：${facility.totalDeaths}\n\n主管，建议优先完成能源配额。`
  }
  if (msg.includes('查看') || msg.includes('帮助') || msg.includes('help')) {
    return `可用指令：\n> 「状态」— 查看设施当前状态\n> 「员工」— 查看员工列表\n> 「异想体」— 查看异想体信息\n> 「工作」— 指派员工工作\n> 「镇压」— 处理异常情况\n\n请输入指令，主管。`
  }
  if (msg.includes('你好') || msg.includes('hello') || msg.includes('hi')) {
    return '主管，您好。我是Angela，LC-47设施的AI终端。请下达指令。'
  }
  if (msg.includes('员工')) {
    return '员工管理系统已接入。您可以通过主管办公室查看所有员工状态、等级和E.G.O.装备。需要我列出当前员工吗？'
  }
  if (msg.includes('异想体') || msg.includes('异常')) {
    return '异想体数据库在线。当前设施内所有异想体信息可通过异想体管理页面查看。请注意高风险等级（WAW、ALEPH）个体的工作安排。'
  }
  return `收到指令：「${userMessage}」\n\n主管，我是Angela终端。我可以帮您：\n> 查看设施状态\n> 管理员工与E.G.O.\n> 监控异想体\n> 查看日志记录\n\n请具体说明您的需求。`
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

  // Add user message
  const userMsg: ChatMessage = {
    id: `msg-${Date.now()}-user`,
    role: 'user',
    content: text,
    timestamp: Date.now(),
  }
  chat.addMessage(userMsg)
  inputText.value = ''
  scrollToBottom()

  // Simulate AI streaming
  const reply = generateMockReply(text)
  simulateStreaming(reply)
}

// ---- Simulate streaming ----
function simulateStreaming(fullText: string) {
  chat.isStreaming = true
  chat.streamText = ''
  let idx = 0

  mockTimer = setInterval(() => {
    if (idx < fullText.length) {
      chat.streamText = fullText.slice(0, idx + 1)
      idx++
      scrollToBottom()
    } else {
      finishStreaming(fullText)
    }
  }, 30)
}

function finishStreaming(fullText: string) {
  clearMockTimers()
  chat.isStreaming = false

  const assistantMsg: ChatMessage = {
    id: `msg-${Date.now()}-assistant`,
    role: 'assistant',
    content: fullText,
    timestamp: Date.now(),
  }
  chat.addMessage(assistantMsg)
  chat.streamText = ''
  scrollToBottom()
}

function clearMockTimers() {
  if (mockTimer) { clearInterval(mockTimer); mockTimer = null }
  if (mockTimeout) { clearTimeout(mockTimeout); mockTimeout = null }
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
  clearMockTimers()
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
      <!-- Empty state -->
      <div v-if="chat.messages.length === 0 && !chat.isStreaming" class="dock-empty">
        <p>Angela 在线。输入指令开始管理设施。</p>
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
  align-items: center;
  min-height: 100%;
}

.dock-empty p {
  color: var(--lc-text-muted);
  font-style: italic;
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
