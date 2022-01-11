<template>
  <el-container class="home_">
    <el-header>
      <div>
        <img src="../img/logo2.svg" alt="" />
        <span>缤购(BingGo)后台管理系统</span>
      </div>
      <el-button type="info" @click="out">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollaspe ? '64px' : '200px'">
        <div class="collaspe_button" @click="collaspeFold">|||</div>
        <el-menu
          active-text-color="#409Eff"
          background-color="#333744"
          text-color="#fff"
          @open="handleOpen"
          @close="handleClose"
          :unique-opened="true"
          :collapse="isCollaspe"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNameStatus('/' + subItem.path)"
            >
              <template>
                <i class="el-icon-s-grid"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iconObj: {
        125: "iconfont icon-users",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      isCollaspe: false,
      activePath:''
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: {
    out() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
    },
    collaspeFold() {
      this.isCollaspe = !this.isCollaspe;
    },
    saveNameStatus(activePath) {
      window.sessionStorage.setItem('activePath',activePath);
      this.activePath = activePath;
    }
  },
};
</script>

<style lang="less" scoped>
.home_ {
  height: 100%;
}
.el-header {
  background-color: #404046;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    img {
      position: absolute;
      top: 0;
      left: 30px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      opacity: 0.7;
    }
    span {
      padding-left: 100px;
    }
  }
}

.collaspe_button {
  font-size: 13px;
  background-color: rgb(92, 94, 94);
  color: #fff;
  line-height: 30px;
  text-align: center;
  letter-spacing: 0.3em;
  cursor: pointer;
}

.el-aside {
  background-color: #1a1717fb;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #fff;
}

.iconfont {
  margin-right: 5px;
}
</style>