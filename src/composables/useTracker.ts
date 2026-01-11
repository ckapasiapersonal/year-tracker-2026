import { ref, watch } from 'vue'

// --- Types ---
export interface DailyEntry {
    id: number
    text: string
    category: string
    amount?: number // For finance
    time: string
    date: string // ISO date string YYYY-MM-DD
    isEditing?: boolean
}

export interface GridData {
    [dateStr: string]: {
        [hour: number]: string // categoryId
    }
}

export interface AmountAccount {
    id: string
    name: string
    type: 'bank' | 'credit' | 'wallet'
    color?: string
}

// --- State (Global) ---
// We initialize from localStorage based on Current User
const currentUser = localStorage.getItem('app_session_user')
const prefix = currentUser ? `${currentUser}_` : ''

const getStorageKey = (key: string) => prefix + key

// Helper to init ref from storage
const initFromStorage = <T>(key: string, defaultVal: T): T => {
    const saved = localStorage.getItem(getStorageKey(key))
    if (!saved) return defaultVal
    try {
        return JSON.parse(saved)
    } catch {
        return defaultVal
    }
}

const dailyEntries = ref<DailyEntry[]>(initFromStorage('tracker_entries', []))
const gridData = ref<GridData>(initFromStorage('tracker_grid', {}))
const savedDays = ref<string[]>(initFromStorage('tracker_saved_days', []))

// Structure: { events: [], food: [], movies: [], games: [], purchases: [] }
const majorThingsData = ref<Record<string, { id: number, text: string, meta?: string }[]>>(
    initFromStorage('tracker_major_things', { events: [], food: [], movies: [], games: [], purchases: [] })
)

// --- Watchers for Persistence ---
watch(dailyEntries, (val) => {
    localStorage.setItem(getStorageKey('tracker_entries'), JSON.stringify(val))
}, { deep: true })

watch(gridData, (val) => {
    localStorage.setItem(getStorageKey('tracker_grid'), JSON.stringify(val))
}, { deep: true })

watch(savedDays, (val) => {
    localStorage.setItem(getStorageKey('tracker_saved_days'), JSON.stringify(val))
}, { deep: true })

watch(majorThingsData, (val) => {
    localStorage.setItem(getStorageKey('tracker_major_things'), JSON.stringify(val))
}, { deep: true })

