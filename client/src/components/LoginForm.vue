<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <span>{{ isLogin ? '用户登录' : '用户注册' }}</span>
        </div>
      </template>
      <el-form :model="form" label-width="80px">
        <el-form-item label="姓名" v-if="!isLogin">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" type="email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" style="width: 100%">
            {{ isLogin ? '登录' : '注册' }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <span>{{ isLogin ? '还没有账号？' : '已有账号？' }}</span>
          <el-button type="text" @click="toggleMode">
            {{ isLogin ? '立即注册' : '立即登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const emit = defineEmits(['login', 'register']);

const isLogin = ref(true);
const form = reactive({
  name: '',
  email: '',
  password: ''
});

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  form.name = '';
};

const submitForm = () => {
  if (!form.email || !form.password) {
    alert('请填写邮箱和密码');
    return;
  }
  if (!isLogin.value && !form.name) {
    alert('请填写姓名');
    return;
  }
  
  const data = {
    email: form.email,
    password: form.password
  };
  if (!isLogin.value) {
    data.name = form.name;
    data.role = 'user';
  }
  
  emit(isLogin.value ? 'login' : 'register', data);
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}
.login-card {
  width: 400px;
}
.card-header {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
</style>