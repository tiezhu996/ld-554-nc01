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
      <el-alert
        type="info"
        :closable="false"
        show-icon
        title="离职当日起尚未打卡的班次将转给接手人；若离职者担任店长，门店负责人一并转移。"
        class="hint"
      />

      <el-descriptions :column="1" border size="small" class="meta">
        <el-descriptions-item label="离职员工">
          {{ preview?.employeeName }}（{{ preview?.employeeNo }}）
        </el-descriptions-item>
      </el-descriptions>

      <el-form label-width="92px" class="form">
        <el-form-item label="离职日期">
          <el-date-picker
            v-model="leaveDate"
            type="date"
            value-format="YYYY-MM-DD"
            :disabled-date="disablePast"
            @change="loadPreview"
          />
        </el-form-item>

        <el-form-item label="接手人" required>
          <el-select
            v-model="successorId"
            filterable
            placeholder="选择同店在职员工接手"
            style="width: 100%"
            :disabled="!preview || preview.candidates.length === 0"
          >
            <el-option
              v-for="candidate in preview?.candidates ?? []"
              :key="candidate.id"
              :label="`${candidate.name}（${candidate.employeeNo}）· ${candidate.position}`"
              :value="candidate.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <el-alert
        v-if="preview && preview.candidates.length === 0"
        type="error"
        :closable="false"
        show-icon
        title="没有合格的同店在职接手人"
        description="请先为该员工调岗或换店，安排好接手人后再办理离职；当前不会改动员工状态、班次和门店负责人。"
        class="warn"
      />

      <template v-else-if="preview">
        <el-descriptions :column="1" border size="small" class="impact">
          <el-descriptions-item label="待接班次">
            {{ preview.transferableShifts.length }} 个
            <span v-if="preview.checkedInShiftCount > 0" class="muted">
              （{{ preview.checkedInShiftCount }} 个已打卡班次不转移）
            </span>
          </el-descriptions-item>
          <el-descriptions-item v-if="preview.isManager" label="门店负责人">
            <el-tag type="warning" size="small">将转移 {{ preview.managedStoreIds.length }} 家门店的店长身份</el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <el-table
          v-if="preview.transferableShifts.length"
          :data="preview.transferableShifts"
          size="small"
          max-height="180"
          class="shift-table"
        >
          <el-table-column prop="date" label="日期" width="120" />
          <el-table-column label="班次">
            <template #default="{ row }">{{ ShiftTypeLabel[row.shiftType as keyof typeof ShiftTypeLabel] }}</template>
          </el-table-column>
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag size="small">{{ ShiftStatusLabel[row.status as keyof typeof ShiftStatusLabel] }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>

    <template #footer>
      <el-button @click="$emit('update:modelValue', false)">取消</el-button>
      <el-button
        type="primary"
        :loading="submitting"
        :disabled="!canSubmit"
        @click="handleSubmit"
      >
        确认办理离职
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { previewResign, resignEmployee } from '@/api/offboarding';
import { ShiftStatusLabel, ShiftTypeLabel } from '@/constants/enums';
import type { OffboardingPreview, ResignResult } from '@/types/offboarding';
import type { Employee } from '@/types/employee';

const props = defineProps<{ modelValue: boolean; employee: Employee | null }>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  done: [result: ResignResult];
}>();

const loading = ref(false);
const submitting = ref(false);
const preview = ref<OffboardingPreview | null>(null);
const leaveDate = ref(new Date().toISOString().slice(0, 10));
const successorId = ref<number | undefined>();

const canSubmit = computed(
  () => Boolean(preview.value && preview.value.candidates.length > 0 && successorId.value) && !submitting.value
);

function disablePast(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime();
}

async function handleOpen() {
  if (!props.employee) return;
  leaveDate.value = new Date().toISOString().slice(0, 10);
  successorId.value = undefined;
  await loadPreview();
}

async function loadPreview() {
  if (!props.employee) return;
  loading.value = true;
  try {
    const response = (await previewResign(props.employee.id, leaveDate.value)) as { data: OffboardingPreview };
    preview.value = response.data;
    if (response.data.candidates.length === 1) successorId.value = response.data.candidates[0].id;
    else if (!response.data.candidates.some((c) => c.id === successorId.value)) successorId.value = undefined;
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  if (!props.employee || !successorId.value) return;
  submitting.value = true;
  try {
    const response = (await resignEmployee(props.employee.id, successorId.value, leaveDate.value)) as unknown as {
      data: ResignResult;
      message: string;
    };
    ElMessage.success(response.message ?? '离职办理成功');
    emit('done', response.data);
    emit('update:modelValue', false);
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.hint,
.warn,
.meta,
.impact {
  margin-bottom: 14px;
}

.muted {
  color: var(--el-text-color-secondary);
}

.shift-table {
  margin-top: 10px;
}
</style>
