<style scoped>
    .loginPanel{
        width: 600px;
        height: 450px;
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
</style>
<template>
    <div class="loginPanel">
        <Row>
            <i-col>
                <Card>
                    <p slot="title" style="text-align: center">预约确认与挂号安排系统</p>
                    <i-form>
                        <FormItem>
                            <Input type="text" v-model="userModel.user" placeholder="请输入用户名">
                            <Icon type="ios-person-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Input type="password" v-model="userModel.password" placeholder="请输入密码">
                            <Icon type="ios-locked-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <form-item>
                            <Button type="primary" long @click="loginHandel()">登录</Button>
                        </form-item>
                    </i-form>
                </Card>
            </i-col>
        </Row>
    </div>
</template>
<script>
    import ICol from 'iview/src/components/grid/col';
    import FormItem from 'iview/src/components/form/form-item';
    import util from '../libs/util'

    export default {
        data () {
            return {
                userModel: {
                    user: '',
                    password: ''
                },
            }
        },
        components: {
            FormItem,
            ICol},
        methods: {
            loginHandel:function(){
                let vm = this;
                util.ajax.post("api/user/login", vm.userModel).then(function (res) {
                    console.log(res);
                    if (res && res.data&&res.data.dbUser == vm.userModel.user.toUpperCase()) {
                        vm.$router.push('/index');
                    }else {
                        vm.$Message.error("登录失败！");
                    }
                }).catch(function(res) {
                    vm.$Message.error("登录失败！");
                });
            }
        }
    };
</script>