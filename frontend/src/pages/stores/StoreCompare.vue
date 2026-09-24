<template>
  <FinanceChart type="bar" title="多门店营收对比" :labels="stores.map((item) => item.name)" :values="stores.map((_, index) => (index + 1) * 12000)" />
</template>

<script setup lang="ts">
import FinanceChart from '@/components/common/FinanceChart.vue';
import type { Store } from '@/types/store';

defineProps<{ stores: Store[] }>();
</script>
