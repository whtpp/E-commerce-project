<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert
      title="添加商品信息"
      type="info"
      center
      show-icon
      :closable="false"
    ></el-alert>
    <el-steps
      :active="activeIndex - 0"
      :space="200"
      finish-status="success"
      align-center
    >
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <el-form
      :model="addForm"
      :rules="addRules"
      ref="addFormRef"
      label-width="100px"
      label-position="top"
    >
      <el-tabs
        @tab-click="tabClicked"
        :before-leave="beforeTabLeave"
        :tab-position="'left'"
        v-model="activeIndex"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称:" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格:" prop="goods_price">
            <el-input v-model="addForm.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量:" prop="goods_weight">
            <el-input v-model="addForm.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量:" prop="goods_number">
            <el-input v-model="addForm.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类:" prop="goods_cat">
            <el-cascader
              expand-trigger="hover"
              v-model="addForm.goods_cat"
              :options="cateList"
              :props="addProps"
              @change="handle_Change"
              clearable
              change-on-select
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数:" name="1">
          <el-form-item
            :label="item.attr_name"
            v-for="item in manyTableData"
            :key="item.attr_id"
          >
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                border
                :label="cb"
                v-for="(cb, i) in item.attr_vals"
                :key="i"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性:" name="2">
          <el-form-item
            :label="item.attr_name"
            v-for="item in onlyTableData"
            :key="item.attr_id"
          >
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片:" name="3">
          <el-upload
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headerObj"
            :on-success="handleSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容:" name="4">
          <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
          <el-button type="primary" style="margin: 15px" @click="add"
            >添加商品</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="pic" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      cateList: [],
      addProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      addForm: {
        goods_name: "11",
        goods_price: 1,
        goods_weight: 1,
        goods_number: 1,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      addRules: {
        goods_name: [{ required: true, message: "不能为空", trigger: "blur" }],
        goods_price: [{ required: true, message: "不能为空", trigger: "blur" }],
        goods_weight: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        goods_cat: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
      activeIndex: "0",
      manyTableData: [],
      onlyTableData: [],
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewPath: "",
      previewVisible: false,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status != 200) return this.$message.error("获取失败");
      this.$message.success("获取成功");
      this.cateList = res.data;
    },
    handle_Change() {
      if (this.addForm.goods_cat.length != 3) {
        this.addForm.goods_cat = [];
        return;
      }
    },
    beforeTabLeave(oldactivename, newactivename) {
      if (newactivename == 0 && this.addForm.goods_cat.length != 3) {
        return false;
      }
    },
    async tabClicked() {
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "many" } }
        );
        if (res.meta.status != 200) return this.$message.error("获取失败");
        this.$message.success("获取动态参数成功");
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
        });
        console.log(res.data);
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "only" } }
        );
        if (res.meta.status != 200) return this.$message.error("获取失败");
        this.$message.success("获取静态属性成功");
        this.onlyTableData = res.data;
      }
    },
    handleSuccess(response) {
      console.log(response);
      const picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
      console.log(this.addForm.pics);
    },
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex((x) => {
        x.pic === filePath;
      });
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm);
    },
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项");
        }
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        console.log(form.goods_cat);
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(newInfo);
        });
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addForm.attrs.push(newInfo);
        });

        form.attrs = this.addForm.attrs;
        console.log(form.attrs);
        console.log(form);
        const { data: res } = await this.$http.post("goods", form);
        console.log(res)
        if (res.meta.status != 201) {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        this.$router.push("/goods");
      });
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px;
}
.el-alert {
  margin: 15px;
}
.el-steps_title {
  font-size: 13px;
}
.pic {
  width: 100%;
}
</style>