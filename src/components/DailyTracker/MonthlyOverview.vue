<template>
  <div class="col-span-12 rounded-lg border border-gray-200 bg-white px-5 pt-7.5 pb-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:px-7.5 xl:col-span-8">
    <div class="mb-3 justify-between gap-4 sm:flex">
      <div>
        <h5 class="text-xl font-bold text-black dark:text-white">
          Monthly Analytics
        </h5>
      </div>
      <div>
        <!-- Format Date for Month Name -->
        <div class="relative z-20 inline-block">
             <span class="font-medium text-gray-500">{{ currentMonth }}</span>
        </div>
      </div>
    </div>

    <div class="mb-2">
      <div id="chartThree" class="mx-auto flex justify-center">
         <apexchart
          type="donut"
          width="380"
          :options="chartOptions"
          :series="chartSeries"
        ></apexchart>
      </div>
    </div>
    
    <div class="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        <div class="w-full px-8 sm:w-1/2">
            <div class="flex w-full items-center">
                <span class="mr-2 block h-3 w-full max-w-3 rounded-full bg-blue-500"></span>
                <p class="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                    <span> Total Expense </span>
                    <span> ₹{{ totalExpense }} </span>
                </p>
            </div>
        </div>
        <div class="w-full px-8 sm:w-1/2">
             <div class="flex w-full items-center">
                <span class="mr-2 block h-3 w-full max-w-3 rounded-full bg-green-500"></span>
                <p class="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                    <span> Tasks Logged </span>
                    <span> {{ totalTasks }} </span>
                </p>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTracker } from '@/composables/useTracker'

const { dailyEntries, financeCategories } = useTracker()

const currentMonth = computed(() => {
    return new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
})

// Calculate Stats for Current Month
const currentMonthEntries = computed(() => {
    const now = new Date()
    return dailyEntries.value.filter(e => {
        const d = new Date(e.date)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
})

const totalExpense = computed(() => {
    return currentMonthEntries.value
       .filter(e => e.category === 'finance' || financeCategories.value.some(c => c.toLowerCase() === e.category.toLowerCase()))
       .reduce((acc, curr) => acc + (curr.amount || 0), 0)
})

const totalTasks = computed(() => {
     return currentMonthEntries.value.length
})

// Chart Data
const chartSeries = computed(() => {
    // Breakdown by category
    const cats: Record<string, number> = {}
    currentMonthEntries.value.forEach(e => {
         // Count occurrences for now (or amounts if finance)
         if(e.amount) {
            cats['Finance'] = (cats['Finance'] || 0) + e.amount
         } else {
             const key = e.category === 'general' ? 'Others' : e.category.charAt(0).toUpperCase() + e.category.slice(1)
             cats[key] = (cats[key] || 0) + 1
         }
    })
    // If empty, return dummy
    if (Object.keys(cats).length === 0) return [1]
    return Object.values(cats)
})

const chartLabels = computed(() => {
    const cats: Record<string, number> = {}
     currentMonthEntries.value.forEach(e => {
         if(e.amount) {
            cats['Finance'] = 1
         } else {
             const key = e.category === 'general' ? 'Others' : e.category.charAt(0).toUpperCase() + e.category.slice(1)
             cats[key] = 1
         }
    })
    if (Object.keys(cats).length === 0) return ['No Data']
    return Object.keys(cats)
})

const chartOptions = computed(() => {
    return {
        chart: { type: 'donut', fontFamily: 'Satoshi, sans-serif' },
        colors: ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF'],
        labels: chartLabels.value,
        legend: { show: false, position: 'bottom' },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        name: { show: true },
                        value: { show: true, formatter: (val: any) => val },
                        total: { show: true, label: 'Entries', formatter: () => {
                             return currentMonthEntries.value.length
                        }}
                    }
                }
            }
        },
        dataLabels: { enabled: false },
        responsive: [{ breakpoint: 2600, options: { chart: { width: 380 } } }, { breakpoint: 640, options: { chart: { width: 200 } } }]
    }
})
</script>
