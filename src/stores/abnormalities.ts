import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Abnormality {
  id: string; name: string; subjectId: string; riskLevel: 'ZAYIN' | 'TETH' | 'HE' | 'WAW' | 'ALEPH'
  qliphothCounter: number; maxQliphoth: number; observationLevel: number; maxObservation: number
  workPreferences: Record<string, number>
  attackType: string; weaknesses: string[]; resistances: string[]
  description: string; story: string; currentWork: string | null; assignedAgent: string | null
}

export const useAbnormalitiesStore = defineStore('abnormalities', () => {
  const abnormalities = ref<Abnormality[]>([
    { id: 'ab1', name: '忏悔', subjectId: 'O-03-03', riskLevel: 'ZAYIN', qliphothCounter: 3, maxQliphoth: 3, observationLevel: 0, maxObservation: 4, workPreferences: { Instinct: 1, Insight: 3, Attachment: 4, Repression: 0 }, attackType: 'WHITE', weaknesses: [], resistances: ['RED'], description: '附着于十字架上的巨大骷髅，头戴荆棘冠冕。以人们对话中流露的恶意为食。浮在地面上方约 2 米处。偶尔能听到颌骨开合的声音。', story: '员工被指派向异想体忏悔其罪过。等级 1 或 2 的忏悔导致能量小幅度增长。在一次等级 3 的忏悔实验中，一道强光闪过，整个设施停电，员工失去了约 6 年的记忆。', currentWork: null, assignedAgent: null },
  ])

  const selectedId = ref<string | null>(null)
  const selected = computed(() => abnormalities.value.find(a => a.id === selectedId.value) ?? null)

  return { abnormalities, selectedId, selected }
})
