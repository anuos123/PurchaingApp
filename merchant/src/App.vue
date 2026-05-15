<template>
  <div id="app">
    <el-container>
      <el-header v-if="isLoggedIn" class="header">
        <div class="logo">采购系统 - 商家端</div>
        <el-menu :default-active="activeMenu" mode="horizontal" class="nav-menu">
          <el-menu-item index="products" @click="activeMenu = 'products'">商品管理</el-menu-item>
          <el-menu-item index="orders" @click="activeMenu = 'orders'">订单管理</el-menu-item>
        </el-menu>
        <div class="user-info">
          <span>{{ currentUser?.name }}</span>
          <el-button type="text" @click="logout">退出登录</el-button>
        </div>
      </el-header>
      <el-main>
        <LoginForm v-if="!isLoggedIn" @login="handleLogin" @register="handleRegister" />
        <ProductManager v-else-if="activeMenu === 'products'" @refresh="refreshProducts" />
        <OrderManager v-else-if="activeMenu === 'orders'" @refresh="refreshOrders" />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import LoginForm from './components/LoginForm.vue';
import ProductManager from './components/ProductManager.vue';
import OrderManager from './components/OrderManager.vue';

const API_BASE = 'http://localhost:3000/api';
const isLoggedIn = ref(false);
const currentUser = ref(null);
const activeMenu = ref('products');

axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token');

const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await axios.get(`${API_BASE}/auth/me`);
      if (response.data.role === 'merchant') {
        currentUser.value = response.data;
        isLoggedIn.value = true;
      } else {
        localStorage.removeItem('token');
      }
    } catch (err) {
      localStorage.removeItem('token');
      isLoggedIn.value = false;
    }
  }
};

const handleLogin = async (data) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, data);
    if (response.data.user.role !== 'merchant') {
      alert('请使用商家账号登录');
      return;
    }
    localStorage.setItem('token', response.data.token);
    axios.defaults.headers.common['x-auth-token'] = response.data.token;
    currentUser.value = response.data.user;
    isLoggedIn.value = true;
  } catch (err) {
    alert(err.response?.data?.msg || '登录失败');
  }
};

const handleRegister = async (data) => {
  try {
    data.role = 'merchant';
    const response = await axios.post(`${API_BASE}/auth/register`, data);
    localStorage.setItem('token', response.data.token);
    axios.defaults.headers.common['x-auth-token'] = response.data.token;
    currentUser.value = response.data.user;
    isLoggedIn.value = true;
  } catch (err) {
    alert(err.response?.data?.msg || '注册失败');
  }
};

const refreshProducts = () => {
};

const refreshOrders = () => {
};

const logout = () => {
  localStorage.removeItem('token');
  axios.defaults.headers.common['x-auth-token'] = '';
  isLoggedIn.value = false;
  currentUser.value = null;
  activeMenu.value = 'products';
};

onMounted(() => {
  checkAuth();
});
</script>

<style>
#app {
  height: 100vh;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #67C23A;
  color: white;
}
.logo {
  font-size: 20px;
  font-weight: bold;
}
.nav-menu {
  flex: 1;
  margin-left: 50px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}
.el-main {
  padding: 20px;
}
</style>