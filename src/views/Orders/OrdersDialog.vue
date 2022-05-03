<template>
  <div>
    <el-dialog
      v-model="OrdersDialogVisible"
      :title="isTitle ? '修改地址' : '物流进度'"
    >
      <!-- <template #default> -->
      <el-form model="form" label-width="120px">
        <el-form-item label="">
          <el-input />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="OrdersDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPara">确定</el-button>
        </span>
        <!-- </template> -->
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { useStore } from "vuex";

export default {
  name: "OrdersDialog",
  setup() {
    const store = useStore();
    console.log(store.state);
    const { OrdersDialogVisible, isTitle } = store.state.OrdersObj
    console.log(OrdersDialogVisible);
    return { OrdersDialogVisible, isTitle };
  },
};
</script>

<style lang="scss" scoped></style>
