import request from "../request";
import http from "../loginHttp";//不带token
import store from "@/store";
import { Message } from 'element-ui';

export function getMenu() {
    return request.get('/common/getMenu');
}

export function login(ruleForm) {
    return http.post('/common/login', ruleForm);
}

export function getStudentList(queryParams, pageSize, pageNum) {
    return request.post('/admin/student/list/' + pageSize + '/' + pageNum, queryParams);
}

export function getOptionList() {
    return request.get('/admin/options');
}

export function deleteStudents(identityForm) {
    return request.post('/admin/student/delete', identityForm);
}

export function resetStudentPassword(id) {
    return request.get('/admin/student/resetPassword/' + id);
}

export function newOneStudent(postForm) {
    return request.post('/admin/student/save', postForm);
}

export function updateOneStudent(postForm) {
    return request.post('/admin/student/update', postForm);
}

export function exportStudentList() {
    windowOpen('http://localhost:9090/admin/student/export', "学生信息表.xlsx");
}

export function exportStudentEmptyList() {
    windowOpen('http://localhost:9090/admin/student/export/empty', "学生信息表（格式）.xlsx");
}

export function getTeacherList(queryParams, pageSize, pageNum) {
    return request.post('/admin/teacher/list/' + pageSize + '/' + pageNum, queryParams);
}

export function getDepartmentList() {
    return request.get('/admin/teacher/department');
}

export function resetTeacherPassword(id) {
    return request.get('/admin/teacher/resetPassword/' + id);
}

export function newOneTeacher(postForm) {
    return request.post('/admin/teacher/save', postForm);
}

export function exportTeacherList() {
    windowOpen('http://localhost:9090/admin/teacher/export', "教师信息表.xlsx");
}

export function exportTeacherEmptyList() {
    windowOpen('http://localhost:9090/admin/teacher/export/empty', "教师信息表（格式）.xlsx");
}

export function deleteTeacherList(identityForm) {
    return request.post('/admin/teacher/delete', identityForm);
}

export function grantTeacher(id) {
    return request.get('/admin/teacher/grant/' + id);
}

export function getAdminList(queryParams, pageSize, pageNum) {
    return request.post('/admin/list/' + pageSize + '/' + pageNum, queryParams);
}

export function newOneAdmin(postForm) {
    return request.post('/admin/save', postForm);
}

export function deleteAdminList(identityForm) {
    return request.post('/admin/delete', identityForm);
}

export function resetAdminPassword(id) {
    return request.get('/admin/resetPassword/' + id);
}

export function revokeAdminADay(id) {
    return request.get('/admin/revoke/temporary/' + id);
}

export function revokeAdmin(id) {
    return request.get('/admin/revoke/' + id);
}

export function grantAdmin(id) {
    return request.get('/admin/grant/' + id);
}

export function privilegeEscalation(id) {
    return request.get('/admin/grant/plus/' + id);
}

export function demotionRights(id) {
    return request.get('/admin/demotion/' + id);
}

export function getPermission() {
    return request.get('/admin/teacher/permission');
}

export function getGrantedTeachers(queryParams, pageSize, pageNum) {
    return request.post('/admin/teacher/granted/list/' + pageSize + '/' + pageNum, queryParams);
}

export function revokeTeacher(id) {
    return request.get('/admin/teacher/granted/revoke/' + id);
}

export function banTeacherADay(id) {
    return request.get('/admin/teacher/granted/ban/temporary/' + id);
}

export function banTeacher(id) {
    return request.get('/admin/teacher/granted/ban/' + id);
}

export function privilegeEscalation2(id) {
    return request.get('/admin/teacher/granted/grant/plus/' + id);
}

export function getCourseList(queryParams, pageSize, pageNum) {
    return request.post('/teacher/course/approving/' + pageSize + '/' + pageNum, queryParams);
}

export function declareOneRequiredCourse(postForm) {
    return request.post('/teacher/course/declare', postForm);
}

export function cancelCourse(id) {
    return request.get('/teacher/course/cancel/' + id);
}

export function editCourse(editForm) {
    return request.post('/teacher/course/edit', editForm);
}

export function deleteCourseInfo(id = []) {
    return request.post('/teacher//course/delete/info', id);
}

export function getPendingCourses(queryParams, pageSize, pageNum) {
    return request.post('/admin/course/list/' + pageSize + '/' + pageNum, queryParams);
}

export function rejectCourse(id) {
    return request.get('/admin/course/reject/' + id);
}

export function passCourse(postForm) {
    return request.post('/admin/course/pass', postForm);
}

export function getCategory() {
    return request.get('/teacher/category');
}

function windowOpen(url, fileName) {
    var xhr = new XMLHttpRequest();
    //var fileName = window.fileName + typeName; // 文件名称
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.setRequestHeader('token', store.getters.getToken);
    xhr.onload = function (res) {
        if (this.status === 200) {
            var type = xhr.getResponseHeader('Content-Type');
            if (type === "application/json;charset=utf-8") {
                Message.error('权限不足');
                return;
            }
            var blob = new Blob([this.response], { type: type });
            if (typeof window.navigator.msSaveBlob !== 'undefined') {
                /*
                 * For IE
                 * >=IE10
                 */
                window.navigator.msSaveBlob(blob, fileName);
            } else {
                /*
                 * For Non-IE (chrome, firefox)
                 */
                var URL = window.URL || window.webkitURL;
                var objectUrl = URL.createObjectURL(blob);
                if (fileName) {
                    var a = document.createElement('a');
                    if (typeof a.download === 'undefined') {
                        window.location = objectUrl;
                    } else {
                        a.href = objectUrl;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    }
                } else {
                    window.location = objectUrl;
                }
            }
        }
    }
    xhr.send();
}

