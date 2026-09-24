<template>
  <div class="employee-avatar" :class="size">
    <span>{{ initials }}</span>
    <div>
      <strong>{{ name }}</strong>
      <small>{{ employeeNo }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{ name: string; employeeNo: string; size?: 'sm' | 'md' }>(), { size: 'md' });
const initials = computed(() => props.name.slice(0, 1));
</script>

<style scoped>
.employee-avatar {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.employee-avatar > span {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #0f766e;
  color: white;
  font-weight: 700;
}

.employee-avatar.sm > span {
  width: 28px;
  height: 28px;
}

strong,
small {
  display: block;
  line-height: 1.2;
}

small {
  color: #697066;
}
</style>
