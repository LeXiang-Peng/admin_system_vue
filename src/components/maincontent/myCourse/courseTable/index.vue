<template>
  <div>
    <div style="margin-bottom: 15px;padding-top:0;margin-top:-10px">
      <el-select
        v-model="current_week"
        @change="selectTrigger"
      >
        <el-option
          v-for="(item,index) in currentWeeks"
          :value="index+1"
          :label="item"
          :key="index"
        >
        </el-option>
      </el-select>
    </div>
    <el-table
      border
      stripe
      :data="tableData"
      :header-cell-style="{color: '#1E90FF', fontSize: '14px', backgroundColor: '#qua'}"
      :row-style="{height:'80px'}"
      :cell-style="{padding:'5px',cursor: 'pointer'}"
      style="font-size: 12px"
      @cell-click="changeCourseTime"
    >
      <el-table-column
        label="时间/课程"
        align="center"
      >
        <template v-slot="scope">
          <div v-if="scope.row">
            <div style="text-align: center; color: #E6A23C; font-weight: bold;">{{ scope.row.head }}</div>
            <div style="text-align: center; color: #E6A23C; font-weight: bold;">{{ scope.row.head_time }}</div>
            <div style="text-align: center; color: #E6A23C; font-weight: bold;">{{ scope.row.tail }}</div>
            <div style="text-align: center; color: #E6A23C; font-weight: bold;">{{ scope.row.tail_time }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="周一"
        align="center"
        prop="monday"
      >
        <template v-slot="scope">
          <div v-if="scope.row.monday">
            <div style="text-align: center;">
              <h5 v-show="false">{{ scope.row.monday.isRescheduled }}</h5>
              <b>[{{ scope.row.monday.course_id }}]</b>
              <h4>{{ scope.row.monday.course }}</h4>
            </div>
            <div style="text-align: center;"><span>{{ scope.row.monday.classroom }}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="周二"
        align="center"
        prop="tuesday"
      >
        <template v-slot="scope">
          <div v-if="scope.row.tuesday">
            <div style="text-align: center;">
              <h5 v-show="false">{{ scope.row.tuesday.isRescheduled }}</h5>
              <b>[{{ scope.row.tuesday.course_id }}]</b>
              <h4>{{ scope.row.tuesday.course }}</h4>
            </div>
            <div style="text-align: center;"><span>{{ scope.row.tuesday.classroom }}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="周三"
        align="center"
        prop="wednesday"
      >
        <template v-slot="scope">
          <div v-if="scope.row.wednesday">
            <div style="text-align: center;">
              <h5 v-show="false">{{ scope.row.wednesday.isRescheduled }}</h5>
              <b>[{{ scope.row.wednesday.course_id }}]</b>
              <h4>{{ scope.row.wednesday.course }}</h4>
            </div>
            <div style="text-align: center;"><span>{{ scope.row.wednesday.classroom }}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="周四"
        align="center"
        prop="thursday"
      >
        <template v-slot="scope">
          <div v-if="scope.row.thursday">
            <div style="text-align: center;">
              <h5 v-show="false">{{ scope.row.thursday.isRescheduled }}</h5>
              <b>[{{ scope.row.thursday.course_id }}]</b>
              <h4>{{ scope.row.thursday.course }}</h4>
            </div>
            <div style="text-align: center;"><span>{{ scope.row.thursday.classroom }}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="周五"
        align="center"
        prop="friday"
      >
        <template v-slot="scope">
          <div v-if="scope.row.friday">
            <div style="text-align: center;">
              <h5 v-show="false">{{ scope.row.friday.isRescheduled }}</h5>
              <b>[{{ scope.row.friday.course_id }}]</b>
              <h4>{{ scope.row.friday.course }}</h4>
            </div>
            <div style="text-align: center;"><span>{{ scope.row.friday.classroom }}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="周六"
        align="center"
        prop="saturday"
      >
        <template v-slot="scope">
          <div v-if="scope.row.saturday">
            <div style="text-align: center;">
              <h5 v-show="false">{{ scope.row.saturday.isRescheduled }}</h5>
              <b>[{{ scope.row.saturday.course_id }}]</b>
              <h4>{{ scope.row.saturday.course }}</h4>
            </div>
            <div style="text-align: center;"><span>{{ scope.row.saturday.classroom }}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="周日"
        align="center"
        prop="sunday"
      >
        <template v-slot="scope">
          <div v-if="scope.row.sunday">
            <div style="text-align: center;">
              <h5 v-show="false">{{ scope.row.sunday.isRescheduled }}</h5>
              <b>[{{ scope.row.sunday.course_id }}]</b>
              <h4>{{ scope.row.sunday.course }}</h4>
            </div>
            <div style="text-align: center;"><span>{{ scope.row.sunday.classroom }}</span></div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="调课"
      :visible.sync="dialogVisable"
      width="440px"
      center
      @close="reset()"
    >
      <el-form
        :model="form"
        ref="form"
        :rules="formRules"
        label-width="80px"
        style="margin-left: 35px;"
        size="small"
      >
        <el-form-item
          label="调周"
          prop="curr_week"
          style="margin-left: -0.5px;"
        >
          <el-select
            v-model="form.curr_week"
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择调整到哪周"
          >
            <el-option
              v-for="(item,index) in currentWeeks"
              :value="index+1"
              :label="item"
              :key="index"
            >

            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item
          label="调星期"
          prop="weekday"
        >
          <el-select
            v-model="form.weekday"
            placeholder="请选择调整到哪一天"
            style="width: 200px; margin-left: 5px;"
          >
            <el-option
              v-for="item in ['周一','周二','周三','周四','周五','周六','周日']"
              :value="item"
              :label="item"
              :key="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="调时间"
          prop="course_time"
          style="margin-left: -0.5px;"
        >
          <el-select
            v-model="form.course_time"
            placeholder="请选择调整到哪段时间"
            style="width: 200px; margin-left: 5px;"
          >
            <el-option
              v-for="item in ['第一大节','第二大节','第三大节','第四大节','第五大节']"
              :value="item"
              :label="item"
              :key="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="教学楼"
          prop="building"
          style="margin-left: -0.5px;"
        >
          <el-select
            v-model="form.building"
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
          style="margin-left: -0.5px;"
        >
          <el-select v-model="form.classroom">
            <el-option
              v-for="item in classrooms"
              :value="item"
              :key="item"
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
          @click="dialogVisable = false;"
          style="margin-right: 10px;"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submit"
        >提交 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
let set = new Set();
import {
  getTeacherCourseTable,
  alterCourseTime,
  getClassroomInfo,
} from "@/utils/api";
export default {
  name: "courseTable",
  data() {
    var validateWeekday = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择调整到哪一天"));
      } else {
        callback();
      }
    };
    var validateCourseTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择调整到哪段时间"));
      } else {
        callback();
      }
    };
    return {
      current_week: 1,
      tableData: [],
      currentWeeks: [
        "第一周",
        "第二周",
        "第三周",
        "第四周",
        "第五周",
        "第六周",
        "第七周",
        "第八周",
        "第九周",
        "第十周",
        "第十一周",
        "第十二周",
        "第十三周",
        "第十四周",
        "第十五周",
        "第十六周",
        "第十七周",
        "第十八",
        "第十九周",
        "第二十周",
        "第二十一周",
        "第二十二周",
        "第二十三周",
        "第二十四周",
        "第二十五周",
      ],
      dialogVisable: false,
      form: {
        course_id: 0,
        course: "",
        classroom: "",
        change_weekday: "",
        change_course_time: "",
        change_week: 0,
        curr_week: 1,
        course_time: "",
        weekday: "",
        building: "",
      },
      formRules: {
        wednesday: [{ validator: validateWeekday, trigger: "change" }],
        course_time: [{ validator: validateCourseTime, trigger: "change" }],
      },
      buildings: [],
      classroomList: [],
      classrooms: [],
    };
  },
  methods: {
    async getCourseTable() {
      const res = await getTeacherCourseTable(this.current_week);
      if (res.code === 200) {
        this.tableData = res.data;
      } else {
        this.$message.error(res.msg);
      }
    },
    selectTrigger() {
      this.getCourseTable();
    },
    changeCourseTime(row, column, cell) {
      let content = $(cell);
      if (content.find("h5").text() === "true") {
        this.$message.error("该记录已经被调整过，请前往调课记录重新调整");
        return;
      }
      this.form.course_id = content.find("b").text().replace(/\[|\]/g, "");
      if (this.form.course_id) {
        this.form.course = content.find("h4").text();
        let classroom = content.find("span").text();
        let parts = classroom.split(/(楼)/);
        parts = parts.filter((part) => part !== "");
        this.form.building = parts[0] + parts[1];
        this.form.classroom = parts[2] + parts[3] + parts[4];
        this.form.change_weekday = column.label;
        this.form.change_course_time = this.getCourseTime(
          this.tableData.findIndex((v) => v === row)
        );
        this.form.change_week = this.current_week;
        set.add(
          this.form.change_week +
            this.form.change_weekday +
            this.form.change_course_time +
            this.form.classroom +
            this.form.building
        );
        this.form.curr_week = this.current_week;
        this.dialogVisable = true;
      }
    },
    getCourseTime(index) {
      switch (index) {
        case 0:
          return "第一大节";
        case 1:
          return "第二大节";
        case 2:
          return "第三大节";
        case 3:
          return "第四大节";
        case 4:
          return "第五大节";
        default:
          return;
      }
    },
    reset() {
      this.$refs.form.clearValidate();
      this.form = {};
      set.clear();
    },
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          set.add(
            this.form.curr_week +
              this.form.weekday +
              this.form.course_time +
              this.form.classroom +
              this.form.building
          );
          if (set.size === 1) {
            this.$message.error("信息重复，请选择重新调课信息");
            return false;
          }
          this.alterCourseTime();
        } else {
          this.$message.error("请重新填写信息");
          return false;
        }
      });
    },
    async alterCourseTime() {
      const res = await alterCourseTime(this.form);
      if (res.code === 200) {
        this.$message.success(res.msg);
        this.dialogVisable = false;
        this.getCourseTable();
      } else {
        this.$message.error(res.msg);
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
    change() {
      if (this.form.building) {
        this.classrooms = this.classroomList
          .filter((v) => v.building === this.form.building)
          .map((v) => v.classroom);
      }
    },
  },
  created() {
    this.getCourseTable();
    this.getClassroomList();
  },
};
</script>