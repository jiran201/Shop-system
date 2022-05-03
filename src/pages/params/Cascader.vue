<template>
  <div>
    <el-cascader v-model="sortID" @change="changeID" :props="props" :options="optionArr" clearable size='large'/>
  </div>
</template>

<script>
import { ref } from "vue";
import { get } from "@/utils/http";

export default {
  name: "Cascader",
  emits:['change-id'],
  setup(prop,{ emit }) {
    const props = {
      value:'cat_id',
      label:'cat_name'
    }
    const optionArr = ref([]);
    const sortID = ref(0)
    // 获取商品分类数据
    const getData = async () => {
      const result = await get("categories");
      optionArr.value = result?.data;
    };
    getData();
    // 传递分类id
    const changeID = async () => {
      emit('change-id',sortID)
    }
    return { optionArr, props, sortID, changeID };
  },
};
</script>

<style>
</style>