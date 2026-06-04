import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ChatMessage { id: string; role: 'user' | 'assistant' | 'system'; content: string; timestamp: number; thinking?: string }

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([])
  const isStreaming = ref(false)
  const streamText = ref('')

  function addMessage(msg: ChatMessage) { messages.value.push(msg) }
  function clearMessages() { messages.value = [] }
  return { messages, isStreaming, streamText, addMessage, clearMessages }
})
