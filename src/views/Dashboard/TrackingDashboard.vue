<template>
  <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
    <!-- Header -->
    <TrackerHeader title="Daily Overview" />

    <!-- Hourly Year Tracker (Timeline) -->
    <div class="mb-6">
        <HourlyYearTracker />
    </div>

    <!-- Daily Tracking Section -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:gap-7.5">
        <!-- Main Input Box (Span 2 cols on large screens) -->
        <div class="col-span-1 md:col-span-2 lg:col-span-2">
            <DailyTrackingBox />
        </div>

        <!-- Quick Summary Box (Placeholder for now) -->
        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-black dark:text-white">Active Accounts</h3>
                <router-link to="/financial-tracker" class="text-xs text-brand-500 hover:underline">Manage</router-link>
            </div>
            
            <div class="space-y-4">
                <!-- Net Worth -->
                <div class="flex items-center justify-between border-b border-gray-100 pb-2 dark:border-gray-800">
                    <span class="text-sm font-medium text-gray-500">Net Worth</span>
                    <span class="text-lg font-bold text-brand-500">{{ formatCurrency(netWorth) }}</span>
                </div>

                <!-- Monthly Spend -->
                <div class="flex items-center justify-between border-b border-gray-100 pb-2 dark:border-gray-800">
                    <span class="text-sm font-medium text-gray-500">Expense ({{ currentMonthName }})</span>
                    <span class="text-sm font-bold text-red-500">{{ formatCurrency(monthlySpend) }}</span>
                </div>

                <!-- Account List -->
                 <div class="space-y-2 pt-2">
                    <div v-for="acc in accountBalances" :key="acc.id" class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                             <span 
                                class="h-2 w-2 rounded-full"
                                :class="acc.type === 'credit' ? 'bg-red-500' : 'bg-brand-500'"
                             ></span>
                            <span class="text-xs text-gray-500">{{ acc.name }}</span>
                        </div>
                        <span class="text-xs font-medium text-black dark:text-white">{{ formatCurrency(acc.balance) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
      <!-- Monthly Tracker -->
      <div class="col-span-12">
           <MonthlyOverview />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TrackerHeader from '@/components/DailyTracker/TrackerHeader.vue'
import DailyTrackingBox from '@/components/DailyTracker/DailyTrackingBox.vue'
import HourlyYearTracker from '@/components/DailyTracker/HourlyYearTracker.vue'
import MonthlyOverview from '@/components/DailyTracker/MonthlyOverview.vue'
import { useTracker } from '@/composables/useTracker'
import { computed } from 'vue'

const { getNetBalance, getMonthlyFinance, accounts, balanceLogs } = useTracker()

const todayStr = new Date().toISOString().split('T')[0]
const currentMonthName = new Date().toLocaleString('default', { month: 'short' })

const netWorth = computed(() => getNetBalance(todayStr))

const monthlySpend = computed(() => {
    const d = new Date()
    return getMonthlyFinance(d.getMonth(), d.getFullYear())
})

const accountBalances = computed(() => {
    const log = balanceLogs.value[todayStr]
    // If no log for today, try fallback to last log? 
    // For simplicity, just show today or 0, OR fallback logic similar to FinancialTracker
    let activeLog = log
    if (!activeLog) {
         const sortedDates = Object.keys(balanceLogs.value).sort().reverse()
         const lastDate = sortedDates.find(d => d <= todayStr)
         if (lastDate) activeLog = balanceLogs.value[lastDate]
    }

    return accounts.value.map(acc => ({
        id: acc.id,
        name: acc.name,
        type: acc.type,
        balance: activeLog ? (activeLog[acc.id] || 0) : 0
    }))
})

const formatCurrency = (val: number) => {
    return '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

</script>
