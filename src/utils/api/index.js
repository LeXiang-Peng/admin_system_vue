import request from "../request";
import http from "../loginHttp";//不带token

export function getMenu() {
    return request.get('/common/getMenu');
}

export function login(ruleForm) {
    return http.post('/common/login', ruleForm);
}

export function getStudentList(queryParams, pageSize, pageNum) {
    return request.post('/admin/studentList/' + pageSize + '/' + pageNum, queryParams);
}

export function getOptionList(){
    return request.get('/admin/options');
}

export function deleteOneStudent(id){
    return request.delete();
}