<template>
  <div class="admin"><!-- 这是后端控制台的主Vue -->
	  <!-- 左边的树 -->
	  <div class="lefttree">
      <el-tree
				:data="tree"
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
							@click="() => motify(node, data)">
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
			<el-input v-model="motifyNode.newNodeName" placeholder="请输入内容"></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleCloseDialog">取 消</el-button>
				<el-button type="primary" @click="handleSaveNode">确 定</el-button>
			</span>
		</el-dialog>
  </div>
</template>

<script>
import AdminCont from './admin/AdminCont'
import apiUrl from '@/api/url.js'
// import { treeData } from '@/mock.js'

export default {
	name: 'Admin',
	components: {
		AdminCont
	},
  data() {
		return {
			clickObj: '',
			tree: [],
			defaultProps: {
				children: 'children',
				label: 'label'
			},
			showDialog: false,
			motifyNode: {
				id: '',
				newNodeName: '',
				isLeaf: ''
			},
			notice: '',
		};
	},
	mounted() {
		this.$nextTick(function() {
			this.init();
		});
	},
	methods: {
		init() {
			// this.tree = treeData;
			var self = this,
          params = {};
      // this.tree = treeData;
      apiUrl.getTree(params).then(function(res) {
        self.tree = res.data;
      }).catch(function(res) {
        console.log(res.message);
      });
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
		motify(node, data) {
			let isLeaf = node.isLeaf;
			if(isLeaf) { // 若是子节点
				this.notice = '修改子节点名称';
			} else {  // 若是父节点，
			  this.notice = '修改父节点名称';
			}
			this.motifyNode = {
				id: data.id,
				isLeaf: node.isLeaf,
				newNodeName: data.label,
			}
    	this.showDialog = true;	
		},
		// 新增节点
		append(node, data) {
			// 这里先请求后台数据
			var self = this,
			    params = {
						isLeaf: node.isLeaf,
					};
			if(node.isLeaf) {  // 若是子节点
				params.id = node.parent.data.id;
				params.label = node.parent.data.label;
				params.f_sort = node.parent.data.sort;
				var list = node.parent.data.children;
				params.c_sort = list[list.length - 1].sort; // 传当前父节点的最后一个子节点的sort过去
			} else { // 若是父节点
				var list = node.parent.data;
				params.sort = list[list.length - 1].sort; // 传最后一个父节点的sort过去
			}
			apiUrl.addTreeNode(params).then(function(res) {
				if(res.data.resultsCode === 'success') {
					self.$message({
						type: 'success',
						message: res.data.message
					})
					self.init();
				}
			}).catch(function(res) {
				console.log(res.message);
			});
		},
    // 删除节点
		remove(node, data) {
			if(node.isLeaf) { // 若是叶子节点
				let parentId = node.parent.data.id;
				for(let i in this.tree) {
					if(this.tree[i].id === parentId) {
						let childlist = this.tree[i].children;
						if(childlist.length === 1) { // 保证每个父节点至少有一个子节点
							this.$message({
								type: 'error',
								message: "这里只有一个子节点了，不能删除"
							});
							return;
						}
						// 删除子节点
						var self = this,
								params = {
									id: data.id,
									isLeaf: node.isLeaf
								};
						apiUrl.deleteTreeNode(params).then(function(res) {
							self.$message({
								type: 'success',
								message: res.data.message
							});
							self.init();
						}).catch(function(res) {
							console.log(res.message);
						});
					}
				}
			} else { // 若是父节点，就慎重一点
			  this.$confirm('你将删除的是父节点, 你确定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { 
					// 删除父节点
					var self = this,
							params = {
								isLeaf: node.isLeaf,
								id: data.id,
							};
					apiUrl.deleteTreeNode(params).then(function(res) {
						self.$message({
							type: res.data.resultsCode,
							message: res.data.message
						});
						self.init();
					}).catch(function(res) {
						console.log(res.message);
					});
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });          
        });
			}
		},

		// 处理关闭dialog
		handleCloseDialog() {
			this.showDialog = false;
			this.motifyNode = {
				id: '',
				newNodeName: '',
				isLeaf: ''
			};
		},
		// 保存修改的节点名称
	  handleSaveNode() {
			if(this.newNodeName === '') {
				this.$message({
					type: 'warning',
					message: '父节点名称不能为空'
				});
				return;
			}
			var self = this,
			    params = {
						id: this.motifyNode.id,
						label: this.motifyNode.newNodeName,
						isLeaf: this.motifyNode.isLeaf
					};
			apiUrl.modifyTreeNode(params).then(function(res) {
				self.showDialog = false;
				self.$message({
					type: 'success',
					message: '保存父节点名称成功'
				});
				self.motifyNode.newNodeName = '';
				self.init();
			}).catch(function(res) {

			});
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
