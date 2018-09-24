<template>
  <div class="photowall">
    <div>
      <el-upload
        action="#"
        name="image"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :file-list="imgUrllist">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible" :title="dialogImageName">
        <img width="100%" :src="dialogImageUrl" alt="">
        <span>{{ dialogCTime }}</span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import apiUrl from '@/api/url.js'
import { baseUrl } from '@/config.js'

export default {
  name: 'PhotoWall',
  data() {
    return {
      dialogImageName: '',
      dialogImageUrl: '',
      dialogCTime: '',
      dialogVisible: false,
      imgUrllist: []
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
            type: 'wall'
          };
      apiUrl.getImgList(params).then(function(res) {
        if(res.data.length !== 0) {
          for(let item of res.data) {
            self.imgUrllist.push({
              img_id: item.img_id,
              imgname: item.imgname,
              filename: item.filename,
              cTime: item.cTime,
              url: baseUrl + '/wall/' + item.filename
            });
          }
        }
      }).catch(function(res) {
        console.log(res);
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogImageName = file.imgname;
      this.dialogCTime = file.cTime;
      this.dialogVisible = true;
    },
  }
}
</script>

<style lang="less">
@import '../../static/global.less';

  .photowall {
    height: 100%;
    .el-upload-list__item.is-success .el-upload-list__item-status-label {  // 去掉右上角的绿勾勾
      display: none !important;
    }
    .el-upload-list--picture-card .el-upload-list__item-actions .el-upload-list__item-delete {  // 去掉删除图片的字体图标
      display: none !important;
    }
    .el-upload--picture-card {  // 去掉上传图片的框
      display: none !important;
    }
  }
</style>
