<template>
  <div class="admincont">
	  <div v-if="$route.query.id">
      <h1>{{title}}</h1>
			<ul>
				<li v-for="(item, index) in contObj.list" :key="index">
					<el-input v-model="item.title" placeholder="请输入内容"></el-input>
          <el-input
						type="textarea"
						:autosize="{ minRows: 3, maxRows: 15}"
						placeholder="请输入内容"
						v-model="item.cont">
					</el-input>
					<!-- 左下角的各种控制按键 -->
					<div class="ctrlbox">
						<span class="iconbox">
							<el-button
								type="text"
								size="mini"
								@click="() => upCont(item, index)"
								v-if="index !== 0">
								<i class="el-icon-arrow-up"></i>
							</el-button>
							<el-button
								type="text"
								size="mini"
								@click="() => downCont(item, index)"
								v-if="index !== contObj.list.length - 1">
								<i class="el-icon-arrow-down"></i>
							</el-button>
							<el-button
								type="text"
								size="mini"
								@click="() => deleteCont(item, index)"
								v-if="contObj.list.length > 1">
								<i class="el-icon-delete"></i>	
							</el-button>
						</span>
						<span class="time">
							创建时间：
							<span>{{item.createtime}}</span>
							&nbsp;&nbsp;&nbsp;&nbsp;
							修改时间：
							<span>{{item.motifytime}}</span>
						</span>
					</div>
					<!-- 上传图片的组件 -->
					<div class="uploadtreecontimg">
						<el-upload
							:action="uploadUrl"
							name="treecont"
							list-type="picture-card"
							:data="{ 
								c_id: contObj.id,
							  sort: item.sort
							}"
							:on-preview="handlePictureCardPreview"
							:on-success="handleSuccess"
							:on-error="handleError"
							:before-remove="handleRemove"
							:file-list="item.filelist"
							:limit="1"
							:class="{'alreadyhasone': item.filename}">
								<i class="el-icon-plus"></i>
						</el-upload>
					</div>
				</li>
			</ul>
			<div class="button">
        <el-button type="primary" @click="addCont" icon="el-icon-plus"></el-button>
			</div>
			<div class="save">
				<el-button type="primary" @click="judge" :disabled="!isModify" icon="el-icon-check"></el-button>
			</div>
			<!-- 图片看大图 -->
			<el-dialog :visible.sync="dialogVisible" :title="dialogImageName">
				<img width="100%" :src="dialogImageUrl" :alt="dialogImageName" :title="dialogImageName">
			</el-dialog>
		</div>
		<div v-else>
			<TreeMain type="admin"></TreeMain>
		</div>
  </div>
</template>

<script>
import apiUrl from '@/api/url.js'
import { baseUrl } from '@/config.js'
import TreeMain from '@/components/TreeMain'

