<template>
  <el-container style="height: 100%">
    <el-aside
      :style="{width: $store.state.sideWidth}"
      class="asideBar"
    >
      <sideBar
        :textShow="$store.state.textShow"
        :isCollapse="$store.state.isCollapse"
      ></sideBar>
    </el-aside>

    <el-container>
      <el-header class="headerBar">
        <headerBar :collapseBtnClass="$store.state.collapseBtnClass"></headerBar>
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
    return{
      
    }
  },
  components: {
    sideBar,
    headerBar,
  },
  methods: {
    collapse() {
      this.$store.commit("collapse");
    },
  },
  provide() {
    return {
      collapse: this.collapse,
    };
  }
};
</script>
