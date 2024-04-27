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
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentPath }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-dropdown style="width: 120px;cursor: pointer;">
      <div style="display: inline-block;">
        <img
          :src="avatar_url"
          style="line-height: 45px;position: relative;top: 10px;right: 5px; 
          border-radius: 50%; object-fit: contain; height: 45px;width: 45px;"
        />
        <span>
          {{ userName }}
        </span>
        <i
          class="el-icon-s-tools"
          style="margin-left:5px"
        ></i>
      </div>
      <el-dropdown-menu
        slot="dropdown"
        style="width: 90px; text-align: center;"
      >
        <el-dropdown-item style="font-size: 14px; padding: 5px 0;">
          <span @click="info()">
            个人信息
          </span>
        </el-dropdown-item>
        <el-dropdown-item style="font-size: 14px; padding: 5px 0;">
          <span
            @click="logout()"
            style="cursor: pointer; width: 100%;height: 100%;;"
          >退出</span>
        </el-dropdown-item>
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
import store from "@/store";
import { logout } from "@/utils/api";
export default {
  name: "headerBar",
  inject: ["collapse"],
  props: {
    collapseBtnClass: {
      type: String,
    },
  },
  computed: {
    currentPath: {
      get() {
        return store.getters.getCurrentPath;
      },
    },
    userName: {
      get() {
        return store.getters.getUserName;
      },
    },
    avatar_url: {
      get() {
        return store.getters.getAvatarUrl;
      },
    },
  },
  methods: {
    async logout() {
      const res = await logout();
      if (res.code === 200) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
      this.$store.commit("logout");
      this.$router.replace("/login");
    },
    info() {
      this.$router.replace("/modifyInfo");
    },
  }
};
</script>