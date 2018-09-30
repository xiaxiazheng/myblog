<template>
  <div class="adminwait">
    <UploadPhotoWall type="wall"></UploadPhotoWall>
  </div>
</template>

<script>
import UploadPhotoWall from '@/components/UploadPhotoWall'

export default {
  name: 'AdminWait',
  components: {
    UploadPhotoWall
  }
}
</script>

<style lang="less">
@import '../../static/global.less';

  .adminwait {
    height: 100%;
  }
</style>
