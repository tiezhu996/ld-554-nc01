<template>
  <el-form :model="form" label-width="88px">
    <el-form-item label="姓名"><el-input v-model="form.name" /></el-form-item>
    <el-form-item label="部门"><el-input v-model="form.department" /></el-form-item>
    <el-form-item label="职位"><el-input v-model="form.position" /></el-form-item>
    <el-form-item label="手机号"><el-input v-model="form.phone" /></el-form-item>
    <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
    <el-form-item label="入职日期"><el-date-picker v-model="form.joinDate" value-format="YYYY-MM-DD" /></el-form-item>
    <el-form-item label="状态">
      <el-select v-model="form.status">
        <el-option v-for="(label, value) in EmployeeStatusLabel" :key="value" :label="label" :value="value" />
      </el-select>
    </el-form-item>
    <el-form-item label="薪资"><el-input-number v-model="form.salary" :min="0" /></el-form-item>
    <el-form-item label="角色">
      <el-select v-model="form.role">
        <el-option label="Owner" value="OWNER" />
        <el-option label="Manager" value="MANAGER" />
        <el-option label="Employee" value="EMPLOYEE" />
      </el-select>
    </el-form-item>
    <el-form-item label="门店"><StoreSelector @change="(value) => form.storeId = Number(value)" /></el-form-item>
    <el-button type="primary" @click="$emit('submit', form)">保存员工</el-button>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import StoreSelector from '@/components/common/StoreSelector.vue';
import { EmployeeStatusLabel } from '@/constants/enums';

defineEmits<{ submit: [Record<string, unknown>] }>();
const form = reactive({
  name: '',
  department: '门店运营部',
  position: '',
  phone: '',
  email: '',
  joinDate: new Date().toISOString().slice(0, 10),
  status: 'ON_PROBATION',
  salary: 8000,
  role: 'EMPLOYEE',
  storeId: 1
});
</script>
