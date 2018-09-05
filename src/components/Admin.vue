<template>
  <div class="admin"><!-- 这是后端控制台的主Vue -->
	  <!-- 左边的树 -->
	  <div class="lefttree">
      <el-tree
				:data="tree"
				:props="defaultProps"
				node-key="id"
				default-expand-all
				@node-click="handleClick"
				:expand-on-click-node="false">
				<span class="custom-tree-node" slot-scope="{ node, data }" @mouseover="showIcon(node)" @mouseout="hideIcon(node)">
					<span>{{ node.label }}</span>
					<span class="iconBox" v-if="node.data.hovering">
						<el-button
							type="text"
							size="mini"
							@click="() => up(node, data)"
							v-if="node.previousSibling">
							<i class="el-icon-arrow-up"></i>
						</el-button>
						<el-button
							type="text"
							size="mini"
							@click="() => down(node, data)"
							v-if="node.nextSibling">
							<i class="el-icon-arrow-down"></i>
						</el-button>
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
							@click="() => shuttle(node, data)"
							v-if="node.isLeaf">
							<i class="el-icon-upload"></i>
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
			<el-switch
				v-model="isEdit"
				title="是否编辑">
			</el-switch>
      <AdminCont v-if="isEdit" :label-obj="clickObj"></AdminCont>
			<HomeCont v-if="!isEdit" :label-obj="clickObj"></HomeCont>
		</div>
		<!-- 修改节点名称的dialog -->
		<el-dialog
			title="提示"
			:visible.sync="showEditDialog"
			width="30%"
			:before-close="handleCloseDialog">
			<span>{{notice}}</span>
			<el-input v-model="motifyNode.newNodeName" placeholder="请输入内容"></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleCloseDialog">取 消</el-button>
				<el-button type="primary" @click="handleSaveNode">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 穿梭更换父节点的dialog -->
		<el-dialog
			title="提示"
			:visible.sync="showShuttleDialog"
			width="30%"
			:before-close="handleCloseDialog">
			<span>请选择"{{shuttleChildLabel}}"要穿梭到的父节点：</span>
			<el-select v-model="choiceFathId">
				<el-option
					v-for="(item, index) in fatherNodeList"
					:key="index"
					:label="item.label"
					:value="item.id">
				</el-option>
			</el-select>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleCloseDialog">取 消</el-button>
				<el-button type="primary" @click="handleSaveShuttle">确 定</el-button>
			</span>
		</el-dialog>
  </div>
</template>

<script>
//import Vue from 'vue'
import AdminCont from './admin/AdminCont'
import HomeCont from './home/HomeCont'
import apiUrl from '@/api/url.js'
// import { treeData } from '@/mock.js'

