<template>
    <Row>
        <Col span="6">
        <Card>
            <p slot="title">患者列表</p>
            <p slot="extra">
                <Button type="primary" size="small" @click="getClinicMasterList">查询</Button>
            </p>
            <Form :label-width="80" ref="formQuery" :rules="clinicMasterRules" :model="query">
                <Row>
                    <FormItem label="就诊卡号" prop="patientId">
                        <Input v-model="query.patientId"></Input>
                    </FormItem>
                </Row>
            </Form>

            <Table
                    :columns="clinicMasterColumns"
                    :data="clinicMasterList"
                    height="500"
                    @on-row-click="patientClicked"
            ></Table>
        </Card>
        </Col>
        <Col style="padding-left:15px;" span="18">
        <Card>
            <p slot="title">待缴费项目</p>
            <p slot="extra">
                <Button type="primary" size="small" @click="isShowPayWay=true">
                    扫码支付
                </Button>
            </p>
            <Form :label-width="80">
                <Row>
                    <Col span="12">
                    <FormItem label="待缴费项目">
                        {{totalInfo.amount}}
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="待缴费金额">
                        {{totalInfo.costs}}
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <Table
                    :columns="payInfoColumns"
                    :data="payInfoList"
                    height="500"
            ></Table>
        </Card>
        </Col>
        <selectPayMode
                v-model="isShowPayWay"
                @ok="ok"
        ></selectPayMode>
    </Row>
</template>
<script>
    import util from "../libs/util";

    import selectPayMode from "./template/select-pay-mode.vue";

    let dateFilter = window.Vue.filter("date");
    export default {
        name: 'clinic-pay',
        components:{
            selectPayMode
        },
        data() {
            return {
                isShowPayWay:false,
                query: {},
                clinicMasterColumns: [
                    {
                        title: '姓名',
                        key: 'name'
                    },
                    {
                        title: '就诊日期',
                        key: 'visitDate',
                        render:(h,params)=> {
                            return h("div", dateFilter(params.row.visitDate));
                        }
                    },
                    {
                        title: '就诊序号',
                        key: 'visitNo'
                    }
                ],
                clinicMasterList: [],
                clinicMasterRules: {
                    patientId: [{required: 'true', message: '就诊卡号不能为空！', trigger: 'blur'}]
                },
                payInfoColumns:[
                    {
                        title:'项目名称',
                        key:'itemName'
                    },
                    {
                        title:'规格',
                        key:'spec'
                    },
                    {
                        title:'单位',
                        key:'units'
                    },
                    {
                        title:'数量',
                        key:'amount'
                    },
                    {
                        title:'金额',
                        key:'costs'
                    }
                ],
                payInfoList:[],
                totalInfo:{
                    amount:0,
                    costs:0
                }

            }
        },
        methods: {
            getClinicMasterList() {
                let vm = this;
                vm.$refs.formQuery.validate(valid => {
                    if (valid) {
                        util.ajax.get("api/clinic-pay/get-clinic-master?patientId=" + vm.query.patientId).then(function (res) {
                            console.log(res);
                            if (res && res.data) {
                                vm.clinicMasterList = res.data;
                            } else {
                                vm.clinicMasterList = [];
                            }
                        })
                    }
                })
            },
            patientClicked(clinicMaster,index) {
                let vm = this;
                //清空总费用信息
                vm.totalInfo={
                    amount:0,
                    costs:0
                }
                vm.payInfoList = [];//清空未支付费用列表信息
                let query = {visitDate: clinicMaster.visitDate, visitNo: clinicMaster.visitNo};
                util.ajax.post("api/clinic-pay/get-unpayed-info",query).then(function(res) {
                    if (res && res.data) {
                        vm.payInfoList = res.data;
                        for (let item of vm.payInfoList) {
                            vm.totalInfo.amount += 1;
                            vm.totalInfo.costs += item.costs;
                        }
                    }
                })
            },
            ok({authCode,payMode}) {
                let vm = this;
                let serialSet = new Set();
                for(let item of vm.payInfoList) {
                    serialSet.add(item.serialNo);
                }
                let query = {authCode,payMode};
                query.serialNo = serialSet[0];
                util.ajax.post("api/clinic-pay/pay",query).then(function(res) {
                    if(res&&res.data&&res.data==0) {
                        vm.$Message.success("付款成功！");
                    }
                })
            }
        }
    }
</script>