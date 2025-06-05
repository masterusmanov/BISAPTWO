<!-- Admin.vue -->
<template>
    <div class="admin-dashboard">
      <div class="admin-header">
        <h1>Admin Dashboard</h1>
        <div class="user-info">
          <span>Salom, {{ user?.name }}!</span>
          <span class="role-badge admin">Admin</span>
          <button @click="logout" class="logout-btn">Chiqish</button>
        </div>
      </div>
      
      <nav class="admin-nav">
        <router-link to="/dashboard/admin/home" class="nav-link">
          Bosh sahifa
        </router-link>
        <router-link to="/dashboard/admin/role" class="nav-link">
          Rollar boshqaruvi
        </router-link>
        <router-link to="/dashboard/admin/home/ministry" class="nav-link">
          Vazirliklar
        </router-link>
      </nav>
  
      <div class="admin-content">
        <router-view />
      </div>
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from '@/stores/auth'
  import { useRouter } from 'vue-router'
  
  const authStore = useAuthStore()
  const router = useRouter()
  const user = authStore.user
  
  const logout = () => {
    authStore.logout()
    router.push('/login')
  }
  </script>
  
  <style scoped>
  .admin-dashboard {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }
  
  .admin-header h1 {
    color: white;
    margin: 0;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: white;
  }
  
  .role-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: bold;
  }
  
  .role-badge.admin {
    background: #ff6b6b;
    color: white;
  }
  
  .logout-btn {
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
  }
  
  .admin-nav {
    display: flex;
    gap: 1rem;
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.05);
  }
  
  .nav-link {
    padding: 0.75rem 1.5rem;
    color: white;
    text-decoration: none;
    border-radius: 0.5rem;
    transition: background 0.3s;
  }
  
  .nav-link:hover,
  .nav-link.router-link-active {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .admin-content {
    padding: 2rem;
  }
  </style>
  
  <!-- Moderator.vue -->
  <template>
    <div class="moderator-dashboard">
      <div class="moderator-header">
        <h1>Moderator Dashboard</h1>
        <div class="user-info">
          <span>Salom, {{ user?.name }}!</span>
          <span class="role-badge moderator">Moderator</span>
          <button @click="logout" class="logout-btn">Chiqish</button>
        </div>
      </div>
      
      <nav class="moderator-nav">
        <router-link to="/dashboard/moderator/home" class="nav-link">
          Bosh sahifa
        </router-link>
        <router-link to="/dashboard/moderator/ministry" class="nav-link">
          Vazirliklar ko'rish
        </router-link>
      </nav>
  
      <div class="moderator-content">
        <router-view />
      </div>
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from '@/stores/auth'
  import { useRouter } from 'vue-router'
  
  const authStore = useAuthStore()
  const router = useRouter()
  const user = authStore.user
  
  const logout = () => {
    authStore.logout()
    router.push('/login')
  }
  </script>
  
  <style scoped>
  .moderator-dashboard {
    min-height: 100vh;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }
  
  .moderator-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }
  
  .role-badge.moderator {
    background: #4ecdc4;
    color: white;
  }
  
  /* Qolgan stillar admin bilan o'xshash */
  </style>
  
  <!-- User.vue -->
  <template>
    <div class="user-dashboard">
      <div class="user-header">
        <h1>User Dashboard</h1>
        <div class="user-info">
          <span>Salom, {{ user?.name }}!</span>
          <span class="role-badge user">User</span>
          <button @click="logout" class="logout-btn">Chiqish</button>
        </div>
      </div>
      
      <nav class="user-nav">
        <router-link to="/dashboard/user/home" class="nav-link">
          Bosh sahifa
        </router-link>
      </nav>
  
      <div class="user-content">
        <router-view />
      </div>
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from '@/stores/auth'
  import { useRouter } from 'vue-router'
  
  const authStore = useAuthStore()
  const router = useRouter()
  const user = authStore.user
  
  const logout = () => {
    authStore.logout()
    router.push('/login')
  }
  </script>
  
  <style scoped>
  .user-dashboard {
    min-height: 100vh;
    background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  }
  
  .role-badge.user {
    background: #95e1d3;
    color: #333;
  }
  
  /* Qolgan stillar o'xshash */
  </style>