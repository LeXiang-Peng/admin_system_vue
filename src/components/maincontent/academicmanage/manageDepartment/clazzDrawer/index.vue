<template>
  <div class="HomeContent">
    <div style="margin: 10px 5px;">
      <el-input
        v-model.number="queryParams.id"
        style="width: 200px;"
        suffix-icon="el-icon-search"
        placeholder="请输入班级编号"
        oninput="value=value.replace(/[^\d]/g,'')"
      ></el-input>
      <el-input
        v-model="queryParams.clazz"
        style="width: 200px; margin-left: 5px;"
        suffix-icon="el-icon-mouse"
        placeholder="请输入班级名字"
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
    <div style="margin: 10px 5px;">
      <el-button
        type="primary"
        @click="openNewClazzDialog"
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
      @selection-change="handleSelectionClazzChange"
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
        label="班级编号"
        width="100px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="clazz"
        label="班级"
        width="250px"
        align="center"
      >
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.id === editId"
            v-model="editForm.clazz"
          ></el-input>
          <span v-else>{{scope.row.clazz}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="semester"
        label="学期"
        width="250px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="total"
        label="班级人数"
        width="250px"
        align="center"
      >
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
            v-if="!is_editable||is_editable&&scope.row.id!==editId"
          ><i class="el-icon-remove-outline"></i><span>删除</span></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 8, 10]"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
    <el-dialog
      :append-to-body="true"
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
          @click="submitIdentityForm"
        >提交 </el-button>
      </span>
    </el-dialog>
    <el-dialog
      :append-to-body="true"
      title="新增班级"
      :visible.sync="newClazzDialogVisble"
      width="440px"
      center
      @close="resetnewClazzFormValidate"
    >
      <el-form
        :model="newClazzForm"
        ref="newClazzForm"
        :rules="newClazzRules"
        label-width="80px"
        style="margin-left: 35px;"
        size="small"
      >
        <el-form-item
          label="专业"
          prop="profession"
          v-if="!profession"
          style="margin-left: -5px;"
        >
          <el-select
            v-model="newClazzForm.profession"
            style="width: 200px;"
            placeholder="请选择专业"
          >
            <el-option
              v-for="item in professionList"
              :key="item"
              :value="item"
              :label="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="班级"
          prop="clazz"
        >
          <el-input
            v-model="newClazzForm.clazz"
            autocomplete="off"
            style="width: 200px;"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="学期"
          prop="semester"
        >
          <el-select
            v-model="newClazzForm.semester"
            style="width: 200px;"
            placeholder="请选择专业"
          >
            <el-option
              v-for="item in semesterList"
              :key="item"
              :value="item"
              :label="item"
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
          @click="newClazzDialogVisble = false;"
          style="margin-right: 10px;"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitClazzForm"
        >提交 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
