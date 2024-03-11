export default{
    get token(){
        return localStorage.getItem('token');
    },
    set token(value){
        localStorage.setItem('token', value);
    },
     //login页面的属性
     isColor :"grey",
     isRememberButtonClass : 'el-icon-turn-off',
     //home页面属性
     isCollapse : false,
     collapseBtnClass: "el-icon-s-fold",
     sideWidth: "200px",
     textShow: true,
}