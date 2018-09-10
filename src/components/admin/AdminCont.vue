<template>
  <div class="admincont">
	  <div v-if="labelObj.label">
      <h1>{{labelObj.label}}</h1>
			<!-- <span v-if="labelObj.id">{{labelObj.id}}</span> -->
			<ul>
				<li v-for="(item, index) in contObj.list" :key="index">
					<el-input v-model="item.title" placeholder="请输入内容"></el-input>
          <el-input
						type="textarea"
						:autosize="{ minRows: 3, maxRows: 15}"
						placeholder="请输入内容"
						v-model="item.cont">
					</el-input>
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
				</li>
			</ul>
			<div class="button">
        <el-button type="primary" plain @click="addCont" icon="el-icon-plus"></el-button>
			</div>
			<div class="save">
				<el-button type="primary" plain @click="judge" :disabled="!isModify" icon="el-icon-check"></el-button>
			</div>
		</div>
		<div v-else>
			<h2>Welcome !</h2>
		</div>
  </div>
</template>

<script>
import apiUrl from '@/api/url.js'
import { setTimeout } from 'timers';
// import { dataObject } from '@/mock.js'

export default {
	props: ['labelObj'],
  data() {
    return {
			contObj: {},
			isModify: true,
    }
	},
	mounted() {
		this.$nextTick(function() {
			this.init();
		});
	},
	watch: {
    labelObj() {
			this.init();
		},
	},
	methods: {
		init() {
			// this.contObj = dataObject;
			if(this.labelObj !== '') {
				var self = this,
						params = {
							id: this.labelObj.id, // 子节点的id
						};
				apiUrl.getNodeCont(params).then(function(res) {
					self.contObj = res.data;
					// self.isModify = false;

					// self.$watch('contObj',  function() { self.isModify = true; }, {deep: true});
				}).catch(function(res) {
					console.log(res.message);
				});
			}
		},
		// 新增节点
		addCont() {
			var self = this,
					params = {
						id: this.labelObj.id, // 子节点的id
						sort: this.contObj.list[this.contObj.list.length - 1].sort,
					};
			apiUrl.addNodeCont(params).then(function(res) {
				self.$message({
					type: "success",
					message: res.data.message
				});
				self.init();
				// self.isModify = false;
				// self.$watch('contObj', function(){self.isModify = true}, {deep: true});
			}).catch(function(res) {
				self.$message({
					type: "error",
					message: res.data.message
				});
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
							id: this.labelObj.id, // 子节点的id
							sort: item.sort,
						};
				apiUrl.deleteNodeCont(params).then(function(res) {
					self.$message({
						type: "success",
						message: '删除成功'
					});
					// self.contObj.list.splice(index, 1);
					self.init();
				}).catch(function(res) {
					self.$message({
						type: "error",
						message: res
					});
				});
			}).catch(() => {
				console.log("已取消");
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
				self.$message({
					type: 'success',
					message: '上移成功'
				});
				self.init();
			}).catch(function(res) {
				console.log(res.data.message);
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
				self.$message({
					type: 'success',
					message: '下移成功'
				});
				self.init();
			}).catch(function(res) {
				console.log(res.data.message);
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
				self.$message({
					type: "success",
					message: res.data.message
				});
				setTimeout(function() {
					self.init();
				}, 1000);
			}).catch(function(res) {
				self.$message({
					type: "error",
					message: res.data.message
				});
			});
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
		ul {
			li {
				text-align: right;
				margin-top: 5px;
				.el-input {
					margin-top: 10px;
				}
				.el-textarea {
					margin-top: 10px;
				}
				.ctrlbox {
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
