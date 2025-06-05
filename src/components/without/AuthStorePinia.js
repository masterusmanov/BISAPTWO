// stores/auth.js
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("authToken") || null,
    role: localStorage.getItem("userRole") || null,
    isAuthenticated: false,
  }),

  getters: {
    getUserRole: (state) => state.role,
    isAdmin: (state) => state.role === "admin",
    isModerator: (state) => state.role === "moderator",
    isUser: (state) => state.role === "user",
    canAccess: (state) => (requiredRoles) => {
      if (!requiredRoles || requiredRoles.length === 0) return true;
      return requiredRoles.includes(state.role);
    },
  },

  actions: {
    async login(credentials) {
      try {
        // API call qiling
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (response.ok) {
          this.user = data.user;
          this.token = data.token;
          this.role = data.user.role;
          this.isAuthenticated = true;

          // LocalStorage ga saqlash
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userRole", data.user.role);
          localStorage.setItem("userData", JSON.stringify(data.user));

          return { success: true, user: data.user };
        } else {
          throw new Error(data.message || "Login failed");
        }
      } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: error.message };
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.role = null;
      this.isAuthenticated = false;

      // LocalStorage dan o'chirish
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userData");
    },

    // Token mavjudligini tekshirish
    checkAuth() {
      const token = localStorage.getItem("authToken");
      const role = localStorage.getItem("userRole");

      if (token && role) {
        this.token = token;
        this.role = role;
        this.isAuthenticated = true;

        // User ma'lumotlarini qayta yuklash
        const userData = localStorage.getItem("userData");
        if (userData) {
          this.user = JSON.parse(userData);
        }

        return true;
      }

      return false;
    },

    // Role o'zgartirish (development uchun)
    setRole(newRole) {
      this.role = newRole;
      localStorage.setItem("userRole", newRole);
    },
  },
});
