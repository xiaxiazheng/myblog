<template>
  <div class="content"><!-- 这是前端展示页面的主Vue -->
	  <div v-if="labelObj.label">
      <h1>{{labelObj.label}}</h1>
			hello
			<span v-if="labelObj.id">{{labelObj.id}}</span>
			<ul>
				<li v-for="(item, index) in dataObj" :key="index">
					<el-input v-model="item.title" placeholder="请输入内容"></el-input>
          <el-input
						type="textarea"
						:autosize="{ minRows: 2, maxRows: 4}"
						placeholder="请输入内容"
						v-model="item.cont">
					</el-input>
				</li>
			</ul>
			<div class="botton">
        <el-button type="primary" plain @click="addCont">添加</el-button>
				<el-button type="primary" plain @click="judge">保存</el-button>
			</div>
		</div>
		<div v-else>
			nothing
		</div>
  </div>
</template>

<script>
import { dataObject } from '@/mock.js'

export default {
	props: ['labelObj'],
  data() {
    return {
      dataObj: []
    }
	},
	mounted() {
		this.$nextTick(function() {
			this.init();
		});
	},
	methods: {
		init() {
      this.dataObj = dataObject;
		},
		addCont() {
      this.dataObj.push({
				title: '请输入标题',
				cont: '请输入内容'
			});
		},
		judge() {
			// console.log(this.dataObj);
			console.log(this.dataObj[0].cont);
			for(let item of this.dataObj) {
				console.log(item);
				if(item.cont === '') {
					this.$message({
						type: "warning",
						message: '输入框可以为空，单文本域不能为空撒'
					});
					return;
				}
			}
			this.$message({
				type: "success",
				message: '保存成功'
			});
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .content {
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
