<template>
  <div>
    <Crumbs />
    <el-card>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column label="#" width="50" type="index" />
        <el-table-column prop="authName" label="权限名称" />
        <el-table-column prop="path" label="路径" />
        <el-table-column label="权限等级">
          <template #default='scope'>
            <el-tag :type="scope.row.level=== '0' ? '' : scope.row.level === '2' ? 'warning':'success'">
              {{scope.row.level=== '0' ? '一' : scope.row.level === '2' ? '二':'三'}}级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import Crumbs from "@/components/Crumbs";
import { ref } from "vue";
import { get } from "@/utils/http";

const tableData = ref([]);
const getRoles = async () => {
  const result = await get(`rights/list`);
  tableData.value = result.data
};
getRoles();
</script>

<style>
.el-table .el-table__cell {
  text-align: center;
}
.el-tag{
  padding: 10px;
}
</style>