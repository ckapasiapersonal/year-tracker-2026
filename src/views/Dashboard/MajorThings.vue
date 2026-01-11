<template>
  <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
    <TrackerHeader title="Major Things of 2026" />

    <!-- 5 Columns Grid -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
        
        <!-- Events -->
        <MajorListColumn 
            title="Events" 
            listKey="events"
            placeholder="e.g. Total Solar Eclipse"
        />

        <!-- Food -->
        <MajorListColumn 
            title="Food" 
            listKey="food"
            placeholder="e.g. Best Ramen in Tokyo"
        />

        <!-- Movies & TV -->
        <MajorListColumn 
            title="Movies & TV Shows" 
            listKey="movies"
            placeholder="e.g. Arcane Season 2"
        />

        <!-- Games -->
        <MajorListColumn 
            title="Games" 
            listKey="games"
            placeholder="e.g. GTA VI"
            :showMeta="true"
            metaPlaceholder="(Score)"
        />

        <!-- Purchases -->
        <MajorListColumn 
            title="Major Purchases" 
            listKey="purchases"
            placeholder="e.g. New Mac Studio" 
            :showMeta="true"
            metaPlaceholder="Price" 
        />
        
    </div>
  </div>
</template>

<script setup lang="ts">
import MajorListColumn from './MajorListColumn.vue'
import TrackerHeader from '@/components/DailyTracker/TrackerHeader.vue'
</script>
