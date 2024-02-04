import Vue from 'vue';
import Vuex from 'vuex';
 
Vue.use(Vuex);
 
export default new Vuex.Store({
  state: {
    //login页面的属性
    role : 'student',
    label : '学号',
    captchaUrl : "http://localhost:9090/common/captcha?time=" + new Date().getTime(),
    isColor :"grey",
    isRemenberButtonClass : 'el-icon-turn-off',
    //home页面属性
    isCollapse : false,
    collapseBtnClass: "el-icon-s-fold",
    sideWidth: "200px",
    textShow: true,
  },
  mutations: {
    changeCaptcha(state){
        state.captchaUrl= "http://localhost:9090/common/captcha?time=" + new Date().getTime();
    },
    changeForm(state, id){
        switch(id){
            case '0':state.role="admin",state.label="管理员ID";break;
            case '1':state.role="teacher",state.label="教师ID";break;
            case '2':state.role="student",state.label="学号";break;
            default: break;
        }
        state.captchaUrl = "http://localhost:9090/common/captcha?time=" + new Date().getTime();
    },
    pressIsRemenberButton(state,isRemenber){
        if (!isRemenber) {
            state.isRemenberButtonClass = "el-icon-open";
            state.isColor = "green";
          } else {
            state.isRemenberButtonClass = "el-icon-turn-off";
            state.isColor = "grey";
        }
    },
    collapse(state){
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
    }
  },
  actions: {

  },
  getters: {
    getRole(state){
        return state.role;
    }
  }

});
