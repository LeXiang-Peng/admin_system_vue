<template>
  <div class="center">
    <h1 style="position: absolute;top:100px">课程管理系统</h1>
    <div class="login">
      <loginHeader></loginHeader>
      <loginPage></loginPage>
    </div>
  </div>
</template>
<style>
.center {
  width: 99.5%;
  height: 99.5%;
  background: url("../assets/loginBackground.jpg") no-repeat center center;
  border-radius: 10px 10px 10px 10px;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  box-shadow: 3px 3px #bebebe, -1em 0 0.4em #d3d3d3;
  font-family: "YouYuan";
}
.login {
  position: absolute;
  border-style: solid;
  border-color: #d3d3d3;
  border-width: 0.5px;
  box-shadow: 0 0 0.5px #d3d3d3;
  width: 460px;
  height: 360px;
  background: url("../assets/loginLogo.png");
  background-size: 100% 100%;
  border-radius: 8px 8px 8px 8px;
  top: 220px;
}
.login:hover {
  border-style: solid;
  border-color: rgb(220, 226, 241);
  border-width: 0.5px;
  box-shadow: 0.5px 0.5px 12px 0.5px rgb(220, 226, 241);
}
</style>

<script>
import loginPage from "../components/login/loginForm.vue";
import loginHeader from "../components/login/loginHeader.vue";
export default {
  name: "LoginView",
  components: {
    loginPage,
    loginHeader,
  },
};
</script>
  