<template>
  <div class="HomeContent">
    <div style="margin: 10px 0;margin-top:-5px;">
      <el-input
        v-model="queryParams.course"
        style="width: 200px; margin-left: 5px;"
        suffix-icon="el-icon-search"
        placeholder="请输入申报课程"
      ></el-input>
      <el-select
        v-model="queryParams.status"
        clearable
        style="width: 200px; margin-left: 5px;"
        placeholder="请选择申报状态"
      >
        <el-option
          :value="0"
          label="审批中"
          :key="0"
        >
        </el-option>
        <el-option
          :value="1"
          label="已通过"
          :key="1"
        >
        </el-option>
        <el-option
          :value="2"
          label="已否决"
          :key="2"
        >
        </el-option>
        <el-option
          :value="3"
          label="已取消"
          :key="3"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="queryParams.type"
        clearable
        style="width: 200px; margin-left: 5px;"
        placeholder="请选择课程类型"
      >
        <el-option
          :value="0"
          label="必修"
          :key="0"
        >
        </el-option>
        <el-option
          :value="1"
          label="选修"
          :key="1"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="queryParams.category"
        clearable
        style="width: 200px; margin-left: 5px;"
        placeholder="请选择课程门类"
      >
        <el-option
          v-for="category in categoryList"
          :value="category"
          :key="category"
          :label="category"
        ></el-option>
      </el-select>
      <el-button
        style="margin-left: 5px;"
        type="primary"
        @click="searchCourse()"
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
        @click="openNewCourse()"
      >
        <i class="el-icon-circle-plus-outline"></i>
        <span>申报必修课</span>
      </el-button>
      <el-button
        type="primary"
        @click="openNewCourse2()"
      >
        <i class="el-icon-circle-plus-outline"></i>
        <span>申报选修课</span>
      </el-button>
      <el-button
        type="danger"
        @click="openBatchDeleteMode()"
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
        <el-popconfirm
          confirm-button-text='确定'
          cancel-button-text='我再想想'
          icon="el-icon-info"
          icon-color="red"
          title="确认删除这条记录吗？"
          @confirm="deleteCourses()"
          style="margin-left: 8px;"
        >
          <el-button
            type="danger"
            slot="reference"
          >确认</el-button>
        </el-popconfirm>
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
        :selectable="checkSelect"
      >
      </el-table-column>
      <el-table-column
        prop="id"
        label="申报编号"
        width="80px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="course"
        label="课程"
        width="120px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="category"
        label="课程门类"
        width="120px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="type"
        label="课程类型"
        width="100px"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            type="danger"
            effect="dark"
            v-if="scope.row.type==0"
          >必修</el-tag>
          <el-tag
            type="success"
            effect="dark"
            v-if="scope.row.type==1"
          >选修</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="clazz"
        label="授课班级"
        width="180px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="semester"
        label="授课学期"
        width="120px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="remark"
        label="备注"
        width="200px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="申报状态"
        width="80px"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            type="warning"
            effect="dark"
            v-if="scope.row.status==0"
          >审批中</el-tag>
          <el-tag
            type="success"
            effect="dark"
            v-if="scope.row.status==1"
          >已通过</el-tag>
          <el-tag
            type="info"
            effect="dark"
            v-if="scope.row.status==2"
          >已否决</el-tag>
          <el-tag
            type="danger"
            effect="dark"
            v-if="scope.row.status==3"
          >已取消</el-tag>
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
            title="确认取消该申报课程吗？"
            @confirm="cancel(scope.row.id)"
            style="margin-left: 5px;"
            v-if="scope.row.status==0"
          >
            <el-button
              type="danger"
              slot="reference"
            ><i class="el-icon-remove-outline"></i><span>撤回</span></el-button>
          </el-popconfirm>
          <el-button
            type="warning"
            style="margin-left: 5px;"
            class="el-icon-edit"
            @click="openeditForm(scope.row)"
            v-if="scope.row.status===0"
          ><i></i><span>编辑</span></el-button>
          <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            title="确认删除这条记录吗？"
            @confirm="deleteInfo([scope.row.id])"
            style="margin-left: 5px;"
            v-if="scope.row.status!==0"
          >
            <el-button
              type="danger"
              slot="reference"
            ><i class="el-icon-coffee"></i><span>删除</span></el-button>
          </el-popconfirm>
          <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            title="确认重新申报这个课程吗？"
            @confirm="openeditForm2(scope.row)"
            style="margin-left: 5px;"
            v-if="scope.row.status===3||scope.row.status===2"
          >
            <el-button
              type="success"
              slot="reference"
            ><i class="el-icon-s-order"></i><span>重新申报</span></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 8, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="授课信息"
      :visible.sync="centerDialogVisible"
      width="440px"
      center
      @close="resetList();resetPostFormValidate();"
    >
      <el-form
        :model="postForm"
        ref="postForm"
        :rules="rules"
        label-width="80px"
        style="margin-left: 35px;"
        size="small"
      >
        <el-form-item
          label="课程"
          prop="course"
          class="is-required"
        >
          <el-input
            v-model="postForm.course"
            autocomplete="off"
            style="width: 200px;"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="课程门类"
          prop="category"
          class="is-required"
        >
          <el-select
            v-model="postForm.category"
            clearable
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择课程门类"
          >
            <el-option
              v-for="category in categoryList"
              :value="category"
              :key="category"
              :label="category"
            ></el-option>
          </el-select>
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
          label="授课班级"
          style="margin-left: -3.5px;"
          prop="clazz"
          class="is-required"
        >
          <el-select
            clearable
            v-model="postForm.clazz"
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择授课班级"
            @change="clazzChange(postForm.clazz, postForm.department, postForm.profession)"
          >
            <el-option
              v-for="cla in clazzList"
              :value="cla.clazz"
              :label="cla.clazz"
              :key="cla.clazz"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="授课学期"
          style="margin-left: -3.5px;"
          prop="semester"
          class="is-required"
        >
          <el-select
            clearable
            v-model="postForm.semester"
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择授课学期"
          >
            <el-option
              v-for="semester in semesterList"
              :value="semester"
              :label="semester"
              :key="semester"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
          style="margin-left: -18px;"
        >
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="postForm.remark"
            style="width:235px;"
            rows="6"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
        style="margin-left: -10px;"
      >
        <el-button
          @click="centerDialogVisible = false;"
          style="margin-right: 10px;"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitPostForm()"
        >提交 </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="授课信息"
      :visible.sync="centerDialogVisible2"
      width="440px"
      center
      @close="resetList();resetPostFormValidate2()"
    >
      <el-form
        :model="postForm2"
        ref="postForm2"
        :rules="rules2"
        label-width="80px"
        style="margin-left: 35px;"
        size="small"
      >
        <el-form-item
          label="课程"
          prop="course"
          class="is-required"
        >
          <el-input
            v-model="postForm2.course"
            autocomplete="off"
            style="width: 200px;"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="课程门类"
          prop="category"
          class="is-required"
        >
          <el-select
            v-model="postForm2.category"
            clearable
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择课程门类"
          >
            <el-option
              v-for="category in categoryList"
              :value="category"
              :key="category"
              :label="category"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="授课学期"
          style="margin-left: -3.5px;"
          prop="semester"
          class="is-required"
        >
          <el-select
            clearable
            v-model="postForm2.semester"
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择授课学期"
          >
            <el-option
              v-for="semester in semesterList"
              :value="semester"
              :label="semester"
              :key="semester"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
          style="margin-left: -18px;"
        >
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="postForm2.remark"
            style="width:235px;"
            rows="6"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
        style="margin-left: -10px;"
      >
        <el-button
          @click="centerDialogVisible2 = false;"
          style="margin-right: 10px;"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitPostForm2()"
        >提交 </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑信息"
      :visible.sync="centerDialogVisible3"
      width="440px"
      center
      @close="resetList();reseteditFormValidate();"
    >
      <el-form
        :model="editForm"
        ref="editForm"
        :rules="editRules"
        label-width="80px"
        style="margin-left: 35px;"
        size="small"
      >
        <el-form-item
          label="课程"
          prop="course"
          class="is-required"
        >
          <el-input
            v-model="editForm.course"
            autocomplete="off"
            style="width: 200px;"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="课程门类"
          prop="category"
          class="is-required"
        >
          <el-select
            v-model="editForm.category"
            clearable
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择课程门类"
          >
            <el-option
              v-for="category in categoryList"
              :value="category"
              :key="category"
              :label="category"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="院系"
          style="margin-left: -3.5px;"
          v-if="this.editForm.type === 0"
        >
          <el-select
            v-model="editForm.department"
            clearable
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择院系"
            @change="departmentChange(editForm.department, editForm.profession, editForm.clazz)"
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
          v-if="this.editForm.type === 0"
        >
          <el-select
            v-model="editForm.profession"
            clearable
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择专业"
            @change="professionChange(editForm.profession, editForm.department, editForm.clazz)"
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
          label="授课班级"
          style="margin-left: -3.5px;"
          prop="clazz"
          class="is-required"
          v-if="this.editForm.type === 0"
        >
          <el-select
            clearable
            v-model="editForm.clazz"
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择授课班级"
            @change="clazzChange(editForm.clazz, editForm.department, editForm.profession)"
          >
            <el-option
              v-for="cla in clazzList"
              :value="cla.clazz"
              :label="cla.clazz"
              :key="cla.clazz"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="授课学期"
          style="margin-left: -3.5px;"
          prop="semester"
          class="is-required"
        >
          <el-select
            clearable
            v-model="editForm.semester"
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择授课学期"
          >
            <el-option
              v-for="semester in semesterList"
              :value="semester"
              :label="semester"
              :key="semester"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
          style="margin-left: -18px;"
        >
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="editForm.remark"
            style="width:235px;"
            rows="6"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
        style="margin-left: -10px;"
      >
        <el-button
          @click="centerDialogVisible3 = false;"
          style="margin-right: 10px;"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitPostForm3()"
        >提交 </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="重新申报"
      :visible.sync="centerDialogVisible4"
      width="440px"
      center
      @close="resetList();reseteditFormValidate2();"
    >
      <el-form
        :model="editForm2"
        ref="editForm2"
        :rules="editRules2"
        label-width="80px"
        style="margin-left: 35px;"
        size="small"
      >
        <el-form-item
          label="课程"
          prop="course"
          class="is-required"
        >
          <el-input
            v-model="editForm2.course"
            autocomplete="off"
            style="width: 200px;"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="课程门类"
          prop="category"
          class="is-required"
        >
          <el-select
            v-model="editForm2.category"
            clearable
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择课程门类"
          >
            <el-option
              v-for="category in categoryList"
              :value="category"
              :key="category"
              :label="category"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="院系"
          style="margin-left: -3.5px;"
          v-if="this.editForm2.type === 0"
        >
          <el-select
            v-model="editForm2.department"
            clearable
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择院系"
            @change="departmentChange(editForm2.department, editForm2.profession, editForm2.clazz)"
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
          v-if="this.editForm2.type === 0"
        >
          <el-select
            v-model="editForm2.profession"
            clearable
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择专业"
            @change="professionChange(editForm2.profession, editForm2.department, editForm2.clazz)"
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
          label="授课班级"
          style="margin-left: -3.5px;"
          prop="clazz"
          class="is-required"
          v-if="this.editForm2.type === 0"
        >
          <el-select
            clearable
            v-model="editForm2.clazz"
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择授课班级"
            @change="clazzChange(editForm2.clazz, editForm2.department, editForm2.profession)"
          >
            <el-option
              v-for="cla in clazzList"
              :value="cla.clazz"
              :label="cla.clazz"
              :key="cla.clazz"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="授课学期"
          style="margin-left: -3.5px;"
          prop="semester"
          class="is-required"
        >
          <el-select
            clearable
            v-model="editForm2.semester"
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择授课学期"
          >
            <el-option
              v-for="semester in semesterList"
              :value="semester"
              :label="semester"
              :key="semester"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
          style="margin-left: -18px;"
        >
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="editForm2.remark"
            style="width:235px;"
            rows="6"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
        style="margin-left: -10px;"
      >
        <el-button
          @click="centerDialogVisible4 = false;"
          style="margin-right: 10px;"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitPostForm4()"
        >提交 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style>
