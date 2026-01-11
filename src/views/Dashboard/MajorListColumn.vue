<template>
  <div class="flex flex-col rounded-sm border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]">
    <h3 class="mb-3 text-sm font-bold uppercase text-gray-500">{{ title }}</h3>
    
    <!-- List -->
    <ul class="mb-4 flex-1 space-y-2 overflow-y-auto max-h-[500px] custom-scrollbar">
        <li 
            v-for="item in listItems" 
            :key="item.id" 
            class="group flex items-start justify-between gap-2 text-sm text-black dark:text-white"
        >
            <div class="break-words">
                <span>{{ item.text }}</span>
                <span v-if="item.meta" :class="metaColorClass" class="ml-2 text-xs font-semibold opacity-80">
                   {{ item.meta }}
                </span>
            </div>
            <button 
                @click="removeMajorThing(listKey, item.id)"
                class="hidden text-gray-400 hover:text-red-500 group-hover:block"
            >
                &times;
            </button>
        </li>
        <li v-if="listItems.length === 0" class="text-xs text-gray-400 italic">
            Nothing yet...
        </li>
    </ul>

    <!-- Input -->
    <div class="mt-auto">
        <div class="flex gap-1" v-if="showMeta">
            <input 
                v-model="newItemText" 
                @keyup.enter="addItem"
                type="text" 
                :placeholder="placeholder"
                class="w-full rounded border border-gray-200 bg-white px-2 py-1 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-boxdark"
            />
            <input 
                 v-model="newItemMeta"
                 @keyup.enter="addItem"
                 type="text" 
                 :placeholder="metaPlaceholder"
                 class="w-20 rounded border border-gray-200 bg-white px-2 py-1 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-boxdark"
            />
        </div>
        <input 
            v-else
            v-model="newItemText" 
            @keyup.enter="addItem"
            type="text" 
            :placeholder="placeholder"
            class="w-full rounded border border-gray-200 bg-white px-2 py-1 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-boxdark"
        />
        <button 
            @click="addItem"
            class="mt-2 w-full rounded bg-white py-1 text-xs font-medium text-gray-500 shadow-sm hover:text-brand-500 dark:bg-boxdark dark:text-gray-400"
        >
            + Add Item
        </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTracker } from '@/composables/useTracker'

const props = defineProps<{
    title: string
    listKey: string
    placeholder: string
    showMeta?: boolean
    metaPlaceholder?: string
}>()

const { majorThingsData, addMajorThing, removeMajorThing } = useTracker()

const listItems = computed(() => {
    return majorThingsData.value[props.listKey] || []
})

const newItemText = ref('')
const newItemMeta = ref('')

const addItem = () => {
    if (!newItemText.value.trim()) return

    // Auto-format price if input is digits only in purchases
    let meta = newItemMeta.value
    if (props.listKey === 'purchases' && meta && !meta.includes('₹') && !isNaN(Number(meta))) {
        meta = '₹' + meta
    }
    // Color logic for meta
    if (props.listKey === 'games' && meta && meta.includes('+')) {
         // e.g. +500xp (green)
    }

    addMajorThing(props.listKey, newItemText.value, meta)
    newItemText.value = ''
    newItemMeta.value = ''
}

const metaColorClass = computed(() => {
    if (props.listKey === 'purchases') return 'text-red-500'
    if (props.listKey === 'games') return 'text-green-500' // Scores often green
    return 'text-gray-500'
})

</script>

<style scoped>
/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 20px;
}
</style>
