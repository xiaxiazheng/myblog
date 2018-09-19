<template>
  <div class="home">
    <!-- PC端 -->
    <div v-if="isPC" class="PC">
      <div class="lefttree">
        <el-tree
          :data="tree"
          :props="defaultProps"
          @node-click="handleClick"
          node-key="id"
          accordion>
        </el-tree>
      </div>
      <div class="rightcont">
        <HomeCont :label-obj="clickObj"></HomeCont>
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
        <HomeCont :label-obj="clickObj" :isPC="isPC"></HomeCont>
      </div>
    </div>
  </div>
</template>

<script>
import HomeCont from './home/HomeCont'
import apiUrl from '@/api/url.js'
// import { treeData } from "@/mock.js";

export default {
  name: 'Home',
  components: {
    HomeCont,
  },
  data() {
    return {
      tree: [],
      clickObj: '',
      defaultProps: {
				children: 'children',
				label: 'label'
      },
      isPC: false,
      showTree: false,
      title: '虾虾郑的个人空间'
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.init();
    });
  },
  methods: {
    init() {
      if(window.screen.width > 600) {
        this.isPC = true;
      }
      var self = this,
          params = {};
      // this.tree = treeData;
      apiUrl.getTree(params).then(function(res) {
        self.tree = res.data;
      }).catch(function(res) {
        console.log(res.message);
      });
    },
    handleClick(a, b, c) {
			let isLeaf = b.isLeaf;
			if(isLeaf) {
        this.clickObj = b.data;
        this.showTree = false;
        this.title = b.data.label;
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
@import '../static/global.less';

  .home {
    height: calc(100% - 3.6rem);
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
