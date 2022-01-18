<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="input3">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col>
          <el-table :data="orderList" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="订单编号"
              prop="order_number"
            ></el-table-column>
            <el-table-column
              label="订单价格"
              prop="order_price"
            ></el-table-column>
            <el-table-column label="是否付款" prop="pay_status">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.pay_status === '1'"
                  >已付款</el-tag
                >
                <el-tag type="danger" v-else>未付款</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="是否发货"
              prop="is_send"
              width="60px"
            ></el-table-column>
            <el-table-column label="下单时间" prop="create_time">
              <template slot-scope="scope">{{
                scope.row.create_time | dateFormat
              }}</template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showDialogVisible"
                ></el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-location"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog title="修改地址" :visible.sync="setDialogVisible" width="50%">
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-input v-model="addForm.address1"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setDialogVisible">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      orderList: [],
      setDialogVisible: false,
      addForm:{
          address1:'',
          address2:'',
      },
      citydata,
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) return this.$message.error("获取失败");
      this.$message.success("获取成功");
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newCurrentPage) {
      this.queryInfo.pagenum = newCurrentPage;
      this.getOrderList();
    },
    showDialogVisible() {
      this.setDialogVisible = true;
    },
  },
};
</script>

<style lang="less" scoped>
</style>