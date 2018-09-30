<template>
  <div class="adminmain">
    <UploadPhotoWall type="main"></UploadPhotoWall>
  </div>
</template>

<script>
import UploadPhotoWall from '@/components/UploadPhotoWall'

export default {
  name: 'AdminMain',
  components: {
    UploadPhotoWall
  }
}
</script>

<style lang="less">
@import '../../static/global.less';

  .adminmain {
    height: 100%;
  }
</style>
