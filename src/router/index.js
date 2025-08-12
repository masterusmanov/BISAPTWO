import { createRouter, createWebHistory } from 'vue-router'
import SignIn from '../views/Auth/SignIn.vue';
import Dashboard from '../views/Dashboard.vue';
import Home from '../views/Home/Home.vue';
// import Ministry from '../components/Ministry/Ministry.vue';
import Role from '../views/Role/Role.vue';
import MinOrgan from '../views/Role/MinOrgan.vue';
// import Profile from '../views/Auth/UserDataUpdate.vue';
import ProjectsAndTasks from '../views/ProjectsAndTasks/ProjectsAndTasks.vue';
import UserDataUpdate from '../views/Auth/UserDataUpdate.vue';
import EmailReset from '@/views/Auth/EmailReset.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      children: [
        {
          path: "/dashboard/home",
          name: "home",
          component: Home,
          children: [
            // {
            //   path: "/dashboard/home/ministry",
            //   name: "ministry",
            //   component: Ministry,
            // },
          ],
        },
        {
          path: "/dashboard/profile",
          name: "profile",
          component: UserDataUpdate,
          meta: {
            hideInternalSidebar: true,
          },
        },
        {
          path: "/dashboard/moderator",
          name: "moderator",
          component: Role,
        },
        {
          path: "/dashboard/minorgan",
          name: "minorgan",
          component: MinOrgan,
        },
        {
          path: "/dashboard/projecttask",
          name: "projecttask",
          component: ProjectsAndTasks,
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: SignIn,
      meta: { requiresAuth: false }
    },
    {
      path: "/email_reset",
      name: "email_reset",
      component: EmailReset,
      meta: { requiresAuth: false }
    },
  ],
});


router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token');

  // Agar sahifa token talab qilmasa, hech qanday tekshiruvsiz o'tkazamiz
  if (to.meta.requiresAuth === false) {
    // Token bo'lsa, /login sahifasiga kirmasligi uchun yo'naltirish
    if (to.path === '/login' && token) {
      next('/dashboard/home');
    } else {
      next();
    }
  } else {
    // Token talab qiladigan sahifalar uchun tekshirish
    if (!token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  }
});



export default router
