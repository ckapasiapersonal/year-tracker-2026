<template>
  <div class="space-y-6">
    <!-- Header -->
    <TrackerHeader title="Financial Overview 2026" />

    <!-- Section 1: Monthly Spend Tracker -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <!-- Monthly Table -->
        <div class="rounded-lg border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
             <div class="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
                <h3 class="font-bold text-black dark:text-white">Spend Tracker</h3>
             </div>
             <div class="p-4">
                 <table class="w-full text-sm">
                    <thead>
                        <tr class="text-left text-gray-500">
                            <th class="pb-2">Month</th>
                            <th class="pb-2 text-right">Amount</th>
                            <th class="pb-2 text-right">Avg/Day</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                        <tr v-for="m in monthlyData" :key="m.name">
                            <td class="py-2 text-black dark:text-white font-medium">{{ m.name }}</td>
                            <td class="py-2 text-right text-red-500">{{ formatCurrency(m.amount) }}</td>
                            <td class="py-2 text-right text-gray-500">{{ formatCurrency(m.amount / 30) }}</td>
                        </tr>
                        <!-- Total -->
                        <tr class="font-bold border-t border-gray-200 dark:border-gray-700">
                            <td class="py-3">Total Spend 2026</td>
                            <td class="py-3 text-right text-red-600">{{ formatCurrency(totalYearlySpend) }}</td>
                            <td></td>
                        </tr>
                    </tbody>
                 </table>
             </div>
        </div>

        <!-- Line Chart -->
        <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 flex flex-col">
             <h3 class="font-bold text-black dark:text-white mb-4">Expenditure in 2026</h3>
             <div id="spendChart" class="flex-1 w-full h-full min-h-[300px]">
                 <apexchart
                  type="line"
                  height="100%"
                  :options="chartOptions"
                  :series="chartSeries"
                ></apexchart>
             </div>
        </div>
    </div>

    <!-- Section 2: Daily Balance Tracker (NEW) -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <!-- Balance Inputs -->
        <div class="rounded-lg border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
             <div class="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
                <h3 class="font-bold text-black dark:text-white">Daily Balance Log</h3>
                <p class="text-xs text-gray-500">Log your end-of-day balances to track net worth and implied expense.</p>
             </div>
             <div class="p-4 space-y-4">
                 <div>
                    <label class="mb-1 block text-sm font-medium text-black dark:text-white">Date</label>
                    <input v-model="balanceDate" type="date" class="w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-primary" />
                 </div>
                 
                  <div class="grid grid-cols-2 gap-4">
                     <div v-for="acc in accounts" :key="acc.id">
                        <label 
                            class="mb-1 block text-sm font-medium"
                            :class="acc.type === 'credit' ? 'text-red-500' : 'text-gray-500'"
                        >
                            {{ acc.name }}
                        </label>
                        <input 
                            v-model.number="currentBalances[acc.id]" 
                            type="number" 
                            placeholder="0" 
                            class="w-full rounded border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
                        />
                     </div>
                  </div>

                 <button @click="saveBalance" class="w-full rounded bg-brand-500 py-2 font-medium text-white hover:bg-brand-600">
                    Update Balance
                 </button>

                 <!-- Daily Change Indicator -->
                 <div v-if="dailyChange !== null" class="mt-2 text-center text-sm">
                    <span class="text-gray-500">Implied Daily Change: </span>
                    <span class="font-bold" :class="dailyChange >= 0 ? 'text-green-500' : 'text-red-500'">
                        {{ formatCurrency(dailyChange) }}
                    </span>
                 </div>
             </div>
        </div>

        <!-- Net Worth Chart -->
        <div class="md:col-span-2 rounded-lg border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 flex flex-col">
             <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-black dark:text-white">Net Liquidity Trend</h3>
                <h3 class="font-bold text-brand-500 text-xl">{{ formatCurrency(currentNetWorth) }}</h3>
             </div>
             <div id="balanceChart" class="flex-1 w-full h-full min-h-[300px]">
                 <apexchart
                  type="area"
                  height="100%"
                  :options="balanceChartOptions"
                  :series="balanceChartSeries"
                ></apexchart>
             </div>
        </div>
    </div>

    <!-- Section 3: Collections / Trading -->
    <div class="space-y-4">
        <!-- Tabs -->
        <div class="flex gap-4 border-b border-gray-200 dark:border-gray-800">
            <button 
                v-for="tab in tabs" 
                :key="tab.id"
                @click="activeTab = tab.id"
                class="pb-2 text-sm font-medium transition-colors hover:text-brand-500 border-b-2"
                :class="activeTab === tab.id ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500'"
            >
                {{ tab.label }}
            </button>
        </div>

        <!-- Active Table -->
        <div class="min-h-[400px]">
            <FinancialCollectionTable 
                :title="activeTabLabel" 
                :list-key="activeTab"
            />
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import TrackerHeader from '@/components/DailyTracker/TrackerHeader.vue'
import FinancialCollectionTable from './FinancialCollectionTable.vue'
import { useTracker } from '@/composables/useTracker'

