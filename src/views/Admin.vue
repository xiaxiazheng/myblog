<template>
  <div class="admin">
    <Nav type="admin"></Nav>
    <router-view class="adminrouter"></router-view>
  </div>
</template>

<script>
import apiUrl from '@/api/url.js'
import Nav from "@/components/Nav";

export default {
	name: 'Admin',
	components: {
		Nav
	},
  data() {
		return {
			
		};
	},
	beforeCreate() {
		if(sessionStorage.getItem("xia_username") && sessionStorage.getItem("xia_password")) {
      var self = this,
        params = {
          username: sessionStorage.getItem("xia_username"),
          userpword: window.atob(sessionStorage.getItem("xia_password"))
        };
      apiUrl.postLogin(params).then(function(res) {
        if(res.data.resultsCode === "success") {
          return;
        } else {
          self.$message({
            type: 'error',
            message: "请重新登陆"
          });
          self.$router.push('/login');
        }
      }).catch(function(res) {
        self.$message({
          type: 'error',
          message: res.message
        });
      });
    } else {
      this.$message({
        type: 'warning',
        message: "请先登陆"
      });
      this.$router.push('/login');
    }
	},
	mounted() {
		this.$nextTick(function() {
			this.init();
		});
	},
	methods: {
		init() {
			
		},
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../static/global.less';

  .admin {
		height: 100%;
		.adminrouter {
			height: calc(100% - 3.6rem);
		}
  }
</style>