export function useTracker() {

    // --- Actions ---
    const addDailyEntry = (entry: Omit<DailyEntry, 'id'>) => {
        const today = new Date().toISOString().split('T')[0]
        if (entry.date > today) {
            alert('Cannot add entries for future dates!')
            return
        }
        dailyEntries.value.unshift({
            id: Date.now(),
            ...entry
        })
    }

    const deleteDailyEntry = (id: number) => {
        dailyEntries.value = dailyEntries.value.filter(e => e.id !== id)
    }

    const updateGridCell = (dateStr: string, hour: number, category: string, force: boolean = false) => {
        const today = new Date().toISOString().split('T')[0]
        if (dateStr > today) {
            alert('Cannot edit future dates!')
            return
        }

        // Check Lock
        if (!force && savedDays.value.includes(dateStr)) {
            console.warn('Day is locked')
            return
        }

        if (!gridData.value[dateStr]) {
            gridData.value[dateStr] = {}
        }

        if (category === 'eraser') {
            delete gridData.value[dateStr][hour]
        } else {
            gridData.value[dateStr][hour] = category
        }
    }

    // --- Locking / saving Actions ---
    const saveDay = (dateStr: string) => {
        if (!savedDays.value.includes(dateStr)) {
            savedDays.value.push(dateStr)
        }
    }

    const unlockDay = (dateStr: string) => {
        savedDays.value = savedDays.value.filter(d => d !== dateStr)
    }

    const isDayLocked = (dateStr: string) => savedDays.value.includes(dateStr)

    // Major Things Actions
    const addMajorThing = (listKey: string, text: string, meta?: string) => {
        if (!majorThingsData.value[listKey]) majorThingsData.value[listKey] = []
        majorThingsData.value[listKey].push({
            id: Date.now(),
            text,
            meta
        })
    }

    const removeMajorThing = (listKey: string, id: number) => {
        if (majorThingsData.value[listKey]) {
            majorThingsData.value[listKey] = majorThingsData.value[listKey].filter(i => i.id !== id)
        }
    }

    // --- Collections / Trading Data ---
    const collectionItems = ref<Record<string, any[]>>(
        initFromStorage('tracker_collections', { pokemon: [], weiss: [], others: [] })
    )

    watch(collectionItems, (val) => {
        localStorage.setItem(getStorageKey('tracker_collections'), JSON.stringify(val))
    }, { deep: true })

    const addCollectionItem = (listKey: string, item: any) => {
        if (!collectionItems.value[listKey]) collectionItems.value[listKey] = []
        collectionItems.value[listKey].unshift({
            id: Date.now(),
            ...item
        })
    }

    const removeCollectionItem = (listKey: string, id: number) => {
        if (collectionItems.value[listKey]) {
            collectionItems.value[listKey] = collectionItems.value[listKey].filter(i => i.id !== id)
        }
    }

    const updateCollectionItem = (listKey: string, id: number, updates: any) => {
        if (collectionItems.value[listKey]) {
            const idx = collectionItems.value[listKey].findIndex(i => i.id === id)
            if (idx !== -1) {
                collectionItems.value[listKey][idx] = { ...collectionItems.value[listKey][idx], ...updates }
            }
        }
    }

    // --- Categories Management ---
    const defaultCategories = [
        { id: 'sleep', label: 'Sleep', color: '#6B7280' },
        { id: 'work', label: 'Work', color: '#3B82F6' },
        { id: 'hobbies', label: 'Hobbies', color: '#F97316' },
        { id: 'hobbies', label: 'Hobbies', color: '#F97316' },
        // { id: 'phd', label: 'PhD', color: '#6366F1' },
        { id: 'exercise', label: 'Exercise', color: '#22C55E' },
        { id: 'friends', label: 'Friends', color: '#EC4899' },
        { id: 'relax', label: 'Relaxation', color: '#2DD4BF' },
        { id: 'dating', label: 'Dating', color: '#F43F5E' },
        { id: 'family', label: 'Family', color: '#A855F7' },
        { id: 'chores', label: 'Chores', color: '#EAB308' },
        { id: 'travel', label: 'Travel', color: '#06B6D4' },
        { id: 'misc', label: 'Misc', color: '#9CA3AF' },
    ]

    const categories = ref<{ id: string, label: string, color: string }[]>(
        initFromStorage('tracker_categories', defaultCategories)
    )

    watch(categories, (val) => {
        localStorage.setItem(getStorageKey('tracker_categories'), JSON.stringify(val))
    }, { deep: true })

    const addCategory = (label: string, color: string) => {
        const id = label.toLowerCase().replace(/\s+/g, '-')
        if (categories.value.find(c => c.id === id)) return
        categories.value.push({ id, label, color })
    }

    const removeCategory = (id: string) => {
        categories.value = categories.value.filter(c => c.id !== id)
    }

    const updateCategory = (id: string, updates: Partial<{ label: string, color: string }>) => {
        const cat = categories.value.find(c => c.id === id)
        if (cat) {
            Object.assign(cat, updates)
        }
    }

    // --- Extended Categories ---
    const taskCategories = ref<string[]>(
        initFromStorage('tracker_cat_task', ['Work', 'Personal', 'Project'])
    )
    const financeCategories = ref<string[]>(
        initFromStorage('tracker_cat_finance', ['Food', 'Transport', 'Bills', 'Shopping'])
    )
    const investCategories = ref<string[]>(
        initFromStorage('tracker_cat_invest', ['Stocks', 'MF', 'Gold', 'Crypto'])
    )

    watch(taskCategories, (val) => { localStorage.setItem(getStorageKey('tracker_cat_task'), JSON.stringify(val)) }, { deep: true })
    watch(financeCategories, (val) => { localStorage.setItem(getStorageKey('tracker_cat_finance'), JSON.stringify(val)) }, { deep: true })
    watch(investCategories, (val) => { localStorage.setItem(getStorageKey('tracker_cat_invest'), JSON.stringify(val)) }, { deep: true })

    const addExtendedCategory = (type: 'task' | 'finance' | 'invest', label: string) => {
        const target = type === 'task' ? taskCategories : type === 'finance' ? financeCategories : investCategories
        if (!target.value.includes(label)) target.value.push(label)
    }

    const removeExtendedCategory = (type: 'task' | 'finance' | 'invest', label: string) => {
        const target = type === 'task' ? taskCategories : type === 'finance' ? financeCategories : investCategories
        target.value = target.value.filter(l => l !== label)
    }

    // --- Theme Management ---
    const isDarkMode = ref<boolean>(
        localStorage.getItem(getStorageKey('tracker_theme')) === 'light' ? false : true
    )

    watch(isDarkMode, (val) => {
        localStorage.setItem(getStorageKey('tracker_theme'), val ? 'dark' : 'light')
        if (val) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, { immediate: true })

    const toggleTheme = () => {
        isDarkMode.value = !isDarkMode.value
    }

    // --- Dynamic Accounts ---
    const accounts = ref<AmountAccount[]>(
        initFromStorage('tracker_accounts', [
            { id: 'bank-1', name: 'Bank Account', type: 'bank', color: '#3B82F6' },
            { id: 'credit-1', name: 'Credit Card', type: 'credit', color: '#EF4444' }
        ])
    )

    watch(accounts, (val) => {
        localStorage.setItem(getStorageKey('tracker_accounts'), JSON.stringify(val))
    }, { deep: true })

    const addAccount = (name: string, type: 'bank' | 'credit' | 'wallet') => {
        const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
        accounts.value.push({ id, name, type })
    }

    const removeAccount = (id: string) => {
        accounts.value = accounts.value.filter(a => a.id !== id)
    }

    const updateAccount = (id: string, updates: Partial<AmountAccount>) => {
        const acc = accounts.value.find(a => a.id === id)
        if (acc) Object.assign(acc, updates)
    }

    // --- Daily Balance Tracking ---
    // Structure: { "2026-01-01": { "account_id": 1000, "account_id_2": -500 } }
    const balanceLogs = ref<Record<string, Record<string, number>>>(
        initFromStorage('tracker_balances', {})
    )

    watch(balanceLogs, (val) => {
        localStorage.setItem(getStorageKey('tracker_balances'), JSON.stringify(val))
    }, { deep: true })

    const updateBalanceLog = (date: string, accountId: string, amount: number) => {
        const today = new Date().toISOString().split('T')[0]
        if (date > today) {
            alert('Cannot update balance for future dates!')
            return
        }
        if (!balanceLogs.value[date]) balanceLogs.value[date] = {}
        balanceLogs.value[date][accountId] = amount
    }

    // Helpers for Balance
    const getNetBalance = (date: string) => {
        const log = balanceLogs.value[date]
        if (!log) return 0
        let total = 0
        accounts.value.forEach(acc => {
            const val = log[acc.id] || 0
            if (acc.type === 'credit') {
                total -= val
            } else {
                total += val
            }
        })
        return total
    }

    // --- Getters / Computed ---

    // Get entries for a specific date
    const getEntriesByDate = (dateStr: string) => {
        return dailyEntries.value.filter(e => e.date === dateStr)
    }

    // Calculate Monthly Financials
    const getMonthlyFinance = (month: number, year: number) => {
        return dailyEntries.value
            .filter(e => {
                const d = new Date(e.date)
                const isFinance = e.category === 'finance' || financeCategories.value.some(c => c.toLowerCase() === e.category.toLowerCase())
                return d.getMonth() === month && d.getFullYear() === year && isFinance
            })
            .reduce((acc, curr) => acc + (curr.amount || 0), 0)
    }

    // Calculate Category Distribution for a Month (for Pie Chart)
    const getMonthlyCategoryDistribution = (month: number, year: number) => {
        const counts: Record<string, number> = {}

        // 1. From Hourly Grid (High precision)
        // Iterate all days in month
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
            const hours = gridData.value[dateStr]
            if (hours) {
                Object.values(hours).forEach(cat => {
                    counts[cat] = (counts[cat] || 0) + 1
                })
            }
        }
        return counts
    }

    // Calculate Category Distribution for the specific YEAR
    const getYearlyCategoryDistribution = (year: number) => {
        const counts: Record<string, number> = {}

        // Iterate every day of the year
        // const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
        // const daysInYear = isLeap ? 366 : 365

        // Construct date strings
        // Optimization: Iterate existing keys in gridData instead of generating all dates
        // This assumes gridData only contains relevant years or we filter keys
        Object.entries(gridData.value).forEach(([dateStr, hours]) => {
            if (dateStr.startsWith(String(year))) {
                Object.values(hours).forEach(cat => {
                    counts[cat] = (counts[cat] || 0) + 1
                })
            }
        })

        return counts
    }

    return {
        categories,
        addCategory,
        removeCategory,
        taskCategories,
        financeCategories,
        investCategories,
        addExtendedCategory,
        removeExtendedCategory,
        isDarkMode,
        toggleTheme,
        dailyEntries,
        gridData,
        majorThingsData,
        collectionItems,
        balanceLogs,
        addDailyEntry,
        deleteDailyEntry,
        updateGridCell,
        addMajorThing,
        removeMajorThing,
        addCollectionItem,
        removeCollectionItem,
        updateCollectionItem,
        accounts,
        addAccount,
        removeAccount,
        updateAccount,
        updateBalanceLog,
        getNetBalance,
        getEntriesByDate,
        getMonthlyFinance,
        getMonthlyCategoryDistribution,
        getYearlyCategoryDistribution,
        savedDays,
        saveDay,
        unlockDay,
        isDayLocked,
        updateCategory
    }
}
