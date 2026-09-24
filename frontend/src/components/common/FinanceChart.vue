<template>
  <div ref="chartRef" class="finance-chart" />
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  type: 'bar' | 'line' | 'pie';
  title: string;
  labels: string[];
  values: number[];
}>();

const chartRef = ref<HTMLDivElement>();
let chart: echarts.ECharts | null = null;

function render() {
  if (!chartRef.value) return;
  chart ??= echarts.init(chartRef.value);
  chart.setOption({
    title: { text: props.title, left: 0, textStyle: { fontSize: 15 } },
    tooltip: {},
    grid: { left: 38, right: 16, bottom: 28, top: 52 },
    xAxis: props.type === 'pie' ? undefined : { type: 'category', data: props.labels },
    yAxis: props.type === 'pie' ? undefined : { type: 'value' },
    series: [
      props.type === 'pie'
        ? { type: 'pie', radius: ['42%', '70%'], data: props.labels.map((name, index) => ({ name, value: props.values[index] })) }
        : { type: props.type, data: props.values, itemStyle: { color: '#0f766e' }, smooth: true }
    ]
  });
}

onMounted(() => {
  render();
  window.addEventListener('resize', render);
});
watch(() => [props.type, props.labels, props.values], render, { deep: true });
onBeforeUnmount(() => {
  window.removeEventListener('resize', render);
  chart?.dispose();
});
</script>

<style scoped>
.finance-chart {
  width: 100%;
  height: 280px;
}
</style>
