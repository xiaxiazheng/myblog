<template>
  <div class="photowall">
    <div>
      <el-upload
        action="#"
        name="image"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="imgUrllist">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
import apiUrl from '@/api/url.js'

export default {
  name: 'PhotoWall',
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
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
              name: item.imgname,
              url: 'http://localhost:3000/wall/' + item.imgname
            });
          }
        }
      }).catch(function(res) {
        console.log(res);
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
