<template>
  <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
    <div class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h3 class="text-xl font-bold text-black dark:text-white">
        Hourly Habit Tracker (2026)
      </h3>
      <div class="flex items-center gap-4">
          <h3 class="text-xl font-bold text-black dark:text-white">
            Hourly Habit Tracker (2026)
          </h3>
          <button @click="showAmendModal = true" class="text-xs text-blue-500 hover:text-blue-700 underline">
            Amend
          </button>
      </div>
      
      <!-- Category Legend / Selector -->
      <div class="flex flex-wrap gap-2">
        <button
          @click="selectedCategory = 'eraser'"
          class="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all border"
          :class="selectedCategory === 'eraser' ? 'bg-gray-500 text-white border-gray-500' : 'text-gray-500 border-gray-300 dark:border-gray-600 dark:text-gray-400'"
        >
          Eraser
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="selectedCategory = cat.id"
          class="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all text-white border"
          :style="{ 
              backgroundColor: selectedCategory === cat.id ? cat.color : 'transparent',
              borderColor: cat.color,
              color: selectedCategory === cat.id ? '#FFF' : cat.color
          }"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>

    <!-- Month Navigation -->
    <div class="mb-4 flex items-center justify-between border-b pb-2 dark:border-gray-700">
        <button @click="changeMonth(-1)" class="text-gray-500 hover:text-brand-500">
            &larr; Prev
        </button>
        <span class="font-bold text-black dark:text-white">{{ currentMonthName }} 2026</span>
        <button @click="changeMonth(1)" class="text-gray-500 hover:text-brand-500">
            Next &rarr;
        </button>
    </div>

    <!-- The Grid -->
    <div class="overflow-x-auto">
      <div class="min-w-[800px]">
        <!-- Header Row (Hours) -->
        <div class="flex">
            <div class="w-24 shrink-0 p-2 text-xs font-bold text-gray-500">Date</div>
            <div v-for="hour in 24" :key="hour" class="flex-1 text-center text-[10px] font-bold text-gray-400">
                {{ formatHour(hour - 1) }}
            </div>
            <div class="w-16 shrink-0 p-2 text-center text-xs font-bold text-gray-500">Save</div>
        </div>

        <!-- Data Rows (Days) -->
        <div class="max-h-[500px] overflow-y-auto custom-scrollbar space-y-[1px]">
            <div 
                v-for="day in daysInMonth" 
                :key="day.dateStr" 
                class="flex items-center hover:bg-gray-50 dark:hover:bg-white/[0.02] relative"
                :class="{'opacity-75': isDayLocked(day.dateStr)}"
            >
                <!-- Date Label -->
                <div class="w-24 shrink-0 p-1 text-xs font-medium text-gray-700 dark:text-gray-300 border-r border-gray-100 dark:border-gray-700">
                    {{ day.displayDate }} <span class="text-[10px] text-gray-400 ml-1">{{ day.dayName }}</span>
                </div>

                <!-- Hour Cells -->
                <!-- Overlay if locked to prevent interaction -->
                <div v-if="isDayLocked(day.dateStr)" class="absolute inset-0 left-24 right-16 z-10 cursor-not-allowed bg-gray-100/10" title="Day is locked. Use Amend to edit."></div>

                <div 
                    v-for="hour in 24" 
                    :key="hour"
                    @mousedown="!isDayLocked(day.dateStr) && handleMouseDown(day.dateStr, hour -1)"
                    @mouseenter="!isDayLocked(day.dateStr) && handleMouseEnter(day.dateStr, hour -1)"
                    class="flex-1 h-6 cursor-pointer border-r border-gray-100 dark:border-gray-700 transition-colors duration-75 text-[8px] flex items-center justify-center text-white/50"
                    :class="getCellClass(day.dateStr, hour - 1)"
                    :style="getCellStyle(day.dateStr, hour - 1)"
                >
                  <!-- Optional: Show hour number faintly if empty? No, keep it clean like image -->
                </div>
                
                <!-- Save/Lock Button -->
                 <div class="w-16 shrink-0 flex items-center justify-center border-l border-gray-100 dark:border-gray-700 h-6">
                    <button 
                        v-if="!isDayLocked(day.dateStr) && day.dateStr < new Date().toISOString().split('T')[0]"
                        @click="handleSaveDay(day.dateStr)"
                        class="text-[10px] px-2 py-0.5 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                        Save
                    </button>
                    <span v-else-if="isDayLocked(day.dateStr)" class="text-xs text-gray-400">
                        🔒
                    </span>
                 </div>
            </div>
        </div>
      </div>
    </div>
    
    <!-- Amend Modal -->
    <div v-if="showAmendModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div class="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 class="mb-4 text-lg font-bold text-gray-900 dark:text-white">Amend Past Date</h3>
            <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Select a date to unlock for editing. You can only amend 1 day prior if previously saved.
            </p>
            
            <div class="mb-4">
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                <input 
                    type="date" 
                    v-model="amendDate"
                    class="w-full rounded border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:text-white"
                />
            </div>
            
            <div class="flex justify-end gap-2">
                <button 
                    @click="showAmendModal = false"
                    class="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                    Cancel
                </button>
                <button 
                    @click="confirmAmend"
                    class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                    Unlock & Edit
                </button>
            </div>
        </div>
    </div>



        <p class="mt-4 text-xs text-gray-400 text-center">
        Click or drag across cells to paint your day. Log what you did every hour.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTracker } from '@/composables/useTracker'

