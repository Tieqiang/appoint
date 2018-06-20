<template>
    <Modal
            title="选择支付方式"
            v-model="myValue"
            @on-visible-change="visibleChanged"
    >
        <Form :label-width="80">
            <FormItem label="支付方式">
                <RadioGroup v-model="pay.payWay">
                    <Radio label="9801">微信</Radio>
                    <Radio label="9901">支付宝</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="付款码">
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
        props: ["value"],
        data() {
            return {
                pay: {
                    payWay: '9801',
                    authCode: ''
                },//默认微信支付
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
                    payWay: '9801',
                    authCode: ''
                };
            },
            ok() {
                let vm = this;
                vm.$emit("ok", vm.pay);
                vm.myValue = false;
            }
        },
        mounted: function () {
            this.init();
        }
    };
</script>