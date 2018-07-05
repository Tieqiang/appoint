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
                            <MenuItem name="timeShift">
                                <Icon type="ios-information"></Icon>
                                班别维护
                            </MenuItem>
                            <MenuItem name="timeInterval">
                                <Icon type="ios-cloud"></Icon>
                                时段维护
                            </MenuItem>
                            <MenuItem name="clinicType">
                                <Icon type="ios-cloud"></Icon>
                                号类维护
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
                            <MenuItem name="stopStartClinic">
                                <Icon type="ios-paper"></Icon>
                                号表调整
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
    import Cookies from 'js-cookie';
    let menuRouters = {
        clinicIndex: '/index/clinic-index',
        clinicSchedule: '/index/clinic-schedule',
        appointConfirm: '/index/appoint-confirm',
        clinicRegister: '/index/clinic-register',
        userManager: '/index/user-manager',
        clinicPay:'/index/clinic-pay',
        timeShift:'/index/time-shift',
        timeInterval:'/index/time-interval',
        clinicType:'/index/clinic-type',
        stopStartClinic:"/index/stop-start-register"
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
                that.cardStyle['min-height'] = (that.fullHeight - 180) + 'px'
            };
        },
        methods: {
            menuSelect: function (menuName) {
                let vm = this;
                if (menuName == "logout") {
                    util.ajax.post("api/user/logout").then(function (res) {
                        vm.$router.push("/");
                        vm.$store.commit("setLoginUser","");
                        Cookies.remove("currentUser");
                    })
                } else {
                    vm.$router.push(menuRouters[menuName]);
                }
            }
        }
    };
</script>
