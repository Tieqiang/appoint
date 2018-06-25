<style scoped>
    .layout {
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }

    .layout-logo {
        width: 100px;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }

    .layout-nav {
        width: 520px;
        margin: 0 auto;
        margin-right: 20px;
    }

    .layout-footer-center {
        text-align: center;
    }
</style>
<template>
    <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" theme="dark" active-name="1" @on-select="menuSelect">
                    <div class="layout-logo"></div>
                    <div class="layout-nav">
                        <Submenu name="appointManager">
                            <template slot="title">
                                <Icon type="stats-bars"></Icon>
                                挂号管理
                            </template>
                            <MenuItem name="appointConfirm">
                                <Icon type="ios-navigate"></Icon>
                                预约确认
                            </MenuItem>
                            <MenuItem name="clinicIndex">
                                <Icon type="ios-keypad"></Icon>
                                号别维护
                            </MenuItem>
                            <MenuItem name="clinicSchedule">
                                <Icon type="ios-analytics"></Icon>
                                出诊安排
                            </MenuItem>
                            <MenuItem name="clinicRegister">
                                <Icon type="ios-paper"></Icon>
                                号表生成
                            </MenuItem>
                        </Submenu>
                        <MenuItem name="userManager">
                            <Icon type="ios-paper"></Icon>
                            用户管理
                        </MenuItem>
                        <Submenu name="clinicPay">
                            <template slot="title">
                                <Icon type="ios-paper"></Icon>
                                诊间支付
                            </template>
                            <MenuItem name="clinicPay">
                                <Icon type="ios-paper"></Icon>
                                扫码支付
                            </MenuItem>
                        </Submenu>
                        <MenuItem name="logout">
                            <Icon type="ios-paper"></Icon>
                            登出
                        </MenuItem>

                    </div>
                </Menu>
            </Header>
            <Content :style="{padding: '0 50px'}">
                <Card :style="cardStyle">
                    <router-view></router-view>
                </Card>
            </Content>
            <Footer class="layout-footer-center" style="text-align: center">2011-2016 &copy; 口腔医院</Footer>
        </Layout>
    </div>
</template>
<script>
    import util from "../libs/util";
    let menuRouters = {
        clinicIndex: '/index/clinic-index',
        clinicSchedule: '/index/clinic-schedule',
        appointConfirm: '/index/appoint-confirm',
        clinicRegister: '/index/appoint-register',
        userManager: '/index/user-manager',
        clinicPay:'/index/clinic-pay'
    };
    export default {
        data() {
            return {
                cardStyle: {
                    margin: '20px 0',
                    'min-height': '500px'
                },
                fullHeight: document.documentElement.clientHeight
            };
        },
        created: function () {
            this.fullHeight = document.documentElement.clientHeight;
            this.cardStyle['min-height'] = (this.fullHeight - 180) + 'px';
            let that = this;
            window.onresize = function (event) {
                that.fullHeight = document.documentElement.clientHeight;
//                console.log(that.fullHeight);
                that.cardStyle['min-height'] = (that.fullHeight - 180) + 'px'
            };
        },
        methods: {
            menuSelect: function (menuName) {
                let vm = this;
                if (menuName == "logout") {
                    util.ajax.post("api/user/logout").then(function (res) {
                        console.log(res);
                        vm.$router.push("/");
                    })
                } else {
                    vm.$router.push(menuRouters[menuName]);
                }


//                if(menuName=='clinicIndex'){
//                    this.$router.push("/index/clinic-index")
//                }else if(menuName=='clinicSchedule'){
//                    this.$router.push("/index/clinic-schedule")
//                }else if(menuName=='appointConfirm'){
//                    this.$router.push("/index/appoint-confirm")
//                }else if(menuName=='clinicRegister'){
//                    this.$router.push("/index/clinic-register")
//                }else if(menuName=="userManager"){
//                    this.$router.push("/index/clinic-register")
//                }
            }
        }
    };
</script>
