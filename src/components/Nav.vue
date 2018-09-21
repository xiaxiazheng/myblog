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
        <span class="tabItem" :class="{'active': activeTab === 'tree'}" @click="clickTabs('Tree')">知识树</span>
        <span class="tabItem" :class="{'active': activeTab === 'photowall'}" @click="clickTabs('PhotoWall')">图片墙</span>
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
        <span class="tabItem" :class="{'active': activeTab === 'tree'}" @click="clickTabs('AdminTree')">知识树</span>
        <span class="tabItem" :class="{'active': activeTab === 'photowall'}" @click="clickTabs('AdminPhotoWall')">图片墙</span>
        <a href="https://github.com/xiaxiazheng/myblog">
          GitHub
          <i class="el-icon-loading"></i>
        </a>
      </div>
    </div>
  </header>
</template>

<script>

export default {
  name: 'Nav',
  data() {
    return {
      activeTab: ''
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
      
    },
    clickTabs(tabName) {
      this.$router.push({ name: tabName });
      this.activeTab = tabName;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
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
      }
    }
  }
</style>
