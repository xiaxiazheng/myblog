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
        <el-button type="primary" @click="addCont" icon="el-icon-plus"></el-button>
			</div>
			<div class="save">
				<el-button type="primary" @click="judge" :disabled="!isModify" icon="el-icon-check"></el-button>
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
			if(this.labelObj !== '') {
				var self = this,
						params = {
							id: this.labelObj.id, // 子节点的id
						};
				apiUrl.getNodeCont(params).then(function(res) {
					self.contObj = res.data;
				}).catch(function(res) {
					self.msgTips(res);
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
							id: this.labelObj.id, // 子节点的id
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
