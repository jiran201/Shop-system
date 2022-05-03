<template>
  <div style="margin-bottom:20px">
    <el-breadcrumb :separator-icon="ArrowRight" v-for="item in data.children" :key="item.id">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ data.authName }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ item.authName }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import { ArrowRight } from "@element-plus/icons-vue";

export default {
  name: "Crumbs",
  setup() {
    const data = JSON.parse(sessionStorage.item);
    return { ArrowRight, data };
  },
};
</script>

<style>
</style>