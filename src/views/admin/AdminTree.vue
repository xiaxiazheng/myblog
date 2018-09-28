<template>
  <div class="admintree">
	  <!-- 左边的树 -->
	  <div class="lefttree">
      <el-tree
				:data="tree"
				:props="defaultProps"
				node-key="id"
				:default-expanded-keys="expandedList"
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
							v-if="node.level !== 1">
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
      <AdminTreeCont v-if="isEdit" :label-obj="clickObj"></AdminTreeCont>
			<TreeCont v-if="!isEdit" :label-obj="clickObj"></TreeCont>
		</div>
		<!-- 修改节点名称的dialog -->
		<el-dialog
			title="提示"
			:visible.sync="showEditDialog"
			width="30%"
			:before-close="handleCloseDialog">
			<span>{{notice}}</span>
			<el-input v-model="motifyNode.newNodeName" placeholder="请输入内容" @keyup.native.enter="handleSaveNode"></el-input>
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
			<span>请选择"{{shuttleChildLabel}}"要穿梭到的
				<span v-if="shuttleLevel === 2">一级</span>
				<span v-if="shuttleLevel === 3">二级</span>
				节点：
			</span>
			<el-select v-model="choiceFathId">
				<el-option
					v-for="(item, index) in fatherNodeList"
					:key="index"
					:label="item.data.label"
					:value="item.data.id">
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
import AdminTreeCont from './AdminTreeCont'
import TreeCont from '../home/TreeCont'
import apiUrl from '@/api/url.js'

