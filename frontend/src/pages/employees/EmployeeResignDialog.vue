<template>
  <el-dialog
    :model-value="modelValue"
    title="离职办理"
    width="560px"
    :close-on-click-modal="false"
    @update:model-value="$emit('update:modelValue', $event)"
    @open="handleOpen"
  >
    <div v-loading="loading">
      <template v-if="preview">
        <el-alert type="info" :closable="false" class="block">
          <template #title>
            为 <strong>{{ preview.employee.name }}（{{ preview.employee.employeeNo }}）</strong> 办理离职，
            请选择一名同店在职员工接手后续事务。
          </template>
        </el-alert>

        <el-form label-width="96px" class="block">
          <el-form-item label="离职日期">
            <el-date-picker
              v-model="resignDate"
              type="date"
              value-format="YYYY-MM-DD"
              :disabled-date="disableFuture"
              @change="reloadPreview"
            />
          </el-form-item>
        </el-form>

        <el-descriptions :column="1" border class="block">
          <el-descriptions-item label="待接手班次">
            {{ preview.pendingShiftCount }} 个
            <span class="muted">（{{ preview.resignDate }} 起尚未打卡的班次）</span>
          </el-descriptions-item>
          <el-descriptions-item label="店长交接">
            <el-tag v-if="preview.isStoreManager" type="warning">
              是「{{ preview.managedStore?.name }}」店长，门店负责人将一并转交
            </el-tag>
            <span v-else class="muted">非店长，无需交接门店</span>
          </el-descriptions-item>
        </el-descriptions>

        <el-alert
          v-if="!preview.hasEligibleSuccessor"
          type="error"
          :closable="false"
          class="block"
          title="没有合格接手人"
          :description="preview.hint ?? '请先调岗或换店，再办理离职'"
          show-icon
        >
          <div class="hint-actions">
            <el-button size="small" @click="$emit('require-transfer')">去调岗 / 换店</el-button>
          </div>
        </el-alert>

        <el-form v-else label-width="96px" class="block">
          <el-form-item label="接手人" required>
            <el-select v-model="successorId" placeholder="选择同店在职员工" filterable style="width: 100%">
              <el-option
                v-for="item in preview.successors"
                :key="item.id"
                :label="`${item.name}（${item.employeeNo}）· ${item.position}`"
                :value="item.id"
              >
                <span>{{ item.name }}</span>
                <span class="muted">（{{ item.employeeNo }}）· {{ item.position }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
    </div>

    <template #footer>
      <el-button @click="$emit('update:modelValue', false)">取消</el-button>
      <el-button
        type="primary"
        :loading="submitting"
        :disabled="!preview?.hasEligibleSuccessor || !successorId"
        @click="handleConfirm"
      >
        确认离职并交接
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { previewResignation, resignEmployee } from '@/api/employee';
import type { Employee, ResignationPreview, ResignationResult } from '@/types/employee';

const props = defineProps<{ modelValue: boolean; employee: Employee | null }>();
const emit = defineEmits<{
  'update:modelValue': [boolean];
  completed: [];
  'require-transfer': [];
}>();

const loading = ref(false);
const submitting = ref(false);
const preview = ref<ResignationPreview | null>(null);
const resignDate = ref(new Date().toISOString().slice(0, 10));
const successorId = ref<number | null>(null);

function disableFuture(date: Date) {
  return date.getTime() > Date.now();
}

async function reloadPreview() {
  if (!props.employee) return;
  loading.value = true;
  try {
    const response = (await previewResignation(props.employee.id, resignDate.value)) as {
      data: ResignationPreview;
    };
    preview.value = response.data;
    successorId.value = response.data.successors[0]?.id ?? null;
  } finally {
    loading.value = false;
  }
}

function handleOpen() {
  preview.value = null;
  successorId.value = null;
  resignDate.value = new Date().toISOString().slice(0, 10);
  void reloadPreview();
}

async function handleConfirm() {
  if (!props.employee || !successorId.value) return;
  submitting.value = true;
  try {
    const response = (await resignEmployee(props.employee.id, {
      successorId: successorId.value,
      resignDate: resignDate.value
    })) as unknown as { message: string; data: ResignationResult };
    ElMessage.success(response.message ?? '离职办理完成');
    emit('update:modelValue', false);
    emit('completed');
  } finally {
    submitting.value = false;
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) handleOpen();
  }
);
</script>

<style scoped>
.block {
  margin-top: 14px;
}

.muted {
  color: #909399;
  font-size: 12px;
}

.hint-actions {
  margin-top: 8px;
}
</style>
