<template>
  <aside class="app-sidebar">
    <el-menu router :default-active="$route.path">
      <el-menu-item index="/dashboard"><el-icon><DataAnalysis /></el-icon>仪表盘</el-menu-item>
      <el-menu-item index="/employees"><el-icon><User /></el-icon>员工</el-menu-item>
      <el-menu-item index="/schedule"><el-icon><Calendar /></el-icon>排班</el-menu-item>
      <el-menu-item index="/finance"><el-icon><Money /></el-icon>财务</el-menu-item>
      <el-menu-item index="/stores"><el-icon><Shop /></el-icon>门店</el-menu-item>
    </el-menu>
  </aside>
</template>

<script setup lang="ts">
import { Calendar, DataAnalysis, Money, Shop, User } from '@element-plus/icons-vue';
</script>
