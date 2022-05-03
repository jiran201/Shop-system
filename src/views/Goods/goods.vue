<template>
  <div>
    <Crumbs />
    <el-card shadow="always">
      <div class="inputSelect">
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          size="large"
          clearable
        >
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>
        <el-button type="primary" size="large" @click="addGoods"
          >添加商品</el-button
        >
      </div>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column label="#" width="50" type="index" />
        <el-table-column prop="goods_name" label="商品名称" />
        <el-table-column prop="goods_price" label="商品价格(元)" width="150" />
        <el-table-column prop="goods_number" label="商品数量" width="150" />
        <el-table-column prop="goods_weight" label="商品重量" width="150" />
        <el-table-column prop="upd_time" label="创建时间" />
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
import { Search, Edit, Delete } from "@element-plus/icons-vue";
import { del } from "@/utils/http";
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import Paging from "@/components/paging";
import { hints } from "@/utils/hints";
const { hint, confirm } = hints();

const router = useRouter();
const tableData = ref([]);
// 获取商品列表
const getData = (getGoods) => {
  const GetGoods = async () => {
    const res = await getGoods("goods");
    tableData.value = res.result.data.goods;
  };
  watchEffect(() => {
    GetGoods();
  });
};
// 添加按钮
const addGoods = () => {
  router.push({ name: "Add" });
};
// 编辑按钮
const editGoods = (id) => {
  router.push({name:`Add`,query:{id:id}});
};
// 删除按钮
const handleDel = (id) => {
  confirm("此操作将永久删除该商品",async () => {
    const res = await del(`goods/${id}`)
    hint(res)
  })
}
</script>

<style lang='scss' scoped>
@import "@/common/style/style.scss";
</style>