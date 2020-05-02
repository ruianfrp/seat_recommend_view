<template>
  <div id = "app">
    <el-container v-if = "$route.meta.keepalive">
      <el-header class = "header">
        <keep-alive>
        </keep-alive>
      </el-header>
      <el-container>
        <el-aside style = "width:200px; height:600px">
          <keep-alive>
          </keep-alive>
        </el-aside>
        <el-container>
          <el-main>
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </el-main>
          <el-footer style = "padding-left: 0px;padding-right: 0px;">
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
    <router-view v-if = "!$route.meta.keepalive"></router-view>
  </div>
</template>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  .header{
    line-height: 60px;
    background-color: #545c64;
    text-color: white;
  }
</style>