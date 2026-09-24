<template>
  <AppLayout>
    <div class="page-title">
      <h1>门店管理</h1>
      <el-segmented v-model="mode" :options="['卡片','表格']" />
    </div>
    <div v-if="mode === '卡片'" class="grid cols-3">
      <article v-for="store in stores.list" :key="store.id" class="panel store-card" @click="selected = store; detailVisible = true">
        <h2>{{ store.name }}</h2>
        <p>{{ store.address }}</p>
        <el-tag>{{ statusLabel[store.status] }}</el-tag>
        <small>{{ store.businessHours }} · {{ store.phone }}</small>
      </article>
    </div>
    <div v-else class="panel">
      <el-table :data="stores.list">
        <el-table-column prop="name" label="门店" />
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column label="状态"><template #default="{ row }">{{ statusLabel[row.status as keyof typeof statusLabel] }}</template></el-table-column>
      </el-table>
    </div>
    <div class="grid cols-2 lower">
      <div class="panel"><StoreCompare :stores="stores.list" /></div>
      <div class="panel">
        <h2>人员配置</h2>
        <EmployeeAvatar name="周然" employee-no="EMP-20260201-002" />
        <el-button text>调岗</el-button>
      </div>
    </div>
    <el-drawer v-model="detailVisible" title="门店详情"><StoreDetail :store="selected" /></el-drawer>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppLayout from '@/components/layout/AppLayout.vue';
import EmployeeAvatar from '@/components/common/EmployeeAvatar.vue';
import StoreCompare from './StoreCompare.vue';
import StoreDetail from './StoreDetail.vue';
import { useStoreStore } from '@/stores/storeStore';
import type { Store } from '@/types/store';

const stores = useStoreStore();
const mode = ref('卡片');
const detailVisible = ref(false);
const selected = ref<Store | null>(null);
const statusLabel = { OPEN: '营业中', RENOVATING: '装修中', CLOSED: '已关闭' };

onMounted(() => stores.load());
</script>

<style scoped>
.store-card {
  cursor: pointer;
}

.store-card h2 {
  margin: 0 0 8px;
}

.store-card p {
  min-height: 44px;
  color: #697066;
}

.store-card small {
  display: block;
  margin-top: 16px;
}

.lower {
  margin-top: 18px;
}
</style>
