<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="success">添加角色</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="rolesList" border stripe>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row
                :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'v-center']"
                v-for="(item1, i1) in scope.row.children"
                :key="item1.id"
              >
                <el-col :span="5">
                  <el-tag closable @close="closeRight(scope.row, item1.id)">{{
                    item1.authName
                  }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-row
                    :class="[i2 === 0 ? '' : 'bdtop', 'v-center']"
                    v-for="(item2, i2) in item1.children"
                    :key="item2.id"
                  >
                    <el-col :span="6">
                      <el-tag
                        closable
                        @close="closeRight(scope.row, item2.id)"
                        type="success"
                        >{{ item2.authName }}</el-tag
                      >
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag
                        type="warning"
                        v-for="(item3, i3) in item2.children"
                        :key="item3.id"
                        closable
                        @close="closeRight(scope.row, item3.id)"
                        >{{ item3.authName }}</el-tag
                      >
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit"
                >编辑</el-button
              >
              <el-button size="mini" type="danger" icon="el-icon-delete"
                >删除</el-button
              >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="showDialogVisible(scope.row)"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <el-dialog
      @close="closeDialog"
      title="分配权限"
      :visible.sync="setDialogVisible"
      width="50%"
    >
      <span>
        <el-tree
          :data="rightList"
          :props="treeProps"
          @node-click="handleNodeClick"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
          ref="treeRef"
        ></el-tree>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      setDialogVisible: false,
      rightList: [],
      treeProps: {
        label: "authName",
        children: "children",
      },
      defKeys: [],
      roleId: "",
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200)
        return this.$message.error("获取角色列表失败");
      this.rolesList = res.data;
      return this.$message.success("获取角色列表成功");
      console.log(res);
    },
    async closeRight(role, rightId) {
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
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status != 200) return this.$message.error("删除失败");
      role.children = res.data;
    },
    async showDialogVisible(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status != 200) return this.$message.error("获取权限失败");
      this.rightList = res.data;
      this.setDialogVisible = true;
      console.log(role);
      this.getLeafKeys(role, this.defKeys);
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        return this.getLeafKeys(item, arr);
      });
    },
    closeDialog() {
      this.defKeys = [];
    },
    async allotRight() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );

      if (res.meta.status != 200) return this.$message.error("分配失败");
      this.$message.success("分配成功");

      this.getRolesList();
      this.setDialogVisible = false;
      
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
.v-center {
  display: flex;
  align-items: center;
}
</style>