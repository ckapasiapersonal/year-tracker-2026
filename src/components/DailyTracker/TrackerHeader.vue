<template>
  <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <h2 class="text-title-md2 font-bold text-black dark:text-white">
      {{ title }}
    </h2>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <!-- Navigation Menu -->
        <TrackerNavigation />

        <!-- Date & Controls -->
        <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ currentDate }}
            </span>
            <button class="flex items-center gap-2 rounded bg-white px-3 py-1.5 text-sm font-medium shadow-card hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white">
            <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.6667 2.66666H12.6667V1.33333C12.6667 0.966663 12.3667 0.666663 12 0.666663C11.6333 0.666663 11.3333 0.966663 11.3333 1.33333V2.66666H4.66667V1.33333C4.66667 0.966663 4.36667 0.666663 4 0.666663C3.63333 0.666663 3.33333 0.966663 3.33333 1.33333V2.66666H1.33333C0.599999 2.66666 0 3.26666 0 4V14.6667C0 15.4 0.599999 16 1.33333 16H14.6667C15.4 16 16 15.4 16 14.6667V4C16 3.26666 15.4 2.66666 14.6667 2.66666ZM14.6667 14.6667H1.33333V5.33333H14.6667V14.6667Z" fill=""/>
            </svg>
            <span>Select Date</span>
            </button>

            <!-- User Info & Logout -->
            <div class="ml-2 flex items-center gap-2 border-l border-gray-200 pl-4 dark:border-gray-700" v-if="currentUser">
                <span class="text-sm font-bold text-black dark:text-white">{{ currentUser() }}</span>
                <button @click="logout" class="text-sm text-red-500 hover:underline">Logout</button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TrackerNavigation from './TrackerNavigation.vue'
import { useAuth } from '@/composables/useAuth'

defineProps<{
    title: string
}>()

const { logout, currentUser } = useAuth()

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
</script>
