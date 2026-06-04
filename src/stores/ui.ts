import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(false)
  const dockExpanded = ref(true)
  const dockHeight = ref(280)
  const toasts = ref<{ id: number; message: string; variant: 'info' | 'success' | 'warning' | 'error' }[]>([])
  let toastId = 0

  function toggleSidebar() { sidebarCollapsed.value = !sidebarCollapsed.value }
  function toggleDock() { dockExpanded.value = !dockExpanded.value }

  function showToast(message: string, variant: 'info' | 'success' | 'warning' | 'error' = 'info') {
    const id = ++toastId
    toasts.value.push({ id, message, variant })
    setTimeout(() => dismissToast(id), 3500)
  }

  function dismissToast(id: number) { toasts.value = toasts.value.filter(t => t.id !== id) }
  return { sidebarCollapsed, dockExpanded, dockHeight, toasts, toggleSidebar, toggleDock, showToast, dismissToast }
})
