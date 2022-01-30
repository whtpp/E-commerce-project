<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="success" @click="showCateDialogVisible"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        border
        stripe
        :expand-type="false"
        show-index
        style="margin-top: 15px"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag type="success" size="mini" v-if="scope.row.cat_level === 0"
            >一级</el-tag
          >
          <el-tag
            type="primary"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
          >
            二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="warning">编辑</el-button>
          <el-button size="mini" type="danger">删除</el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 8, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加商品"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="商品分类" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            style="width: 100%"
            expand-trigger="hover"
            v-model="selection"
            :options="parentCateList"
            :props="cascaderProps"
            @change="handleChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data() {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      selection: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      total: 0,
      parentCateList: [],
      addCateDialogVisible: false,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      addForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      addRules: {
        cat_name: [
          { required: true, message: "请输入商品分类", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) return this.$message.error("获取失败");
      this.$message.success("获取成功");
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newCurrentPage) {
      this.queryInfo.pagenum = newCurrentPage;
      this.getCateList();
    },
    showCateDialogVisible() {
      this.addCateDialogVisible = true;
      this.getParentCateList();
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status != 200) return this.$message.error("获取错误");
      this.parentCateList = res.data;
    },
    handleChange() {
      if (this.selection.length > 0) {
        this.addForm.cat_pid = this.selection[this.selection.length - 1];
        this.addForm.cat_level = this.selection.length;
        return;
      } else {
        this.addForm.cat_pid = 0;
        this.addForm.cat_level = 0;
      }
    },
    addCate() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("categories", this.addForm);
        if (res.meta.status != 201) return this.$message.error("添加失败");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    addCateDialogClosed() {
      this.$refs.addFormRef.resetFields();
      this.selection = [];
      this.addForm.cat_level = 0;
      this.addForm.cat_pid = 0;
    },
  },
};
</script>

<style lang="less" scoped>
</style>