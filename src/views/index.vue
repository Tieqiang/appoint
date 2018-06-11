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
                        <MenuItem name="预约确认">
                            <Icon type="ios-navigate"></Icon>
                            预约确认
                        </MenuItem>
                        <MenuItem name="号别维护">
                            <Icon type="ios-keypad"></Icon>
                            号别维护
                        </MenuItem>
                        <MenuItem name="出诊安排">
                            <Icon type="ios-analytics"></Icon>
                            出诊安排
                        </MenuItem>
                        <MenuItem name="号表生成">
                            <Icon type="ios-paper"></Icon>
                            号表生成
                        </MenuItem>
                    </div>
                </Menu>
            </Header>
            <Content :style="{padding: '0 50px'}">
                <Card :style="cardStyle">
                    <router-view></router-view>
                </Card>
            </Content>
            <Footer class="layout-footer-center" style="text-align: center">2011-2016 &copy; 空腔医院</Footer>
        </Layout>
    </div>
</template>
<script>
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
            this.cardStyle['min-height']=(this.fullHeight - 180)+'px';
            let that = this ;
            window.onresize = function (event) {
                that.fullHeight = document.documentElement.clientHeight;
                console.log(that.fullHeight);
                that.cardStyle['min-height']=(that.fullHeight - 180)+'px'
            };
        },
        methods: {
            menuSelect:function(menuName){

                if(menuName=='号别维护'){
                    this.$router.push("/index/clinic-index")
                }else if(menuName=='出诊安排'){
                    this.$router.push("/index/clinic-schedule")
                }else if(menuName=='预约确认'){
                    this.$router.push("/index/appoint-confirm")
                }else if(menuName=='号表生成'){
                    this.$router.push("/index/clinic-register")
                }else{

                }
            }
        }
    };
</script>
