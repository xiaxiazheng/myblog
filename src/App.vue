<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
}
</script>

<style lang="less">
html{height: 100%;}
body,ul,ol,li,p,h1,h2,h3,h4,h5,h6,form,fieldset,table,td,img,div{margin:0;padding:0;} 
body{background:#fff;color:#333;font-size:12px;font-family:"SimSun","宋体","Arial Narrow";height:100%;} 
  
ul,ol{list-style-type:none;} 
select,input,img,select{vertical-align:middle;} 
  
a{text-decoration:none;} 
a:link{color:#009;} 
a:visited{color:#800080;} 
a:hover,a:active,a:focus{color:#c00;text-decoration:underline;}
#app {
  font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
  color: #34495e;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
}
</style>
