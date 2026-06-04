import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFacilityStore = defineStore('facility', () => {
  const energyQuota = ref(100)
  const energyCollected = ref(0)
  const trumpetLevel = ref(0)
  const breachedCount = ref(0)
  const activeBreach = ref(false)
  const branchId = ref(47)
  const day = ref(1)
  const completedDays = ref(0)
  const totalDeaths = ref(0)

  const energyPercent = computed(() => Math.min(100, Math.round((energyCollected.value / energyQuota.value) * 100)))
  const quotaMet = computed(() => energyCollected.value >= energyQuota.value)

  function collectEnergy(amount: number) { energyCollected.value = Math.min(energyQuota.value, energyCollected.value + amount) }
  function advanceDay() { day.value++; energyCollected.value = 0; completedDays.value++ }
  function setTrumpet(level: number) { trumpetLevel.value = Math.min(7, Math.max(0, level)); activeBreach.value = level > 0 }

  return { energyQuota, energyCollected, trumpetLevel, breachedCount, activeBreach, branchId, day, completedDays, totalDeaths, energyPercent, quotaMet, collectEnergy, advanceDay, setTrumpet }
})
