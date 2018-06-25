<template>
    <Modal
            title="选择支付方式"
            v-model="myValue"
            @on-visible-change="visibleChanged"
    >
        <Form :label-width="80" ref="formPay" :rules="rulesValidate" :model="pay">
            <FormItem label="总金额">
                <span style="color: red;font-size: 16px;">{{costs|currency}}</span>
            </FormItem>
            <FormItem label="支付方式">
                <RadioGroup v-model="pay.payMode">
                    <Radio label="9801">微信</Radio>
                    <Radio label="9901">支付宝</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="付款码" prop="authCode">
                <Input v-model="pay.authCode"></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="myValue=false">取消</Button>
            <Button type="primary" @click="ok">确定</Button>
        </div>
    </Modal>
</template>
<script>
    export default {
        name: 'select-pay-way',
        computed: {
            myValue: {
                get() {
                    return this.value;
                },
                set(v) {
                    this.$emit("input", v);
                }
            }
        },
        props: ["value","costs"],
        data() {
            return {
                pay: {
                    payMode: '9801',
                    authCode: ''
                },//默认微信支付
                rulesValidate:{
                    authCode:{required:true,message:'付款码不能为空！',trigger:'blur'}
                }
            };
        },
        methods: {
            visibleChanged(visible) {
                if (visible) {
                    this.init();
                }

            },
            init() {
                this.pay = {
                    payMode: '9801',
                    authCode: ''
                };
            },
            ok() {
                let vm = this;
                vm.$refs.formPay.validate(valid=> {
                    if(valid) {
                        vm.$emit("ok", vm.pay);
                        vm.myValue = false;
                    }
                })
            }
        },
        mounted: function () {
            this.init();
        }
    };
</script>