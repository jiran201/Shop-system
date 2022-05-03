<template>
  <div>
    <Crumbs />
    <el-card shadow="always">
      <div ref="main" style="width: 100%; height: 400px"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { get } from "@/utils/http";
import Crumbs from "@/components/Crumbs";
import * as echarts from "echarts";
// 引入柱状图图表，图表后缀都为 Chart
onMounted(() => {
  init();
});
const main = ref();
async function init() {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(main.value);
  // 指定图表的配置项和数据
  var option = {};
  // 使用刚指定的配置项和数据显示图表。
  const res = await get("reports/type/1");
  option = res.data;
  option['title'] = {}
  option.title['text'] = "用户来源"
  myChart.setOption(option);
}
</script>

<style lang="scss" scoped></style>
