<template>
  <div class="swap-box">
    <el-steps :active="1" finish-status="success">
      <el-step title="员工发起" />
      <el-step title="对方确认" />
      <el-step title="管理员审批" />
    </el-steps>
    <el-alert title="换班流转已纳入审计范围，审批后会记录到操作日志。" type="info" show-icon />
  </div>
</template>

<style scoped>
.swap-box {
  display: grid;
  gap: 16px;
}
</style>
