<template>
  <div class="login_header_content">
    <el-tooltip
      class="item"
      effect="dark"
      content="验证码登录"
      placement="top"
    >
      <span
        @mouseover="iconChange"
        @mouseout="iconChangeBack"
      >
        由此打开
        <i
          :class="iconClass"
          style="transform: scale(2);"
        ></i>
      </span>
    </el-tooltip>
  </div>
</template>

<style>
.login_header_content {
  height: 10%;
  width: 30%;
  margin-left: 42%;
  padding-top: 4.5%;
}
.login_header_content span {
  color: rgb(57, 89, 108);
  zoom: 1;
}
.login_header_content span:hover {
  color: crimson;
  zoom: 1.02;
  cursor: pointer;
}
</style>

<script>
export default {
  name: "loginHeader",
  data() {
    return {
      iconClass: "el-icon-caret-bottom",
    };
  },
  methods: {
    iconChange() {
      this.iconClass = "el-icon-caret-top";
    },
    iconChangeBack() {
      this.iconClass = "el-icon-caret-bottom";
    },
  },
};
</script>
