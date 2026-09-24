<template>
  <el-descriptions :column="1" border>
    <el-descriptions-item label="姓名">{{ employee?.name }}</el-descriptions-item>
    <el-descriptions-item label="工号">{{ employee?.employeeNo }}</el-descriptions-item>
    <el-descriptions-item label="部门">{{ employee?.department }}</el-descriptions-item>
    <el-descriptions-item label="职位">{{ employee?.position }}</el-descriptions-item>
    <el-descriptions-item label="薪资">{{ money(employee?.salary ?? 0) }}</el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import type { Employee } from '@/types/employee';
import { money } from '@/utils/format';

defineProps<{ employee: Employee | null }>();
</script>
