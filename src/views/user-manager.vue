<template>
    <Card>
        <p slot="title">用户管理</p>
        <p slot="extra">
            <Button type="primary" @click="add">新建</Button>
            <Button type="primary" @click="search">查询</Button>
        </p>
        <Form :label-width="80">
            <Row>
                <Col span="6">
                <FormItem label="用户名">
                    <Input v-model="query.dbUser"></Input>
                </FormItem>
                </Col>
                <Col span="6">
                <FormItem label="姓名">
                    <Input v-model="query.name"></Input>
                </FormItem>
                </Col>
            </Row>
        </Form>

        <Table
                :columns="columns"
                :data="userList"
                height="600"
        ></Table>
        <addUser :user="user" v-model="isShow" @ok="ok"></addUser>
    </Card>
</template>
<script>
    import util from "../libs/util";
    import addUser from "./template/add-user.vue";

    let deptFilter = window.Vue.filter("dept");

    export default {
        name: 'user-manage',
        components: {
            addUser,
        },
        data() {
            return {

                isShow: false,
                isAdd: false,
                loading: false,
                query: {},
                user: {},
                userList: [],
                columns: [
                    {
                        title: '操作',
                        width: 100,
                        render: (h, params) => {
                            return h("div", [
                                h("Button", {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.row);
                                        }
                                    }
                                }, ["修改"])
                            ])
                        }
                    },
                    {
                        title: '用户名',
                        key: 'dbUser'
                    },
                    {
                        title: '姓名',
                        key: 'name'
                    },
                    {
                        title: '科室',
                        key: 'deptCode',
                        render:(h,params)=> {
                            return h("div",deptFilter(params.row.deptCode,this.deptDict))
                        }
                    }

                ],
                deptDict:[],
            }
        },
        methods: {
            search() {
                let vm = this;
                vm.loading = true;
                util.ajax.post("api/user/list",vm.query).then(function(res) {
                    if(res&&res.data) {
                        vm.userList = res.data;
                    }
                }).catch(function(res) {
                    console.log(res);
                })
            },
            add() {
                this.user = {};
                this.isAdd = true;
                this.isShow = true;
            },
            edit(user) {
                this.user = user;
                this.isAdd = false;
                this.isShow = true;
            },
            ok(user) {
                if (this.isAdd) {
                    this.userList.push(user);
                } else {
                    this.userList.splice(user._index, 1, user);
                }
            },
        },
        mounted:function() {
            let vm = this;
            util.ajax.get("api/clinic-pay/dept-dict").then(function(res) {
                vm.deptDict = res.data;
            })
//            invokeSrv.getFnData(dictSrv.getDeptDict,null,function(data) {
//                vm.deptDict = data;
//            })
        }

    }


</script>