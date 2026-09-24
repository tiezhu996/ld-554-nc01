<template>
  <AppLayout>
    <div class="page-title">
      <h1>财务管理</h1>
      <el-button v-permission="['OWNER','MANAGER']" type="primary" :icon="Plus" @click="formVisible = true">新增记账</el-button>
    </div>
    <div class="panel filters">
      <el-select v-model="filters.type" placeholder="类型" clearable>
        <el-option v-for="(label, value) in TransactionTypeLabel" :key="value" :label="label" :value="value" />
      </el-select>
      <el-select v-model="filters.category" placeholder="分类" clearable>
        <el-option v-for="(label, value) in TransactionCategoryLabel" :key="value" :label="label" :value="value" />
      </el-select>
      <StoreSelector @change="(value) => filters.storeId = value as number" />
      <el-button @click="load">筛选</el-button>
    </div>
    <div class="grid cols-2">
      <div class="panel">
        <el-table :data="transactions.list">
          <el-table-column prop="date" label="日期" />
          <el-table-column label="类型"><template #default="{ row }">{{ TransactionTypeLabel[row.type as keyof typeof TransactionTypeLabel] }}</template></el-table-column>
          <el-table-column label="分类"><template #default="{ row }">{{ TransactionCategoryLabel[row.category as keyof typeof TransactionCategoryLabel] }}</template></el-table-column>
          <el-table-column label="金额"><template #default="{ row }">{{ money(row.amount) }}</template></el-table-column>
          <el-table-column prop="description" label="描述" />
        </el-table>
      </div>
      <div class="panel"><FinanceChart type="pie" title="分类统计" :labels="categoryLabels" :values="categoryValues" /></div>
      <div class="panel"><FinanceReport /></div>
    </div>
    <el-drawer v-model="formVisible" title="记账表单"><FinanceForm @submit="save" /></el-drawer>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import AppLayout from '@/components/layout/AppLayout.vue';
import StoreSelector from '@/components/common/StoreSelector.vue';
import FinanceChart from '@/components/common/FinanceChart.vue';
import FinanceForm from './FinanceForm.vue';
import FinanceReport from './FinanceReport.vue';
import { TransactionCategoryLabel, TransactionTypeLabel } from '@/constants/enums';
import { useTransactionStore } from '@/stores/transactionStore';
import { createTransaction } from '@/api/transaction';
import { money } from '@/utils/format';

const transactions = useTransactionStore();
const filters = reactive<Record<string, unknown>>({});
const formVisible = ref(false);
const categoryLabels = computed(() => Object.values(TransactionCategoryLabel));
const categoryValues = computed(() => Object.keys(TransactionCategoryLabel).map((key) => transactions.list.filter((item) => item.category === key).reduce((sum, item) => sum + Number(item.amount), 0)));

async function load() {
  await transactions.load(filters);
}

async function save(payload: Record<string, unknown>) {
  await createTransaction(payload);
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
</style>
