<template>
  <div class="main">
    <el-carousel interval="5000" v-if="imgUrlList.length !== 0">
      <el-carousel-item v-for="item in imgUrlList" :key="item">
        <img :src="item" alt="">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import apiUrl from '@/api/url.js'
import Nav from '@/components/Nav'

export default {
  name: 'Main',
  components: {
    Nav
  },
  data() {
    return {
      imgUrlList: []
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.init();
    });
  },
  methods: {
    init() {
      let self = this,
          params = {
            type: 'main'
          };
      apiUrl.getImgList(params).then(function(res) {
        console.log(res);
        for(let item of res.data) {
          self.imgUrlList.push('http://localhost:3000/' + item.imgname);
        }
      }).catch(function(res) {
        console.log(res);
      });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '../../static/global.less';

  .main {
    height: calc(100% - 7.2rem) !important;
    padding: 1rem 3.6rem 2rem 0;
    max-width: 960px; // 走马灯宽度
    margin: 0 auto;
    .el-carousel__container {
      height: 540px !important;  // 走马灯高度，960*540比例16:9   
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
