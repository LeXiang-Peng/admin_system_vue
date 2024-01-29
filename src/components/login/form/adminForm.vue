<template>
    <div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item>
              <span class="login_body_button" @click="pressButton">
                <i :class="buttonClass" :style="{color:isColor}"></i>
                <span style="font-size:15px">记住密码</span>
              </span>
            </el-form-item>
            <el-form-item prop="id" label="管理员ID">
              <el-input type="text" autocomplete="off" v-model="ruleForm.id" style="width: 210px;"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码">
              <el-input type="password" autocomplete="off" v-model="ruleForm.password" style="width: 210px;" show-password></el-input>
            </el-form-item>
            <el-form-item class="verificationCode" prop="captcha">
              <el-input autocomplete="off" type="text" style="width: 120px;" v-model="ruleForm.captcha"></el-input>
              <span @click="resetCaptcha"><el-image :src="captchaUrl" style="width:100%;height:100%;" ></el-image></span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
              <el-button type="warning" style="margin-left: 10px;" @click="resetForm('ruleForm')">重置</el-button>
              <p style="display: inline; margin-left: 5px;"><span style="margin-left: 0;">忘记密码？</span>
                <a href="" class="login_body_icon">
                  <i class="el-icon-thumb" style="transform: scale(1.1);margin-right: 1px;"></i>点我
                </a>
              </p>
            </el-form-item>
        </el-form>
    </div>
</template>

<style>
.login_body_icon{
  zoom:1;
  text-decoration: none;
  color: blue;
}
.login_body_icon:hover{
  color: crimson;
  zoom:1.1;
}
.login_body_button{
  width: 90px;
  height: 26px;
  position: absolute;
  left: 60%;
  bottom: 1%;
  cursor: pointer;
}
.login_body_button i{
  transform: scale(1.9);
  margin-right: 10px;
}
.login_body_button:hover{
  zoom:1.01;
}
.verificationCode span{
  margin-left: 5.5%;
  position: absolute;
  width: 24.5%;
  height:125%;
}
.verificationCode span:hover{
  cursor: pointer;
}
</style>

<script>
export default{
    name:'adminForm',
    data(){
          var checkId  = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入管理员ID'));
        }else{
        setTimeout(() => {
          let idPattern = new RegExp("[a-zA-Z0-9]{5,18}");
          if(!idPattern.test(value)){
            callback(new Error('请输入正确管理员ID'));
          }else{
            callback();
          }
          }, 500);
        }
      };
      var validatePass   = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }else{
          let passPattern =new RegExp('[a-zA-Z0-9!_$]{5,18}');
          setTimeout(() => {
            if(!passPattern.test(value)){
              callback(new Error('格式：数字或英文或!或_或$ , 长度：5-18'));
            }else{
              callback();
            }
          },1000)
        }
      };
      var validateCaptcha   = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请填写验证码'));
        } else {
          callback();
        }
      };
      return {
        buttonClass:'el-icon-turn-off',
        isColor: 'grey',
        ruleForm: {
          id:'',
          password:'',
          captcha:'',
          isRemenber: false
        },
        rules: {
          id:[{validator: checkId, trigger: 'blur'}],
          password:[{validator: validatePass, trigger: 'blur'}],
          captcha: [{validator: validateCaptcha, trigger: 'blur'}],
        },
        isPost:false,
        isTurned:false,
      }
     },
     props:{
      captchaUrl:{
        type: String
      },
     },
     methods: {
      submitForm(formName) {
        if(!this.isTurned){
          this.isTurned=true;
          this.$refs[formName].validate((valid)=>{
            if(valid){
              this.getCaptchaResult((res)=>{
                if(window.atob(res) === this.ruleForm.captcha){
                  this.$message.success('验证码正确');
                  this.resetCaptcha();
                  this.$router.push('/home',()=>{});
                }else{
                  this.$message.error('验证码错误');
                  this.resetCaptcha();
                  return false;
                }
              })
            }else{
              this.$message.error('请填写信息后提交');
              return false;
            }
          })
          setTimeout(()=>{this.isTurned=false},1000);
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      pressButton(){
      if(!this.ruleForm.isRemenber){
        this.ruleForm.isRemenber=true;
        this.buttonClass = 'el-icon-open';
        this.isColor = 'green';
      }else{
        this.ruleForm.isRemenber=false;
        this.buttonClass = 'el-icon-turn-off';
        this.isColor = 'grey';
      }
    },        
    getCaptchaResult(callback){
        this.request.get('common/captcha/result').then(res=>{
          callback(res);
      })
    },    
    resetCaptcha(){
      if(!this.isPost){
        this.isPost=true;
        this.captchaUrl = 'http://localhost:9090/common/captcha?time=' + new Date().getTime();
        setTimeout(()=>{this.isPost=false},500);
      }
    }
  }
}
</script>