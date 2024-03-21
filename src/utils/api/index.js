import request from "../request";
import http from "../loginHttp";//不带token
import store from "@/store";

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
    windowOpen('http://localhost:9090/admin/student/export',"学生信息表");
}

function windowOpen(url,fileName){
    var xhr = new XMLHttpRequest();
    // var fileName = window.fileName + typeName; // 文件名称
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.setRequestHeader('token',store.getters.getToken);
    xhr.onload = function(res) {
        if (this.status === 200) {
            var type = xhr.getResponseHeader('Content-Type');
            var blob = new Blob([this.response], {type: type});
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

