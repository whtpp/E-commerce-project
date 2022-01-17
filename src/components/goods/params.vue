<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
      >
      </el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            expand-trigger="hover"
            v-model="paramsKeys"
            :options="paramsList"
            :props="paramsProps"
            @change="handle_Change"
            clearable
            change-on-select
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handtagChange">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="showparamsDialogVisible"
            >添加参数</el-button
          >
          <el-table :data="manyTableDate" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  closable
                  @close="handleClose(i, scope.row)"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditParamsDialogVisible(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="showparamsDialogVisible"
            >添加属性</el-button
          >
          <el-table :data="onlyTableDate" border stripe>
                        <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  closable
                  @close="handleClose(i, scope.row)"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditParamsDialogVisible(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addparamsDialogVisible"
      width="50%"
      @close="addparamsDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addparamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addparams">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editparamsDialogVisible"
      width="50%"
      @close="editparamsDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editparamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editparams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paramsList: [],
      activeName: "many",
      paramsProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },

      manyTableDate: [],
      onlyTableDate: [],
      paramsKeys: [],
      addparamsDialogVisible: false,
      editparamsDialogVisible: false,
      addForm: {
        attr_name: "",
      },
      editForm: {
        attr_name: "",
      },
      addRules: {
        attr_name: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
      editRules: {
        attr_name: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getParamsList();
  },

  methods: {
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false;
        row.inputValue = "";
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(",")
        }
      );
      console.log(row.attr_vals);
      if (res.meta.status != 200) return this.$message.error("修改失败");
      this.$message.success("修改成功");
    },
    async handleClose(i, row) {
      row.attr_vals.splice(i,1)
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(",")
        }
      );
      if (res.meta.status != 200) return this.$message.error("修改失败");
      this.$message.success("修改成功");
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    async getParamsList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status != 200) return this.$message.error("获取失败");
      this.$message.success("获取成功");
      this.paramsList = res.data;
    },
    handle_Change() {
      this.getParamsDate();
    },
    handtagChange() {
      this.getParamsDate();
    },
    showparamsDialogVisible() {
      this.addparamsDialogVisible = true;
    },
    async showEditParamsDialogVisible(attr_id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        { params: { attr_sel: this.activeName } }
      );
      if (res.meta.status != 200) {
        return this.$message.error("获取失败");
      }
      this.editForm = res.data;
      this.editparamsDialogVisible = true;
    },
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该项, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status != 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getParamsDate();
    },
    addparams() {
      this.$refs.addRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          { attr_name: this.addForm.attr_name, attr_sel: this.activeName }
        );
        if (res.meta.status != 201) {
          return this.$message.error("添加失败");
        }
        this.addparamsDialogVisible = false;
        this.getParamsDate();
      });
    },
    editparams() {
      this.$refs.editRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        );
        if (res.meta.status != 200) {
          return this.$message.error("修改失败");
        }
        this.editparamsDialogVisible = false;
        this.getParamsDate();
      });
    },
    async getParamsDate() {
      if (this.paramsKeys.length != 3) {
        this.paramsKeys = [];
        this.manyTableDate=[];
        this.onlyTableDate=[];
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      );
      if (res.meta.status != 200) {
        return this.$message.error("获取参数列表失败");
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
        item.inputVisible = false;
        item.inputValue = "";
      });
      this.$message.success("获取参数列表成功");
      console.log(res.data);
      if (this.activeName === "many") {
        this.manyTableDate = res.data;
      } else {
        this.onlyTableDate = res.data;
      }
    },
    addparamsDialogClosed() {
      this.$refs.addRef.resetFields();
    },
    editparamsDialogClosed() {
      this.$refs.editRef.resetFields();
    },
  },
  computed: {
    isBtnDisabled() {
      if (this.paramsKeys.length != 3) {
        return true;
      }
      return false;
    },
    cateId() {
      if (this.paramsKeys.length === 3) {
        return this.paramsKeys[2];
      }
      return null;
    },
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    },
  },
};
</script>

<style lang="less" scoped>
.el-alert {
  width: 35%;
}
.el-row {
  margin: 15px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 100px;
}
</style>