<template>
  <el-dialog v-model="visible" :title="title" width="420px">
    <p>{{ message }}</p>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="$emit('confirm')">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ title: string; message: string }>();
defineEmits<{ confirm: [] }>();
const visible = ref(false);
defineExpose({ open: () => (visible.value = true), close: () => (visible.value = false) });
</script>
