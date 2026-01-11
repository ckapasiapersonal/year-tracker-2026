<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 px-4 relative">
    <!-- Theme Toggle -->
    <button 
        @click="toggleTheme" 
        class="absolute top-4 right-4 flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
    >
        <span v-if="isDarkMode">☀️ Light Mode</span>
        <span v-else>🌙 Dark Mode</span>
    </button>

    <div class="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-default dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-6 text-center">
        <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Sign In</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Enter your credentials to access your tracker</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="mb-2.5 block font-medium text-gray-900 dark:text-white">Username</label>
          <div class="relative">
            <input 
              v-model="username"
              type="text" 
              placeholder="Enter username" 
              class="w-full rounded border border-gray-300 bg-white py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>

        <div class="mb-6">
          <label class="mb-2.5 block font-medium text-gray-900 dark:text-white">Password</label>
          <div class="relative">
            <input 
              v-model="password"
              type="password" 
              placeholder="Enter password" 
              class="w-full rounded border border-gray-300 bg-white py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>

        <div v-if="error" class="mb-4 text-sm text-red-500 text-center font-medium">
          {{ error }}
        </div>

        <div class="mb-5">
          <button 
            type="submit" 
            class="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 font-bold"
          >
            Sign In / Register
          </button>
        </div>

        <div class="text-center text-xs text-gray-500 mt-4">
            If usage with a new username, a new account will be created automatically.
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { login, error } = useAuth()
const username = ref('')
const password = ref('')
const isDarkMode = ref(false)

const toggleTheme = () => {
    const html = document.documentElement
    if (html.classList.contains('dark')) {
        html.classList.remove('dark')
        localStorage.setItem('darkMode', 'false')
        isDarkMode.value = false
    } else {
        html.classList.add('dark')
        localStorage.setItem('darkMode', 'true')
        isDarkMode.value = true
    }
}

onMounted(() => {
    isDarkMode.value = document.documentElement.classList.contains('dark')
})

const handleSubmit = () => {
    login(username.value, password.value)
}
</script>
