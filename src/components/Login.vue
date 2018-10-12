<template>
  <div class="login">
		<div class="loginCont">
      <div class="loginBox">
        <span>Please Login:</span>
        <el-input class="elinput1" v-model="username" placeholder="请输入用户名" maxlength="10"></el-input>
        <el-input type="password" v-model="userpword" v-if="!showPassword" placeholder="请输入密码" maxlength="16" @keyup.native.enter="login">
          <i slot="suffix" title="显示密码" @click="changePass('hide')" class="el-icon-view eye"></i>
        </el-input>
        <el-input type="text" v-model="userpword" v-if="showPassword" placeholder="请输入密码" maxlength="16" @keyup.native.enter="login">
          <i slot="suffix" title="隐藏密码" @click="changePass('hide')" style="color:#409eff;" class="el-icon-view eye"></i>
        </el-input>
        <el-button type="primary" @click="login">登录</el-button>
      </div>
		</div>
  </div>
</template>

<script>
import apiUrl from '@/api/url.js'

export default {
	name: 'Login',
	data() {
		return {
      username: '',
      userpword: '',
      showPassword: false,
		}
	},
  created() {
    if(sessionStorage.getItem("xia_username") && sessionStorage.getItem("xia_password")) {
      var self = this,
        params = {
          username: sessionStorage.getItem("xia_username"),
          userpword: window.atob(sessionStorage.getItem("xia_password"))
        };
      apiUrl.postLogin(params).then(function(res) {
        if(res.data.resultsCode === "success") {
          self.$router.replace({ path: 'admin' });
          return;
        } else {
          self.$message({
            type: 'error',
            message: "请重新登陆"
          });
          return;
        }
      }).catch(function(res) {
        self.$message({
          type: 'error',
          message: res.data.message
        });
      });
    }
  },
	methods: {
		login() {
      if(!this.checkEmpty()) {
        return;
      }
      var self = this,
          params = {
            username: self.username,
            userpword: self.userpword
          };
      apiUrl.postLogin(params).then(function(res) {
        if(res.data.resultsCode === "success") {
          self.$router.replace({ path: 'admin' });
          sessionStorage.setItem("xia_username", self.username);
          sessionStorage.setItem("xia_password", window.btoa(self.userpword));
        } else if(res.data.resultsCode === "error") {
          self.$message({
            type: 'error',
            message: "密码错误，请重新输入密码"
          });
          self.userpword = '';
        } else {
          self.$message({
            type: 'error',
            message: "用户不存在，请重新输入用户名"
          });
        }
      }).catch(function(res) {
        self.$message({
          type: 'error',
          message: res.data.message
        });
      });
    },
    // 查是否为空
    checkEmpty() {
      if(this.username !== '' && this.userpword !== '') {
        return true;
      }
      let warning = this.username === '' ? '账号':'密码';
      this.$message({
        type: 'warning',
        message: warning + "不可为空"
      });
      return false;
    },
    changePass() {
      this.showPassword = !this.showPassword;
    }
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .login {
    height: 100%;
    .loginCont {
      height: 100%;
      background: url('~@/assets/login.jpg') no-repeat fixed;
      background-size: 100% 100%;
      .loginBox {
        width: 250px;
        height: 300px;
        position: absolute;
        right: 16rem;
        top: 16rem;
        border-radius: 10px;
        padding: 30px 15px 0px;
        background-color:rgba(181, 182, 181, 0.5);
        z-index: 3;
        > span {
          position: absolute;
          font-size: 20px;
          font-weight: rgba(38, 39, 38, 0.5);
        }
        .el-input {
          margin-top: 30px;
          // .el-input__inner {
          //   BACKGROUND-COLOR: transparent;
          // }
          .eye {
            cursor: pointer;
            margin-right: 5px;
            line-height: 40px;
            font-size: 20px;
          }
        }
        .elinput1 {
          margin-top: 60px;
        }
        .el-button {
          width: 100%;
          margin-top: 50px;
        }
      }
    }
    .loginCont:after{
      content: "";
      width:100%;
      height:100%;
      position: absolute;
      left:0;
      top:0;
      background: inherit;
      filter: blur(10px);
      z-index: 2;
    }
  }
</style>
