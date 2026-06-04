import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEgoStore = defineStore('ego', () => {
  const weapons = ref([
    { id: 'w1', name: '忏悔', grade: 'ZAYIN' as const, damageType: 'WHITE', source: 'O-03-03', requiredVirtue: 'Justice', requiredLevel: 1 },
    { id: 'w2', name: '荆棘之矛', grade: 'TETH' as const, damageType: 'RED', source: 'T-09-80', requiredVirtue: 'Fortitude', requiredLevel: 2 },
  ])
  const suits = ref([
    { id: 's1', name: '荆棘之盾', grade: 'HE' as const, resists: { red: 0.8, white: 1.4, black: 0.6, pale: 1.0 }, source: 'F-05-52', requiredVirtue: 'Fortitude', requiredLevel: 3 },
    { id: 's2', name: '基础制服', grade: 'ZAYIN' as const, resists: { red: 1.0, white: 1.2, black: 0.8, pale: 1.0 }, source: '标准配备', requiredVirtue: 'Prudence', requiredLevel: 1 },
  ])
  return { weapons, suits }
})
