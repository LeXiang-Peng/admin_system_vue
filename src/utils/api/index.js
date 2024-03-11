import request from "../request";
import store from "../../store";

export function getMenu() {
    return request.get('/common/getMenu', { headers: store.state.token });
}

export function login(ruleForm) {
    return request.post('/common/login', ruleForm);
}