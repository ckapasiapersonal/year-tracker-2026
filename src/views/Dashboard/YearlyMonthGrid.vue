<template>
  <div class="rounded border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.02]">
    <h4 class="mb-2 text-sm font-bold uppercase text-gray-500">{{ monthName }}</h4>
    <div class="flex">
        <!-- Date Column -->
        <div class="w-4 shrink-0 space-y-[1px]">
            <div v-for="d in days" :key="d" class="h-2 text-[6px] text-gray-400 text-right pr-1">
                {{ d }}
            </div>
        </div>
        <!-- Grid -->
        <div class="flex-1 space-y-[1px]">
            <div v-for="d in days" :key="d" class="flex h-2 w-full gap-[1px]">
                 <!-- 24 Hour blocks -->
                 <div 
                    v-for="h in 24" 
                    :key="h" 
                    class="flex-1 rounded-[1px] bg-gray-200 dark:bg-gray-800"
                    :style="getCellStyle(d, h)"
                 ></div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTracker } from '@/composables/useTracker'

const props = defineProps<{
    month: number
    year: number
}>()

const { gridData, categories } = useTracker()

const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
const monthName = computed(() => monthNames[props.month])

const days = computed(() => {
    return new Date(props.year, props.month + 1, 0).getDate()
})

const getCellStyle = (day: number, hour: number) => {
    // Construct date string YYYY-MM-DD
    const dateStr = `${props.year}-${String(props.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    
    const catId = gridData.value[dateStr]?.[hour -1] // hour is 1-24 in loop, 0-23 in data
    if (catId) {
        const cat = categories.value.find(c => c.id === catId)
        if (cat) return { backgroundColor: cat.color }
    }
    return {}
}
</script>
