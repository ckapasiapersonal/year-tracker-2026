<template>
  <div class="flex flex-wrap items-center gap-2">
    <router-link 
        to="/" 
        class="rounded-md border px-4 py-2 text-sm font-medium transition-colors"
        :class="$route.path === '/' 
            ? 'bg-brand-500 text-white border-brand-500' 
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'"
    >
      Dashboard
    </router-link>

    <router-link 
        to="/yearly-overview" 
        class="rounded-md border px-4 py-2 text-sm font-medium transition-colors"
        :class="$route.path === '/yearly-overview' 
            ? 'bg-brand-500 text-white border-brand-500' 
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'"
    >
      Year in Color
    </router-link>

    <router-link 
        to="/major-things" 
        class="rounded-md border px-4 py-2 text-sm font-medium transition-colors"
        :class="$route.path === '/major-things' 
            ? 'bg-brand-500 text-white border-brand-500' 
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'"
    >
      Major Things
    </router-link>

    <router-link 
        to="/financial" 
        class="rounded-md border px-4 py-2 text-sm font-medium transition-colors"
        :class="$route.path === '/financial' 
            ? 'bg-brand-500 text-white border-brand-500' 
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'"
    >
      Financials
    </router-link>

    <router-link 
        to="/settings" 
        class="rounded-md border px-4 py-2 text-sm font-medium transition-colors"
        :class="$route.path === '/settings' 
            ? 'bg-brand-500 text-white border-brand-500' 
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'"
    >
      Settings
    </router-link>
  </div>
</template>

<script setup lang="ts">
// No script logic needed, relies on RouterLink active class logic manually handled for custom brand colors
</script>
