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
    { id: 'a1', name: 'Agent Alpha', status: 'idle', fortitude: 1, prudence: 1, temperance: 1, justice: 1, weapon: null, suit: null, experience: 0 },
  ])
  const clerks = ref<{ id: string; name: string; status: string }[]>([])
  return { agents, clerks }
})
