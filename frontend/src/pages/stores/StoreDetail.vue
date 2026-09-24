<template>
  <el-descriptions :column="1" border>
    <el-descriptions-item label="门店">{{ store?.name }}</el-descriptions-item>
    <el-descriptions-item label="地址">{{ store?.address }}</el-descriptions-item>
    <el-descriptions-item label="电话">{{ store?.phone }}</el-descriptions-item>
    <el-descriptions-item label="营业时间">{{ store?.businessHours }}</el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import type { Store } from '@/types/store';

defineProps<{ store: Store | null }>();
</script>
