<template>
  <div style="filter:(2px);">
    <el-tabs
      style="filter:(2px);"
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="课程编排"
        name="first"
      >
        <div style="margin: 10px 0;margin-top:10px;">
          <el-input
            v-model="queryParams.course"
            style="width: 200px; margin-left: 5px;"
            suffix-icon="el-icon-search"
            placeholder="请输入课程"
          ></el-input>
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
          <el-input
            v-model="queryParams.lecturer_id"
            style="width: 200px; margin-left: 5px;"
            suffix-icon="el-icon-c-scale-to-original"
            placeholder="请输入授课教师编号"
            oninput="value=value.replace(/[^\d]/g,'')"
          ></el-input>
          <el-input
            v-model="queryParams.lecturer"
            style="width: 200px; margin-left: 5px;"
            suffix-icon="el-icon-user"
            placeholder="请输入授课教师"
          ></el-input>
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
            >
            </el-option>
          </el-select>
          <el-button
            style="margin-left: 5px;"
            type="primary"
            @click="search()"
          >搜索</el-button>
          <el-button
            style="margin-left: 5px;"
            type="warning"
            @click="resetParams()"
          >重置</el-button>
        </div>
        <div style="margin: 10px 0;padding-bottom:5px;">
          <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            title="之前安排的数据会消失哦，确定一键排课吗？"
            @confirm="generateCourseTableByGA()"
            style="margin-left: 20px;"
            v-if="tableData.length !== 0"
          >
            <el-button
              type="primary"
              slot="reference"
            >
              <i class="el-icon-circle-plus-outline"></i>
              <span>一键排课</span>
            </el-button>
          </el-popconfirm>
        </div>
        <el-table
          size="small"
          :data="tableData"
          ref="tableData"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          style="border-radius: 8px; box-shadow: 5px 5px 50px 50px rgba(179, 184, 182, 0.267);margin-top: 10px;"
        >
          <el-table-column
            prop="id"
            label="课程编号"
            width="100px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="course"
            label="课程"
            width="150px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="category"
            label="课程门类"
            width="180px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="type"
            label="课程类型"
            width="120px"
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
            prop="lecturer_id"
            label="教师编号"
            width="100px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="lecturer"
            label="授课教师"
            width="120px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="student_total"
            label="学生总数"
            width="100px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="clazz"
            label="授课班级"
            width="180px"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag
                effect="dark"
                v-if="scope.row.clazz !== null"
              >{{scope.row.clazz}}</el-tag>
              <el-popover
                v-if="scope.row.clazz === null"
                placement="bottom"
                title="授课班级："
                width="200"
                trigger="click"
              >
                <p v-for="(clazz,index) in clazzs">{{index + 1 + "、" + clazz }}</p>
                <el-button
                  slot="reference"
                  style="cursor: pointer;"
                  @click="getClazzList(scope.row.id)"
                >查看详情</el-button>
              </el-popover>
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
                title="确定需要编排该课程吗？"
                @confirm="generateSingleCourse(scope.row)"
                style="margin-left: 5px;"
              >
                <el-button
                  type="success"
                  slot="reference"
                ><i class="el-icon-remove-outline"></i><span>排课</span></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div style="padding: 10px 0;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[5, 8]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>

      </el-tab-pane>
      <el-tab-pane
        label="编排列表"
        name="second"
      >
        <div style="margin: 10px 0;margin-top:10px;">
          <el-input
            v-model="queryParams2.course"
            style="width: 200px; margin-left: 5px;"
            suffix-icon="el-icon-search"
            placeholder="请输入课程"
          ></el-input>
          <el-input
            v-model="queryParams2.lecturer_id"
            style="width: 200px; margin-left: 5px;"
            suffix-icon="el-icon-c-scale-to-original"
            placeholder="请输入授课教师编号"
            oninput="value=value.replace(/[^\d]/g,'')"
          ></el-input>
          <el-input
            v-model="queryParams2.lecturer"
            style="width: 200px; margin-left: 5px;"
            suffix-icon="el-icon-user"
            placeholder="请输入授课教师"
          ></el-input>
          <el-button
            style="margin-left: 5px;"
            type="primary"
            @click="search2()"
          >搜索</el-button>
          <el-button
            style="margin-left: 5px;"
            type="warning"
            @click="resetParams2()"
          >重置</el-button>
        </div>
        <el-table
          size="small"
          :data="tableData2"
          ref="tableData"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          style="border-radius: 8px; box-shadow: 5px 5px 50px 50px rgba(179, 184, 182, 0.267);margin-top: 20px;"
        >
          <el-table-column
            prop="course_id"
            label="课程编号"
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
            prop="lecturer_id"
            label="教师编号"
            width="100px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="lecturer"
            label="授课教师"
            width="120px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="building"
            label="教学楼"
            width="100px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="classroom"
            label="教室"
            width="150px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="weekday"
            label="星期"
            width="100px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="course_time"
            label="上课时间"
            width="100px"
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
                title="确认通过该申报课程吗？"
                @confirm="openDialog(scope.row)"
                style="margin-left: 5px;"
              >
                <el-button
                  type="success"
                  slot="reference"
                ><i class="el-icon-remove-outline"></i><span>重新安排</span></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div style="padding: 10px 0;">
          <el-pagination
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page="pageNum"
            :page-sizes="[5, 8]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
        <el-dialog
          title="编排课程"
          :visible.sync="scheduleCourseVisible"
          width="440px"
          center
          @close="resetValidate()"
        >
          <el-form
            :model="courseInfo"
            ref="courseInfo"
            :rules="rules"
            label-width="80px"
            style="margin-left: 35px;"
            size="small"
          >
            <el-form-item
              label="教学楼"
              prop="building"
              class="is-required"
            >
              <el-select
                v-model="courseInfo.building"
                @change="change"
              >
                <el-option
                  v-for="item in buildings"
                  :value="item"
                  :key="item"
                  :label="item"
                >

                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="教室"
              prop="classroom"
              class="is-required"
            >
              <el-select v-model="courseInfo.classroom">
                <el-option
                  v-for="item in classrooms"
                  :value="item"
                  :key="item"
                  :label="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="上课星期"
              prop="weekday"
              class="is-required"
            >
              <el-select v-model="courseInfo.weekday">
                <el-option
                  v-for="item in weekdays"
                  :value="item"
                  :key="item"
                  :label="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="上课时间"
              prop="course_time"
              class="is-required"
            >
              <el-select v-model="courseInfo.course_time">
                <el-option
                  v-for="item in course_times"
                  :value="item"
                  :key="item"
                  :label="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span
            slot="footer"
            class="dialog-footer"
            style="margin-left: -10px;"
          >
            <el-button
              @click="scheduleCourseVisible = false;"
              style="margin-right: 10px;"
            >取 消</el-button>
            <el-button
              type="primary"
              @click="commit()"
            >提交 </el-button>
          </span>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
