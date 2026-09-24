<template>
  <AppLayout>
    <div class="page-title">
      <h1>员工管理</h1>
      <el-button v-permission="['OWNER','MANAGER']" type="primary" :icon="Plus" @click="formVisible = true">入职登记</el-button>
    </div>
    <div class="panel filters">
      <el-input v-model="filters.keyword" placeholder="搜索姓名" clearable />
      <el-select v-model="filters.status" placeholder="状态" clearable>
        <el-option v-for="(label, value) in EmployeeStatusLabel" :key="value" :label="label" :value="value" />
      </el-select>
      <StoreSelector @change="(value) => filters.storeId = value as number" />
      <el-button @click="load">筛选</el-button>
    </div>
    <div class="grid cols-2 body-grid">
      <div class="panel">
        <el-table :data="employees.list" row-key="id">
          <el-table-column label="员工" min-width="180">
            <template #default="{ row }"><EmployeeAvatar :name="row.name" :employee-no="row.employeeNo" /></template>
          </el-table-column>
          <el-table-column prop="department" label="部门" />
          <el-table-column prop="position" label="职位" />
          <el-table-column label="状态">
            <template #default="{ row }"><el-tag>{{ EmployeeStatusLabel[row.status as keyof typeof EmployeeStatusLabel] }}</el-tag></template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }"><el-button text @click="selected = row; detailVisible = true">详情</el-button></template>
          </el-table-column>
        </el-table>
      </div>
      <div class="panel">
        <h2>部门组织图</h2>
        <el-tree :data="departmentTree" default-expand-all />
      </div>
    </div>
    <el-drawer v-model="detailVisible" title="员工详情"><EmployeeDetail :employee="selected" /></el-drawer>
    <el-drawer v-model="formVisible" title="入职登记"><EmployeeForm @submit="save" /></el-drawer>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import AppLayout from '@/components/layout/AppLayout.vue';
import EmployeeAvatar from '@/components/common/EmployeeAvatar.vue';
import StoreSelector from '@/components/common/StoreSelector.vue';
import EmployeeDetail from './EmployeeDetail.vue';
import EmployeeForm from './EmployeeForm.vue';
import { EmployeeStatusLabel } from '@/constants/enums';
import { useEmployeeStore } from '@/stores/employeeStore';
import { createEmployee } from '@/api/employee';
import type { Employee } from '@/types/employee';

const employees = useEmployeeStore();
const filters = reactive<Record<string, unknown>>({});
const detailVisible = ref(false);
const formVisible = ref(false);
const selected = ref<Employee | null>(null);
const departmentTree = computed(() => {
  const groups = employees.list.reduce<Record<string, Employee[]>>((acc, item) => {
    acc[item.department] ??= [];
    acc[item.department].push(item);
    return acc;
  }, {});
  return Object.entries(groups).map(([label, items]) => ({
    label,
    children: items.map((item) => ({ label: `${item.name} - ${item.position}` }))
  }));
});

async function load() {
  await employees.load(filters);
}

async function save(payload: Record<string, unknown>) {
  await createEmployee(payload);
  formVisible.value = false;
  await load();
}

onMounted(load);
</script>

<style scoped>
.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
}

.body-grid {
  align-items: start;
}
</style>
