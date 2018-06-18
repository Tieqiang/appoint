const routers = [{
    path: '/',
    meta: {
        title: '预约确认与号表安排系统'
    },
    component: (resolve) => require(['./views/login.vue'], resolve)
},{
    path:'/index',
    meta:{
        title:'预约确认与号表安排系统-主页面'
    },
    component: (resolve) => require(['./views/index.vue'], resolve),
    children:[
        {
            path:'clinic-index',
            meta:{
                title:"主界面-号表维护"
            },
            component:(resolve)=>require(['./views/clinic-index.vue'],resolve)
        },{
            path:"clinic-register",
            meta:{
                title:"主界面-号表生成"
            },
            component:(resolve)=>require(['./views/clinic-register.vue'],resolve)
        },{
            path:'clinic-schedule',
            meta:{
                title:"主界面-号表安排"
            },
            component:(resolve)=>require(['./views/clinic-schedule.vue'],resolve)
        },{
            path:'appoint-confirm',
            meta:{
                title:"主界面-预约确认"
            },
            component:(resolve)=>require(['./views/appoint-confirm.vue'],resolve)
        },{
            path:'user-manager',
            meta:{
                title:"主界面-用户管理"
            },
            component:(resolve)=>require(['./views/user-manager.vue'],resolve)
        }
    ]
}];
export default routers;