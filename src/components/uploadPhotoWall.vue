<template>
  <div class="uploadphotowall">
    <el-upload
      :action="uploadUrl"
      name="image"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
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
</template>

<script>
import apiUrl from '@/api/url.js'
import { baseUrl } from '@/config.js'

export default {
  name: 'AdminWait',
  data() {
    return {
      dialogImageName: '',
      dialogImageUrl: '',
      dialogCTime: '',
      dialogVisible: false,
      imgUrllist: [],
      uploadUrl: '',
    }
  },
  props: ['type'],
  mounted() {
    this.$nextTick(function() {
      this.init();
    });
  },
  methods: {
    init() {
      this.uploadUrl = baseUrl + '/' + this.type + '_upload';
      let self = this,
          params = {
            type: this.type
          };
      apiUrl.getImgList(params).then(function(res) {
        if(res.data.length !== 0) {
          self.imgUrllist = [];
          for(let item of res.data) {
            self.imgUrllist.push({
              img_id: item.img_id,
              imgname: item.imgname,
              filename: item.filename,
              cTime: item.cTime,
              url: baseUrl + '/' + self.type + '/' + item.filename
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
    // 上传成功后
    handleSuccess(response, file, fileList) {
      this.$message({
        type: "success",
        message: "上传成功"
      });
      this.init();
    },
    // 上传失败后
    handleError(err, file, fileList) {
      this.$message({
        type: "error",
        message: "上传失败"
      });
      this.init();
    },
    // 删除图片后
    handleRemove(file, fileList) {
      /* 如果不是服务器上的图片，就直接删除 */
      if(file.status === 'ready') {
        return true;
      }

      this.$confirm('此操作将永久删除该文件' + file.imgname + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let self = this,
            params = {
              type: this.type,
              img_id: file.img_id,
              filename: file.filename
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

<style lang="less">
@import '../static/global.less';

  .uploadphotowall {
    height: 100%;
  }
</style>
