<template>
  <div class="home">
    <Nav type="home"></Nav>
    <router-view class="homerouter"></router-view>
  </div>
</template>

<script>
import apiUrl from '@/api/url.js'
import Nav from '@/components/Nav'

export default {
  name: 'Home',
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
@import '../static/global.less';

  .home {
    height: 100%;
    .homerouter {
      height: calc(100% - 3.6rem);
    }
  }
</style>
