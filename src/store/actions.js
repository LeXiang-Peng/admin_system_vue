import router from "@/router";
import { getMenu } from "@/utils/api"
import { Message } from 'element-ui';

export default {
    async getMenu({ commit }) {
        const res = await getMenu();
        if (res.code == 200) {
            commit('setMenu', res.data);
        } else {
            Message.error(res.msg);
            commit('logout');
            router.replace('/login');
        }
    }
}