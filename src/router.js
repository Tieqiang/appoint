const routers = [{
    path: '/',
    name:'login',
    meta: {
        title: '预约确认与号表安排系统',
        requireAuth:false
    },
    component: (resolve) => require(['./views/login.vue'], resolve)
},{
    path:'/index',
    meta:{
        title:'预约确认与号表安排系统-主页面',
        requireAuth:true,
    },
    component: (resolve) => require(['./views/index.vue'], resolve),
    children:[
        {
            path:'clinic-index',
            meta:{
                title:"主界面-号表维护",
                requireAuth:true,
            },
            component:(resolve)=>require(['./views/clinic-index.vue'],resolve)
        },{
            path:"clinic-register",
            meta:{
                title:"主界面-号表生成",
                requireAuth:true
            },
            component:(resolve)=>require(['./views/clinic-register.vue'],resolve)
        },{
            path:'clinic-schedule',
            meta:{
                title:"主界面-号表安排",
                requireAuth:true
            },
            component:(resolve)=>require(['./views/clinic-schedule.vue'],resolve)
        },{
            path:'appoint-confirm',
            meta:{
                title:"主界面-预约确认",
                requireAuth:true
            },
            component:(resolve)=>require(['./views/appoint-confirm.vue'],resolve)
        },{
            path:"time-interval",
            meta:{
                title:"主界面-挂号时段维护",
                requireAuth:true,
            },
            component:(resolve)=>require(['./views/time-interval.vue'],resolve)
        },{
            path:"time-shift",
            meta:{title:"主界面-班别维护",requireAuth:true},
            component:(resolve)=>require(['./views/time-shift.vue'],resolve)
        },{
            path:"clinic-type",
            meta:{title:"主界面-号类维护",requireAuth:true},
            component:(resolve)=>require(['./views/clinic-type.vue'],resolve)
        },{
            path:'user-manager',
            meta:{
                title:"主界面-用户管理",
                requireAuth:true
            },
            component:(resolve)=>require(['./views/user-manager.vue'],resolve)
        },{
            path:"stop-start-register",
            meta:{title:"主界面-停诊复诊处理",requireAuth:true},
            component:(resolve)=>require(['./views/stop-start-register.vue'],resolve)
        },{
            path:'clinic-pay',
            meta:{
                title:"主界面-扫码支付",
                requireAuth:true
            },
            component:(resolve)=>require(['./views/clinic-pay.vue'],resolve)
        }
    ]
}];
export default routers;