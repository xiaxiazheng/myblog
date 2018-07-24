<template>
  <div class="admin"><!-- 这是后端控制台的主Vue -->
	  <!-- 左边的树 -->
	  <div class="lefttree">
      <el-tree
				:data="data6"
				:props="defaultProps"
				node-key="id"
				default-expand-all
				@node-drag-start="handleDragStart"
				@node-drag-end="handleDragEnd"
				@node-drop="handleDrop"
				@node-click="handleClick"
				draggable
				:allow-drop="allowDrop"
				:allow-drag="allowDrag"
				:expand-on-click-node="false">
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span :class="{'biggerfont': !node.isLeaf}">{{ node.label }}</span>
					<span>
						<el-button
							type="text"
							size="mini"
							@click="() => notify(node, data)">
							<i class="el-icon-edit-outline"></i>
						</el-button>
						<el-button
							type="text"
							size="mini"
							@click="() => append(node, data)">
							<i class="el-icon-circle-plus-outline"></i>
						</el-button>
						<el-button
							type="text"
							size="mini"
							@click="() => remove(node, data)">
							<i class="el-icon-delete"></i>	
						</el-button>
					</span>
				</span>
			</el-tree>
		</div>
		<!-- 右边的子组件 -->
		<div class="rightcont">
      <AdminCont :label-obj="clickObj"></AdminCont>
		</div>
		<!-- 修改父节点名称的dialog -->
		<el-dialog
			title="提示"
			:visible.sync="showDialog"
			width="30%"
			:before-close="handleCloseDialog">
			<span>{{notice}}</span>
			<el-input v-model="newNodeName" placeholder="请输入内容"></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleCloseDialog">取 消</el-button>
				<el-button type="primary" @click="handleSaveNode">确 定</el-button>
			</span>
		</el-dialog>
  </div>
</template>

<script>
import AdminCont from './admin/AdminCont'
import { treeData } from '@/mock.js'

export default {
	name: 'Admin',
	components: {
		AdminCont
	},
  data() {
		return {
			clickObj: '',
			data6: [],
			defaultProps: {
				children: 'children',
				label: 'label'
			},
			showDialog: false,
			newNodeName: '',
			notice: '',
		};
	},
	mounted() {
		this.$nextTick(function() {
			this.init();
		});
	},
	methods: {
		// 初始化数据
		init() {
      this.data6 = treeData;
		},

		// 点击节点
		handleClick(a, b, c) {
			let isLeaf = b.isLeaf;
			if(isLeaf) { // 若是子节点则右边显示具体信息
				this.clickObj = b.data;
			} else {  // 若是父节点，
				
			}
		},

		// 修改节点
		notify(node, data) {
			let isLeaf = node.isLeaf;
			if(isLeaf) { // 若是子节点
				this.notice = '修改子节点名称';
			} else {  // 若是父节点，
			  this.notice = '修改父节点名称';
			}
			this.newNodeName = data.label;
    	this.showDialog = true;	
		},
		// 新增节点
		append(node, data) {
			// 这里先请求后台数据
			if(node.isLeaf) { // 若是叶子节点
				let parentId = node.parent.data.id;
				for(let i in this.data6) {
					if(this.data6[i].id === parentId) {
            this.data6[i].children.push({
							id: Math.floor(Math.random()*1000),
							label: 'newchild'
						});
						break;
					}
				}
			} else { // 若是父节点
				this.data6.push({
					id: Math.floor(Math.random()*1000),
					label: 'newNode',
					children: [{ // 让新增的父节点自带一个子节点
						id: Math.floor(Math.random()*1000),
						label: 'newchild'
					}]
				});
			}
		},
    // 删除节点
		remove(node, data) {
			if(node.isLeaf) { // 若是叶子节点
				let parentId = node.parent.data.id;
				for(let i in this.data6) {
					if(this.data6[i].id === parentId) {
						let childlist =this.data6[i].children;
						if(childlist.length === 1) { // 保证每个父节点至少有一个子节点
							this.$message({
								type: 'error',
								message: "这里只有一个子节点了，不能删除"
							});
							break;
						}
						for(let j in childlist) {
							if(childlist[j].id === data.id) {
								this.data6[i].children.splice(j, 1);
								break;
							}
						}
						break;
					}
				}
			} else { // 若是父节点，就慎重一点
			  this.$confirm('你将删除的是父节点, 你确定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					for(let i in this.data6) {
						if(this.data6[i].id === data.id) {
							this.data6.splice(i, 1);
							break;
						}
					}
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });          
        });
			}
		},

		// 拖动开始
		handleDragStart(node, ev) {
			console.log('drag start', node);
		},
    // 拖动结束
		handleDragEnd(draggingNode, dropNode, dropType, ev) {
			console.log('tree drag end: ', dropNode && dropNode.label, dropType);
		},
		// 丢下节点
		handleDrop(draggingNode, dropNode, dropType, ev) {
			console.log('tree drop: ', dropNode.label, dropType);
		  this.$message({
				type: 'success',
				message: '删除成功'
			})
		},
		// 允许放下，这里要限制不允许放在子节点
		allowDrop(draggingNode, dropNode, type) {
			if (dropNode.data.label === '二级 3-1') {
				return type !== 'inner';
			} else {
				return true;
			}
		},
		// 允许拖动，这里要限制父节点不准拖动
		allowDrag(draggingNode) {
			return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
		},

    // 处理关闭dialog
		handleCloseDialog() {
			this.showDialog = false;
			this.newNodeName = '';
		},
		// 保存节点名称
	  handleSaveNode() {
			if(this.newNodeName === '') {
				this.$message({
					type: 'warning',
					message: '父节点名称不能为空'
				});
				return;
			}
			// TODO,这里直接把节点数据传到后台，然后成功了再传回来初始化这个树
			this.showDialog = false;
			this.$message({
				type: 'success',
				message: '保存父节点名称成功'
			});
			this.newNodeName = '';
			this.init();
		},
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '../static/global.less';

  .admin {
		height: 100%;
		.custom-tree-node {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 14px;
			padding-right: 8px;
		}
		.biggerfont {
			font-size: 16px;
		}
  }
</style>
