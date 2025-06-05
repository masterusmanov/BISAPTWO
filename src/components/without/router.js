import { createRouter, createWebHistory } from "vue-router";
import SignIn from "../views/Auth/SignIn.vue";
import Dashboard from "../views/Dashboard.vue";
import Home from "../views/Home/Home.vue";
import Ministry from "../components/Ministry/Ministry.vue";
import Role from "../views/Role/Role.vue";

// Role-based components
import AdminDashboard from "../views/Admin/Admin.vue";
import ModeratorDashboard from "../views/Moderator/Moderator.vue";
import UserDashboard from "../views/User/User.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: SignIn,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          redirect: (to) => {
            // Role asosida redirect qilish
            const userRole = getUserRole(); // Bu funksiyani o'zingiz implement qiling
            switch (userRole) {
              case "admin":
                return "/dashboard/admin";
              case "moderator":
                return "/dashboard/moderator";
              case "user":
                return "/dashboard/user";
              default:
                return "/login";
            }
          },
        },
        // Admin routes
        {
          path: "admin",
          name: "admin-dashboard",
          component: AdminDashboard,
          meta: {
            requiresAuth: true,
            roles: ["admin"],
          },
          children: [
            {
              path: "home",
              name: "admin-home",
              component: Home,
              children: [
                {
                  path: "ministry",
                  name: "admin-ministry",
                  component: Ministry,
                },
              ],
            },
            {
              path: "role",
              name: "admin-role",
              component: Role,
            },
          ],
        },
        // Moderator routes
        {
          path: "moderator",
          name: "moderator-dashboard",
          component: ModeratorDashboard,
          meta: {
            requiresAuth: true,
            roles: ["moderator", "admin"],
          },
          children: [
            {
              path: "home",
              name: "moderator-home",
              component: Home,
            },
            {
              path: "ministry",
              name: "moderator-ministry",
              component: Ministry,
            },
          ],
        },
        // User routes
        {
          path: "user",
          name: "user-dashboard",
          component: UserDashboard,
          meta: {
            requiresAuth: true,
            roles: ["user", "moderator", "admin"],
          },
          children: [
            {
              path: "home",
              name: "user-home",
              component: Home,
            },
          ],
        },
      ],
    },
  ],
});

// Role olish funksiyasi (localStorage, Vuex, Pinia dan)
function getUserRole() {
  // Bu yerda siz user rolni qayerdan olishingizni yozing
  // Masalan: localStorage dan, store dan, yoki API dan
  return localStorage.getItem("userRole") || "user";
}

// Authentication va role check uchun navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = checkAuth(); // Bu funksiyani implement qiling
  const userRole = getUserRole();

  // Login sahifasiga kirish
  if (to.name === "login") {
    if (isAuthenticated) {
      // Agar authenticate bo'lsa, role asosida redirect
      switch (userRole) {
        case "admin":
          next("/dashboard/admin");
          break;
        case "moderator":
          next("/dashboard/moderator");
          break;
        case "user":
          next("/dashboard/user");
          break;
        default:
          next();
      }
    } else {
      next();
    }
    return;
  }

  // Authentication check
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
    return;
  }

  // Role-based access control
  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    // Agar user roli route uchun ruxsat berilmagan bo'lsa
    switch (userRole) {
      case "admin":
        next("/dashboard/admin");
        break;
      case "moderator":
        next("/dashboard/moderator");
        break;
      case "user":
        next("/dashboard/user");
        break;
      default:
        next("/login");
    }
    return;
  }

  next();
});

// Authentication check funksiyasi
function checkAuth() {
  // Bu yerda authentication logic yozing
  // Masalan: token check, API call, etc.
  const token = localStorage.getItem("authToken");
  return !!token; // token mavjudligini tekshirish
}

export default router;