let set = new Set();
import {
  deleteClazz,
  getclazzList,
  getProfession,
  newClazz,
  editClazz,
} from "@/utils/api";
export default {
  name: "ClazzDrawer",
  data() {
    var validateClazz = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入班级名称"));
      } else {
        callback();
      }
    };
    var validateProfession = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入专业名称"));
      } else {
        callback();
      }
    };
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
    return {
      semesterList: [
        "第一学年上学期",
        "第一学年下学期",
        "第二学年上学期",
        "第二学年下学期",
        "第三学年上学期",
        "第三学年下学期",
        "第四学年上学期",
        "第四学年下学期",
      ],
      tableData: [],
      queryParams: {
        id: "",
        clazz: "",
        profession: this.profession,
        department: this.department,
      },
      pageNum: this.pNum,
      pageSize: this.pSize,
      selectedClazz: [],
      batchDeleteVisible: false,
      newClazzForm: {
        department: this.department,
        profession: this.profession,
        clazz: "",
        semester: "",
      },
      professionList: [],
      newClazzDialogVisble: false,
      newClazzRules: {
        profession: [{ validator: validateProfession, trigger: "change" }],
        clazz: [{ validator: validateClazz, trigger: "blur" }],
      },
      editId: "",
      is_editable: false,
      editForm: {
        id: "",
        clazz: "",
      },
      identityForm: {
        id: [],
        password: "",
        password2: "",
      },
      identityDialogVisable: false,
      identityrules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        password2: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  methods: {
    saveInfo() {
      set.add(this.editForm.clazz);
      if (set.size === 1) {
        this.$message.error("班级信息重复，请重新输入");
        return;
      }
      this.editClazz();
    },
    async editClazz() {
      const res = await editClazz(this.editForm);
      if (res.code === 200) {
        this.getClazzList();
        this.cancel();
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    edit(row) {
      this.editForm = { ...row };
      this.editId = row.id;
      this.is_editable = true;
      set.add(row.clazz);
    },
    openIdentityDialog(id) {
      if (id) {
        this.identityForm.id = [id];
      } else {
        if (this.selectedClazz.length <= 0) {
          this.$message.error("请选择删除信息");
          return;
        }
        this.identityForm.id = this.selectedClazz.map((v) => v.id);
      }
      this.identityDialogVisable = true;
    },
    handleSelectionClazzChange(val) {
      this.selectedClazz = val;
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
    exitBatchDeleteMode() {
      this.batchDeleteVisible = false;
      this.toggleSelection();
      this.selectedClazz = [];
    },
    submitIdentityForm() {
      this.$refs["identityForm"].validate((valid) => {
        if (valid) {
          this.deleteClazz();
        } else {
          this.$message.error("请填写信息后提交");
          return false;
        }
      });
    },
    cancel() {
      this.is_editable = false;
      this.editForm = {};
      set.clear();
      this.editId = "";
    },
    async deleteClazz() {
      const res = await deleteClazz(this.identityForm);
      if (res.code === 200) {
        this.getClazzList();
        this.identityDialogVisable = false;
        this.batchDeleteVisible = false;
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    resetIdentityFormValidate() {
      this.identityForm = {};
      this.$refs.identityForm.clearValidate();
    },
    async newClazz() {
      const res = await newClazz(this.newClazzForm);
      if (res.code === 200) {
        this.getClazzList();
        this.newClazzDialogVisble = false;
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    submitClazzForm() {
      this.$refs["newClazzForm"].validate((valid) => {
        if (valid) {
          this.newClazzDialogVisble = false;
          this.newClazz();
        } else {
          this.$message.error("请填写信息后提交");
          return false;
        }
      });
    },
    openNewClazzDialog() {
      this.newClazzDialogVisble = true;
      this.getProfessionList();
    },
    resetnewClazzFormValidate() {
      this.newClazzForm.clazz = "";
      this.newClazzForm.semester = "";
      if (this.professionList.size > 0) {
        this.newClazzForm.profession = "";
      }
      this.professionList = [];
      this.$refs.newClazzForm.clearValidate();
    },
    async getProfessionList() {
      const res = await getProfession(this.queryParams, 1e3, 1);
      if (res.code === 200) {
        this.professionList = res.data.map((v) => v.profession);
      } else {
        this.$message.error(res.msg);
      }
    },
    openBatchDeleteMode() {
      this.batchDeleteVisible = true;
    },
    resetParams() {
      this.queryParams.id = "";
      this.queryParams.clazz = "";
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getClazzList();
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getClazzList();
    },
    handleSelectionChange(val) {
      this.selectedClazzs = val;
    },
    async getClazzList() {
      const res = await getclazzList(
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
      const res = await this.getClazzList();
      if (res.code === 200) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
  },
  created() {
    this.getClazzList();
  },
  props: {
    profession: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    pNum: {
      type: Number,
    },
    pSize: {
      type: Number,
    },
  },
  watch: {
    profession(newVal, oldVal) {
      this.pageNum = this.pNum;
      this.pageSize = this.pSize;
      this.queryParams.profession = newVal;
      this.newClazzForm.profession = newVal;
      this.getClazzList();
    },
    department(newVal, oldVal) {
      this.pageNum = this.pNum;
      this.pageSize = this.pSize;
      this.queryParams.department = newVal;
      this.newClazzForm.department = newVal;
      this.getClazzList();
    },
  },
};
</script>
