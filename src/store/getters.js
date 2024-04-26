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
    },
    getCurrentPath(state) {
        if (!state.currentPath) state.currentPath = sessionStorage.getItem("currentPath");
        return state.currentPath;
    },
    getUserName(state) {
        if (!state.userName) state.userName = sessionStorage.getItem("userName");
        if (!state.userName) state.userName = localStorage.getItem('userName');
        return state.userName;
    },
    getAvatarUrl(state) {
        if (!state.avatar_url ||
            state.avatar_url === "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png")
            state.avatar_url = localStorage.getItem('avatar_url');
        if (!state.avatar_url)
            state.avatar_url = "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
        return state.avatar_url;
    },
}