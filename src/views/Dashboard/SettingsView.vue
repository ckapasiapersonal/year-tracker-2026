<template>
  <div class="space-y-6">
    <TrackerHeader title="Settings" />

    <!-- Theme Settings -->
    <div class="rounded-lg border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <div>
           <h3 class="font-bold text-black dark:text-white">Theme Customization</h3>
           <p class="text-sm text-gray-500">Choose your preferred appearance.</p>
        </div>
        <button 
           @click="toggleTheme" 
           class="flex items-center gap-2 rounded bg-gray-100 px-4 py-2 text-sm font-medium text-black hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
           <span v-if="isDarkMode">☀️ Switch to Light</span>
           <span v-else>🌙 Switch to Dark</span>
        </button>
      </div>
    </div>

    <!-- Bank Accounts -->
    <div class="rounded-lg border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
         <h3 class="font-bold text-black dark:text-white">Bank Accounts & Cards</h3>
         <p class="text-sm text-gray-500">Manage your financial accounts.</p>
      </div>
      <div class="p-6">
         <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
             <div 
                v-for="acc in accounts" 
                :key="acc.id" 
                class="flex items-center justify-between rounded border border-gray-200 p-3 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/[0.02]"
             >
                <div class="flex items-center gap-3">
                    <span 
                        class="flex h-8 w-8 items-center justify-center rounded-full bg-opacity-10"
                        :class="acc.type === 'credit' ? 'bg-red-500 text-red-500' : 'bg-blue-500 text-blue-500'"
                    >
                        <span v-if="acc.type === 'credit'">💳</span>
                        <span v-else>🏦</span>
                    </span>
                    <div>
                        <p class="font-medium text-black dark:text-white">{{ acc.name }}</p>
                        <p class="text-xs text-gray-500 capitalize">{{ acc.type }}</p>
                    </div>
                </div>
                <button @click="removeAccount(acc.id)" class="text-gray-400 hover:text-red-500">&times;</button>
             </div>
         </div>
         <div class="flex flex-col gap-4 border-t border-gray-200 pt-6 dark:border-gray-800 sm:flex-row sm:items-end">
             <div class="flex-1">
                <label class="mb-2 block text-sm font-medium text-black dark:text-white">Account Name</label>
                <input v-model="newAccName" type="text" placeholder="e.g. HDFC Salary" class="w-full rounded border border-gray-300 bg-transparent px-4 py-2 font-medium outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"/>
             </div>
             <div>
                <label class="mb-2 block text-sm font-medium text-black dark:text-white">Type</label>
                <select v-model="newAccType" class="h-[42px] w-full rounded border border-gray-300 bg-transparent px-4 py-2 font-medium outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    <option value="bank">Bank</option>
                    <option value="credit">Credit Card</option>
                    <option value="wallet">Wallet</option>
                </select>
             </div>
             <button @click="handleAddAccount" class="rounded bg-brand-500 px-6 py-2.5 font-medium text-white hover:bg-brand-600 disabled:opacity-50" :disabled="!newAccName">Add</button>
         </div>
      </div>
    </div>
    <div class="rounded-lg border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
      <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
         <h3 class="font-bold text-black dark:text-white">Habit Categories</h3>
         <p class="text-sm text-gray-500">For the Hourly Grid Tracker.</p>
      </div>
      
      <div class="p-6">
         <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
             <div 
                v-for="cat in categories" 
                :key="cat.id" 
                class="flex items-center justify-between rounded border border-gray-200 p-3 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                @dblclick="handleEditCategory(cat)"
                title="Double-click to edit color"
             >
                <div class="flex items-center gap-3">
                    <span class="h-6 w-6 rounded shadow-sm" :style="{ backgroundColor: cat.color }"></span>
                    <span class="font-medium text-black dark:text-white">{{ cat.label }}</span>
                </div>
                <button @click.stop="removeCategory(cat.id)" class="text-gray-400 hover:text-red-500"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6m4-6v6"/></svg></button>
             </div>
             <!-- Hidden Color Input for Editing -->
             <input 
                type="color" 
                ref="editColorInputRef"
                class="absolute opacity-0 pointer-events-none"
                @change="handleColorChange"
             />
         </div>
         <div class="flex flex-col gap-4 border-t border-gray-200 pt-6 dark:border-gray-800 sm:flex-row sm:items-end">
             <div class="flex-1">
                <label class="mb-2 block text-sm font-medium text-black dark:text-white">New Habit Category</label>
                <input v-model="newCatName" type="text" placeholder="e.g. Coding" class="w-full rounded border border-gray-300 bg-transparent px-4 py-2 font-medium outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"/>
             </div>
             <div>
                <label class="mb-2 block text-sm font-medium text-black dark:text-white">Color</label>
                <input v-model="newCatColor" type="color" class="h-[42px] w-[80px] cursor-pointer rounded border border-gray-300 bg-transparent p-1 dark:border-gray-700"/>
             </div>
             <button @click="handleAdd" class="rounded bg-brand-500 px-6 py-2.5 font-medium text-white hover:bg-brand-600 disabled:opacity-50" :disabled="!newCatName">Add</button>
         </div>
      </div>
    </div>

    <!-- Task Categories -->
    <div class="rounded-lg border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
         <h3 class="font-bold text-black dark:text-white">Task Categories</h3>
         <p class="text-sm text-gray-500">Options for Daily Tasks.</p>
      </div>
      <div class="p-6">
         <div class="flex flex-wrap gap-2 mb-4">
             <span v-for="cat in taskCategories" :key="cat" class="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-sm font-medium dark:border-gray-700 dark:text-white">
                {{ cat }}
                <button @click="removeExtendedCategory('task', cat)" class="text-gray-400 hover:text-red-500">&times;</button>
             </span>
         </div>
         <div class="flex gap-2">
             <input v-model="newTaskCat" type="text" placeholder="Add Task Category" class="flex-1 rounded border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400" @keyup.enter="handleAddExt('task')"/>
             <button @click="handleAddExt('task')" class="rounded bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">Add</button>
         </div>
      </div>
    </div>

    <!-- Finance Categories -->
    <div class="rounded-lg border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
         <h3 class="font-bold text-black dark:text-white">Finance Categories</h3>
         <p class="text-sm text-gray-500">Options for Daily Expenditures.</p>
      </div>
      <div class="p-6">
         <div class="flex flex-wrap gap-2 mb-4">
             <span v-for="cat in financeCategories" :key="cat" class="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-sm font-medium dark:border-gray-700 dark:text-white">
                {{ cat }}
                <button @click="removeExtendedCategory('finance', cat)" class="text-gray-400 hover:text-red-500">&times;</button>
             </span>
         </div>
         <div class="flex gap-2">
             <input v-model="newFinCat" type="text" placeholder="Add Finance Category" class="flex-1 rounded border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400" @keyup.enter="handleAddExt('finance')"/>
             <button @click="handleAddExt('finance')" class="rounded bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">Add</button>
         </div>
      </div>
    </div>

    <!-- Investment Categories -->
    <div class="rounded-lg border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
         <h3 class="font-bold text-black dark:text-white">Investment Categories</h3>
         <p class="text-sm text-gray-500">Options for Investments.</p>
      </div>
      <div class="p-6">
         <div class="flex flex-wrap gap-2 mb-4">
             <span v-for="cat in investCategories" :key="cat" class="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-sm font-medium dark:border-gray-700 dark:text-white">
                {{ cat }}
                <button @click="removeExtendedCategory('invest', cat)" class="text-gray-400 hover:text-red-500">&times;</button>
             </span>
         </div>
         <div class="flex gap-2">
             <input v-model="newInvestCat" type="text" placeholder="Add Investment Category" class="flex-1 rounded border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400" @keyup.enter="handleAddExt('invest')"/>
             <button @click="handleAddExt('invest')" class="rounded bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">Add</button>
         </div>
      </div>
    </div>

    <!-- Data Management (Backup/Restore) -->
    <div class="rounded-lg border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
         <div>
            <h3 class="font-bold text-black dark:text-white">Data Management</h3>
            <p class="text-sm text-gray-500">Backup your data or restore from a file. Essential for updates.</p>
         </div>
      </div>
      <div class="p-6 flex flex-col gap-4 sm:flex-row">
         <button @click="exportData" class="flex items-center gap-2 rounded bg-brand-500 px-6 py-2.5 font-medium text-white hover:bg-brand-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Export Backup
         </button>
         <div class="relative">
            <input type="file" @change="importData" accept=".json" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
            <button class="flex items-center gap-2 rounded border border-gray-300 px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                Import Backup
            </button>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTracker } from '@/composables/useTracker'
