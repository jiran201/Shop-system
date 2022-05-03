<template>
  <el-card shadow="always">
    <el-form
      :model="data"
      status-icon
      :rules="rules"
      ref="ruleFormRef"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="username" >
        <el-input
          v-model="data.username"
          autocomplete="off"
          size="large"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" >
        <el-input
          v-model="data.password"
          type="password"
          size="large"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="large" @click="submitForm(ruleFormRef)"
          >提交</el-button
        >
        <el-button size="large" @click="resetForm(ruleFormRef)"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { post } from "@/utils/http";
import { hints } from "@/utils/hints";
import { reactive, ref } from "vue";

// 表单验证
const verify = () => {
  const ruleFormRef = ref("");
  const checkUser = (rule, value, callback) => {
    if (value.trim() === "") {
      callback(new Error("请输入用户名"));
    } else {
      callback();
    }
  };
  const validatePass = (rule, value, callback) => {
    if (!value) {
      return callback(new Error("请输入密码"));
    } else {
      callback();
    }
  };
  const rules = reactive({
    username: [{ validator: checkUser, trigger: "blur" }],
    password: [{ validator: validatePass, trigger: "blur" }],
  });
  return { ruleFormRef, rules };
};

// 登录提交按钮
const submit = (hint) => {
  const data = reactive({ username: "admin", password: "123456" });
  const handleLogin = async () => {
    const result = await post("login", data);
    if (result?.meta?.status === 200) {
      localStorage.isLogin = true;
      localStorage.setItem("token", result.data.token);
      hint(result, "Home");
    }
  };
  const submitForm = (formEl) => {
    if (!formEl) return;
    formEl.validate((valid) => {
      if (valid) {
        handleLogin();
      } else {
        return false;
      }
    });
  };
  return { handleLogin, submitForm, data };
};

export default {
  name: "Login",
  setup() {
    const { hint } = hints();
    const { handleLogin, submitForm, data } = submit(hint);
    const { ruleFormRef, rules } = verify();
    // 重置表单
    const resetForm = (formEl) => {
      if (!formEl) return;
      formEl.resetFields();
    };
    return {
      handleLogin,
      data,
      submitForm,
      ruleFormRef,
      resetForm,
      hint,
      rules,
    };
  },
};
</script>

<style>
body {
  background: skyblue;
}
</style>
<style scoped>
.el-card {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  border-radius: 5px;
}
.el-form {
  margin: 50px 0;
}
</style>
