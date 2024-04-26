import { removeIdCard } from "@/utils/role";
export default {
  changeCaptcha(state) {
    state.captchaUrl = "http://localhost:9090/common/captcha?time=" + new Date().getTime();
  },
  changeForm(state, id) {
    switch (id) {
      case '0': state.role = "admin", state.label = "管理员ID"; break;
      case '1': state.role = "teacher", state.label = "教师ID"; break;
      case '2': state.role = "student", state.label = "学号"; break;
      default: break;
    }
    state.captchaUrl = "http://localhost:9090/common/captcha?time=" + new Date().getTime();
  },

  pressIsRememberButton(state, isRemember) {
    if (!isRemember) {
      state.isRememberButtonClass = "el-icon-open";
      state.isColor = "green";
    } else {
      state.isRememberButtonClass = "el-icon-turn-off";
      state.isColor = "grey";
    }
  },
  collapse(state) {
    state.isCollapse = !state.isCollapse;
    if (state.isCollapse) {
      state.sideWidth = "64px";
      state.collapseBtnClass = "el-icon-s-unfold";
      state.textShow = false;
    } else {
      state.sideWidth = "200px";
      state.collapseBtnClass = "el-icon-s-fold";
      state.textShow = true;
    }
  },
  setMenu(state, menuList) {
    state.menu = menuList;
  },
  setLocalToken(state, token) {
    localStorage.setItem('token', token);
  },
  setToken(state, token) {
    state.token = token;
    sessionStorage.setItem('token', token);
  },
  logout(state) {
    removeIdCard();
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('userName');
    sessionStorage.removeItem('userName');
    state.userName = '';
    state.token = '';
  },
  setCurrentPath(state, currentPath) {
    state.currentPath = currentPath;
    sessionStorage.setItem("currentPath", currentPath);
  },
  setUserName(state, userName) {
    state.userName = userName;
    sessionStorage.setItem("userName", userName);
    if (localStorage.getItem("userName")) localStorage.setItem("userName", userName);
  },
  setLocalUserName(state, userName) {
    localStorage.setItem("userName", userName);
  },
  setAvatarUrl(state, avatar_url) {
    state.avatar_url = avatar_url;
    localStorage.setItem("avatar_url", avatar_url);
  }
}