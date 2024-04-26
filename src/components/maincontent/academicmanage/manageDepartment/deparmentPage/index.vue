<template>
  <div>
    <div style="margin: 10px 0;margin-top:-5px;">
      <el-input
        v-model.number="queryParams.id"
        style="width: 200px;"
        suffix-icon="el-icon-search"
        placeholder="请输入院系编号"
        oninput="value=value.replace(/[^\d]/g,'')"
      ></el-input>
      <el-input
        v-model="queryParams.department"
        style="width: 200px; margin-left: 5px;"
        suffix-icon="el-icon-mouse"
        placeholder="请输入院系名字"
      ></el-input>
      <el-button
        style="margin-left: 5px;"
        type="primary"
        @click="search"
      >搜索</el-button>
      <el-button
        style="margin-left: 5px;"
        type="warning"
        @click="resetParams"
      >重置</el-button>
    </div>
    <div style="margin: 10px 0;padding-bottom:5px;">
      <el-button
        type="primary"
        @click="newDepartmentDilogVisible = true"
      >
        <i class="el-icon-circle-plus-outline"></i>
        <span>新增</span>
      </el-button>
      <el-button
        type="danger"
        @click="openBatchDeleteMode"
      >
        <i class="el-icon-remove-outline"></i>
        <span>批量删除</span>
      </el-button>
      <el-upload
        ref="upload"
        :on-success="importDaprments"
        style="display: inline-block; margin-left: 5px;margin-right: 5px;"
        action="http://47.96.157.155:9090/admin/department/import"
        :headers="headers"
        :show-file-list="false"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
      >
        <el-button type="primary">
          <i class="el-icon-bottom"></i>
          <span>导入</span>
        </el-button>
      </el-upload>
      <el-button
        type="primary"
        @click="exportDepartment"
      >
        <i class="el-icon-top"></i>
        <span>导出格式</span>
      </el-button>
      <div
        v-if="batchDeleteVisible"
        style="display: inline;margin-left: 580px;"
      >
        <el-button
          type="primary"
          @click="exitBatchDeleteMode()"
        >取消</el-button>
        <el-button
          type="primary"
          @click="toggleSelection()"
        >重置选择</el-button>
        <el-button
          type="danger"
          @click="openIdentityDialog()"
        >确认</el-button>
      </div>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      size="small"
      :data="tableData"
      ref="tableData"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      style="border-radius: 8px; box-shadow: 5px 5px 50px 50px rgba(179, 184, 182, 0.267);"
    >
      <el-table-column
        type="selection"
        width="55"
        v-if="batchDeleteVisible"
      >
      </el-table-column>
      <el-table-column
        prop="id"
        label="院系编号"
        width="100px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="department"
        label="院系"
        width="250px"
        align="center"
      >
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.id === editId"
            v-model="editForm.department"
          ></el-input>
          <span v-else>{{scope.row.department}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="profession"
        label="专业"
        width="250px"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            slot="reference"
            style="cursor: pointer;"
            @click="getProfeesions(scope.row.department)"
          >查看详情</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="clazz"
        label="班级"
        width="250px"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            slot="reference"
            style="cursor: pointer;"
            @click="getClazzs(scope.row.department)"
          >查看详情</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            title="确认编辑该学生信息吗？"
            @confirm="edit(scope.row)"
            style="margin-right: 5px;"
            v-if="!is_editable||is_editable&&scope.row.id!==editId"
          >
            <el-button
              type="success"
              slot="reference"
            ><i class="el-icon-refresh"></i><span>编辑</span></el-button>
          </el-popconfirm>
          <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            title="确认保存此次编辑吗？"
            @confirm="saveInfo"
            style="margin-right: 5px;"
            v-if="is_editable&&scope.row.id===editId"
          >
            <el-button
              type="success"
              slot="reference"
            ><i class="el-icon-refresh"></i><span>保存</span></el-button>
          </el-popconfirm>
          <el-button
            type="info"
            slot="reference"
            @click="cancel()"
            v-if="is_editable&&scope.row.id===editId"
          ><i class="el-icon-refresh"></i><span>取消</span></el-button>
          <el-button
            type="danger"
            @click="openIdentityDialog(scope.row.id)"
            style="margin-left: 5px;"
            v-if="!is_editable||is_editable&&scope.row.id!==editId"
          ><i class="el-icon-remove-outline"></i><span>删除</span></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0;">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
    <el-drawer
      title="专业信息"
      :visible.sync="drawer"
      size="86%"
    >
      <ProfessionDrawer :department="department" :pNum="1" :pSize="5"></ProfessionDrawer>
    </el-drawer>
    <el-drawer
      title="班级信息"
      :visible.sync="drawer2"
      size="86%"
    >
      <ClazzDrawer :department="department" :profession="''" :pNum="1" :pSize="5"></ClazzDrawer>
    </el-drawer>
    <el-dialog
      title="身份验证"
      :visible.sync="identityDialogVisable"
      width="440px"
      center
      @close="resetIdentityFormValidate();"
    >
      <el-form
        :model="identityForm"
        ref="identityForm"
        :rules="identityrules"
        label-width="80px"
        style="margin-left: 35px;"
        size="small"
      >
        <el-form-item
          label="密码"
          prop="password"
          style="margin-left: -0.5px;"
        >
          <el-input
            type="password"
            v-model="identityForm.password"
            autocomplete="off"
            style="width: 200px;"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="password2"
        >
          <el-input
            type="password"
            v-model="identityForm.password2"
            autocomplete="off"
            style="width: 200px;"
          ></el-input>

        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
        style="margin-left: -10px;"
      >
        <el-button
          @click="identityDialogVisable = false;"
          style="margin-right: 10px;"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitIdentityForm()"
        >提交 </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="新增院系"
      :visible.sync="newDepartmentDilogVisible"
      width="440px"
      center
      @close="resetnewDepartmentFormValidate"
    >
      <el-form
        :model="newDepartmentForm"
        ref="newDepartmentForm"
        :rules="newDepartmentRules"
        label-width="80px"
        style="margin-left: 35px;"
        size="small"
      >
        <el-form-item
          label="院系"
          prop="newDeaprtment"
          style="margin-left: -0.5px;"
        >
          <el-input
            v-model="newDepartmentForm.newDeaprtment"
            autocomplete="off"
            style="width: 200px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
        style="margin-left: -10px;"
      >
        <el-button
          @click="newDepartmentDilogVisible = false;"
          style="margin-right: 10px;"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitNewDepartmentForm"
        >提交 </el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
<script>
let set = new Set();
import {
  getDepartmens,
  editDepartment,
  deleteDepartment,
  newDepartment,
  exportDepartment,
} from "@/utils/api";
import ProfessionDrawer from "../ProfessionDrawer";
import ClazzDrawer from "../clazzDrawer";
export default {
  name: "departmentPage",
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.identityForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validateDepartment = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入院系名称"));
      } else {
        callback();
      }
    };
    return {
      pageNum: 1,
      pageSize: 5,
      tableData: [],
      queryParams: {
        id: "",
        department: "",
      },
      batchDeleteVisible: false,
      identityDialogVisable: false,
      editId: "",
      editForm: {
        id: "",
        department: "",
      },
      selectedDepartment: [],
      headers: { token: this.$store.getters.getToken },
      drawer: false,
      drawer2: false,
      department: "",
      is_editable: false,
      editId: "",
      editForm: {
        id: "",
        department: "",
      },
      identityForm: {
        id: [],
        password: "",
        password2: "",
      },
      identityrules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        password2: [{ validator: validatePass2, trigger: "blur" }],
      },
      newDepartmentForm: {
        newDeaprtment: "",
      },
      newDepartmentDilogVisible: false,
      newDepartmentRules: {
        newDeaprtment: [{ validator: validateDepartment, trigger: "blur" }],
      },
    };
  },
  components: {
    ProfessionDrawer,
    ClazzDrawer,
  },
  methods: {
    async exportDepartment() {
      exportDepartment();
    },
    submitNewDepartmentForm() {
      this.$refs["newDepartmentForm"].validate((valid) => {
        if (valid) {
          this.newDepartment();
        } else {
          this.$message.error("请填写信息后提交");
          return false;
        }
      });
    },
    resetnewDepartmentFormValidate() {
      this.$refs.newDepartmentForm.clearValidate();
      this.newDepartmentForm = {};
    },
    async newDepartment() {
      const res = await newDepartment(this.newDepartmentForm.newDeaprtment);
      if (res.code === 200) {
        this.getDepartmentList();
        this.newDepartmentDilogVisible = false;
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    submitIdentityForm() {
      this.$refs["identityForm"].validate((valid) => {
        if (valid) {
          this.deleteDepartment();
        } else {
          this.$message.error("请填写信息后提交");
          return false;
        }
      });
    },
    async deleteDepartment() {
      const res = await deleteDepartment(this.identityForm);
      if (res.code === 200) {
        this.getDepartmentList();
        this.identityDialogVisable = false;
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    resetIdentityFormValidate() {
      this.identityForm = {};
      this.$refs.identityForm.clearValidate();
    },
    openBatchDeleteMode() {
      this.batchDeleteVisible = true;
    },
    openIdentityDialog(id) {
      if (id) {
        this.identityForm.id = [id];
      } else {
        if (this.selectedDepartment.length <= 0) {
          this.$message.error("请选择删除信息");
          return;
        }
        this.identityForm.id = this.selectedDepartment.map((v) => v.id);
      }
      this.identityDialogVisable = true;
    },
    async editDeapartment() {
      const res = await editDepartment(this.editForm);
      if (res.code === 200) {
        this.getDepartmentList();
        this.cancel();
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    saveInfo() {
      set.add(this.editForm.department);
      if (set.size === 1) {
        this.$message.error("院系信息重复，请重新输入");
        return;
      }
      this.editDeapartment();
    },
    cancel() {
      this.is_editable = false;
      this.editForm = {};
      set.clear();
      this.editId = "";
    },
    edit(row) {
      this.editForm = { ...row };
      this.editId = row.id;
      this.is_editable = true;
      set.add(row.department);
    },
    async getClazzs(department) {
      this.drawer2 = true;
      this.department = department;
    },
    async getProfeesions(department) {
      this.drawer = true;
      this.department = department;
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getDepartmentList();
    },
    resetParams() {
      this.queryParams = {};
    },
    async getDepartmentList() {
      const res = await getDepartmens(
        this.queryParams,
        this.pageSize,
        this.pageNum
      );
      if (res.code === 200) {
        this.tableData = res.data;
      } else {
        this.$message.error(res.msg);
      }
      return res;
    },
    async search() {
      this.pageNum = 1;
      const res = await this.getDepartmentList();
      if (res.code === 200) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    exitBatchDeleteMode() {
      this.batchDeleteVisible = false;
      this.toggleSelection();
      this.selectedDepartment = [];
    },
    handleSelectionChange(val) {
      this.selectedDepartment = val;
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.tableData.toggleRowSelection(row);
        });
      } else {
        this.$refs.tableData.clearSelection();
      }
    },
    importDaprments(response, file, fileList) {
      if (response.code === 200) {
        this.pageNum = 1;
        this.resetParams();
        this.getDepartmentList();
        this.$message.success(response.msg);
      } else {
        this.$message.error(response.msg);
      }
      this.$refs.upload.clearFiles();
    },
  },
  created() {
    this.getDepartmentList();
  },
};
</script>
  