export default {
	name: 'Admin',
	components: {
		AdminCont,
		HomeCont
	},
  data() {
		return {
			isEdit: false,
			clickObj: '', // 传给子组件的，包括子节点的id和label
			tree: [],
			fatherNodeList: [], // 所有的父节点
			newChildLabel: '',
			defaultProps: {
				children: 'children',
				label: 'label'
			},
			// 节点改名
			showEditDialog: false,
			motifyNode: {
				id: '',
				newNodeName: '',
				isLeaf: ''
			},
			notice: '',
			// 子节点穿梭
			showShuttleDialog: false,
			originFathId: '',
			choiceFathId: '',
			shuttleChildId: '',
			shuttleChildLabel: '',
		};
	},
	mounted() {
		this.$nextTick(function() {
			this.init();
		});
	},
	methods: {
		init() {
			var self = this,
          params = {};
      apiUrl.getTree(params).then(function(res) {
				self.tree = res.data;
				self.fatherNodeList = [];
				// 给树设置属性
				for(let i in self.tree) {
					// hovering
					Vue.set(self.tree[i], 'hovering', false);
					for(let j in self.tree[i].children) {
						Vue.set(self.tree[i].children[j], 'hovering', false);
					}
					self.fatherNodeList.push({
						id: self.tree[i].id,
						label: self.tree[i].label,
						sort: self.tree[i].sort
					});
				}
      }).catch(function(res) {
        console.log("初始化失败");
      });
		},

		//onmouseover时显示图标
    showIcon(item) {
      item.data.hovering = true;
    },
    //onmouseout时隐藏图标
    hideIcon(item) {
      item.data.hovering = false;
		},
		
		// 上移
		up(node, data) {
			var self = this,
					params = {
						isLeaf: node.isLeaf,
						thisId: node.data.id,
						thisSort: node.data.sort,
						otherId: node.previousSibling.data.id,
						otherSort: node.previousSibling.data.sort
					};
			apiUrl.changeSort(params).then(function(res) {
				self.$message({
					type: 'success',
					message: '上移成功'
				});
				self.init();
			}).catch(function(res) {
				console.log(res.data.message);
			});
		},
		// 下移
		down(node, data) {
			var self = this,
					params = {
						isLeaf: node.isLeaf,
						thisId: node.data.id,
						thisSort: node.data.sort,
						otherId: node.nextSibling.data.id,
						otherSort: node.nextSibling.data.sort
					};
			apiUrl.changeSort(params).then(function(res) {
				self.$message({
					type: 'success',
					message: '下移成功'
				});
				self.init();
			}).catch(function(res) {
				console.log(res.data.message);
			});
		},

		// 点击节点，三个参数分别为传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。
		handleClick(obj, node, component) {
			let isLeaf = node.isLeaf;
			if(isLeaf) { // 若是子节点则右边显示具体信息
				this.clickObj = node.data;
			}
		},

		// 修改节点
		motify(node, data) {
			let isLeaf = node.isLeaf;
			if(isLeaf) {
				this.notice = '修改子节点名称';
			} else {
			  this.notice = '修改父节点名称';
			}
			this.motifyNode = {
				id: data.id,
				isLeaf: node.isLeaf,
				newNodeName: data.label,
			}
    	this.showEditDialog = true;	
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
				} else {
					self.$message({
						type: 'error',
						message: res.data.message
					})
				}
			}).catch(function(res) {
				console.log(res.message);
			});
		},
    // 删除节点
		remove(node, data) {
			if(node.isLeaf) { // 若是叶子节点
				this.$confirm(`你将删除的是子节点${data.label}, 你确定?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { 
					let parentId = node.parent.data.id;
					for(let i in this.tree) {
						if(this.tree[i].id === parentId) {
							// 保证每个父节点至少有一个子节点
							let childlist = this.tree[i].children;
							if(childlist.length === 1) {
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
								self.clickObj = '';
							}).catch(function(res) {
								self.$message({
									type: 'error',
									message: res.data.message
								});
							});
						}
					}
				}).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除' + data.label
          });          
        });
			} else { // 若是父节点
			  this.$confirm(`你将删除的是父节点${data.label}, 你确定?`, '提示', {
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
						self.$message({
							type: 'error',
							message: res.data.message
						});
					});
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除' + data.label
          });          
        });
			}
		},
		// 穿梭节点
		shuttle(node, data) {
			this.choiceFathId = node.parent.data.id;
			this.originFathId = this.choiceFathId;
			this.shuttleChildId = data.id;
			this.shuttleChildLabel = data.label;
			this.showShuttleDialog = true;
		},

		// 处理关闭dialog
		handleCloseDialog() {
			this.showEditDialog = false;
			this.motifyNode = {
				id: '',
				newNodeName: '',
				isLeaf: ''
			};
			this.showShuttleDialog = false;
			this.shuttleChildId = '';
			this.shuttleChildLabel = '';
		},
		// 保存修改的节点名称
	  handleSaveNode() {
			if(this.newNodeName === '') {
				this.$message({
					type: 'warning',
					message: '节点名称不能为空'
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
				self.showEditDialog = false;
				self.$message({
					type: 'success',
					message: res.data.message
				});
				if(self.motifyNode.isLeaf) {  // 若是子节点，则把修改后的节点名传到子组件
					self.clickObj.label = self.motifyNode.newNodeName;
				}
				self.motifyNode.newNodeName = '';
				self.init();
			}).catch(function(res) {
				self.$message({
					type: 'error',
					message: res.data.message
				});
			});
		},
		// 保存穿梭
		handleSaveShuttle() {
			if(this.choiceFathId === this.originFathId) {
				this.$message({
					type: 'warning',
					message: '当前所选与原来的相同'
				});
				return;
			}
			for(let item of this.tree) {
				if(item.id === this.originFathId) {
					if(item.children.length === 1) {
						this.$message({
							type: 'warning',
							message: '待穿梭节点的父节点只有这一个子节点，不能穿梭'
						});
						return;
					}
				}
			}
			let fatherNode = {};
			let newchildsort = '';
			for(let item of this.tree) {
				if(item.id === this.choiceFathId) {
					fatherNode = item;
					newchildsort = item.children[item.children.length - 1].sort;
					break;
				}
			}
			var self = this,
			    params = {
						fatherid: fatherNode.id,
						fatherlabel: fatherNode.label,
						fathersort: fatherNode.sort,
						newchildsort: newchildsort + 1,
						childid: this.shuttleChildId
					};
			apiUrl.changeFather(params).then(function(res) {
				self.$message({
					type: 'success',
					message: res.data.message
				});
				self.showShuttleDialog = false;
				self.init();
			}).catch(function(res) {
				console.log("穿梭出错");
			});
		}
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
			.iconBox {
				position: absolute;
				right: 13px;
				padding-left: 6px;
				background-color: #f5f7fa;
				z-index: 2;
			}
		}
		.rightcont {
			.el-switch {
				position: fixed;
				right: 5rem;
				top: 2rem;
			}
		}
  }
</style>
