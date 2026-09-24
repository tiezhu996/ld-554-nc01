<template>
  <el-form :model="form" label-width="88px">
    <el-form-item label="员工 ID"><el-input-number v-model="form.employeeId" :min="1" /></el-form-item>
    <el-form-item label="日期"><el-date-picker v-model="form.date" value-format="YYYY-MM-DD" /></el-form-item>
    <el-form-item label="班次">
      <el-select v-model="form.shiftType">
        <el-option v-for="(label, value) in ShiftTypeLabel" :key="value" :label="label" :value="value" />
      </el-select>
    </el-form-item>
    <el-form-item label="开始"><el-time-picker v-model="form.startTime" value-format="HH:mm:ss" /></el-form-item>
    <el-form-item label="结束"><el-time-picker v-model="form.endTime" value-format="HH:mm:ss" /></el-form-item>
    <el-form-item label="门店"><StoreSelector @change="(value) => form.storeId = Number(value)" /></el-form-item>
    <el-button type="primary" @click="$emit('submit', form)">创建排班</el-button>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import StoreSelector from '@/components/common/StoreSelector.vue';
import { ShiftTypeLabel } from '@/constants/enums';

defineEmits<{ submit: [Record<string, unknown>] }>();
const form = reactive({ employeeId: 1, date: new Date().toISOString().slice(0, 10), shiftType: 'MORNING', startTime: '08:30:00', endTime: '13:30:00', storeId: 1 });
</script>
