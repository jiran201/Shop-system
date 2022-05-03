<template>
  <div>
    <el-dialog
      v-model="ObjData.dialogVisible"
      :title="ObjData.isTitle ? (ObjData.activeName=='many' ? '添加动态参数':'添加静态属性') : (ObjData.activeName=='many' ? '修改动态参数':'修改静态属性')"
    >
      <el-form :model="form" label-width="120px">
        <el-form-item :label="ObjData.activeName == 'many' ? '动态参数' : '静态属性'">
          <el-input v-model="form.attr_name"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ObjData.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPara"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { inject } from "vue";
import { post, put } from "@/utils/http";
import { hints } from "@/utils/hints";

export default {
  name: "ParaDialog",
  setup() {
    const { hint } = hints()
    const ObjData = inject("ObjData");
    const form = inject("form");
    // 提交
    const submitPara = async () => {
      ObjData.dialogVisible = false;
      const result = await (ObjData.isTitle ? post(`categories/${ObjData.sortID[ObjData.sortID.length-1]}/attributes`,form): put(`categories/${ObjData.sortID[2]}/attributes/${form.attr_id}`,form))
     hint(result)
    }
    return { ObjData, submitPara, form };
  },
};
</script>

<style>
</style>