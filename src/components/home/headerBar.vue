<template>
  <div class="headerBar">
    <div style="flex: 1; font-size:  18px;">
      <span
        style="cursor: pointer;"
        :class="collapseBtnClass"
        @click="collapse"
      ></span>
      <el-breadcrumb
        separator="/"
        style="display: inline-block; margin-left: 10px;"
      >
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentPath }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-dropdown style="width: 100px;cursor: pointer;">
      <span>王小虎</span>
      <i
        class="el-icon-s-tools"
        style="margin-left:5px"
      ></i>
      <el-dropdown-menu slot="dropdown" style="width: 90px; text-align: center;">
        <el-dropdown-item style="font-size: 14px; padding: 5px 0;">个人信息</el-dropdown-item>
        <el-dropdown-item style="font-size: 14px; padding: 5px 0;">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<style>
.headerBar {
  height: 100%;
  width: 100%;
  display: flex;
}
</style>

<script>
import store from '@/store';
export default {
  name: "headerBar",
  inject: ["collapse"],
  props: {
    collapseBtnClass: {
      type: String,
    },
  },
  computed:{
    currentPath:{
      get(){
        return store.getters.getCurrentPath;
      }
    }
  }
};
</script>