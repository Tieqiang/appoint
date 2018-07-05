import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import Cookies from 'js-cookie'
import "./libs/filter";


Vue.use(VueRouter);
Vue.use(Vuex);

Vue.use(iView);


// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);


router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

const store = new Vuex.Store({
    state: {
        users: [],
        titleDicts: [],
        depts: [],
        clinicIndexes: [],
        timeIntervals: [],
        loginUser:""
    },
    getters: {},
    mutations: {
        setUsers: function (state, users) {
            state.users = users;
        },
        setTitleDicts: function (state, titleDicts) {
            state.titleDicts = titleDicts;
        },
        setDepts: function (state, depts) {
            state.depts = depts;
        },
        setClinicIndex(state, clinicIndexes) {
            state.clinicIndexes = clinicIndexes;
        },
        setTimeIntervals(state, timeIntervals) {
            state.timeIntervals = timeIntervals;
        },
        setLoginUser(state,user){
            state.loginUser = user ;
        }
    },
    actions: {}
});

//设置职称字典信息
Util.ajax.get("api/comm/get-title-dict").then(res => {
    store.commit("setTitleDicts", res.data);
});
//设置医生信息
Util.ajax.get("api/comm/get-user-info").then(res => {
    store.commit("setUsers", res.data)
})
//设置科室信息
Util.ajax.get("api/comm/get-dept-info").then(res => {
    store.commit("setDepts", res.data)
})


//设置号别时间安排
Util.ajax.get("api/comm/get-time-interval").then(res => {
    console.log(res.data);
    store.commit("setTimeIntervals", res.data)
});


router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    if(to.meta.requireAuth){

        if(store.state.loginUser){
            next();
        }else{
            if(Cookies.get("currentUser")){
                next();
            }else{
                next({
                    path:"/",
                    query: {redirect: to.fullPath}
                })
            }
        }
    }else{
        next();
    }
});

window.vueMain = new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});