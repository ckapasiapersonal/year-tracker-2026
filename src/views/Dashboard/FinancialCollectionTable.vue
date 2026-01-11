<template>
  <div class="rounded-lg border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
    <div class="px-4 py-4 sm:px-6">
      <h3 class="font-bold text-black dark:text-white">{{ title }} Tracker</h3>
    </div>
    
    <div class="max-w-full overflow-x-auto">
      <table class="w-full table-auto">
        <thead>
          <tr class="bg-gray-50 text-left dark:bg-gray-800">
            <th class="min-w-[120px] px-4 py-3 font-medium text-black dark:text-white">Date</th>
            <th class="min-w-[220px] px-4 py-3 font-medium text-black dark:text-white">Item</th>
            <th class="min-w-[120px] px-4 py-3 font-medium text-black dark:text-white">Price (Buy)</th>
            <th class="min-w-[120px] px-4 py-3 font-medium text-black dark:text-white">Sold</th>
            <th class="min-w-[120px] px-4 py-3 font-medium text-black dark:text-white">P/L</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <!-- Input Row -->
          <tr class="border-b border-gray-200 dark:border-gray-800">
             <td class="px-4 py-3">
                <input 
                    v-model="newDate" 
                    type="date" 
                    class="w-full rounded border border-gray-200 bg-transparent px-2 py-1 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
                />
             </td>
             <td class="px-4 py-3">
                <input 
                    v-model="newItem" 
                    type="text" 
                    placeholder="Item Name" 
                    class="w-full rounded border border-gray-200 bg-transparent px-2 py-1 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
             </td>
             <td class="px-4 py-3">
                 <input 
                    v-model="newPrice" 
                    type="number" 
                    placeholder="0.00" 
                    class="w-full rounded border border-gray-200 bg-transparent px-2 py-1 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
             </td>
             <td class="px-4 py-3">
                 <input 
                    v-model="newSold" 
                    type="number" 
                    placeholder="0.00" 
                    class="w-full rounded border border-gray-200 bg-transparent px-2 py-1 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
             </td>
             <td class="px-4 py-3">
                <span class="text-xs text-gray-400">Auto</span>
             </td>
             <td class="px-4 py-3">
                 <button 
                    @click="addItem" 
                    class="flex items-center justify-center rounded bg-brand-500 px-3 py-1 text-sm font-medium text-white hover:bg-brand-600"
                 >
                    Add
                 </button>
             </td>
          </tr>

          <!-- List Rows -->
          <tr v-for="item in sortedList" :key="item.id" class="border-b border-gray-200 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-boxdark">
             <td class="px-4 py-3 text-sm text-black dark:text-white">
                {{ item.date }}
             </td>
             <td class="px-4 py-3 text-sm text-black dark:text-white">
                {{ item.item }}
             </td>
             <td class="px-4 py-3 text-sm text-red-500 font-medium">
                {{ formatCurrency(item.price) }}
             </td>
             <td class="px-4 py-3 text-sm text-green-500 font-medium">
                {{ item.sold ? formatCurrency(item.sold) : '-' }}
             </td>
             <td class="px-4 py-3 text-sm font-bold" :class="getPLColor(item)">
                {{ getPL(item) }}
             </td>
             <td class="px-4 py-3 text-right">
                <button @click="removeCollectionItem(listKey, item.id)" class="text-gray-500 hover:text-red-500">
                    <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H2.21914C1.70352 2.47502 1.28164 2.8969 1.28164 3.41252C1.28164 3.92815 1.70352 4.35002 2.21914 4.35002V15.0281C2.21914 15.8719 2.89414 16.5469 3.73789 16.5469H14.2348C15.0785 16.5469 15.7535 15.8719 15.7535 15.0281V4.35002C16.2691 4.35002 16.691 3.92815 16.691 3.41252C16.691 2.8969 16.2691 2.47502 15.7535 2.47502H13.7535ZM7.90352 1.9969H10.0691V2.47502H7.90352V1.9969ZM14.2348 15.0281H3.73789V4.35002H14.2348V15.0281Z" fill=""/><path d="M6.22969 13.5656C6.51094 13.5656 6.74531 13.3313 6.74531 13.05V6.32812C6.74531 6.04688 6.51094 5.8125 6.22969 5.8125C5.94844 5.8125 5.71406 6.04688 5.71406 6.32812V13.05C5.71406 13.3313 5.94844 13.5656 6.22969 13.5656Z" fill=""/><path d="M11.7703 13.5656C12.0516 13.5656 12.2859 13.3313 12.2859 13.05V6.32812C12.2859 6.04688 12.0516 5.8125 11.7703 5.8125C11.4891 5.8125 11.2547 6.04688 11.2547 6.32812V13.05C11.2547 13.3313 11.4891 13.5656 11.7703 13.5656Z" fill=""/></svg>
                 </button>
             </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Summary Footer -->
    <div class="border-t border-gray-200 px-4 py-4 dark:border-gray-800">
        <div class="flex items-center justify-end gap-6 text-sm">
             <div class="flex flex-col text-right">
                <span class="text-gray-500">Total Spent</span>
                <span class="font-bold text-red-500">{{ formatCurrency(totalSpent) }}</span>
             </div>
             <div class="flex flex-col text-right">
                <span class="text-gray-500">Total Sold</span>
                <span class="font-bold text-green-500">{{ formatCurrency(totalSold) }}</span>
             </div>
              <div class="flex flex-col text-right">
                <span class="text-gray-500">Net P/L</span>
                <span class="font-bold text-lg" :class="totalPL >= 0 ? 'text-green-500' : 'text-red-500'">
                    {{ formatCurrency(totalPL) }}
                </span>
             </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTracker } from '@/composables/useTracker'

