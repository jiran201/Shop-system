<template>
  <div>
    <Crumbs />
    <el-card shadow="always">
      <div class="inputSelect">
        <el-input
          v-model="params.query"
          placeholder="请输入内容"
          class="input-with-select"
          size="large"
          clearable
        >
          <template #append>
            <el-button :icon="Search" @click="search" />
          </template>
        </el-input>
        <el-button type="primary" size="large" @click="addUser">添加用户</el-button>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="#" width="50" height="50" />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="mobile" label="电话" />
        <el-table-column prop="role_name" label="角色" />
        <el-table-column label="状态">
          <template #default="scope">
            <el-switch
              v-model="scope.row.mg_state"
              class="ml-2"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changState(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="revamp(scope.row)" :icon="Edit" />
            <el-button
              type="danger"
              @click="delUser(scope.row.id)"
              :icon="Delete"
            />
            <el-tooltip
              placement="top-start"
              class="box-item"
              content="分配角色"
              effect="dark"
            >
              <el-button
                type="warning"
                @click="rights(scope.row.id)"
                :icon="Star"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="demo-pagination-block">
        <el-pagination
          v-model:currentPage="params.pagenum"
          v-model:page-size="params.pagesize"
          :page-sizes="[2, 4, 8, 10]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
      <el-dialog
        v-model="dialogTableVisible"
        :title="isTitle ? '添加用户' : '修改用户'"
      >
        <el-form
          :model="userArr"
          status-icon
          label-width="120px"
          class="demo-ruleForm"
          ref="ruleFormRef"
          :rules="rules"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="userArr.username"
              :disabled="!isTitle"
              autocomplete="off"
              size="large"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password" v-if="isTitle">
            <el-input v-model="userArr.password" type="password" size="large" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userArr.email" autocomplete="off" size="large" />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input
              v-model="userArr.mobile"
              autocomplete="off"
              size="large"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cancel" size="large">取消</el-button>
            <el-button type="primary" size="large" @click="submitUser"
              >确定</el-button
            >
          </span>
        </template>
      </el-dialog>
      <el-dialog v-model="dialogRights" title="分配角色">
        <p>当前的用户：admin</p>
        <p>当前的用户：超级管理员</p>
        <p>
          分配新角色:
          <el-select
            v-model="id.rId"
            class="m-2"
            placeholder="请选择"
            size="large"
            popper-class="select-option"
          >
            <el-option
              v-for="item in rolesArr"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            />
          </el-select>
        </p>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cancel" size="large">取消</el-button>
            <el-button type="primary" size="large" @click="submitRoles"
              >确定</el-button
            >
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Crumbs from "@/components/Crumbs";
import { ref, watchEffect, reactive } from "vue";
import { Search, Edit, Star, Delete } from "@element-plus/icons-vue";
import { get, put, post, del } from "@/utils/http";
import { hints } from "@/utils/hints";

// 验证表单
const verifyEffect = () => {
  const ruleFormRef = ref("");
  // 邮箱验证
  const checkEmail = (rule, value, callback) => {
    const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    if (!value) {
      return callback(new Error("请输入邮箱"));
    }
    setTimeout(() => {
      if (mailReg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入合法邮箱!"));
      }
    }, 100);
  };
  // 手机号验证
  const checkMobile = (rule, value, callback) => {
    const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
    if (!value) {
      return callback(new Error("请输入手机号"));
    }
    setTimeout(() => {
      if (phoneReg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入合法手机号!"));
      }
    }, 100);
  };
  const rules = reactive({
    username: [
      { required: true, message: "请输入用户名", trigger: "blur" },
      { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
    ],
    password: [
      { required: true, message: "请输入密码", trigger: "blur" },
      { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "blur" },
    ],
    email: [{ required: true, validator: checkEmail, trigger: "blur" }],
    mobile: [{ required: true, validator: checkMobile, trigger: "blur" }],
  });
  return { ruleFormRef, rules };
};

// 获取用户列表和分页功能
const GetDataEffect = () => {
  const tableData = ref([]);
  const params = reactive({
    query: "",
    pagenum: 1,
    pagesize: 2,
  });
  let total = ref();
  // 获取用户列表
  const getData = async () => {
    const result = await get("users", params);
    tableData.value = result.data.users;
    total.value = result.data.total;
  };
  // 监听用户列表
  watchEffect(() => {
    getData();
  });
  // 查询用户
  const search = async () => {
    getData();
  };
  return { tableData, params, total, search, getData };
};

// 分配角色
const rolesEffect = (hint,getData) => {
  const rolesArr = ref([]);
  let dialogRights = ref(false);
  const id = reactive({
    rid: "",
    userId: "",
  });
  // 获取角色列表
  const getRoles = async () => {
    const result = await get(`roles`);
    rolesArr.value = result.data;
  };
  // 权限按钮
  const rights = async (rowId) => {
    dialogRights.value = true;
    id.userId = rowId;
    getRoles();
  };
  // 权限提交按钮
  const submitRoles = async () => {
    dialogRights.value = false;
    const result = await put(`users/${id.userId}/role`, {
      rid: id.rId,
    });
    getRoles();
    hint(result);
    getData()
  };
  return { rolesArr, id, rights, submitRoles, dialogRights };
};

export default {
  name: "users",
  components: { Crumbs },
  setup() {
    const { hint, confirm } = hints();
    const { ruleFormRef, rules } = verifyEffect();
    const { tableData, params, total, search, getData } = GetDataEffect();
    const { rolesArr, id, rights, submitRoles, dialogRights } = rolesEffect(hint,getData)
    let dialogTableVisible = ref(false);
    const userArr = reactive({
      username: "",
      password: "",
      email: "",
      mobile: "",
    });
    let isTitle = ref(true);
    // 添加用户
    const addUser = () => {
      dialogTableVisible.value = true;
      isTitle.value = true;
      for (let k in userArr) {
        userArr[k] = "";
      }
    };
    // 改变用户状态
    const changState = async (row) => {
      const result = await put(`users/${row.id}/state/${row.mg_state}`);
      hint(result);
    };
    // 取消按钮
    const cancel = () => {
      dialogTableVisible.value = false;
      dialogRights.value = false;
    };
    // 确定按钮
    const submitUser = async () => {
      dialogTableVisible.value = false;
      const result = await (isTitle.value
        ? post("users", userArr)
        : put(`users/${userArr.id}`, userArr));
      hint(result);
      getData();
      delete userArr?.id;
    };
    // 修改用户
    const revamp = async (row) => {
      dialogTableVisible.value = true;
      isTitle.value = false;
      Object.assign(userArr, row);
    };
    // 删除用户
    const delUser = (id) => {
      confirm("此操作将永久删除该用户",async () => {
        const result = await del(`users/${id}`);
        hint(result);
        getData();
      });
    };
    return {
      total,
      tableData,
      Search,
      params,
      Edit,
      Star,
      Delete,
      search,
      addUser,
      dialogTableVisible,
      changState,
      hint,
      cancel,
      userArr,
      submitUser,
      isTitle,
      revamp,
      delUser,
      rights,
      dialogRights,
      rolesArr,
      id,
      submitRoles,
      ruleFormRef,
      rules,
    };
  },
};
</script>

<style lang='scss' scoped>
@import '@/common/style/style.scss';
.el-table {
  margin-bottom: 20px;
}
.el-dialog p {
  padding: 7px 0;
}
</style>