export default {
	name: 'Admin',
	components: {
		AdminTreeCont,
		TreeCont
	},
  data() {
		return {
			tree: [],
			isEdit: false,  // 切换编辑版和展示版
			clickObj: '',  // 传给子组件的数据，包括子节点的id和label
			defaultProps: {
				children: 'children',
				label: 'label'
			},
			// 保存当前默认展开的节点，不然一操作树init数据树就要折叠
			expandedList: [],
			/* 节点改名 */
			showEditDialog: false,
			motifyNode: {
				id: '',
				newNodeName: '',
				level: ''
			},
			notice: '',
			/* 子节点穿梭 */
			fatherNodeList: [], // 子节点上一级的所有节点
			showShuttleDialog: false,
			shuttleLevel: 0,
			originFathId: '',
			choiceFathId: '',
			shuttleChildId: '',
			shuttleChildLabel: '',
		};
	},
	beforeCreate() {
		if(sessionStorage.getItem("xia_username") && sessionStorage.getItem("xia_password")) {
      var self = this,
        params = {
          username: sessionStorage.getItem("xia_username"),
					userpword: window.atob(sessionStorage.getItem("xia_password"))
        };
      apiUrl.postLogin(params).then(function(res) {
        if(res.data.resultsCode === "success") {
          self.showAdmin = true;
          return;
        } else {
          self.msgTips(res);
          self.$router.replace({ path: 'login' });
        }
      }).catch(function(res) {
        self.msgTips(res);
      });
    } else {
			this.$router.replace({ path: 'login' });
		}
	},
	mounted() {
		this.$nextTick(function() {
			this.init();
		});
	},
	methods: {
		init() {
			var self = this,
          params = {
						type: 'admin'
					};
      apiUrl.getTree(params).then(function(res) {
				self.tree = res.data;
				self.fatherNodeList = [];
				// 给树设置hover属性
				for(let i in self.tree) {
					Vue.set(self.tree[i], 'hovering', false);
					for(let j in self.tree[i].children) {
						// hovering
						Vue.set(self.tree[i].children[j], 'hovering', false);
						for(let k in self.tree[i].children[j].children) {
							Vue.set(self.tree[i].children[j].children[k], 'hovering', false);
						}
					}
				}
      }).catch(function(res) {
				self.msgTips(res);
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

		// 点击节点，三个参数分别为传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。
		handleClick(obj, node, component) {
			if(node.level === 3) { // 若是子节点则右边显示具体信息
				this.clickObj = node.data;
			}
		},

		// 修改节点
		motify(node, data) {
			let level = node.level;
			if(level === 3) {
				this.notice = '修改三级节点名称';
			}
			if(level === 2) {
			  this.notice = '修改二级节点名称';
			}
			if(level === 1) {
				this.notice = '修改一级节点名称';
			}
			this.motifyNode = {
				id: data.id,
				level: node.level,
				newNodeName: data.label,
			}
			this.showEditDialog = true;	
			
			this.saveFathExpend(node);
		},
		// 新增节点
		append(node, data) {
			// 这里先请求后台数据
			var self = this,
			    params = {
						level: node.level,
					};
			if(node.level === 3) {  // 若是子节点
				params.id = node.parent.data.id;
				params.label = node.parent.data.label;
				params.f_sort = node.parent.data.sort;
				params.category_id = node.data.category_id;
				var list = node.parent.data.children;
				params.c_sort = list[list.length - 1].sort; // 传当前父节点的最后一个子节点的sort过去
			}
			if(node.level === 2) { // 若是父节点
				params.category_id = node.data.category_id;
				var list = node.parent.data.children;
				params.sort = list[list.length - 1].sort; // 传最后一个父节点的sort过去
			}
			if(node.level === 1) { // 若是一大类
				var list = node.parent.data;
				params.sort = list[list.length - 1].sort;
			}
			apiUrl.addTreeNode(params).then(function(res) {
				self.msgTips(res);
				self.saveFathExpend(node);
				self.init();
			}).catch(function(res) {
				self.msgTips(res);
			});
		},
    // 删除节点
		remove(node, data) {
			if(node.level === 3) { // 若是叶子节点
				this.$confirm(`你将删除的是三级节点${data.label}, 你确定?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					let category_id = data.category_id;
					let parentId = node.parent.data.id;
					for(let i in this.tree) {
						if(category_id === this.tree[i].id) {
							for(let j in this.tree[i].children) {
								if(this.tree[i].children[j].id === parentId) {
									// 保证每个父节点至少有一个子节点
									let childlist = this.tree[i].children[j].children;
									if(childlist.length === 1) {
										this.$message({
											type: 'error',
											message: "这里只有一个三级节点了，不能删除"
										});
										return;
									}
									// 删除子节点
									var self = this,
											params = {
												id: data.id,
												level: node.level
											};
									apiUrl.deleteTreeNode(params).then(function(res) {
										self.msgTips(res);
										self.saveFathExpend(node);
										self.init();
										self.clickObj = '';
									}).catch(function(res) {
										self.msgTips(res);
									});
								}
							}
							
						}
					}
				}).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除' + data.label
          });          
        });
			}

			if(node.level === 2) { // 若是二级节点
			  this.$confirm(`你将删除的是二级节点${data.label}, 你确定?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					// 保证至少有一个二级节点
					if(node.parent.data.children.length === 1) {
						this.$message({
							type: 'error',
							message: "只剩下一个二级节点了，不能删除"
						});
						return;
					}
					// 删除二级节点
					var self = this,
							params = {
								level: node.level,
								id: data.id,
							};
					apiUrl.deleteTreeNode(params).then(function(res) {
						self.msgTips(res);
						self.saveFathExpend(node);
						self.init();
						self.clickObj = '';
					}).catch(function(res) {
						self.msgTips(res);
					});
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除' + data.label
          });          
        });
			}

			if(node.level === 1) { // 若是一级节点
				this.$confirm(`你将删除的是一级节点${data.label}, 你确定?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					// 保证至少有一个一级节点
					if(node.parent.childNodes.length === 1) {
						this.$message({
							type: 'error',
							message: "只剩下一个一级节点了，不能删除"
						});
						return;
					}
					// 删除一级节点
					var self = this,
							params = {
								level: node.level,
								id: data.id,
							};
					apiUrl.deleteTreeNode(params).then(function(res) {
						self.msgTips(res);
						self.saveFathExpend(node);
						self.init();
						self.clickObj = '';
					}).catch(function(res) {
						self.msgTips(res);
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
			if(node.parent.childNodes.length === 1) {
				this.$message({
					type: 'warning',
					message: '当前节点的父节点只有这一个子节点，不能穿梭'
				});
				return;
			}

			/* 找到所有父级节点 */
			this.fatherNodeList = node.parent.parent.childNodes;
      /* 保存穿梭等级 */
			this.shuttleLevel = node.level;
			/* 保存现场 */
			this.choiceFathId = node.parent.data.id;
			this.originFathId = this.choiceFathId;
			this.shuttleChildId = data.id;
			this.shuttleChildLabel = data.label;

			this.showShuttleDialog = true;
			this.saveFathExpend(node);
		},

		// 上移
		up(node, data) {
			var self = this,
					params = {
						level: node.level,
						thisId: node.data.id,
						thisSort: node.data.sort,
						otherId: node.previousSibling.data.id,
						otherSort: node.previousSibling.data.sort
					};
			apiUrl.changeSort(params).then(function(res) {
				self.msgTips(res);
				self.saveFathExpend(node);
				self.init();
			}).catch(function(res) {
				self.msgTips(res);
			});
		},
		// 下移
		down(node, data) {
			var self = this,
					params = {
						level: node.level,
						thisId: node.data.id,
						thisSort: node.data.sort,
						otherId: node.nextSibling.data.id,
						otherSort: node.nextSibling.data.sort
					};
			apiUrl.changeSort(params).then(function(res) {
				self.msgTips(res);
				self.saveFathExpend(node);
				self.init();
			}).catch(function(res) {
				self.msgTips(res);
			});
		},

		// 处理关闭dialog
		handleCloseDialog() {
			this.showEditDialog = false;
			this.motifyNode = {
				id: '',
				newNodeName: '',
				level: ''
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
						level: this.motifyNode.level
					};
			apiUrl.modifyTreeNode(params).then(function(res) {
				self.showEditDialog = false;
				self.msgTips(res);
				if(self.motifyNode.level === 3) {  // 若是三级节点，则把修改后的节点名传到子组件
					self.clickObj.label = self.motifyNode.newNodeName;
				}
				self.init();
				self.motifyNode.newNodeName = '';
			}).catch(function(res) {
				self.msgTips(res);
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
			let params = {};
			if(this.shuttleLevel === 2) {
				for(let item of this.tree) {  // 二级节点穿梭，就要到一级节点找穿梭到的节点
					if(item.id === this.choiceFathId) {
						params = {
								category_id: item.id,
								f_sort:  item.children[item.children.length - 1].sort + 1,
								f_id: this.shuttleChildId,
								shuttleLevel: this.shuttleLevel
							}
						break;
					}
				}
			}
			if(this.shuttleLevel === 3) {  // 三级节点穿梭，就要到二级节点找穿梭到的节点
				for(let item of this.tree) {
					let isfind = false;
					for(let jtem of item.children) {
						if(jtem.id === this.choiceFathId) {
							params = {
								fatherid: jtem.id,
								fatherlabel: jtem.label,
								fathersort: jtem.sort,
								newchildsort: jtem.children[jtem.children.length - 1].sort + 1,
								childid: this.shuttleChildId,
								shuttleLevel: this.shuttleLevel,
							}
							isfind = true;
							break;
						}
					}
					if(isfind) {
						break;
					}
				}
			}
			let self = this;
			apiUrl.changeFather(params).then(function(res) {
				self.msgTips(res);
				self.showShuttleDialog = false;
				self.init();
			}).catch(function(res) {
				self.msgTips(res);
			});
		},

		// 保存当前一二级节点们的展开状态
		saveFathExpend(node) {
			let list = [];
			if(node.level === 1) {  // 一级节点
				list = node.parent.childNodes;
			} else if(node.level === 2) {  // 二级节点
				list = node.parent.parent.childNodes;
			} else {  // 三级节点
				list = node.parent.parent.parent.childNodes;
			}
			this.expandedList = [];
			for(let item of list) {
				if(item.expanded) {
					this.expandedList.push(item.data.id);
				}
				for(let jtem of item.childNodes) {
					if(jtem.expanded) {
						this.expandedList.push(jtem.data.id);
					}
				}
			}
		},

		// 弹框提示
		msgTips(res) {
			this.$message({
				type: res.data.resultsCode,
				message: res.data.message
			});
		},
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '../../static/global.less';

  .admintree {
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
        right: 3rem;
        top: 5rem;
			}
		}
  }
</style>
