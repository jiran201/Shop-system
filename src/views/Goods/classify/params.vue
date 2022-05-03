<template>
  <div>
    <Crumbs />
    <el-card shadow="always">
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
      />
      <div class="title">
        选择商品分类：
        <Cascader @change-id="getGoodsParams" style="display: inline-block" />
      </div>
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="动态参数" name="many">
          <ParaTabs />
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <ParaTabs />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import Crumbs from "@/components/Crumbs";
import Cascader from "@/pages/params/Cascader";
import { get } from "@/utils/http";
import ParaTabs from "./paraTabs.vue";
import { ref, watch, provide, reactive } from "vue";

const activeName = ref("many");
const tableData = reactive([]);
const ObjData = reactive({
  activeName: activeName.value,
  sortID: "",
  dialogVisible: false,
  isTitle: true,
});

// 获取参数
const getGoodsParams = (val) => {
  ObjData.sortID = val.value;
  if (val.value[val.value.length-1]) {
    const getData = async () => {
      ObjData.activeName=activeName.value;
      const res = await get(`categories/${val.value[val.value.length-1]}/attributes`, {
        sel: ObjData.activeName,
      });
      tableData.splice(0, tableData.length);
      Object.assign(tableData, res.data);
    };
    watch([()=>tableData,activeName], () => {
      getData();
    }, { immediate: true });
  }
};
provide("ObjData", ObjData);
provide("tableData", tableData);
</script>

<style lang='scss' scoped>
.title {
  line-height: 60px;
}
</style>