let set = new Set();
import {
  getToBeScheduledCourse,
  getCategory,
  getScheduledCourse,
  getClazzs,
  generateCourseTable,
  getClassroomInfo,
  generateSingleCourseByGA,
  rearranage,
} from "@/utils/api";
export default {
  name: "scheduleCourse",
  data() {
    var validateBuilding = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入教学楼"));
      } else {
        callback();
      }
    };
    var validateClassroom = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入教室"));
      } else {
        callback();
      }
    };
    var validateWeekday = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入上课星期"));
      } else {
        callback();
      }
    };
    var validateCourseTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入上课时间"));
      } else {
        callback();
      }
    };
    return {
      activeName: "first",
      tableData: [],
      tableData2: [],
      total: 0,
      pageSize: 5,
      pageSize2: 5,
      pageNum: 1,
      pageNum2: 1,
      queryParams: {
        course: "",
        type: "",
        lecturer_id: "",
        lecturer: "",
        category: "",
      },
      queryParams2: {
        course: "",
        lecturer_id: "",
        lecturer: "",
      },
      categoryList: [],
      clazzs: [],
      scheduleCourseVisible: false,
      courseInfo: {},
      weekdays: ["周一", "周二", "周三", "周四", "周五"],
      course_times: ["第一大节", "第二大节", "第三大节", "第四大节"],
      rules: {
        building: [{ validator: validateBuilding, trigger: "change" }],
        classroom: [{ validator: validateClassroom, trigger: "change" }],
        weekday: [{ validator: validateWeekday, trigger: "change" }],
        course_time: [{ validator: validateCourseTime, trigger: "change" }],
      },
      buildings: [],
      classroomList: [],
      classrooms: [],
    };
  },
  methods: {
    handleSizeChange2(pageSize) {
      this.pageSize2 = pageSize;
      this.getCourse2(this.queryParams2, this.pageSize2, this.pageNum2);
    },
    handleCurrentChange2(pageNum) {
      this.pageNum2 = pageNum;
      this.getCourse2(this.queryParams2, this.pageSize2, this.pageNum2);
    },
    resetParams() {
      this.queryParams = {};
    },
    resetParams2() {
      this.queryParams2 = {};
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getCourse(this.queryParams, this.pageSize, this.pageNum);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getCourse(this.queryParams, this.pageSize, this.pageNum);
    },
    async getCourse(queryParams, pageSize, pageNum) {
      const res = await getToBeScheduledCourse(queryParams, pageSize, pageNum);
      if (res.code === 200) {
        this.tableData = res.data.list;
        this.total = res.data.total;
      } else {
        this.$message.error(res.msg);
      }
      return res;
    },
    async getCourse2(queryParams, pageSize, pageNum) {
      const res = await getScheduledCourse(queryParams, pageSize, pageNum);
      if (res.code === 200) {
        this.tableData2 = res.data.list;
        this.total = res.data.total;
      } else {
        this.$message.error(res.msg);
      }
      return res;
    },
    async search() {
      const res = await this.getCourse(
        this.queryParams,
        this.pageSize,
        this.pageNum
      );
      if (res.code === 200) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    async search2() {
      const res = await this.getCourse2(
        this.queryParams2,
        this.pageSize2,
        this.pageNum2
      );
      if (res.code === 200) {
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
    handleClick(tab, event) {
      if (this.activeName === "first") {
        this.getCourse(this.queryParams, this.pageSize, this.pageNum);
        this.getCategories();
      } else if (this.activeName === "second") {
        this.getClassroomList();
        this.getCourse2(this.queryParams2, this.pageSize2, this.pageNum2);
      }
    },
    async getClazzList(id) {
      this.clazzs = [];
      const res = await getClazzs(id);
      this.clazzs = res.data;
    },
    async generateCourseTableByGA() {
      const res = await generateCourseTable();
      this.getCourse(this.queryParams, this.pageSize, this.pageNum);
      if (res.code === 200) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    openDialog(row) {
      this.scheduleCourseVisible = true;
      this.courseInfo = { ...row };
      set.add(
        this.courseInfo.building +
          this.courseInfo.classroom +
          this.courseInfo.course_time +
          this.courseInfo.weekday
      );
    },
    resetValidate() {
      set.clear();
      this.courseInfo = {};
      this.$refs.courseInfo.clearValidate();
    },
    change() {
      if (this.courseInfo.building) {
        this.classrooms = this.classroomList
          .filter((v) => v.building === this.courseInfo.building)
          .map((v) => v.classroom);
      }
    },
    unique(arr, val) {
      const res = new Map();
      return arr.filter((item) => !res.has(item[val]) && res.set(item[val], 1));
    },
    async getClassroomList() {
      const res = await getClassroomInfo();
      if (res.code === 200) {
        this.classroomList = res.data;
        this.buildings = this.unique(res.data, "building").map(
          (v) => v.building
        );
        this.classrooms = this.classroomList
          .filter((v) => v.building === this.buildings[0])
          .map((v) => v.classroom);
      } else {
        this.$message.error(res.msg);
      }
    },
    commit() {
      this.$refs["courseInfo"].validate((valid) => {
        if (valid) {
          set.add(
            this.courseInfo.building +
              this.courseInfo.classroom +
              this.courseInfo.course_time +
              this.courseInfo.weekday
          );
          if (set.size === 1) {
            this.$message.error("提交信息重复");
            return;
          }
          this.rearranage();
        } else {
          this.$message.error("请填写信息后提交");
          return false;
        }
      });
    },
    async rearranage() {
      const res = await rearranage(this.courseInfo);
      if (res.code === 200) {
        this.scheduleCourseVisible = false;
        this.getCourse2(this.queryParams2, this.pageSize2, this.pageNum2);
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    async generateSingleCourse(row) {
      let temp = { ...row };
      if (temp.clazz) {
        temp.clazz = [temp.clazz];
      }
      const res = await generateSingleCourseByGA(temp);
      console.log(res);
      if (res.code === 200) {
        this.getCourse(this.queryParams, this.pageSize, this.pageNum);
        this.$message.success(res.msg);
      } else {
        this.$methods.error(res.msg);
      }
    },
  },
  created() {
    this.handleClick();
  },
};
</script>