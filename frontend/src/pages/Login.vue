<template>
  <div class="login-page">
    <section>
      <h1>BizStarter</h1>
      <p>把排班、收支、门店和员工放到一张经营桌面。</p>
    </section>
    <el-form class="login-card" :model="form" @submit.prevent="submit">
      <el-form-item label="账号">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" show-password />
      </el-form-item>
      <el-button type="primary" native-type="submit" :loading="loading">登录</el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const auth = useAuthStore();
const loading = ref(false);
const form = reactive({ username: 'owner', password: 'password123' });

async function submit() {
  loading.value = true;
  try {
    await auth.login(form.username, form.password);
    router.push('/dashboard');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) 420px;
  gap: 40px;
  align-items: center;
  padding: 48px;
  background: #f4f1ea;
}

h1 {
  font-size: clamp(42px, 7vw, 92px);
  margin: 0 0 18px;
  letter-spacing: 0;
}

p {
  font-size: 22px;
  color: #697066;
}

.login-card {
  border: 1px solid #d9d2c4;
  background: #fbf8f0;
  border-radius: 8px;
  padding: 28px;
}

.el-button {
  width: 100%;
}

@media (max-width: 760px) {
  .login-page {
    grid-template-columns: 1fr;
    padding: 24px;
  }
}
</style>
