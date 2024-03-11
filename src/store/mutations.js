export default{
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

    pressIsRememberButton(state,isRemember){
        if (!isRemember) {
            state.isRememberButtonClass = "el-icon-open";
            state.isColor = "green";
          } else {
            state.isRememberButtonClass = "el-icon-turn-off";
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
    },
    LOGIN(state, token){
      state.token = token;
    },
    LOGOUT(state){
      state.token = '';
    }
}