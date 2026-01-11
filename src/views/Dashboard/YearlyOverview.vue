<template>
  <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
    <TrackerHeader title="Year in Color: 2026 Overview" />

    <!-- 3 Columns Layout -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <!-- Column 1: Jan - Apr -->
        <div class="space-y-6">
            <YearlyMonthGrid v-for="m in [0, 1, 2, 3]" :key="m" :month="m" :year="2026" />
        </div>
        <!-- Column 2: May - Aug -->
        <div class="space-y-6">
            <YearlyMonthGrid v-for="m in [4, 5, 6, 7]" :key="m" :month="m" :year="2026" />
        </div>
        <!-- Column 3: Sep - Dec -->
        <div class="space-y-6">
            <YearlyMonthGrid v-for="m in [8, 9, 10, 11]" :key="m" :month="m" :year="2026" />
        </div>
    </div>

    <!-- Analytics Section -->
    <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <!-- Legend / Table -->
        <div class="rounded border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 class="mb-4 text-sm font-bold uppercase text-gray-500">Distribution of Hours by Category</h3>
            <div class="space-y-1 text-xs">
                <div class="flex items-center justify-between border-b border-gray-200 px-2 py-1 font-bold dark:border-gray-700">
                    <span>Legend</span>
                    <span>Count</span>
                </div>
                <div v-for="stat in yearlyStats" :key="stat.id" class="flex items-center justify-between px-2 py-1 hover:bg-black/5 dark:hover:bg-white/5 relative">
                    <div class="flex items-center gap-2">
                        <span class="h-3 w-3 rounded-sm" :style="{ backgroundColor: stat.color }"></span>
                        <span class="font-medium text-black dark:text-white">{{ stat.label }}</span>
                    </div>
                    <span class="font-mono text-gray-600 dark:text-gray-400">{{ stat.count }}</span>
                </div>
            </div>
        </div>

        <!-- Donut Chart -->
        <div class="rounded border border-gray-200 bg-gray-50 p-4 flex flex-col items-center justify-center dark:border-gray-800 dark:bg-white/[0.03]">
             <h3 class="mb-4 text-sm font-bold uppercase text-gray-500">Distribution of Hours in 2026</h3>
             <div id="yearChart">
                 <apexchart
                  type="donut"
                  width="380"
                  :options="chartOptions"
                  :series="chartSeries"
                ></apexchart>
             </div>
             <p class="mt-4 text-center text-xs text-gray-400 max-w-sm">
                 On the spreadsheet, I also charted how many hours I spent doing what.
             </p>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TrackerHeader from '@/components/DailyTracker/TrackerHeader.vue'
import YearlyMonthGrid from './YearlyMonthGrid.vue'
import { useTracker } from '@/composables/useTracker'

const { getYearlyCategoryDistribution, categories: storeCategories } = useTracker()

const categories = computed(() => storeCategories.value) // Use store categories directly

const yearlyStats = computed(() => {
    const raw = getYearlyCategoryDistribution(2026)
    // Convert to array matching categories for chart
    return categories.value.map(c => ({
        ...c,
        count: raw[c.id] || 0
    }))
})

// Chart Data
const chartSeries = computed(() => yearlyStats.value.map(s => s.count))
const chartLabels = computed(() => yearlyStats.value.map(s => s.label))
const chartColors = computed(() => yearlyStats.value.map(s => s.color))

const chartOptions = computed(() => {
    return {
        chart: { type: 'donut', fontFamily: 'Satoshi, sans-serif' },
        colors: chartColors.value,
        labels: chartLabels.value,
        legend: { show: false },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        total: { show: true, label: 'Total Hours', formatter: (w: any) => {
                             return w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0)
                        }}
                    }
                }
            }
        },
        dataLabels: { enabled: false },
        responsive: [{ breakpoint: 640, options: { chart: { width: 280 } } }]
    }
})
</script>
