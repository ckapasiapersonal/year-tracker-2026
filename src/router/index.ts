import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'TrackingDashboard',
      component: () => import('../views/Dashboard/TrackingDashboard.vue'),
      meta: {
        title: 'Daily Tracker',
      },
    },
    {
      path: '/yearly-overview',
      name: 'YearlyOverview',
      component: () => import('../views/Dashboard/YearlyOverview.vue'),
      meta: {
        title: 'Year in Color',
      },
    },
    {
      path: '/major-things',
      name: 'MajorThings',
      component: () => import('../views/Dashboard/MajorThings.vue'),
      meta: {
        title: 'Major Things',
      },
    },
    {
      path: '/financial',
      name: 'FinancialTracker',
      component: () => import('../views/Dashboard/FinancialTracker.vue'),
      meta: {
        title: 'Financial Tracker',
      },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('../views/Dashboard/SettingsView.vue'),
      meta: {
        title: 'Settings',
      },
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: {
        title: 'Calendar',
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
      },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },

    {
      path: '/auth/signin',
      name: 'Authentication',
      component: () => import('../views/Authentication/SignInView.vue'),
      meta: {
        title: 'Sign In',
        public: true
      },
    },
    {
      path: '/signin', // Keep legacy pointing to new or just redirect
      redirect: '/auth/signin'
    },
    // ... other routes
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `Year Tracker 2026 | ${to.meta.title}`

  const isAuthenticated = !!localStorage.getItem('app_session_user')

  if (to.path === '/auth/signin' && isAuthenticated) {
    next('/')
    return
  }

  if (!to.meta.public && !isAuthenticated) {
    next('/auth/signin')
    return
  }

  next()
})
