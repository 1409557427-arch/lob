<template>
  <div class="terminal-page">
    <h1 class="page-title">AI 终端</h1>
    <div class="terminal-container" ref="terminalRef">
      <div class="terminal-output">
        <div v-for="msg in chatStore.messages" :key="msg.id" class="terminal-line">
          <span :class="msg.role === 'user' ? 'terminal-prompt--user' : 'terminal-prompt--angela'">
            {{ msg.role === 'user' ? '>' : 'ANGELA>' }}
          </span>
          <span>{{ msg.content }}</span>
        </div>
        <div v-if="chatStore.messages.length === 0 && !isStreaming" class="terminal-line terminal-line--dim">
          <span class="terminal-prompt--angela">ANGELA></span>
          <span>终端已连接。输入指令开始管理设施。</span>
        </div>
        <div v-if="isStreaming" class="terminal-line">
          <span class="terminal-prompt--angela">ANGELA></span>
          <span>{{ streamText }}<span class="terminal-cursor">_</span></span>
        </div>
      </div>
      <div class="terminal-input-row">
        <span class="terminal-prompt--user">></span>
        <input id="terminal-full-input" v-model="inputText" @keydown.enter="sendCmd" :disabled="isStreaming" placeholder="输入指令..." autofocus />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useChatStore } from '../../stores/chat'
import { useFacilityStore } from '../../stores/facility'
import { useAbnormalitiesStore } from '../../stores/abnormalities'
import { useEmployeesStore } from '../../stores/employees'
import { useApiClient } from '../../composables/useApiClient'
import { ANGELA_SYSTEM_PROMPT } from '../../data/angela-prompt'

const chatStore = useChatStore()
const facility = useFacilityStore()
const abnoStore = useAbnormalitiesStore()
const empStore = useEmployeesStore()
const api = useApiClient()

const inputText = ref('')
const isStreaming = ref(false)
const streamText = ref('')
const terminalRef = ref<HTMLElement | null>(null)

function buildContext(): string {
  const lines: string[] = []
  lines.push('Day ' + facility.day + ' | 能量 ' + facility.energyCollected + '/' + facility.energyQuota + ' | Trumpet ' + (facility.trumpetLevel > 0 ? String(facility.trumpetLevel) : '正常'))
  empStore.agents.forEach(a => { lines.push('  ' + a.name + ' - ' + (a.status === 'idle' ? '待命' : '工作中')) })
  abnoStore.abnormalities.forEach(a => { lines.push('  ' + a.subjectId + ' ' + a.name + ' [' + a.riskLevel + ']') })
  return lines.join('\n')
}

function sendCmd() {
  const cmd = inputText.value.trim()
  if (!cmd || isStreaming.value) return
  chatStore.addMessage({ id: crypto.randomUUID(), role: 'user', content: cmd, timestamp: Date.now() })
  inputText.value = ''
  isStreaming.value = true
  streamText.value = ''
  const context = buildContext()
  const apiMessages = [
    { role: 'system', content: ANGELA_SYSTEM_PROMPT },
    { role: 'system', content: context },
    ...chatStore.messages.slice(0, 20).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: cmd },
  ]
  api.sendMessage(
    apiMessages,
    (partial) => { streamText.value = partial; scrollToBottom() },
    (full) => {
      chatStore.addMessage({ id: crypto.randomUUID(), role: 'assistant', content: full, timestamp: Date.now() })
      streamText.value = ''
      isStreaming.value = false
      scrollToBottom()
    },
    (err) => { streamText.value = err; isStreaming.value = false }
  )
}

function scrollToBottom() {
  nextTick(() => { if (terminalRef.value) terminalRef.value.scrollTop = terminalRef.value.scrollHeight })
}

onMounted(() => { const el = document.getElementById('terminal-full-input'); if (el) el.focus() })
onUnmounted(() => { api.abort() })
</script>

<style scoped>
.terminal-page { display: flex; flex-direction: column; gap: var(--space-md); height: 100%; }
.terminal-container { display: flex; flex-direction: column; flex: 1; background: var(--lc-terminal); border: 1px solid var(--lc-border); clip-path: polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px); min-height: 60vh; }
.terminal-output { flex: 1; overflow-y: auto; padding: var(--space-md); font-family: var(--font-mono); font-size: var(--text-sm); color: var(--lc-text-terminal); line-height: 1.7; }
.terminal-line { margin-bottom: 2px; white-space: pre-wrap; }
.terminal-line--dim { opacity: 0.5; font-style: italic; }
.terminal-prompt--user { color: var(--lc-yellow); margin-right: var(--space-sm); user-select: none; }
.terminal-prompt--angela { color: var(--lc-green); margin-right: var(--space-sm); user-select: none; }
.terminal-cursor { animation: blink 1s step-end infinite; color: var(--lc-green); }
.terminal-input-row { display: flex; align-items: center; gap: var(--space-sm); padding: var(--space-sm) var(--space-md); border-top: 1px solid var(--lc-border); }
.terminal-input-row input { flex: 1; background: transparent; border: none; color: var(--lc-text-terminal); font-family: var(--font-mono); font-size: var(--text-sm); padding: 6px 0; }
.terminal-input-row input::placeholder { color: var(--lc-text-muted); }
.terminal-input-row input:focus { border: none; outline: none; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
</style>
