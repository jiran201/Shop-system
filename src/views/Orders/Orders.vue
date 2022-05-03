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
      </div>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column label="#" width="50" type="index" />
        <el-table-column prop="order_number" label="订单编号" />
        <el-table-column prop="order_price" label="订单价格" />
        <el-table-column prop="pay_status" label="是否付款" />
        <el-table-column prop="order_pay" label="是否发货" />
        <el-table-column prop="create_time" label="下单时间" />
        <el-table-column prop="goods_name" label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              @click="editSite(scope.row.goods_id)"
              size="small"
              :icon="EditPen"
            ></el-button>
            <el-button
              type="success"
              size="small"
              @click="logisticsPlan(scope.row.goods_id)"
              :icon="LocationFilled"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <Paging @get-Data="getData" />
      <OrdersDialog />
    </el-card>
  </div>
</template>

<script setup>
import Crumbs from "@/components/Crumbs";
import Paging from "@/components/paging";
import { Search, EditPen, LocationFilled } from "@element-plus/icons-vue";
import { ref, watchEffect } from "vue";
import OrdersDialog from "./OrdersDialog";
import { useStore } from "vuex";

const tableData = ref([]);
const store = useStore();
const getData = (getGoods) => {
  const GetGoods = async () => {
    const res = await getGoods("orders");
    tableData.value = res.result.data.goods;
    console.log(tableData.value);
  };
  watchEffect(() => {
    GetGoods();
  });
};
// 修改地址
const OrdersDialogVisible = ref(false);
const isTitle = ref(true);
const editSite = () => {
  OrdersDialogVisible.value = true
  store.commit("changeDialog", {
    OrdersDialogVisible,
    isTitle,
  });
};
// 物流进度
const logisticsPlan = () => {
  // isTitle.value = false
};
</script>

<style lang="scss" scoped>
@import "@/common/style/style.scss";
</style>
