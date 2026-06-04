import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEgoStore = defineStore('ego', () => {
  const weapons = ref<{ id: string; name: string; grade: string; damageType: string; source: string; requiredVirtue: string; requiredLevel: number }[]>([])
  const suits = ref<{ id: string; name: string; grade: string; resists: { red: number; white: number; black: number; pale: number }; source: string; requiredVirtue: string; requiredLevel: number }[]>([])
  return { weapons, suits }
})
