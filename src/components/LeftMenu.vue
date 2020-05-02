<template>
  <el-row class = "tac">
    <el-col :span = "24">
      <el-menu class = "el-menu-vertical-demo" style = "height: 100%" router @open = "handleOpen" @close = "handleClose" background-color = "#545c64" text-color = "#fff" active-text-color = "#ffd04b">
        <el-submenu v-for = "item in menu" :index = "item.id" :key = "item.id">
          <template slot = "title">
            <span v-text = "item.name"></span>
          </template>

          <el-menu-item-group class = "menu_hide" v-for = "sub in item.sub" :key = "sub.componentName">
            <el-menu-item :index = "sub.componentName" v-text = "sub.name">
            </el-menu-item>
          </el-menu-item-group>

        </el-submenu>
      </el-menu>
    </el-col>
  </el-row>
</template>
