<template>
  <div>
    <Crumbs />
    <el-card shadow="always">
      <el-button type="primary" size="large" @click="addRoles"
        >添加角色</el-button
      >
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="expand" label=">">
          <template #default="props">
            <el-row
              :class="props.row.children.length - 1 !== index ? 'current' : ''"
              v-for="(item, index) in props.row.children"
              :key="item.id"
            >
              <el-col :span="6">
                <el-tag closable @close="closeTag(props.row, item.id)">{{
                  item.authName
                }}</el-tag>
                <el-icon><caret-right /></el-icon>
              </el-col>
              <el-col :span="18">
                <el-row v-for="item in item.children" :key="item.id">
                  <el-col :span="6">
                    <el-tag
                      class="ml-2"
                      type="success"
                      @close="closeTag(props.row, item.id)"
                      closable
                      >{{ item.authName }}</el-tag
                    >
                    <el-icon><caret-right /></el-icon>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item in item.children"
                      @close="closeTag(props.row, item.id)"
                      :key="item.id"
                      class="ml-2"
                      type="warning"
                      closable
                      >{{ item.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="80" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleDesc" label="角色描述" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="revamp(scope.row)" :icon="Edit"
              >编辑</el-button
            >
            <el-button
              type="danger"
              @click="delRoles(scope.row.id)"
              :icon="Delete"
              >删除</el-button
            >
            <el-button
              type="warning"
              @click="allotRoles(scope.row)"
              :icon="Setting"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        v-model="dialogRoles"
        :title="isTitle ? '添加角色' : '修改角色信息'"
      >
        <el-form
          :model="rolesArr"
          status-icon
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称" prop="roleName" required>
            <el-input
              v-model="rolesArr.roleName"
              autocomplete="off"
              size="large"
            />
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc" required>
            <el-input v-model="rolesArr.roleDesc" size="large" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cancel" size="large">取消</el-button>
            <el-button type="primary" size="large" @click="submitRoles"
              >确定</el-button
            >
          </span>
        </template>
      </el-dialog>
      <el-dialog v-model="dialogAllot" title="分配权限">
        <el-tree
          :data="treeArr"
          :height="208"
          :props="{ label: 'authName' }"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="expandArr"
          ref="tree"
        />
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cancel" size="large">取消</el-button>
            <el-button type="primary" size="large" @click="submitTree"
              >确定</el-button
            >
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import Crumbs from "@/components/Crumbs";
import { ref, reactive, watchEffect } from "vue";
import { get, post, put, del } from "@/utils/http";
import { Edit, Setting, Delete, CaretRight } from "@element-plus/icons-vue";
import { hints } from "@/utils/hints";

const { hint, confirm } = hints();
const rolesArr = reactive({
  roleName: "",
  roleDesc: "",
});
const tableData = ref([]);
const dialogRoles = ref(false);
const isTitle = ref(true);
const dialogAllot = ref(false);
const treeArr = ref([]);
const expandArr = ref([]);
const rid = ref();
// 获取角色列表
const getRoles = async () => {
  const result = await get(`roles`);
  tableData.value = result.data;
};
watchEffect(() => {
  getRoles();
});
// 添加角色
const addRoles = () => {
  dialogRoles.value = true;
  isTitle.value = true;
  for (let k in rolesArr) {
    rolesArr[k] = "";
  }
};
// 取消按钮
const cancel = () => {
  dialogRoles.value = false;
  dialogAllot.value = false;
};
// 提交按钮
const submitRoles = async () => {
  dialogRoles.value = false;
  const result = await (isTitle.value
    ? post("roles", rolesArr)
    : put(`roles/${rolesArr.id}`, rolesArr));
  hint(result);
  getRoles();
  delete rolesArr?.id;
};
// 删除按钮
const delRoles = (id) => {
  confirm("此操作将永久删除该角色",async () => {
    const result = await del(`roles/${id}`);
    hint(result);
    getRoles();
  });

};
// 编辑按钮
const revamp = async (row) => {
  dialogRoles.value = true;
  isTitle.value = false;
  Object.assign(rolesArr, row);
  getRoles();
};
// 分配权限按钮
const allotRoles = async (row) => {
  dialogAllot.value = true;
  rid.value = row.id;
  expandArr.value = [];
  EachChildren(row.children);
  // 树形控件数据
  const result = await get(`rights/tree`);
  treeArr.value = result.data;
};
// 遍历所有id
const EachChildren = (obj) => {
  obj.forEach((item) => {
    if (item.children) {
      return EachChildren(item.children);
    }
    expandArr.value.push(item.id);
  });
};
// 树形控件提交
const tree = ref();
const submitTree = async () => {
  dialogAllot.value = false;
  const result = await post(`roles/${rid.value}/rights`, {
    rids: [
      ...tree.value.getCheckedKeys(),
      ...tree.value.getHalfCheckedKeys(),
    ].join(","),
  });
  hint(result);
  getRoles();
};
// 删除角色指定权限
const closeTag = async (row, id) => {
  const result = await del(`roles/${row.id}/rights/${id}`);
  hint(result);
  getRoles();
};
</script>

<style lang='scss' scoped>
@import "@/common/style/style.scss";
.el-row {
  margin: 10px;
  align-items: center;
}
.current {
  border-bottom: 1px solid #eee;
}
</style>