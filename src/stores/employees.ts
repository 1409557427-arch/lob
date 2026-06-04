import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Agent {
  id: string; name: string; status: 'idle' | 'working' | 'panicked' | 'dead' | 'absent'
  fortitude: number; prudence: number; temperance: number; justice: number
  weapon: { name: string; grade: string; damageType: string; source: string } | null
  suit: { name: string; grade: string; resists: { red: number; white: number; black: number; pale: number }; source: string } | null
  experience: number
}

export const useEmployeesStore = defineStore('employees', () => {
  const agents = ref<Agent[]>([
    { id: 'a1', name: 'Agent Alpha', status: 'idle', fortitude: 2, prudence: 3, temperance: 1, justice: 2, weapon: { name: '忏悔', grade: 'ZAYIN', damageType: 'WHITE', source: 'O-03-03' }, suit: { name: '基础制服', grade: 'ZAYIN', resists: { red: 1.0, white: 1.2, black: 0.8, pale: 1.0 }, source: '标准配备' }, experience: 45 },
    { id: 'a2', name: 'Agent Beta', status: 'idle', fortitude: 3, prudence: 2, temperance: 2, justice: 1, weapon: null, suit: { name: '基础制服', grade: 'ZAYIN', resists: { red: 1.0, white: 1.0, black: 1.0, pale: 1.0 }, source: '标准配备' }, experience: 30 },
    { id: 'a3', name: 'Agent Gamma', status: 'idle', fortitude: 1, prudence: 2, temperance: 3, justice: 2, weapon: null, suit: null, experience: 15 },
  ])
  const clerks = ref([{ id: 'c1', name: 'Clerk 01', status: 'active' as const }, { id: 'c2', name: 'Clerk 02', status: 'active' as const }])
  return { agents, clerks }
})