.el-tooltip__popper {
  font-size: 14px;
  max-width: 50%;
}
</style>

<script>
import {
  getCourseList,
  getOptionList,
  declareOneRequiredCourse,
  cancelCourse,
  editCourse,
  deleteCourseInfo,
  getCategory,
} from "@/utils/api";
export default {
  name: "approvingCourse",
  data() {
    var validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入课程名字"));
      } else {
        callback();
      }
    };
    var validateClazz = (rule, value, callback) => {
      if (!value) {
        if (this.editForm.type === 1 || this.editForm2.type === 1) {
          callback();
        }
        callback(new Error("请选择授课班级"));
      } else {
        callback();
      }
    };
    var validateSemester = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择授课学期"));
      } else {
        callback();
      }
    };
    var validateCategory = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择授课学期"));
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
      editForm2: {
        course: "",
        department: "",
        profession: "",
        clazz: "",
        remark: "",
        status: 0,
        semester: "",
        category: "",
      },
      editRules2: {
        course: [{ validator: validateName, trigger: "blur" }],
        clazz: [{ validator: validateClazz, trigger: "change" }],
        semester: [{ validator: validateSemester, trigger: "change" }],
        category: [{ validator: validateCategory, trigger: "change" }],
      },
      pageNum: 1,
      pageSize: 5,
      total: 0,
      tableData: [],
      queryParams: {
        course: "",
        status: "",
        type: "",
        category: "",
      },
      selectedCourseList: [],
      batchDeleteVisible: false,
      centerDialogVisible: false,
      centerDialogVisible2: false,
      centerDialogVisible3: false,
      centerDialogVisible4: false,
      options: [],
      departmentList: [],
      professionList: [],
      clazzList: [],
      initialData: {
        clazzs: [],
        professions: [],
      },
      postForm: {
        course: "",
        type: 0,
        department: "",
        profession: "",
        clazz: "",
        remark: "",
        semester: "",
        category: "",
      },
      postForm2: {
        course: "",
        type: 1,
        remark: "",
        semester: "",
      },
      rules: {
        course: [{ validator: validateName, trigger: "blur" }],
        clazz: [{ validator: validateClazz, trigger: "change" }],
        semester: [{ validator: validateSemester, trigger: "change" }],
        category: [{ validator: validateCategory, trigger: "change" }],
      },
      rules2: {
        course: [{ validator: validateSemester, trigger: "blur" }],
        semester: [{ validator: validateSemester, trigger: "change" }],
        category: [{ validator: validateCategory, trigger: "change" }],
      },
      editForm: {
        id: "",
        course: "",
        department: "",
        profession: "",
        clazz: "",
        remark: "",
        semester: "",
        category: "",
      },
      editRules: {
        course: [{ validator: validateName, trigger: "blur" }],
        clazz: [{ validator: validateClazz, trigger: "change" }],
        semester: [{ validator: validateSemester, trigger: "change" }],
        category: [{ validator: validateCategory, trigger: "change" }],
      },
      tempForm: {
        course: "",
        clazz: "",
        remark: "",
        semester: "",
        category: "",
      },
      categoryList: [],
    };
  },
  methods: {
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getCourses(this.queryParams, this.pageSize, this.pageNum);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getCourses(this.queryParams, this.pageSize, this.pageNum);
    },
    resetParams() {
      this.queryParams = {};
      this.resetList();
    },
    handleSelectionChange(val) {
      this.selectedCourseList = val;
    },
    openBatchDeleteMode() {
      this.batchDeleteVisible = true;
    },
    exitBatchDeleteMode() {
      this.batchDeleteVisible = false;
      this.toggleSelection();
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
    async getCourses(queryParams, pageSize, pageNum) {
      const res = await getCourseList(queryParams, pageSize, pageNum);
      if (res.code === 200) {
        this.total = res.data.total;
        this.tableData = res.data.list;
      } else {
        this.$message.error(res.msg);
      }
      return res;
    },
    async searchCourse() {
      const res = await this.getCourses(
        this.queryParams,
        this.pageSize,
        this.pageNum
      );
      if (res.code === 200) {
        this.total = res.data.total;
        this.tableData = res.data.list;
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    openBatchDeleteMode() {
      this.batchDeleteVisible = true;
    },
    openeditForm(row) {
      this.queryParams = {};
      this.centerDialogVisible3 = true;
      this.editForm = row;
      this.tempForm = { ...row };
      this.clazzChange(this.editForm.clazz, "", "");
    },
    openeditForm2(row) {
      this.queryParams = {};
      this.centerDialogVisible4 = true;
      this.editForm2 = row;
      this.clazzChange(this.editForm2.clazz, "", "");
    },
    /**
     * row：当前行数据
     * index：当前第几位
     */
    checkSelect(row, index) {
      let isChecked = false;
      if (row.status !== 0) {
        isChecked = true;
      }
      return isChecked;
    },
    deleteCourses() {
      if (this.selectedCourseList.length === 0) {
        this.$message.error("请选择要删除的记录");
      }
      let id = this.selectedCourseList.map((v) => v.id);
      this.deleteInfo(id);
    },
    async getOptions() {
      const res = await getOptionList();
      this.options = res.data;
      this.initParams();
    },
    departmentChange(value, profession, clazz) {
      if (!value && !profession && !clazz) {
        this.resetList();
        return;
      }
      this.clazzList = [];
      this.professionList = [];
      if (!profession && !clazz) this.departmentList = this.options;
      else this.departmentList = [];
      for (let i = 0; i < this.options.length; i++) {
        let d_list = this.options[i];
        for (let j = 0; j < d_list.professionList.length; j++) {
          let p_list = d_list.professionList[j];
          if (value && !clazz) {
            if (value === d_list.department) this.professionList.push(p_list);
          } else if (!value && !clazz) {
            this.professionList = this.initialData.professions;
          }
          if (profession && !clazz && p_list.profession === profession) {
            this.departmentList.push(d_list);
          }
          for (let k = 0; k < p_list.clazzList.length; k++) {
            let c_list = p_list.clazzList[k];
            if (profession) {
              if (p_list.profession === profession) this.clazzList.push(c_list);
            } else if (value) {
              if (value === d_list.department) this.clazzList.push(c_list);
            } else {
              this.clazzList = this.initialData.clazzs;
            }
            if (clazz && c_list.clazz === clazz) {
              this.departmentList.push(d_list);
              this.professionList.push(p_list);
            }
          }
        }
      }
    },
    professionChange(value, department, clazz) {
      if (!value && !department && !clazz) {
        this.resetList();
        return;
      }
      this.departmentList = [];
      this.clazzList = [];
      if (!department && !clazz)
        this.professionList = this.initialData.professions;
      else this.professionList = [];
      for (let i = 0; i < this.options.length; i++) {
        let d_list = this.options[i];
        for (let j = 0; j < d_list.professionList.length; j++) {
          let p_list = d_list.professionList[j];
          if (!clazz && value) {
            if (value === p_list.profession) this.departmentList.push(d_list);
          } else if (!clazz && !value) {
            this.departmentList = this.options;
          }
          if (!clazz && department && department === d_list.department) {
            this.professionList.push(p_list);
          }
          for (let k = 0; k < p_list.clazzList.length; k++) {
            let c_list = p_list.clazzList[k];
            if (value) {
              if (value === p_list.profession) this.clazzList.push(c_list);
            } else if (department) {
              if (department === d_list.department) this.clazzList.push(c_list);
            } else {
              this.clazzList = this.initialData.clazzs;
            }
            if (clazz && clazz === c_list.clazz) {
              this.departmentList.push(d_list);
              this.professionList.push(p_list);
            }
          }
        }
      }
    },
    clazzChange(value, department, profession) {
      if (!value && !department && !profession) {
        this.resetList();
        return;
      }
      this.professionList = [];
      this.departmentList = [];
      if (!department && !profession) this.clazzList = this.initialData.clazzs;
      else this.clazzList = [];
      for (let i = 0; i < this.options.length; i++) {
        let d_list = this.options[i];
        for (let j = 0; j < d_list.professionList.length; j++) {
          let p_list = d_list.professionList[j];
          if (!value && profession) {
            if (profession === p_list.profession)
              this.departmentList.push(d_list);
          } else if (!value && !profession) this.departmentList = this.options;
          if (!value && department) {
            if (department === d_list.department)
              this.professionList.push(p_list);
          } else if (!value && !department)
            this.professionList = this.initialData.professions;
          for (let k = 0; k < p_list.clazzList.length; k++) {
            let c_list = p_list.clazzList[k];
            if (profession) {
              if (profession === p_list.profession) this.clazzList.push(c_list);
            } else if (department) {
              if (department === d_list.department) this.clazzList.push(c_list);
            } else {
              this.clazzList = this.initialData.clazzs;
            }
            if (value && value === c_list.clazz) {
              this.professionList.push(p_list);
              this.departmentList.push(d_list);
            }
          }
        }
      }
    },
    initParams() {
      this.departmentList = this.options;
      for (let i = 0; i < this.options.length; i++) {
        const p_list = this.options[i].professionList;
        for (let j = 0; j < p_list.length; j++) {
          this.initialData.professions.push(p_list[j]);
          const c_list = p_list[j].clazzList;
          for (let k = 0; k < c_list.length; k++) {
            this.initialData.clazzs.push(c_list[k]);
          }
        }
      }
    },
    resetList() {
      this.departmentList = this.options;
      this.professionList = this.initialData.professions;
      this.clazzList = this.initialData.clazzs;
    },
    openNewCourse() {
      this.resetParams();
      this.postForm = { type: 0 };
      this.centerDialogVisible = true;
    },
    openNewCourse2() {
      this.resetParams();
      this.postForm2 = { type: 1 };
      this.centerDialogVisible2 = true;
    },
    resetPostFormValidate() {
      this.$refs.postForm.clearValidate();
    },
    resetPostFormValidate2() {
      this.$refs.postForm2.clearValidate();
    },
    reseteditFormValidate() {
      this.$refs.editForm.clearValidate();
    },
    reseteditFormValidate2() {
      this.$refs.editForm2.clearValidate();
    },
    async declareCourse(form) {
      const res = await declareOneRequiredCourse(form);
      if (res.code === 200) {
        this.pageNum = 1;
        this.queryParams = {};
        this.getCourses(this.queryParams, this.pageSize, this.pageNum);
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    submitPostForm() {
      this.$refs["postForm"].validate((valid) => {
        if (valid) {
          this.declareCourse(this.postForm);
          this.centerDialogVisible = false;
        } else {
          this.$message.error("请填写信息后提交");
          return false;
        }
      });
    },
    submitPostForm2() {
      this.$refs["postForm2"].validate((valid) => {
        if (valid) {
          this.declareCourse(this.postForm2);
          this.centerDialogVisible2 = false;
        } else {
          this.$message.error("请填写信息后提交");
          return false;
        }
      });
    },
    async cancel(id) {
      const res = await cancelCourse(id);
      if (res.code === 200) {
        this.getCourses(this.queryParams, this.pageSize, this.pageNum);
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    submitPostForm3() {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          if (
            this.editForm.course === this.tempForm.course &&
            this.editForm.clazz === this.tempForm.clazz &&
            this.editForm.remark === this.tempForm.remark &&
            this.editForm.semester === this.tempForm.semester&&
            this.editForm.category === this.tempForm.category
          ) {
            this.$message.error("请重新填写信息后提交");
            return false;
          }
          this.edit(this.editForm);
          this.centerDialogVisible3 = false;
        } else {
          this.$message.error("请填写信息后提交");
          return false;
        }
      });
    },
    submitPostForm4() {
      this.$refs["editForm2"].validate((valid) => {
        if (valid) {
          this.editForm2.status = 0;
          this.edit(this.editForm2);
          this.centerDialogVisible4 = false;
        } else {
          this.$message.error("请填写信息后提交");
          return false;
        }
      });
    },
    async edit(form) {
      const res = await editCourse(form);
      if (res.code === 200) {
        this.getCourses(this.queryParams, this.pageSize, this.pageNum);
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    async deleteInfo(id = []) {
      const res = await deleteCourseInfo(id);
      if (res.code === 200) {
        this.getCourses(this.queryParams, this.pageSize, this.pageNum);
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    async getCategories() {
      const res = await getCategory();
      if (res.code === 200) {
        this.categoryList = res.data;
      } else {
        this.$message.error(res.msg);
      }
    },
  },
  created() {
    this.getCategories();
    this.getOptions();
    this.getCourses(this.queryParams, this.pageSize, this.pageNum);
    this.professionList = this.initialData.professions;
    this.clazzList = this.initialData.clazzs;
  },
};
</script>