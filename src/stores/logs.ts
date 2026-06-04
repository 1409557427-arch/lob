import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface LogEntry { id: string; day: number; type: 'info' | 'success' | 'warning' | 'error'; message: string; timestamp: number }

export const useLogsStore = defineStore('logs', () => {
  const entries = ref<LogEntry[]>([])
  return { entries }
})
