<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, watch, computed } from 'vue'

type Theme = 'light' | 'dark'

const theme = ref<Theme>('dark')
const isInitialized = ref(false)

const isDarkMode = computed(() => true)

const toggleTheme = () => {
  // Disabled: Always Dark
  theme.value = 'dark'
}

onMounted(() => {
  // Always enforce dark
  theme.value = 'dark'
  document.documentElement.classList.add('dark')
  localStorage.setItem('theme', 'dark')
  isInitialized.value = true
})

watch([theme, isInitialized], () => {
   document.documentElement.classList.add('dark')
})

provide('theme', {
  isDarkMode,
  toggleTheme,
})
</script>

<script lang="ts">
import { inject } from 'vue'

export function useTheme() {
  const theme = inject('theme')
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return theme
}
</script>
