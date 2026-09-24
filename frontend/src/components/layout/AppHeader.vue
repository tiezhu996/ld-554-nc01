<template>
  <header class="app-header">
    <div>
      <strong>BizStarter</strong>
      <span>创业与小微企业管理系统</span>
    </div>
    <el-dropdown>
      <el-button text>
        {{ auth.user?.username ?? '未登录' }}
        <el-icon><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </header>
</template>

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const auth = useAuthStore();
function logout() {
  auth.logout();
  router.push('/login');
}
</script>
