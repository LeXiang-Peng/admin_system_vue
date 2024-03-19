<template>
  <el-menu
    class="sideBar"
    background-color=rgb(48,65,86)
    text-color="#fff"
    active-text-color="black"
    :collapse-transition="false"
    :collapse="isCollapse"
    :default-active="defaultActive"
    router
  >
    <div>
      <img src="../../assets/logo.png">
      <b v-show="textShow">教务管理系统</b>
    </div>
    <el-submenu
      v-for="(item) in menuList"
      v-if="item.menuChildren&&item.menuChildren.length > 0"
      :index="item.menuUrl"
      :key="item.menuId"
    >
      <template slot="title">
        <i :class="item.menuIcon"></i>
        <span slot="title">
          {{ item.menuName }}
        </span>
      </template>

      <el-menu-item-group>
        <el-menu-item
          v-for="(i) in item.menuChildren"
          :index="i.menuUrl"
          :key="i.menuId"
        >{{ i.menuName }}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-menu-item
      v-else
      :index="item.menuUrl"
      :key="item.menuId"
    >
      <i :class="item.menuIcon"></i>
      <span v-show="textShow">{{ item.menuName }}</span>
    </el-menu-item>
  </el-menu>
</template>

<style>
.sideBar {
  min-height: 100vh;
  overflow-x: hidden;
}
.sideBar > div {
  height: 60px;
  line-height: 60px;
  text-align: center;
}

.sideBar img {
  width: 20px;
  position: relative;
  top: 5px;
  margin-right: 5px;
  margin-left: 6px;
}
.sideBar b {
  color: white;
  margin-right: 5px;
}

.el-submenu.is-active > .el-submenu__title {
  background: rgb(205, 207, 208) !important;
}

.is-active{
  background: rgb(208, 205, 205) !important;
}
</style>

<script>
export default {
  name: "sideBar",
  data(){
    return{
      defaultActive:'home',
    }
  },
  props: {
    isCollapse: {
      type: Boolean,
    },
    textShow: {
      type: Boolean,
    },
  },
  computed: {
    menuList: {
      get() {
        return this.$store.state.menu;
      },
    },
  },
  created() {
    this.$store.dispatch("getMenu");
    this.setCurrentRoute();
  },
  methods: {
    setCurrentRoute () {
      this.defaultActive = this.$route.name;//关键   通过他就可以监听到当前路由状态并激活当前菜单
    }
  },
  watch: {
    $route () {
      this.setCurrentRoute();
    }
  },
};
</script>
