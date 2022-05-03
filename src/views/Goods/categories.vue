<template>
  <div>
    <Crumbs />
    <el-card shadow="always">
      <el-button type="primary" size="large" @click="addSort"
        >添加分类</el-button
      >
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column label="序号" width="80" type="index" />
        <el-table-column prop="cat_name" label="分类名称">

        </el-table-column>
        <el-table-column prop="goods_price" label="是否有效" width="150" />
        <el-table-column prop="cat_level" label="排序" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button
              type="primary"
              @click="editGoods(scope.row.goods_id)"
              size="small"
              :icon="Edit"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleDel(scope.row.goods_id)"
              :icon="Delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <Paging @get-Data="getData" />
    </el-card>
  </div>
</template>

<script setup>
import Crumbs from "@/components/Crumbs";
import Paging from "@/components/paging";
import { reactive, watch } from "vue";
import { Edit, Delete } from "@element-plus/icons-vue";

const tableData = reactive([]);

const getData = (getGoods, params) => {
  params.pagesize = 10;
  const GetGoods = async () => {
    const res = await getGoods(`categories`);
    Object.assign(tableData, res.result.data.result);
  };
  watch(
    tableData,
    () => {
      GetGoods();
    },
    { immediate: true, deep: true }
  );
};
</script>

<style lang='scss' scoped>
@import "@/common/style/style.scss";
</style>