// import { useTheme } from '@/components/layout/ThemeProvider.vue'
import TrackerHeader from '@/components/DailyTracker/TrackerHeader.vue'

const { 
    categories, addCategory, removeCategory, updateCategory,
    taskCategories, financeCategories, investCategories,
    addExtendedCategory, removeExtendedCategory,
    toggleTheme, isDarkMode,
    accounts, addAccount, removeAccount
} = useTracker()

// Edit Logic
const editColorInputRef = ref<HTMLInputElement | null>(null)
const editingCatId = ref<string | null>(null)

const handleEditCategory = (cat: { id: string, color: string }) => {
    editingCatId.value = cat.id
    if (editColorInputRef.value) {
        editColorInputRef.value.value = cat.color
        editColorInputRef.value.click()
    }
}

const handleColorChange = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (editingCatId.value && input.value) {
        updateCategory(editingCatId.value, { color: input.value })
    }
}

// Habit Logic
const newCatName = ref('')
const newCatColor = ref('#3C50E0') 

const handleAdd = () => {
    if (!newCatName.value) return
    addCategory(newCatName.value, newCatColor.value)
    newCatName.value = ''
    newCatColor.value = '#' + Math.floor(Math.random()*16777215).toString(16)
}

// Extended Logic
const newTaskCat = ref('')
const newFinCat = ref('')
const newInvestCat = ref('')

const handleAddExt = (type: 'task' | 'finance' | 'invest') => {
    if (type === 'task' && newTaskCat.value) {
        addExtendedCategory('task', newTaskCat.value)
        newTaskCat.value = ''
    }
    if (type === 'finance' && newFinCat.value) {
        addExtendedCategory('finance', newFinCat.value)
        newFinCat.value = ''
    }
    if (type === 'invest' && newInvestCat.value) {
        addExtendedCategory('invest', newInvestCat.value)
        newInvestCat.value = ''
    }
}

// Bank Logic
const newAccName = ref('')
const newAccType = ref<'bank'|'credit'|'wallet'>('bank')

const handleAddAccount = () => {
    if (!newAccName.value) return
    addAccount(newAccName.value, newAccType.value)
    newAccName.value = ''
    newAccType.value = 'bank'
}

// Backup Logic
const exportData = () => {
    const data: Record<string, any> = {}
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.startsWith('tracker_') || key.startsWith('year_'))) {
            data[key] = localStorage.getItem(key)
        }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()
}

const importData = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target?.result as string)
            Object.keys(data).forEach(key => {
                localStorage.setItem(key, data[key])
            })
            alert('Data restored successfully! reloading...')
            window.location.reload()
        } catch {
            alert('Invalid backup file')
        }
    }
    reader.readAsText(input.files[0])
}
</script>
