<template>
  <div>
    <Crumbs />
    <el-card shadow="always">
      <el-alert title="添加商品信息" center type="info" show-icon />
      <el-steps :active="activeName - 0" finish-status="success" align-center>
        <el-step title="基本信息" />
        <el-step title="商品参数" />
        <el-step title="商品属性" />
        <el-step title="商品图片" />
        <el-step title="商品内容" />
        <el-step title="完成" />
      </el-steps>
      <el-form label-position="top" label-width="100px">
        <el-tabs
          :before-leave="beforeLeave"
          tab-position="left"
          class="demo-tabs"
          v-model="activeName"
        >
          <el-tab-pane label="基本信息" :name="0">
            <el-form-item label="商品名称">
              <el-input v-model="GoodsArr.goods_name" size="large" />
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input
                v-model="GoodsArr.goods_price"
                size="large"
                type="number"
              />
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input
                v-model="GoodsArr.goods_weight"
                size="large"
                type="number"
              />
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input
                v-model="GoodsArr.goods_number"
                size="large"
                type="number"
              />
            </el-form-item>
            <el-form-item label="商品分类">
              <Cascader @change-id="getGoodsParams" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" :name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in paramArr"
              :key="item.attr_id"
            >
              <el-checkbox
                :label="item"
                @change="changeCheck"
                :checked="true"
                v-for="(item, index) in item.attr_vals.split(',')"
                :key="index"
                size="large"
                border
              />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" :name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in GoodsAttrArr"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals" size="large" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" :name="3">
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers="headersObj"
              :on-success="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :file-list="listFile"
            >
              <el-button type="primary">点击商城</el-button>
              <template #tip>
                <div class="el-upload__tip">jpg/png 上传仅限于 500kb</div>
              </template>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" :name="4">
            <QuillEditor
              v-model:content="GoodsArr.goods_introduce"
              contentType="text"
              theme="snow"
              toolbar="full"
              style="height: 300px; margin-bottom: 10px"
            />
            <el-button type="primary" size="large" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Crumbs from "@/components/Crumbs";
import { ref, reactive } from "vue";
import Cascader from "@/pages/params/Cascader";
import { get, post, put } from "@/utils/http";
import { ElMessage } from "element-plus";
import { hints } from "@/utils/hints";
import { useRoute } from "vue-router";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default {
  name: "add",
  components: { Cascader, Crumbs, QuillEditor },
  setup() {
    const route = useRoute();
    const activeName = ref(0);
    const { hint } = hints();
    let GoodsArr = reactive({
      goods_name: "",
      goods_cat: "",
      goods_price: 0,
      goods_number: 0,
      goods_weight: 0,
      goods_introduce: "",
      pics: [],
      attrs: [],
    });
    const paramArr = ref([]);
    const GoodsAttrArr = ref([]);
    let sortID = ref(0);
    const listFile = ref([]);
    // 判断是否有id，编辑
    if (route?.query?.id) {
      const GetDataEdit = async () => {
        const res = await get(`goods/${route?.query?.id}`);
        Object.assign(GoodsArr, res?.data);
        // 显示图片
        res?.data?.pics?.forEach((item) => {
          listFile.value.push({ prc: item.pics_mid_url, id: item.pics_id });
        });
      };
      GetDataEdit();
    }
    // 判断商品分类是否选择
    const beforeLeave = (activeName) => {
      if (
        (activeName === 1 || activeName === 2) &&
        paramArr.value.length === 0
      ) {
        ElMessage({
          message: "请选择商品分类!",
          type: "error",
        });
        return Promise.reject(false);
      }
    };
    // 获取商品参数
    const getGoodsParams = async (val) => {
      sortID = val;
      GoodsArr.goods_cat = val.value.join(",");
      const res = await get(`categories/${sortID.value[2]}/attributes`, {
        sel: "many",
      });
      paramArr.value = res.data.map((item) => {
        return item;
      });
      getGoodsAttr();
    };
    // 判断checkbox是否勾选
    const changeCheck = (a, e) => {
      e.path[2].style.display = "none";
    };
    // 获取商品属性
    const getGoodsAttr = async () => {
      const res = await get(`categories/${sortID.value[2]}/attributes`, {
        sel: "only",
      });
      GoodsAttrArr.value = res.data.map((item) => {
        return item;
      });
    };
    // 已上传的文件
    const headersObj = reactive({ Authorization: localStorage.token });
    const handlePreview = async (File) => {
      GoodsArr.pics.push({ pic: File?.data?.tmp_path });
      hint(File);
    };
    // 添加商品按钮
    const addGoods = async () => {
      const result = await (route?.query?.id
        ? put(`goods/${route?.query?.id}`, GoodsArr)
        : post("goods", GoodsArr));
      hint(result, "Goods");
    };
    // 移除图片
    const handleRemove = (newVla) => {
      GoodsArr.pics.splice(
        GoodsArr.pics.filter((item, index) => {
          return item.pics_id != newVla.id ? "" : index;
        }),1
      );
    };
    return {
      GoodsArr,
      GoodsAttrArr,
      activeName,
      getGoodsParams,
      paramArr,
      beforeLeave,
      changeCheck,
      handlePreview,
      headersObj,
      addGoods,
      listFile,
      handleRemove,
    };
  },
};
</script>

<style lang='scss' scoped>
.el-form-item {
  margin-bottom: 22px;
}
.el-steps {
  margin: 20px 0;
}
</style>