import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';



Vue.use(VueRouter);
Vue.use(Vuex);

Vue.use(iView);



// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    next();
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

const store = new Vuex.Store({
    state: {
        users:[],
        titleDicts:[],
        depts:[],
        clinicIndexes:[],
        timeIntervals:[]
    },
    getters: {

    },
    mutations: {
        setUsers:function(state,users){
            state.users = users;
        },
        setTitleDicts:function(state,titleDicts){
            state.titleDicts = titleDicts;
        },
        setDepts:function(state,depts){
            state.depts = depts;
        },
        setClinicIndex(state,clinicIndexes){
            state.clinicIndexes = clinicIndexes ;
        },
        setTimeIntervals(state,timeIntervals){
            state.timeIntervals = timeIntervals;
        },
        addClinicIndex(state,clinicIndex){
            state.clinicIndexes.push(clinicIndex);
        }
    },
    actions: {

    }
});

//设置职称字典信息
Util.ajax.get("api/comm/get-title-dict").then(res=>{
    store.commit("setTitleDicts", res.data);
});
//设置医生信息
Util.ajax.get("api/comm/get-user-info").then(res=>{
    store.commit("setUsers",res.data)
})
//设置科室信息
Util.ajax.get("api/comm/get-dept-info").then(res=>{
    store.commit("setDepts",res.data)
})
//设置号别信息
Util.ajax.get("api/clinic-index/get-all-clinic-index").then(res=>{
    store.commit("setClinicIndex",res.data)
});

//设置号别时间安排
Util.ajax.get("api/comm/get-time-interval").then(res=>{
    console.log(res.data);
    store.commit("setTimeIntervals",res.data)
});


window.vueMain = new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});