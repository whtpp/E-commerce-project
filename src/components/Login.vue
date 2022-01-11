<template>
  <div class="contain">
    <div class="login_">
      <div class="logo_">
        <img src="../img/logo.svg" alt="" />
      </div>
      <el-form
        ref="login_ref"
        :model="login_data"
        :rules="login_rules"
        class="form_"
      >
        <el-form-item prop="username">
          <el-input
            v-model="login_data.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="login_data.password"
            show-password
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <el-form-item class="login_btn">
          <el-button type="primary" @click="advancetest" round>登录</el-button>
          <el-button type="info" @click="resetLoginRef" round>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      login_data: {
        username: "admin",
        password: "123456",
      },
      login_rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginRef() {
      this.$refs.login_ref.resetFields();
    },
    advancetest() {
      this.$refs.login_ref.validate(async valid=>{
        if(!valid) return;
        const { data: res} = await this.$http.post("login",this.login_data);
        if(res.meta.status!=200){
           return this.$message.error('用户名或密码有误');
        }
        this.$message.success('登陆成功');
        // console.log(res);
        window.sessionStorage.setItem("token",res.data.token);
        this.$router.push("/home");
        }  
      )
    }
  }
}
</script>

<style lang="less" scoped>
.contain {
  background: url("../img/login.svg");
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  height: 100%;
}

.login_ {
  position: absolute;
  width: 400px;
  height: 250px;
  background-color: #fff;
  border-radius: 15px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.9;
}

.logo_ {
  position: absolute;
  width: 100px;
  height: 100px;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #646487;
  border-radius: 50%;
  padding: 7px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

.form_ {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 35px;
  box-sizing: border-box;
}
.login_btn {
  display: flex;
  justify-content: center;
}
</style>