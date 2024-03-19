<template>
  <div class="HomeContent">
    <div style="margin: 10px 0;margin-top:-5px;">
      <el-input
        v-model="queryParams.id"
        style="width: 200px;"
        suffix-icon="el-icon-search"
        placeholder="请输入学号"
      ></el-input>
      <el-input
        v-model="queryParams.name"
        style="width: 200px; margin-left: 5px;"
        suffix-icon="el-icon-user"
        placeholder="请输入名字"
      ></el-input>
      <el-select
        v-model="queryParams.department"
        clearable
        style="width: 200px; margin-left: 5px;"
        placeholder="请选择院系"
        @change="departmentChange(queryParams.department, queryParams.profession, queryParams.clazz)"
      >
        <el-option
          v-for="(dep) in departmentList"
          :value="dep.department"
          :label="dep.department"
          :key="dep.department"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="queryParams.profession"
        clearable
        style="width: 200px; margin-left: 5px;"
        placeholder="请选择专业"
        @change="professionChange(queryParams.profession, queryParams.department, queryParams.clazz)"
      >
        <el-option
          v-for="pro in professionList"
          :value="pro.profession"
          :label="pro.profession"
          :key="pro.profession"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="queryParams.clazz"
        clearable
        style="width: 200px; margin-left: 5px;"
        placeholder="请选择班级"
        @change="clazzChange(queryParams.clazz, queryParams.department, queryParams.profession)"
      >
        <el-option
          v-for="cla in clazzList"
          :value="cla"
          :label="cla"
          :key="cla"
        >
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 5px;"
        type="primary"
        @click="getStudents(queryParams, pageSize, pageNum)"
      >搜索</el-button>
      <el-button
        style="margin-left: 5px;"
        type="warning"
        @click="resetParams"
      >重置</el-button>
    </div>
    <div style="margin: 10px 0;padding-bottom:5px;">
      <el-button type="primary">
        <i class="el-icon-circle-plus-outline"></i>
        <span>新增</span>
      </el-button>
      <el-button type="danger">
        <i class="el-icon-remove-outline"></i>
        <span>批量删除</span>
      </el-button>
      <el-button type="primary">
        <i class="el-icon-bottom"></i>
        <span>导入</span>
      </el-button>
      <el-button type="primary">
        <i class="el-icon-top"></i>
        <span>导出</span>
      </el-button>
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      :header-row-style="{height:'38px'}"
      style="border-radius: 8px; box-shadow: 5px 5px 50px 50px rgba(179, 184, 182, 0.267);"
    >
      <el-table-column
        prop="id"
        label="学号"
        width="110px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="100px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="clazz"
        label="班级"
        width="180px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="profession"
        label="专业"
        width="160px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="department"
        label="院系"
        width="160px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="gender"
        label="性别"
        width="80px"
        align="center"
      >
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="warning"
            @click="resetPassword"
          ><i class="el-icon-refresh"></i><span>重置密码</span></el-button>
          <el-button type="danger"><i class="el-icon-remove-outline"></i><span>删除</span></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 8, 10, 12]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="学生信息"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <el-form
        label-width="80px"
        style="margin-left: 35px;"
      >
        <el-form-item label="学生姓名">
          <el-input
            autocomplete="off"
            style="width: 200px;"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="院系"
          style="margin-left: -3.5px;"
        >
          <el-select
            v-model="postForm.department"
            clearable
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择院系"
            @change="departmentChange(postForm.department, postForm.profession, postForm.clazz)"
          >
            <el-option
              v-for="(dep) in departmentList"
              :value="dep.department"
              :label="dep.department"
              :key="dep.department"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="专业"
          style="margin-left: -3.5px;"
        >
          <el-select
            v-model="postForm.profession"
            clearable
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择专业"
            @change="professionChange(postForm.profession, postForm.department, postForm.clazz)"
          >
            <el-option
              v-for="pro in professionList"
              :value="pro.profession"
              :label="pro.profession"
              :key="pro.profession"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="班级"
          style="margin-left: -3.5px;"
        >
          <el-select
            v-model="postForm.clazz"
            clearable
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择班级"
            @change="clazzChange(postForm.clazz, postForm.department, postForm.profession)"
          >
            <el-option
              v-for="cla in clazzList"
              :value="cla"
              :label="cla"
              :key="cla"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
        style="margin-left: -10px;"
      >
        <el-button
          @click="centerDialogVisible = false;resetParams()"
          style="margin-right: 10px;"
        >取 消</el-button>  
        <el-button
          type="primary"
          @click="centerDialogVisible = false;resetParams()"
        >提交 </el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { getStudentList, getOptionList } from "@/utils/api";
