<template>
  <header class="nav">
    <div class="leftside">
      <span>
        XIAXIA
      </span>
    </div>
    <div class="rightside">
      <span>
        还不知道放啥
      </span>
    </div>
  </header>
</template>

<script>

export default {
  name: 'Nav',
  data() {
    return {
      
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.init();
    });
  },
  methods: {
    init() {
      
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .nav {
    display: flex;
    justify-content: space-between;
    height: 3.6rem;
    padding: .7rem 1.5rem;
    line-height: 2.2rem;
    background-color: #fff;
    box-sizing: border-box;
    border-bottom: 1px solid #eaecef;
    .leftside {
      .span {
        font-size: 1.3rem;
        font-weight: 600;
        color: #2c3e50;
        position: relative;
      }
    }
    .rightside {
      .span {
        font-size: 1.3rem;
        font-weight: 600;
        color: #2c3e50;
        position: relative;
      }
    }
  }
</style>
