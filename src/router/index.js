import { createRouter, createWebHistory } from 'vue-router'
import SignIn from '../views/Auth/SignIn.vue';
import Dashboard from '../views/Dashboard.vue';
import Home from '../views/Home/Home.vue';
// import Ministry from '../components/Ministry/Ministry.vue';
import Role from '../views/Role/Role.vue';
import MinOrgan from '../views/Role/MinOrgan.vue';
import Profile from '../views/Auth/Profile.vue';
import ProjectsAndTasks from '../views/ProjectsAndTasks/ProjectsAndTasks.vue';

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
          component: Profile,
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
    },
  ],
});

export default router
