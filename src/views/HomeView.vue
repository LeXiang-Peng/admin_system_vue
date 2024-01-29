<template>
  <el-container style="height: 100%">
  <el-aside :style="{width:sideWidth}" class="aside">
    <sideBar :textShow="textShow" :isCollapse="isCollapse"></sideBar>
  </el-aside>

  <el-container>
    <el-header style="font-size: 12px; border-bottom: 1px solid #ccc; line-height: 60px; display: flex;">
      <div style="flex: 1; font-size:  18px;">
        <span :class="collapseBtnClass" style="cursor:pointer" @click="collapse"></span>
      </div>
      <el-dropdown style="width: 70px; cursor: pointer;">
        <span>王小虎</span><i class="el-icon-arrow-down" style="margin-left:5px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人信息</el-dropdown-item>
          <el-dropdown-item>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>

    <el-main>
      <div style="margin-bottom: 30px;">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div style="margin: 10px 0">
        <el-input style="width:200px" suffix-icon="el-icon-search" placeholder="请输入名称"></el-input>
        <el-input style="width:200px; margin-left: 5px;" suffix-icon="el-icon-search" placeholder="请输入邮箱"></el-input>
        <el-input style="width:200px; margin-left: 5px;" suffix-icon="el-icon-search" placeholder="请输入地址"></el-input>
        <el-button style="margin-left:5px" type="primary">搜索</el-button>
      </div>
      
      <div style="margin: 10px 0;">
        <el-button type="primary"><i class="el-icon-circle-plus-outline" ></i> 新增</el-button>
        <el-button type="danger"><i class="el-icon-remove-outline"></i> 批量删除</el-button>
        <el-button type="primary"><i class="el-icon-bottom"></i> 导入</el-button>
        <el-button type="primary"><i class="el-icon-top"></i> 导出</el-button>
      </div>

      <el-table :data="tableData" >
        <el-table-column prop="date" label="日期" width="140">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="address" label="地址">
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="success"><i class="el-icon-edit"></i> 编辑</el-button>
            <el-button type="danger"><i class="el-icon-remove-outline"></i> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="padding: 10px 0">
      <el-pagination
        :page-sizes="[5, 10, 15]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">

        </el-pagination>
      </div>
    </el-main>
  </el-container>
</el-container>
</template>

<style>
.aside{
  background-color: rgb(238, 241, 246); 
  height: 100%; 
  box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
}
</style>

<script>
import sideBar from '../components/home/sideBar.vue';
export default {
name: 'HomeView',
data(){
const item = {
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  };
  return {
    tableData: Array(10).fill(item),
    collapseBtnClass:'el-icon-s-fold',
    sideWidth: '200px',
    isCollapse:false,
    textShow:true
  }
},
components:{
  sideBar
},
methods:{
collapse(){
  this.isCollapse =!this.isCollapse;
  if(this.isCollapse){
    this.sideWidth = '64px';
    this.collapseBtnClass = 'el-icon-s-unfold';
    this.textShow = false;
  }
  else{
    this.sideWidth = '200px';
    this.collapseBtnClass = 'el-icon-s-fold';
    this.textShow=true;
  }
}
}
}
</script>
