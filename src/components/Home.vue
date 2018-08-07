<template>
  <div class="home"><!-- 这是前端展示页面的主Vue -->
    <div class="lefttree">
      <el-tree
				:data="tree"
        :props="defaultProps"
        @node-click="handleClick"
				node-key="id"
        :highlight-current="true"
				accordion>
			</el-tree>
		</div>
		<div class="rightcont">
      <HomeCont :label-obj="clickObj"></HomeCont>
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
			}
		},
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../static/global.less';

  .home {
    height: 100%;
  }
</style>
