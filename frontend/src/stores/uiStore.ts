import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(true)

  const setSidebarOpen = (value: boolean) => {
    sidebarOpen.value = value
  }

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  return { sidebarOpen, setSidebarOpen, toggleSidebar }
})
