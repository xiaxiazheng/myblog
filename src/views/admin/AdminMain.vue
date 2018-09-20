<template>
  <div class="adminmain">
    <div>我是控制台的主页哟</div>
  </div>
</template>

<script>
import apiUrl from '@/api/url.js'
import Nav from '@/components/Nav'

export default {
  name: 'AdminMain',
  components: {
    Nav
  },
  data() {
    return {
      
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../static/global.less';

  .adminmain {
    height: 100%;
  }
</style>
