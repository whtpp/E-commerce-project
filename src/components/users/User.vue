<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="success" round @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="userlist" style="width: 100%" stripe border>
        <el-table-column type="index" tabel="#"></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="150"
        ></el-table-column>

        <el-table-column
          prop="email"
          label="邮箱"
          width="150"
        ></el-table-column>

        <el-table-column
          prop="mobile"
          label="电话"
          width="150"
        ></el-table-column>

        <el-table-column
          prop="role_name"
          label="角色"
          width="150"
        ></el-table-column>

        <el-table-column prop="mg_state" label="状态" width="150">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              :circle="true"
              @click="editEvent(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :circle="true"
              @click="removeUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
              ><el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                :circle="true"
                @click="showDialogVisible(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="closeAddForm"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="closeEditForm"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog @close="setDialogVisibleClosed" title="分配角色" :visible.sync="setDialogVisible" width="50%">
      <span>
        <p>用户：{{ userInfo.username }}</p>
        <p>角色：{{ userInfo.role_name }}</p>
        <p>
          分配角色：
          <el-select v-model="selectedRoled" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    var checkTele = (rule, value, cb) => {
      const regTele =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regTele.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userInfo: {},
      userlist: [],
      rolesList: [],
      selectedRoled: "",
      total: 0,
      setDialogVisible: false,
      addDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 16,
            message: "长度在 5 到 16 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkTele, trigger: "blur" },
        ],
      },
      editDialogVisible: false,
      editForm: {},
      editRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkTele, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200)
        return this.$message.error("获取用户列表失败");
      this.userlist = res.data.users;
      this.total = res.data.total;
      console.log(res);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newCurrentPage) {
      this.queryInfo.pagenum = newCurrentPage;
      this.getUserList();
    },
    async userStateChanged(userinfo) {
      console.log(userinfo);
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      console.log(res);
      if (res.meta.status != 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新失败");
      }
      this.$message.success("更新成功");
    },
    closeAddForm() {
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status != 201) {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        this.addDialogVisible = false;
        this.getUserList();
      });
    },
    async editEvent(id) {
      const { data: res } = await this.$http.get(`users/${id}`);
      if (res.meta.status != 200) {
        return this.$message.error("查询失败");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    closeEditForm() {
      this.$refs.editFormRef.resetFields();
    },
    EditUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        );
        if (res.meta.status != 200) {
          return this.$message.error("更新失败");
        }
        this.$message.success("添加成功");
        this.editDialogVisible = false;
        this.getUserList();
      });
    },
    async removeUser(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
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
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status != 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.editDialogVisible = false;
      this.getUserList();
    },
    async showDialogVisible(userInfo) {
      this.userInfo = userInfo;
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200)
        return this.$message.error("获取角色列表失败");
      this.$message.success("获取角色列表成功");
      this.rolesList = res.data;
      this.setDialogVisible = true;
    },
    async selectedRoled() {
      if (!this.selectedRoled) {
        return this.$message.error("请选择要分配的角色");
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        { rid: this.selectedRoled }
      );
      if (res.meta.status != 200) return this.$message.error("更新角色失败");
      this.$message.success("更新角色成功");
      this.getUserList();
      this.setDialogVisible = true;
    },
    setDialogVisibleClosed() {
      this.selectedRoled = '';
      this.userInfo = {};
    },
  },
};
</script>

<style lang="less" scoped>
</style>
