<template>
  <div class="bar">
    <span
      id="2"
      :class="{hold:isActive[2]}"
      @click="changeForm($event)"
    >学生</span>
    <span
      id="0"
      :class="{hold:isActive[0]}"
      @click="changeForm($event)"
    >管理员</span>
    <span
      id="1"
      :class="{hold:isActive[1]}"
      @click="changeForm($event)"
    >教师</span>
  </div>
</template>

<style scoped>
.bar {
  margin-left: 20%;
  margin-top: -5%;
  margin-bottom: 5.5%;
}
.bar span {
  flex: 1;
  min-width: 62px;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  display: inline-block;
  line-height: 30px;
  text-align: center;
  background: #f2f3f9;
  color: #666;
  cursor: pointer;
  margin-right: 15px;
}
.bar .hold {
  background: #cce3f6;
  border: 1px solid rgb(#7288fa);
  color: rgb(#7288fa);
}
</style>

<script>
export default {
  name: "loginFormBar",
  data() {
    return {
      isActive: [false, false, true],
    };
  },
  methods: {
    changeForm(event) {
      let id = event.currentTarget.id;
      if (!this.isActive[id]) {
        if(this.isRemember){this.pressIsRememberButton();}
        this.resetForm("ruleForm");
        this.isActive = [false, false, false];
        this.isActive[id] = true;
        this.selectForm(id);
      }
    },
  },
  props:{
    isRemember:{
      type:Boolean
    }
  },
  inject:["pressIsRememberButton","resetForm","selectForm"]
};
</script>