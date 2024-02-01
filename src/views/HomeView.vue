<template>
  <el-container style="height: 100%">
    <el-aside
      :style="{width:sideWidth}"
      class="asideBar"
    >
      <sideBar
        :textShow="textShow"
        :isCollapse="isCollapse"
        role="role"
      ></sideBar>
    </el-aside>

    <el-container>
      <el-header class="headerBar">
        <headerBar :collapseBtnClass="collapseBtnClass"></headerBar>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
.asideBar {
  background-color: rgb(238, 241, 246);
  height: 100%;
  box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
}

.headerBar{
  font-size: 12px; 
  border-bottom: 1px solid #ccc; 
  line-height: 60px; 
  display: flex;
}
</style>

<script>
import sideBar from "../components/home/sideBar.vue";
import headerBar from "../components/home/headerBar.vue";
export default {
  name: "HomeView",
  data() {
    return {
      collapseBtnClass: "el-icon-s-fold",
      sideWidth: "200px",
      isCollapse: false,
      textShow: true,
      role:"",
    };
  },
  components: {
    sideBar,
    headerBar,
  },
  methods: {
    collapse() {
      this.isCollapse = !this.isCollapse;
      if (this.isCollapse) {
        this.sideWidth = "64px";
        this.collapseBtnClass = "el-icon-s-unfold";
        this.textShow = false;
      } else {
        this.sideWidth = "200px";
        this.collapseBtnClass = "el-icon-s-fold";
        this.textShow = true;
      }
    },
  },
  provide() {
    return {
      collapse: this.collapse,
    };
  },
  created(){
    this.role = window.localStorage.getItem("role");
  }
};
</script>
