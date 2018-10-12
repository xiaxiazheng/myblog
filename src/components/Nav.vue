<template>
  <header class="nav">
    <!-- 展示版 -->
    <div v-if="type === 'home'">
      <div class="leftside">
        <span @click="clickTabs('Main')">
          XIAXIAZheng
        </span>
      </div>
      <div class="rightside">
        <!-- <el-input
          placeholder="暂时没想好怎么做"
          prefix-icon="el-icon-search"
          v-model="searchkeyword">
        </el-input> -->
        <el-autocomplete
          class="searchBox"
          popper-class="searchBoxPopper"
          v-model="searchkeyword"
          :fetch-suggestions="querySearch"
          placeholder="搜索树的节点"
          :trigger-on-focus="false"
          @select="handleSelect"
        >
          <i
            class="el-icon-edit el-input__icon"
            slot="suffix">
          </i>
          <template slot-scope="{ item }" :title="item.label + '\n' + item.flabel">
            <div class="label">{{ item.label }}</div>
            <span class="flabel">{{ item.flabel }}</span>
          </template>
        </el-autocomplete>
        <span class="tabItem" :class="{'active': activeTab === 'Tree'}" @click="clickTabs('Tree')">知识树</span>
        <span class="tabItem" :class="{'active': activeTab === 'PhotoWall'}" @click="clickTabs('PhotoWall')">图片墙</span>
        <a href="https://github.com/xiaxiazheng/myblog">
          GitHub
          <i class="el-icon-loading"></i>
        </a>
      </div>
    </div>
    <!-- 控制台版 -->
    <div v-if="type === 'admin'">
      <div class="leftside">
        <span @click="clickTabs('AdminMain')">
          XIAXIAZheng
        </span>
      </div>
      <div class="rightside">
        <span class="tabItem" :class="{'active': activeTab === 'AdminTree'}" @click="clickTabs('AdminTree')">知识树</span>
        <span class="tabItem" :class="{'active': activeTab === 'AdminPhotoWall'}" @click="clickTabs('AdminPhotoWall')">图片墙</span>
        <a href="https://github.com/xiaxiazheng/myblog">
          GitHub
          <i class="el-icon-loading"></i>
        </a>
      </div>
    </div>
  </header>
</template>

<script>
import apiUrl from '@/api/url.js'

export default {
  name: 'Nav',
  data() {
    return {
      tree: [],
      activeTab: '',
      searchkeyword: '',
    }
  },
  props: ["type"],
  mounted() {
    this.$nextTick(function() {
      this.init();
    });
  },
  methods: {
    init() {
      var self = this,
          params = {
            type: 'home'
          };
      apiUrl.getTree(params).then(function(res) {
        self.tree = [];
        for(let item of res.data) {
          for(let jtem of item.children) {
            for(let ktem of jtem.children) {
              self.tree.push({
                id: ktem.id,
                flabel: item.label + ' -> ' + jtem.label,
                label: ktem.label
              });
            }
          }
        }
      }).catch(function(res) {
        self.$message({
          type: 'error',
          message: '初始化树失败'
        });
      });
    },

    clickTabs(tabName) {
      this.$router.push({ name: tabName });
      this.activeTab = tabName;
    },

    querySearch(queryString, cb) {
      var tree = this.tree;
      var results = queryString ? tree.filter(this.createFilter(queryString)) : tree;
      
      cb(results); // 调用 callback 返回建议列表的数据
    },
    createFilter(queryString) {
      return (item) => {
        return (item.label.toLowerCase().indexOf(queryString.toLowerCase()) !== -1 || item.flabel.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
      };
    },
    handleSelect(item) {
      this.$router.replace({
        name: "Tree",
        query: {
          id: btoa(encodeURIComponent(item.id))
        }
      })
    }
  }
}
</script>

<style lang="less">
  .nav {
    height: 3.6rem;
    padding: .7rem 1.5rem;
    line-height: 2.2rem;
    background-color: #fff;
    box-sizing: border-box;
    border-bottom: 1px solid #eaecef;
    >div {
      display: flex;
      justify-content: space-between;
      .leftside {
        >span {
          font-size: 1.3rem;
          font-weight: 600;
          color: #2c3e50;
          cursor: pointer;
        }
      }
      .rightside {
        .tabItem {
          display: inline-block;
          height: 1.7rem;
          margin-left: 1.5rem;
          font-size: .9rem;
          cursor: pointer;
        }
        .tabItem:hover {
          border-bottom: 2px solid #409eff;
        }
        .active {
          border-bottom: 2px solid #409eff;
        }
        >a {
          margin-left: 1.5rem;
          font-size: .9rem;
          text-decoration: none;
          color: black;
        }
        .searchBox {
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }
  // 这个搜索的弹出框在比较全局的地方
  .searchBoxPopper {
    li {
      line-height: normal;
      padding: 7px;
      .label {
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .flabel {
        font-size: 12px;
        color: #b4b4b4;
      }
    }
  }
</style>