export default {
  name: "manage",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 5,
      queryParams: {
        id: null,
        name: "",
        clazz: "",
        profession: "",
        department: "",
      },
      options: [],
      departmentList: [],
      professionList: [],
      clazzList: [],
      initialData: {
        clazzs: [],
        professions: [],
      },
      centerDialogVisible: true,
      postForm: {
        name: "",
        department: "",
        profession: "",
        clazz: "",
      },
    };
  },
  methods: {
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getStudents(this.queryParams, this.pageSize, this.pageNum);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getStudents(this.queryParams, this.pageSize, this.pageNum);
    },
    async getStudents(queryParams, pageSize, pageNum) {
      const res = await getStudentList(queryParams, pageSize, pageNum);
      if (res.code === 200) {
        this.$message.success(res.msg);
        this.total = res.data.total;
        this.tableData = res.data.list;
      }
    },
    async getOptions() {
      const res = await getOptionList();
      this.options = res.data;
      this.initData();
    },
    departmentChange(value, profession, clazz) {
      if (!value) {
        if (profession !== "") {
          this.professionChange(profession);
          this.professionList = this.initialData.professions;
        } else if (clazz !== "") {
          this.clazzChange(clazz);
          this.clazzList = this.initialData.clazzs;
        } else {
          this.clazzList = this.initialData.clazzs;
          this.professionList = this.initialData.professions;
        }
        return;
      }
      this.professionList = [];
      this.clazzList = [];
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].department !== value) continue;
        else {
          let d_list = this.options[i];
          for (let j = 0; j < d_list.professionList.length; j++) {
            let p_list = d_list.professionList[j];
            this.professionList.push(p_list);
            for (let k = 0; k < p_list.clazzList.length; k++) {
              this.clazzList.push(p_list.clazzList[k].clazz);
            }
          }
        }
      }
    },
    professionChange(value, department, clazz) {
      if (!value) {
        if (department !== "") {
          this.departmentChange(department);
          this.departmentList = this.options;
        } else if (clazz !== "") {
          this.clazzChange(clazz);
          this.clazzList = this.initialData.clazzs;
        } else {
          this.departmentList = this.options;
          this.clazzList = this.initialData.clazzs;
        }
        return;
      }
      this.departmentList = [];
      this.clazzList = [];
      for (let i = 0; i < this.options.length; i++) {
        let d_list = this.options[i];
        for (let j = 0; j < d_list.professionList.length; j++) {
          let p_list = d_list.professionList[j];
          if (p_list.profession === value) {
            this.departmentList.push(d_list);
            for (let k = 0; k < p_list.clazzList.length; k++) {
              this.clazzList.push(p_list.clazzList[k].clazz);
            }
          }
        }
      }
    },
    clazzChange(value, department, profession) {
      if (!value) {
        if (department != "") {
          this.departmentChange(department);
          this.departmentList = this.options;
        } else if (profession !== "") {
          this.professionChange(profession);
          this.professionList = this.initialData.professions;
        } else {
          this.departmentList = this.options;
          this.professionList = this.initialData.professions;
        }
        return;
      }
      this.professionList = [];
      this.departmentList = [];
      for (let i = 0; i < this.options.length; i++) {
        let d_list = this.options[i];
        for (let j = 0; j < d_list.professionList.length; j++) {
          let p_list = d_list.professionList[j];
          for (let k = 0; k < p_list.clazzList.length; k++) {
            if (p_list.clazzList[k].clazz === value) {
              this.departmentList.push(d_list);
              this.professionList.push(p_list);
            }
          }
        }
      }
    },
    initData() {
      this.departmentList = this.options;
      for (let i = 0; i < this.options.length; i++) {
        const p_list = this.options[i].professionList;
        for (let j = 0; j < p_list.length; j++) {
          this.initialData.professions.push(p_list[j]);
          const c_list = p_list[j].clazzList;
          for (let k = 0; k < c_list.length; k++) {
            this.initialData.clazzs.push(c_list[k].clazz);
          }
        }
      }
    },
    resetPassword() {},
    resetParams() {
      this.queryParams.id = null;
      this.queryParams.name = "";
      this.queryParams.department = "";
      this.queryParams.profession = "";
      this.queryParams.clazz = "";
      this.departmentList = this.options;
      this.professionList = this.initialData.professions;
      this.clazzList = this.initialData.clazzs;
    },
  },
  created() {
    this.getOptions();
    this.getStudents(this.queryParams, this.pageSize, this.pageNum);
    this.professionList = this.initialData.professions;
    this.clazzList = this.initialData.clazzs;
  },
};
</script>