const props = defineProps<{
    title: string
    listKey: string
}>()

const { collectionItems, addCollectionItem, removeCollectionItem } = useTracker()

const list = computed(() => collectionItems.value[props.listKey] || [])

// Default to today
const newDate = ref(new Date().toISOString().split('T')[0])
const newItem = ref('')
const newPrice = ref('')
const newSold = ref('')

const addItem = () => {
    if (!newItem.value || !newPrice.value) return

    addCollectionItem(props.listKey, {
        date: newDate.value,
        item: newItem.value,
        price: parseFloat(newPrice.value),
        sold: newSold.value ? parseFloat(newSold.value) : null,
        isSold: !!newSold.value
    })

    // Reset fields (keeping date same)
    newItem.value = ''
    newPrice.value = ''
    newSold.value = ''
}

// Sorting: Most recent first
const sortedList = computed(() => {
    return [...list.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const formatCurrency = (val: number) => {
    return '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getPL = (item: any) => {
    if (!item.sold) return '-'
    const pl = item.sold - item.price
    return formatCurrency(pl)
}

const getPLColor = (item: any) => {
    if (!item.sold) return 'text-gray-400'
    return item.sold - item.price >= 0 ? 'text-green-500' : 'text-red-500'
}

// Stats
const totalSpent = computed(() => list.value.reduce((acc, curr) => acc + (curr.price || 0), 0))
const totalSold = computed(() => list.value.reduce((acc, curr) => acc + (curr.sold || 0), 0))
const totalPL = computed(() => totalSold.value - totalSpent.value) // Simple Total Sold - Total Cost? Or only realized? 
// Usually P/L for *Sold* items is better, but "Net P/L" often implies Portfolio items are unrealized losses?
// Let's stick to simple Cash Flow: Sold - Spent (which matches the "Result" concept in some trackers, or "Total Profit")
// Actually, simple Total Sold - Total Bought gives current cash position.
// If the user wants specific P/L on sold items, that's different.
// Let's go with Cash Flow (Total Sold - Total Spent) for the footer, but the row P/L is specific.
</script>
