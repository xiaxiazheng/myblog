<template>
  <div class="tree">
    <!-- PC端 -->
    <div v-if="isPC" class="PC">
      <div class="lefttree">
        <el-tree
          :data="tree"
          :props="defaultProps"
          node-key="id"
          :default-expanded-keys="defaultExpandedKeys"
          :highlight-current="true"
          @node-click="handleClick"
          accordion>
        </el-tree>
      </div>
      <div class="rightcont">
        <TreeCont></TreeCont>
      </div>
    </div>
    <!-- 移动端 -->
    <div v-else class="Mobile">
      <div class="topMobile">
        <el-button 
          type="primary" 
          icon="el-icon-tickets"
          @click="isShowTree">
        </el-button>
        <h1>{{ title }}</h1>
      </div>
      <div class="leftMobile" v-show="showTree">
        <el-tree
          :data="tree"
          :props="defaultProps"
          @node-click="handleClick"
          node-key="id"
          accordion>
        </el-tree>
      </div>
      <div class="rightMobile">
        <TreeCont :isPC="isPC"></TreeCont>
      </div>
    </div>
  </div>
</template>

<script>
import apiUrl from '@/api/url.js'
import TreeCont from './TreeCont'

export default {
  name: 'tree',
  components: {
    TreeCont,
  },
  data() {
    return {
      tree: [],
      defaultProps: {
				children: 'children',
				label: 'label'
      },
      defaultExpandedKeys: [],
      isPC: false,
      showTree: false,
      title: '虾虾郑的个人空间',
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.init();
    });
  },
  watch: {
    "$route"() { // 路由变化要监听
      this.init();
    }
  },
  methods: {
    init() {
      if(window.screen.width > 600) {
        this.isPC = true;
      }
      if(this.$route.query.id) {  // 如果有id就做节点展开，起码刷新的时候要把当前的节点存起来展开
        this.defaultExpandedKeys = []; // 前台展示的话直接清空
        this.defaultExpandedKeys.push(parseInt(atob(this.$route.query.id)));
      }
      var self = this,
          params = {
            type: 'home'
          };
      apiUrl.getTree(params).then(function(res) {
        self.tree = res.data;
      }).catch(function(res) {
        self.$message({
          type: 'error',
          message: '初始化树失败'
        });
      });
    },
    handleClick(nodeObj, node, c) {
			let isLeaf = node.isLeaf;
			if(isLeaf) {
        this.$router.push({ // 点击节点就改路由
          query: {
            id: btoa(encodeURIComponent(node.data.id))
          } 
        });

        // 移动端
        this.showTree = false;
        this.title = node.data.label;
      }
    },
    isShowTree() {
      this.showTree = !this.showTree;
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../static/global.less';

  .tree {
    .PC {
      height: 100%;
    }
    .Mobile {
      .topMobile {
        position: fixed;
        top: 0;
        width: 100%;
        height: 2.5rem;
        border-bottom: 1px solid #ccc;
        background-color: white;
        text-align: left;
        .el-button {
          width: 3.5rem;
          height: 2.5rem;
          margin-right: .4rem;
          text-align: center;
          vertical-align: middle;
        }
        h1 {
          display: inline-block;
          vertical-align: middle;
        }
      }
      .leftMobile {
        height: calc(100% - 2rem);
        position: fixed;
        top: 2.5rem;
        width: 65%;
        background-color: white;
        border: 1px solid #ccc;
        z-index: 2;
        overflow-y: auto;
      }
      .rightMobile {
        position: fixed;
        top: 2.5rem;
        height: calc(100% - 2rem);
        width: 100%;
        overflow-y: auto;
      }
    }
  }
</style>
