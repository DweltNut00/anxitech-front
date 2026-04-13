// Utilities
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const loading = ref()

  const default_title = ref()
  const default_subtitle = ref()
  
  const encabezado = ref()
  const getEncabezado = computed(() => encabezado.value)

  const getDefaultTitle = computed(() => default_title.value)
  const getDefaultSubtitle = computed(() => default_subtitle.value)

  const isLoading = computed(() => loading.value)
  
  function setEncabezado(value) {
    encabezado.value = value
  }

  function setDefaultTitle(value) {
    default_title.value = value
  }

  function setDefaultSubtitle(value) {
    default_subtitle.value = value
  }

  function setLoading(value) {
    loading.value = value
  }

  return { default_title, default_subtitle, getDefaultTitle, getDefaultSubtitle, setDefaultTitle, setDefaultSubtitle, getEncabezado, setEncabezado, setLoading, isLoading }
})