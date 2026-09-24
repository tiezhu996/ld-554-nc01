<template>
  <div>
    <FinanceChart type="line" title="利润趋势" :labels="['1月','2月','3月','4月','5月']" :values="[12,18,11,24,20]" />
    <el-button :icon="Download" @click="exportReport">导出 Excel</el-button>
  </div>
</template>

<script setup lang="ts">
import { Download } from '@element-plus/icons-vue';
import FinanceChart from '@/components/common/FinanceChart.vue';
import { downloadText } from '@/utils/export';

function exportReport() {
  downloadText('profit-report.csv', 'month,profit\n2026-06,20000');
}
</script>
