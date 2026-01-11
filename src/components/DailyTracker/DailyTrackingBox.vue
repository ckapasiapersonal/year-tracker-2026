<template>
  <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
    <!-- Header -->
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-xl font-bold text-black dark:text-white">Daily Notes</h3>
      <div class="text-sm text-gray-500">{{ todayFormatted }}</div>
    </div>

    <!-- Input Area -->
    <div class="mb-6 relative">
      <input
        v-model="newItemText"
        @keydown.enter="addItem"
        type="text"
        placeholder="Type a note or expense (e.g. '200 Lunch')"
        class="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white"
      />
      <button
        @click="addItem"
        class="absolute right-2 top-2 rounded-md bg-brand-500 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-brand-600"
      >
        Add
      </button>
      <p class="mt-2 text-xs text-gray-400">
        Tip: Start with a number to log an expense (e.g., "500 Taxi").
      </p>
    </div>

    <!-- One Unified List -->
    <div class="space-y-3">
      <div
        v-for="item in currentItems"
        :key="item.id"
        class="group flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 transition hover:border-gray-200 dark:border-gray-800 dark:bg-white/[0.02] dark:hover:border-gray-700"
      >
        <!-- Time -->
        <div class="w-12 shrink-0 text-xs font-medium text-gray-400">
          {{ item.time }}
        </div>

        <!-- Content -->
        <div class="flex-1" :class="item.isEditing ? '' : 'cursor-pointer'" @click="!item.isEditing && startEditing(item)">
          <input
            v-if="item.isEditing"
            v-model="item.text"
            @blur="stopEditing(item)"
            @keydown.enter="stopEditing(item)"
            class="w-full bg-transparent text-sm font-medium text-gray-800 outline-none dark:text-white"
            autoFocus
          />
          <div v-else class="flex items-center justify-between">
             <span class="text-sm font-medium text-gray-800 dark:text-white">
                {{ item.text }}
             </span>
             <span v-if="item.amount" class="text-xs font-bold text-red-500">
                -₹{{ item.amount }}
             </span>
          </div>
        </div>

        <!-- Delete Action -->
        <button
          @click="deleteItem(item.id)"
          class="opacity-0 transition group-hover:opacity-100 text-gray-400 hover:text-red-500"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      </div>

      <div v-if="currentItems.length === 0" class="text-center py-8 text-sm text-gray-400">
        No notes yet.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTracker } from '@/composables/useTracker'

const { addDailyEntry, getEntriesByDate, deleteDailyEntry: deleteItem } = useTracker()

const newItemText = ref('')
const todayStr = new Date().toISOString().split('T')[0]
const todayFormatted = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', weekday: 'short' })

const currentItems = computed(() => getEntriesByDate(todayStr).reverse()) // Newest first

const addItem = () => {
    const raw = newItemText.value.trim()
    if (!raw) return

    // Smart Parsing
    // Check if starts with amount: "200 Lunch"
    const financeMatch = raw.match(/^(\d+)(\s+(.*))?$/)
    
    let text = raw
    let amount = 0
    let category = 'general'

    if (financeMatch) {
         amount = parseInt(financeMatch[1])
         text = financeMatch[3] ? financeMatch[3].trim() : 'Expense'
         category = 'finance'
    }

    addDailyEntry({
        text,
        category,
        amount: amount || undefined,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: todayStr
    })

    newItemText.value = ''
}

const startEditing = (item: any) => {
    item.isEditing = true
}

const stopEditing = (item: any) => {
    item.isEditing = false
}
</script>
