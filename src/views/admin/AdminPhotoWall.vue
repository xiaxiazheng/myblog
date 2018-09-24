<template>
  <div class="adminwait">
    <uploadPhotoWall type="wall"></uploadPhotoWall>
  </div>
</template>

<script>
import uploadPhotoWall from '@/components/uploadPhotoWall'

export default {
  name: 'AdminWait',
  components: {
    uploadPhotoWall
  }
}
</script>

<style lang="less">
@import '../../static/global.less';

  .adminwait {
    height: 100%;
  }
</style>
