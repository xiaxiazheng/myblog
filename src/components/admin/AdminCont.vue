<template>
  <div class="admincont">
	  <div v-if="labelObj.label">
      <h1>{{labelObj.label}}</h1>
			<h2>
				修改时间：
				<span v-if="contObj.list">{{contObj.list[0].motifytime}}</span>
			</h2>
			<!-- <span v-if="labelObj.id">{{labelObj.id}}</span> -->
			<ul>
				<li v-for="(item, index) in contObj.list" :key="index">
					<el-input v-model="item.title" placeholder="请输入内容"></el-input>
          <el-input
						type="textarea"
						:autosize="{ minRows: 3, maxRows: 8}"
						placeholder="请输入内容"
						v-model="item.cont">
					</el-input>
				</li>
			</ul>
			<div class="botton">
        <el-button type="primary" plain @click="addCont">添加</el-button>
				<el-button type="primary" plain @click="judge" :disabled="!isModify">保存</el-button>
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
			contObj: [],
			isModify: true
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
		// contObj:{ // 尝试控制修改了才能点击保存按钮
		// 	immediate: true,
		// 	handler: function (val,oldVal) {
		// 		this.isModify = true;
		// 	},
		// 	deep:true
		// }
	},
	methods: {
		init() {
			// this.contObj = dataObject;
			if(this.labelObj) {
				var self = this,
						params = {
							id: this.labelObj.id, // 子节点的id
						};
				apiUrl.getNodeCont(params).then(function(res) {
					self.contObj = res.data;
					// self.isModify = false;
					// self.$watch('contObj', function(){self.isModify = true}, {deep: true});
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
					console.log(res.message);
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
			console.log("params");
			console.log(params);
			apiUrl.modifyNodeCont(params).then(function(res) {
				self.$message({
					type: "success",
					message: res.data.message
				});
				self.init();
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .admincont {
		text-align: left;
		padding: 10px;
    h1 {
      margin-bottom: 10px;
		}
		.el-input {
			margin-top: 10px;
		}
		.el-textarea {
			margin-top: 10px;
		}
		.botton {
			margin-top: 20px;
			text-align: center;
		}
  }
</style>
