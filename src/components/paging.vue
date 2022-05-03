<template>
  <div>
    <el-pagination
      v-model:currentPage="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 4, 8, 10]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
    />
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { get } from "@/utils/http";

export default {
  name: "Paging",
  emits: ["get-Data"],
  setup(prop, { emit }) {
    const params = reactive({
      type:[1,2,3],
      query:"",
      pagenum: 1,
      pagesize: 2,
    });
    const total = ref(0);
    const getData = async (url) => {
      const result = await get(url, params);
      total.value = result?.data?.total;
      return { result };
    };
    emit("get-Data", getData,params);
    return { params, total };
  },
};
</script>

<style>
</style>