const { getMonthlyFinance, balanceLogs, updateBalanceLog, getNetBalance, accounts } = useTracker()

// Tabs (Renamed Pokemon -> Stocks per user request)
const tabs = [
    { id: 'stocks', label: 'Stocks' },
    { id: 'others', label: 'Others' }
]
const activeTab = ref('stocks')
const activeTabLabel = computed(() => tabs.find(t => t.id === activeTab.value)?.label || '')

// --- Monthly Data Logic ---
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const monthlyData = computed(() => {
    return months.map((name, index) => {
        const amount = getMonthlyFinance(index, 2026)
        return { name, amount }
    })
})
const totalYearlySpend = computed(() => monthlyData.value.reduce((acc, curr) => acc + curr.amount, 0))

// --- Balance Tracker Logic ---
const balanceDate = ref(new Date().toISOString().split('T')[0])
const currentBalances = ref<Record<string, number | ''>>({})

// Load data when date changes
watch(balanceDate, (newDate) => {
    // Reset inputs
    currentBalances.value = {}
    
    // Check if we have logs for this date
    const log = balanceLogs.value[newDate]
    
    if (log) {
        // Populate from existing log
        accounts.value.forEach(acc => {
            currentBalances.value[acc.id] = log[acc.id] !== undefined ? log[acc.id] : ''
        })
    } else {
        // Pre-fill from previous entry
        const sortedDates = Object.keys(balanceLogs.value).sort().reverse()
        const lastDate = sortedDates.find(d => d < newDate)
        
        if (lastDate) {
            const lastLog = balanceLogs.value[lastDate]
             accounts.value.forEach(acc => {
                currentBalances.value[acc.id] = lastLog[acc.id] !== undefined ? lastLog[acc.id] : ''
            })
        }
    }
}, { immediate: true })

const saveBalance = () => {
    if (!balanceDate.value) return
    accounts.value.forEach(acc => {
        const val = Number(currentBalances.value[acc.id])
        updateBalanceLog(balanceDate.value, acc.id, isNaN(val) ? 0 : val)
    })
    alert('Balance updated!')
}

const currentNetWorth = computed(() => getNetBalance(balanceDate.value))

// Calculate Implied Daily Change (Vs Previous Day)
const dailyChange = computed(() => {
    const date = new Date(balanceDate.value)
    date.setDate(date.getDate() - 1)
    const prevDate = date.toISOString().split('T')[0]
    
    // Check if we have a log for previous day
    // If not, maybe look back further? For now strict previous day.
    if (balanceLogs.value[prevDate]) {
        return currentNetWorth.value - getNetBalance(prevDate)
    }
    return null
})

// Balance Chart Data
const balanceHistory = computed(() => {
    // Sort dates
    const dates = Object.keys(balanceLogs.value).sort()
    return dates.map(d => ({
        date: d,
        net: getNetBalance(d)
    }))
})

const balanceChartSeries = computed(() => [{
    name: 'Net Worth',
    data: balanceHistory.value.map(h => h.net)
}])

const balanceChartOptions = computed(() => ({
    chart: { type: 'area', fontFamily: 'Satoshi, sans-serif', toolbar: { show: false } },
    colors: ['#3C50E0'],
    stroke: { curve: 'smooth', width: 2 },
    fill: { opacity: 0.1 },
    xaxis: { 
        categories: balanceHistory.value.map(h => h.date), 
        axisBorder: { show: false }, 
        axisTicks: { show: false },
        labels: { show: false } // Hide labels if too many
    },
    yaxis: { labels: { formatter: (val: number) => `₹${val}` } },
    grid: { borderColor: '#e4e4e7', strokeDashArray: 4 },
    dataLabels: { enabled: false },
    theme: { mode: 'light' }
}))

// --- Monthly Spend Chart ---
const chartSeries = computed(() => [{
    name: 'Expenditure',
    data: monthlyData.value.map(m => m.amount)
}])

const chartOptions = computed(() => ({
    chart: { type: 'line', fontFamily: 'Satoshi, sans-serif', toolbar: { show: false } },
    colors: ['#F87171'], // red-400
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { categories: months, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (val: number) => `₹${val}` } },
    grid: { borderColor: '#e4e4e7', strokeDashArray: 4 },
    dataLabels: { enabled: false },
    theme: { mode: 'light' } 
}))

const formatCurrency = (val: number) => {
    return '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>
