<template>
  <div class="adminwait">
    <div>
      <el-upload
        :action="uploadUrl"
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
import { baseUrl } from '@/config.js'

export default {
  name: 'AdminWait',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      imgUrllist: [],
      uploadUrl: baseUrl + '/wall_upload'
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
              url: baseUrl + '/wall/' + item.imgname
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
<style lang="less" scoped>
@import '../../static/global.less';

  .adminwait {
    height: 100%;
  }
</style>
