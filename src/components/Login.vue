<template>
  <div class="login">
		<div v-if="!showAdmin">
      <h1>登录</h1>
      <button @click="clickme">点我</button>
		</div>
		<Admin v-if="showAdmin"></Admin>
  </div>
</template>

<script>
import Admin from './Admin'

export default {
	name: 'Login',
	data() {
		return {
      showAdmin: false,
		}
	},
  components: {
		Admin
  },
  props: {
    msg: String
	},
	methods: {
		clickme() {
      this.showAdmin = true;
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .login {
    height: 100%;
    h1 {
      color: red;
    }
  }
</style>
