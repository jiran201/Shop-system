<template>
  <el-container>
    <el-header>
      <div>
        <span>电商后台管理系统</span>
      </div>
      <div>
        <el-button type="info" @click="handleClose" size="large">退出登录</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="fold" @click="select">|||</div>
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          background-color="#353d41"
          text-color="#fff"
          active-text-color="#409EFF"
          :collapse-transition="false"
          :collapse="isCollapse"
          unique-opened
          router
        >
          <el-sub-menu :index="item.id + ''" v-for="item in data" :key="item.id">
            <template #title>
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item-group v-for="childrenItem in item.children" :key="childrenItem.id">
              <el-menu-item :index="'/'+childrenItem.path" @click="routeClick(item,childrenItem.id)">
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{ childrenItem.authName }}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view style="padding: 20px;"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { hints } from "@/utils/hints";
import { ref } from "vue";
import { get } from "@/utils/http";
import { User, Setting, Goods, Help, Search } from "@element-plus/icons-vue";

export default {
  name: "Home",
  components: { User, Setting, Goods, Help, Search },
  setup() {
    const isCollapse = ref(false);
    let data = ref([]);
    // 左侧菜单图标
    const iconArr = ["User", "Setting", "Goods", "Help", "Search"];
    const { hint, confirm } = hints();
    // 退出登录
    const handleClose = () => {
      confirm('您确定是否退出登录',"", "Login");
    };
    // 折叠的菜单
    const select = () => {
      isCollapse.value = !isCollapse.value;
    };
    // 获取左侧菜单
    const getData = async () => {
      const result = await get("menus");
      data.value = result.data;
      for (let key in data.value) {
        data.value[key].icon = iconArr[key];
      }
    };
    getData();
    // 左侧菜单点击
    const routeClick = (item,index) =>{
      sessionStorage.clear()
      const item1 = {};
      Object.assign(item1,item)
      item1.children = item1.children.filter(item=>{
          return item.id == index 
      })
      sessionStorage.setItem('item',JSON.stringify(item1))
    }
    return { routeClick,iconArr, handleClose, hint, confirm, select, isCollapse, data };
  },
};
</script>

<style>

html,
body,
#app,
.el-container {
  height: 100%;
}

.el-header {
  background-color: #353d41;
  color: #fff;
  text-align: center;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
}

.el-aside {
  background-color: #d3dce6;
  color: #fff;
  text-align: center;
  line-height: 200px;
  overflow: hidden;
}

.el-menu {
  width: 100%;
  height: 100%;
  border: 0;
}

.el-main {
  background-color: #e9eef3;
  color: #fff;
  padding: 0;
}

body > .el-container {
  margin-bottom: 40px;
}

.fold {
  height: 40px;
  line-height: 40px;
  background-color: #4a5065;
  color: #fff;
  cursor: pointer;
}
</style>