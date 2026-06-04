import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const api = ref({ baseUrl: 'https://api.openai.com/v1', apiKey: '', model: 'gpt-4o' })
  const uiMode = ref<'game' | 'chat'>('game')
  const thinkingDisplay = ref<'fold' | 'hide' | 'inline'>('fold')
  const activePresetId = ref<string | null>(null)
  const activeLorebookIds = ref<string[]>([])
  return { api, uiMode, thinkingDisplay, activePresetId, activeLorebookIds }
})
