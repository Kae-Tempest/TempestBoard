// composables/useSystemTheme.js
export function useSystemTheme() {
  const isDark = ref(false)

  onMounted(() => {
    // Check if prefers-color-scheme is supported
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    // Set initial value
    isDark.value = mediaQuery.matches

    // Listen for changes
    const handleChange = (e) => {
      isDark.value = e.matches
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    }
    // Clean up
    onUnmounted(() => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      }
    })
  })

  return {
    isDark,
    theme: computed(() => isDark.value ? 'dark' : 'light')
  }
}