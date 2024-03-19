export default {
    getMenuList(state) {
        return state.menu;
    },
    getToken(state) {
        if (state.token && state.token !== '') return state.token;
        state.token = sessionStorage.getItem('token');
        if (state.token && state.token !== '') return state.token;
        state.token = localStorage.getItem('token');
        return state.token;
    }
}