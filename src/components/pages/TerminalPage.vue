<template>
  <div class="terminal-page">
    <h1 class="terminal-page__title">AI 终端</h1>
    <div class="terminal-container" ref="terminalRef">
      <div class="terminal-output">
        <!-- User messages -->
        <div
          v-for="msg in chatStore.messages"
          :key="msg.id"
          class="terminal-line"
        >
          <span class="terminal-prompt terminal-prompt--user">&gt;</span>
          <span class="terminal-content">{{ msg.content }}</span>
        </div>
        <!-- Assistant messages -->
        <div
          v-for="msg in assistantMessages"
          :key="'assistant-' + msg.id"
          class="terminal-line"
        >
          <span class="terminal-prompt terminal-prompt--angela">ANGELA&gt;</span>
          <span class="terminal-content">{{ msg.content }}</span>
        </div>
        <!-- Empty state -->
        <div
          v-if="chatStore.messages.length === 0 && !isStreaming"
          class="terminal-line"
        >
          <span class="terminal-prompt terminal-prompt--angela">ANGELA&gt;</span>
          <span class="terminal-content terminal-content--dim">终端已连接。输入指令开始管理设施。</span>
        </div>
        <!-- Streaming indicator -->
        <div v-if="isStreaming" class="terminal-line">
          <span class="terminal-prompt terminal-prompt--angela">ANGELA&gt;</span>
          <span class="terminal-content">{{ streamText }}<span class="terminal-cursor">_</span></span>
        </div>
      </div>
      <div class="terminal-input-row">
        <span class="terminal-prompt terminal-prompt--user">&gt;</span>
        <input
          id="terminal-full-input"
          class="terminal-input"
          v-model="inputText"
          autofocus
          @keydown.enter="sendCmd"
          placeholder="输入指令..."
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { useChatStore } from '../../stores/chat'
import { useFacilityStore } from '../../stores/facility'
import { useAbnormalitiesStore } from '../../stores/abnormalities'
import { useEmployeesStore } from '../../stores/employees'

const chatStore = useChatStore()
const facility = useFacilityStore()
const abnoStore = useAbnormalitiesStore()
const empStore = useEmployeesStore()

const inputText = ref('')
const isStreaming = ref(false)
const streamText = ref('')
const terminalRef = ref<HTMLElement | null>(null)
let streamTimer: ReturnType<typeof setInterval> | null = null

const assistantMessages = computed(() => {
  return chatStore.messages.filter((m: any) => m.role === 'assistant')
})

const mockReplies: Record<string, string> = {
  '状态': `BRANCH 47 设施状态报告\n能量收集: ${facility.energyCollected}/${facility.energyQuota}\nTrumpet等级: ${facility.trumpetLevel}\n异想体在收容: ${abnoStore.abnormalities.length}\n代理在岗: ${empStore.agents.filter(a => a.status !== 'dead').length}`,
  '查看': '请指定查看对象：异想体列表 / 员工列表 / E.G.O.库存 / 日志记录 / 部门地图。',
  '工作': '请指定代理名称和异想体编号。示例：指派 Agent Alpha 对 O-03-03 执行 Insight 工作。',
  '日志': '最近 3 条记录已加载。切换到日志页面查看完整时间线。',
}

function sendCmd() {
  const cmd = inputText.value.trim()
  if (!cmd || isStreaming.value) return

  chatStore.addMessage({ id: crypto.randomUUID(), role: 'user', content: cmd, timestamp: Date.now() })
  inputText.value = ''
  isStreaming.value = true
  streamText.value = ''

  const reply = getReply(cmd)

  let charIndex = 0
  streamTimer = setInterval(() => {
    if (charIndex < reply.length) {
      streamText.value += reply[charIndex]
      charIndex++
      scrollToBottom()
    } else {
      if (streamTimer) clearInterval(streamTimer)
      streamTimer = null
      chatStore.addMessage({ id: crypto.randomUUID(), role: 'assistant', content: streamText.value, timestamp: Date.now() })
      streamText.value = ''
      isStreaming.value = false
      scrollToBottom()
    }
  }, 30)
}

function getReply(cmd: string): string {
  const lower = cmd.toLowerCase()
  for (const [key, reply] of Object.entries(mockReplies)) {
    if (lower.includes(key.toLowerCase())) {
      if (key === '状态') {
        return `BRANCH 47 设施状态报告\n能量收集: ${facility.energyCollected}/${facility.energyQuota}\nTrumpet等级: ${facility.trumpetLevel}\n异想体在收容: ${abnoStore.abnormalities.length}\n代理在岗: ${empStore.agents.filter(a => a.status !== 'dead').length}`
      }
      return reply
    }
  }
  return `未识别的指令: "${cmd}"。\n可用指令示例：状态、查看、工作、日志。`
}

function scrollToBottom() {
  nextTick(() => {
    if (terminalRef.value) {
      terminalRef.value.scrollTop = terminalRef.value.scrollHeight
    }
  })
}

onMounted(() => {
  const el = document.getElementById('terminal-full-input')
  if (el) el.focus()
})
</script>

<style scoped>
.terminal-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--space-lg);
  background: var(--lc-surface);
}

.terminal-page__title {
  font-family: var(--font-display), 'Rajdhani', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--lc-text-primary);
  margin: 0 0 var(--space-md);
  letter-spacing: 0.04em;
}

.terminal-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--lc-terminal, #0a1a0f);
  border: 1px solid var(--lc-border);
  clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
  overflow: hidden;
  height: calc(100vh - 140px);
}

.terminal-output {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.terminal-line {
  display: flex;
  gap: 8px;
  font-family: var(--font-mono), 'JetBrains Mono', monospace;
  font-size: 0.8125rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.terminal-prompt {
  flex-shrink: 0;
  font-weight: 700;
  user-select: none;
}

.terminal-prompt--user {
  color: var(--lc-yellow, #eab308);
}

.terminal-prompt--angela {
  color: var(--lc-green, #22c55e);
}

.terminal-content {
  color: var(--lc-text-terminal, #33cc33);
}

.terminal-content--dim {
  color: var(--lc-text-muted);
  font-style: italic;
}

.terminal-cursor {
  animation: blink 1s step-end infinite;
  color: var(--lc-text-terminal, #33cc33);
  font-weight: 700;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.terminal-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: var(--space-sm) var(--space-md);
  border-top: 1px solid var(--lc-border);
  background: rgba(0, 0, 0, 0.3);
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-mono), 'JetBrains Mono', monospace;
  font-size: 0.8125rem;
  color: var(--lc-text-terminal, #33cc33);
  caret-color: var(--lc-text-terminal, #33cc33);
}

.terminal-input::placeholder {
  color: var(--lc-text-muted);
  opacity: 0.5;
}
</style>
