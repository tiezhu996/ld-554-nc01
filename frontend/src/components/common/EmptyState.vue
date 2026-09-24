<template>
  <div class="empty-state">
    <el-icon><FolderOpened /></el-icon>
    <p>{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { FolderOpened } from '@element-plus/icons-vue';
defineProps<{ text: string }>();
</script>

<style scoped>
.empty-state {
  display: grid;
  place-items: center;
  min-height: 180px;
  color: #697066;
}

.el-icon {
  font-size: 32px;
}
</style>
