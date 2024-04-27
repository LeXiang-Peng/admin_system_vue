import 'element-ui/lib/theme-chalk/index.css';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import router from "./index";
import store from '@/store';

NProgress.configure({
    easing: 'ease', // 动画方式
    speed: 500, // 递增进度条的速度
    showSpinner: false, // 是否显示加载ico
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3 // 初始化时的最小百分比
})


router.beforeEach((to, from, next) => {
    NProgress.start();
    //如果用户访问的登录页，直接放行
    if (to.path === '/login') return next();
    //从sessionStorage中获取到保存的token值
    const token = store.getters.getToken;
    //没有token，强制跳转到登录页
    if (!token || token == "") {
        //有可能是从/login=>/login,所以需要提前关掉动画
        NProgress.done();
        return next('/login')
    };
    //默认页
    store.commit('setCurrentPath', to.meta.name);
    if (to.fullPath == '/') next('/home');
    next();
})

router.afterEach(() => {
    // 在即将进入新的页面组件前，关闭掉进度条
    NProgress.done();
})
