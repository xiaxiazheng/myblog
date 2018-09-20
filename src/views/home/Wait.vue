<template>
  <div class="wait">
    <div>这一版待定</div>
  </div>
</template>

<script>
import apiUrl from '@/api/url.js'

export default {
  name: 'Wait',
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

  .wait {
    height: 100%;
  }
</style>
