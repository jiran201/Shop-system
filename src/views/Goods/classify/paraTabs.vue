<template>
  <div>
    <el-button type="primary" :disabled="isDisabled" @click="addPara">{{
      ObjData.activeName == "many" ? "添加参数" : "添加属性"
    }}</el-button>
    <el-table :data="newTableData" stripe border style="width: 100%">
      <el-table-column width="50" type="expand">
        <template #default="scoped">
          <el-tag
            v-for="(item, index) in newTags[scoped.$index].attr_vals.split(',')"
          v-show="item ? true :false"
            :key="index"
            >{{item}}</el-tag
          >
          <el-input
            style="margin: 0 10px"
            v-if="showData[scoped.$index].show"
            ref="input"
            @blur="blurChange(scoped.row, scoped.$index)"
            v-model.trim="inputVal"
          />
          <el-button
            style="margin: 0 10px"
            v-else
            @click="handleClick(scoped.row, scoped.$index)"
            >+ New Tag</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="#" width="50" type="index" />
      <el-table-column
        prop="attr_name"
        :label="ObjData.activeName == 'many' ? '参数名称' : '属性名称'"
      />
      <el-table-column label="操作">
        <template #default="scoped">
          <el-button
            type="primary"
            size="small"
            :icon="Edit"
            @click="editPara(scoped.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="small"
            :icon="Delete"
            @click="handleDelete(scoped.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <ParaDialog />
  </div>
</template>

<script>
import { inject, ref, watchEffect, provide, reactive, watch } from "vue";
import { Edit, Delete } from "@element-plus/icons-vue";
import ParaDialog from "./paradialog.vue";
import { put, del } from "@/utils/http";
import { hints } from "@/utils/hints";
import { clone } from "xe-utils";

export default {
  name: "ParaTabs",
  components: { ParaDialog },
  setup() {
    const { hint, confirm } = hints();
    const ObjData = inject("ObjData");
    const tableData = inject("tableData");
    const newTableData = ref([]);
    const newTags = ref([]);
    const showData = ref([]);

    const form = reactive({
      attr_name: "",
      attr_sel: ObjData.activeName,
      attr_vals: "",
    });
    const inputVal = ref("");
    const isDisabled = ref(true);

    watch(tableData, (val) => {
      if (val.length) {
        showData.value = [];
        newTableData.value = [...val];
        newTags.value = clone(val, true);
        val.forEach((item) =>
          showData.value.push({
            attr_id: item.attr_id,
            show: false,
          })
        );
      }
    });

    watchEffect(() => {
      isDisabled.value = ObjData.sortID[ObjData.sortID.length - 1]
        ? false
        : true;
    });
    // 修改
    const editPara = (row) => {
      ObjData.dialogVisible = true;
      ObjData.isTitle = false;
      Object.assign(form, row);
    };
    // 添加
    const addPara = () => {
      for (let k in form) {
        k == "attr_sel" ? (form[k] = ObjData.activeName) : (form[k] = "");
      }
      ObjData.dialogVisible = true;
      ObjData.isTitle = true;
    };
    // 删除
    const handleDelete = (row) => {
      confirm("此操作将永久删除该参数", async () => {
        const result = await del(
          `categories/${ObjData.sortID[2]}/attributes/${row.attr_id}`
        );
        hint(result);
      });
    };
    // 按钮点击
    const input = ref(null);
    const handleClick = (row, index) => {
      showData.value[index].show = true;
      Object.assign(form, row);
    };
    // 添加vals
    const blurChange = async (row, index) => {
      showData.value[index].show = false;
      if (inputVal.value.length) {
        form.attr_vals = `${newTags.value[index].attr_vals},${inputVal.value}`;
        const res = await put(
          `categories/${form.cat_id}/attributes/${form.attr_id}`,
          form
        );
        newTags.value[index].attr_vals = res.data.attr_vals;
        inputVal.value = "";
      }
    };
    provide("isTitle", ObjData);
    provide("form", form);
    return {
      Edit,
      Delete,
      ObjData,
      isDisabled,
      editPara,
      ParaDialog,
      addPara,
      handleDelete,
      handleClick,
      input,
      blurChange,
      inputVal,
      showData,
      newTableData,
      newTags,
    };
  },
};
</script>

<style lang='scss' scoped>
@import "@/common/style/style.scss";
.el-input {
  width: 80px;
}
</style>