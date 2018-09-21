<template>
  <div class="adminmain">
    <div>
      <el-upload
        :action="uploadUrl"
        name="image"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :before-upload="handleUpload"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-remove="handleRemove"
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
  name: 'AdminMain',
  data() {
    return {
      dialogImageName: '',
      dialogImageUrl: '',
      dialogCTime: '',
      dialogVisible: false,
      imgUrllist: [],
      uploadUrl: baseUrl + '/main_upload',
      isrepeat: false,
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
        if(res.data.length !== 0) {
          self.imgUrllist = [];
          for(let item of res.data) {
            self.imgUrllist.push({
              img_id: item.img_id,
              imgname: item.imgname,
              cTime: item.cTime,
              url: baseUrl + '/' + item.imgname
            });
          }
        }
      }).catch(function(res) {
        console.log(res);
      });
    },
    // 点击查看大图
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogImageName = file.imgname;
      this.dialogCTime = file.cTime;
      this.dialogVisible = true;
    },
    // 上传之前
    handleUpload(file) {
      let isfind = false;
      for(let item of this.imgUrllist) {
        if(item.imgname === file.name) {
          isfind = true;
          break;
        }
      }
      if(isfind) {
        this.$message({
          type: 'error',
          message: "图片名称已存在，请改名先"
        });
        this.isrepeat = true;
        return false;
      }
    },
    // 上传成功后
    handleSuccess(response, file, fileList) {
      this.init();
    },
    // 上传失败后
    handleError(err, file, fileList) {
      this.init();
    },
    // 删除图片后
    handleRemove(file, fileList) {
      if(this.isrepeat) {
        this.isrepeat = false;
        return true;
      }

      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let self = this,
            params = {
              type: 'main',
              img_id: file.img_id,
              imgname: file.imgname
            };
        apiUrl.deleteImg(params).then(function(res) {
          self.$message({
            type: 'success',
            message: '删除成功'
          });
          self.init();
        }).catch(function(res) {
          console.log(res);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
      return false;
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '../../static/global.less';

  .adminmain {
    height: 100%;
    .el-icon-close,
    .el-upload-list__item .el-icon-close-tip{
      display: none !important;
    }
    .el-upload-list__item.is-success .el-upload-list__item-status-label {
      display: none !important;
    }
  }
</style>
