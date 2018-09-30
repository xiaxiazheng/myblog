<template>
  <div class="treemain">
    <h1>树的首页</h1>
    <h2 v-if="type === 'home'">
      前台展示，施工中
    </h2>
    <h2 v-if="type === 'admin'">
      控制台，施工中
    </h2>
  </div>
</template>

<script>

export default {
  name: 'TreeMain',
  props: ['type'],
  components: {
  }
}
</script>

<style lang="less">
@import '../static/global.less';

  .treemain {
    height: 100%;
  }
</style>
