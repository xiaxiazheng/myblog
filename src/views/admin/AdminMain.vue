<template>
  <div class="adminmain">
    <uploadPhotoWall type="main"></uploadPhotoWall>
  </div>
</template>

<script>
import uploadPhotoWall from '@/components/uploadPhotoWall'

export default {
  name: 'AdminMain',
  components: {
    uploadPhotoWall
  }
}
</script>

<style lang="less">
@import '../../static/global.less';

  .adminmain {
    height: 100%;
  }
</style>
