<template>
  <AppLayout>
    <div class="page-title">
      <h1>排班管理</h1>
      <el-button-group>
        <el-button v-permission="['OWNER','MANAGER']" type="primary" :icon="Plus" @click="formVisible = true">创建排班</el-button>
        <el-button v-permission="['OWNER','MANAGER']" :icon="MagicStick" @click="autoPlan">自动排班</el-button>
      </el-button-group>
    </div>
    <div class="panel filters">
      <StoreSelector @change="(value) => filters.storeId = value as number" />
      <el-select v-model="filters.shiftType" placeholder="班次" clearable>
        <el-option v-for="(label, value) in ShiftTypeLabel" :key="value" :label="label" :value="value" />
      </el-select>
      <el-button @click="load">刷新</el-button>
    </div>
    <div class="panel week-board">
      <div v-for="day in weekDays" :key="day" class="day-col">
        <strong>{{ day }}</strong>
        <article v-for="shift in shifts.list.filter((item) => item.date.endsWith(day.slice(-2)))" :key="shift.id" draggable="true">
          <EmployeeAvatar :name="shift.employee?.name ?? `员工 ${shift.employeeId}`" :employee-no="shift.employee?.employeeNo ?? 'EMP'" size="sm" />
          <el-tag>{{ ShiftTypeLabel[shift.shiftType as keyof typeof ShiftTypeLabel] }}</el-tag>
          <small>{{ shift.startTime }} - {{ shift.endTime }}</small>
        </article>
      </div>
    </div>
    <div class="grid cols-2 lower">
      <div class="panel">
        <h2>换班申请</h2>
        <ShiftSwapRequest />
      </div>
      <div class="panel">
        <h2>排班统计</h2>
        <el-statistic title="本月预估工时" :value="shifts.list.length * 5" suffix="小时" />
      </div>
    </div>
    <el-drawer v-model="formVisible" title="创建排班"><ScheduleForm @submit="save" /></el-drawer>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { MagicStick, Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import AppLayout from '@/components/layout/AppLayout.vue';
import EmployeeAvatar from '@/components/common/EmployeeAvatar.vue';
import StoreSelector from '@/components/common/StoreSelector.vue';
import ScheduleForm from './ScheduleForm.vue';
import ShiftSwapRequest from './ShiftSwapRequest.vue';
import { ShiftTypeLabel } from '@/constants/enums';
import { createShift, autoGenerateShifts } from '@/api/shift';
import { useShiftStore } from '@/stores/shiftStore';

const shifts = useShiftStore();
const filters = reactive<Record<string, unknown>>({});
const formVisible = ref(false);
const weekDays = ['06-15', '06-16', '06-17', '06-18', '06-19', '06-20', '06-21'];

async function load() {
  await shifts.load(filters);
}

async function save(payload: Record<string, unknown>) {
  await createShift(payload);
  formVisible.value = false;
  await load();
}

async function autoPlan() {
  await autoGenerateShifts({ storeId: Number(filters.storeId ?? 1), date: new Date().toISOString().slice(0, 10) });
  ElMessage.success('已生成排班方案');
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

.week-board {
  display: grid;
  grid-template-columns: repeat(7, minmax(130px, 1fr));
  gap: 12px;
  overflow-x: auto;
}

.day-col {
  min-height: 260px;
  border-left: 1px solid #d9d2c4;
  padding-left: 12px;
}

article {
  margin-top: 12px;
  display: grid;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  background: #f4f1ea;
}

.lower {
  margin-top: 18px;
}
</style>