export default {
  data() {
    return {
			title: '',
			contObj: {},
			isModify: true,
			// 图片相关
			imgUrllist: [],
			uploadUrl: baseUrl + '/treecont_upload',
			dialogVisible: false,
			dialogImageName: '', 
			dialogImageUrl: '',
    }
	},
	components: {
		TreeMain
	},
	mounted() {
		this.$nextTick(function() {
			this.init();
		});
	},
	watch: {
		"$route"() {
			this.init();
		}
	},
	methods: {
		init() {
			if(this.$route.query.id !== '') {
				var self = this,
						params = {
							id: decodeURIComponent(atob(this.$route.query.id)), // 子节点的id
						};
				apiUrl.getChildName(params).then(function(res) {
					self.title = res.data[0].c_label;
				}).catch(function(res) {
					self.$message({
						type: 'error',
						message: '初始化出错'
					});
				});
				apiUrl.getNodeCont(params).then(function(res) {
					self.contObj = {
						id: res.data.id,
						list: []
					};
					for(let item of res.data.list) {
						let imgname = '';
						if(item.filename) {
							list1 = item.filename.split('.');
							let houzhui1 = list[list.length - 1]; // 文件类型
							list2 = item.filename.split('-');
							let houzhui2 = list[list.length - 1]; // "随机数.文件类型"
							let qianzhui2 = item.filename.substr(0, item.filename.length - houzhui2.length - 1); // 多-1是要剪掉'-'
							let qianzhui1 = qianzhui2.substr(0, qianzhui2.length - res.data.id.length);
							imgname = qianzhui1 + '.' + houzhui1;
						}
						self.contObj.list.push({
							cont: item.cont,
							createtime: item.createtime,
							motifytime: item.motifytime,
							sort: item.sort,
							title: item.title,
							imgname: imgname,
							filename: item.filename || '',
							filelist: item.filename ? [{
								filename: item.filename || '',
								imgname: imgname || '',
								url: item.filename ? baseUrl + '/treecont/' + item.filename : ''
							}] : [],
						}); 
					}
				}).catch(function(res) {
					console.log(res);
				});
			}
		},
		// 新增节点
		addCont() {
			var self = this,
					params = {
						id: decodeURIComponent(atob(this.$route.query.id)), // 子节点的id
						sort: this.contObj.list[this.contObj.list.length - 1].sort,
					};
			apiUrl.addNodeCont(params).then(function(res) {
				self.msgTips(res);
				self.init();
			}).catch(function(res) {
				self.msgTips(res);
			});
		},
		// 删除节点
		deleteCont(item, index) {
			this.$confirm('你将删除“' + item.title + '”, 你确定?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => { 
				var self = this,
						params = {
							id: decodeURIComponent(atob(this.$route.query.id)), // 子节点的id
							sort: item.sort,
						};
				apiUrl.deleteNodeCont(params).then(function(res) {
					self.msgTips(res);
					self.init();
				}).catch(function(res) {
					self.msgTips(res);
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		// 上移节点
		upCont(item, index) {
			var self = this,
					params = {
						thiscTime: item.createtime,
						thisSort: item.sort,
						othercTime: this.contObj.list[index - 1].createtime,
						otherSort: this.contObj.list[index - 1].sort
					};
			apiUrl.changeContSort(params).then(function(res) {
				self.msgTips(res);
				self.init();
			}).catch(function(res) {
				self.msgTips(res);
			});
		},
		// 下移节点
		downCont(item, index) {
			var self = this,
					params = {
						thiscTime: item.createtime,
						thisSort: item.sort,
						othercTime: this.contObj.list[index + 1].createtime,
						otherSort: this.contObj.list[index + 1].sort
					};
			apiUrl.changeContSort(params).then(function(res) {
				self.msgTips(res);
				self.init();
			}).catch(function(res) {
				self.msgTips(res);
			});
		},
		// 先判断判断
		judge() {
			for(let item of this.contObj.list) {
				if(item.cont === '') {
					this.$message({
						type: "warning",
						message: '输入框可以为空，但文本域不能为空撒'
					});
					return;
				}
			}
			this.saveModify();
		},
		// 再保存修改
		saveModify() {
			var self = this,
					params = this.contObj;
			apiUrl.modifyNodeCont(params).then(function(res) {
				self.msgTips(res);
				setTimeout(function() {
					self.init();
				}, 1000);
			}).catch(function(res) {
				self.msgTips(res);
			});
		},

		// 弹框提示
		msgTips(res) {
			this.$message({
				type: res.data.resultsCode,
				message: res.data.message
			});
		},

		/** 图片操作 */
		// 点击查看大图
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogImageName = file.imgname;
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
              filename: file.filename
            };
        apiUrl.deleteTreeContImg(params).then(function(res) {
          self.msgTips(res);
          self.init();
        }).catch(function(res) {
          self.msgTips(res);
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
  .admincont {
		text-align: left;
		padding: 10px;
    h1 {
      margin-bottom: 10px;
		}
		>div >ul {
			width: 82.6%; /* 经过计算的，别乱改啊 */
			li {
				position: relative;
				text-align: right;
				margin-top: 5px;
				.el-input {  /* 标题 */
					margin-top: 10px;
				}
				.el-textarea {  /* 内容 */
					margin-top: 10px;
				}
				.ctrlbox {  /* 控制栏 */
					position: relative;
					overflow: hidden;
					.iconbox {
						position: absolute;
						left: 0;
						top: -5px;
					}
					.time {
						float: right;
						color: #ccc;
					}
				}
				.uploadtreecontimg {  /* 上传图片 */
					position: absolute;
					right: -157px;
					top: 10px;
					.alreadyhasone {
						width: 148px;
						.el-upload--picture-card {
						  display: none;
						}
					}
				}
			}
		}
		.button {
			margin-top: 20px;
			text-align: center;
		}
		.save {
			position: fixed;
			text-align: center;
			right: 4.5rem;
			bottom: 2rem;
		}
  }
</style>