const { 
    gridData, 
    updateGridCell, 
    saveDay, 
    unlockDay, 
    isDayLocked: checkDayLocked 
} = useTracker()

// --- Configuration ---
const { categories: storeCategories } = useTracker()
// To handle the computed/ref nature if necessary, or just use directly
// Store returns a Ref.
const categories = computed(() => storeCategories.value.map(c => ({
    ...c,
    // Map store 'color' (hex) to bgClass/textClass logic if needed. 
    // The existing component uses tailwind classes (bg-gray-700). 
    // The new system uses HEX codes. We need to adapt the template style binding.
    // For now, let's keep it simple: Use inline styles for dynamic colors in the template.
    // But wait, the template uses :class="cat.bgClass". I need to change template to use :style.
    activeClass: '', // Placeholder, will handle in template
    bgClass: '', // Placeholder
    textClass: 'text-white' // Default text color
})))

const selectedCategory = ref('work')
const currentMonth = ref(0) // 0 = Jan
const isDrawing = ref(false)

// Amend Logic
const showAmendModal = ref(false)
const amendDate = ref('')

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const currentMonthName = computed(() => monthNames[currentMonth.value])

const daysInMonth = computed(() => {
    const year = 2026
    const month = currentMonth.value
    const date = new Date(year, month, 1)
    const days = []

    while (date.getMonth() === month) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' }) // India Locale
        const displayDate = `${date.getDate()}/${month + 1}`

        days.push({ dateStr, displayDate, dayName })
        date.setDate(date.getDate() + 1)
    }
    return days
})

// --- Methods ---

const isDayLocked = (dateStr: string) => {
    return checkDayLocked(dateStr)
}

// Save Logic 
// Direct save as per user request (no confirmation)
const handleSaveDay = (dateStr: string) => {
    saveDay(dateStr)
}

const confirmAmend = () => {
    if (!amendDate.value) return
    
    if (checkDayLocked(amendDate.value)) {
        // Unlock it
        unlockDay(amendDate.value)
        showAmendModal.value = false
        
        // Optional: Navigate to that month?
        const [y, m, d] = amendDate.value.split('-').map(Number)
        if (y === 2026) {
           currentMonth.value = m - 1
        }
        
    } else {
        alert('This day is not locked, you can already edit it.')
        showAmendModal.value = false 
    }
}

const formatHour = (h: number) => {
    // 12am, 1am ... 12pm, 1pm
    const ampm = h >= 12 ? 'pm' : 'am'
    const hours = h % 12 || 12
    return `${hours}${ampm}`
}

const getCellClass = (dateStr: string, hour: number) => {
    const cellValue = gridData.value[dateStr]?.[hour]
    if (!cellValue) return 'bg-gray-100 dark:bg-gray-800 border-r border-gray-100 dark:border-gray-800' 
    
    // Add border to colored cells for grid visibility
    const cat = categories.value.find(c => c.id === cellValue)
    return cat ? '' : 'bg-gray-400' // Return empty class if we have custom color, fallback if not
}

const getCellStyle = (dateStr: string, hour: number) => {
    const cellValue = gridData.value[dateStr]?.[hour]
    if (!cellValue) return {}
    
    const cat = categories.value.find(c => c.id === cellValue)
    if (cat) return { backgroundColor: cat.color }
    return {}
}

const paintCell = (dateStr: string, hour: number) => {
    updateGridCell(dateStr, hour, selectedCategory.value)
}

// Mouse Interactions for "Drag Painting"
const handleMouseDown = (dateStr: string, hour: number) => {
    isDrawing.value = true
    paintCell(dateStr, hour)
    window.addEventListener('mouseup', handleMouseUp)
}

const handleMouseEnter = (dateStr: string, hour: number) => {
    if (isDrawing.value) {
        paintCell(dateStr, hour)
    }
}

const handleMouseUp = () => {
    isDrawing.value = false
    // Remove listener
    window.removeEventListener('mouseup', handleMouseUp)
}

const changeMonth = (delta: number) => {
    let newMonth = currentMonth.value + delta
    if (newMonth < 0) newMonth = 0
    if (newMonth > 11) newMonth = 11
    currentMonth.value = newMonth
}
</script>

<style scoped>
/* Custom Scrollbar for the grid specifically */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}
</style>
