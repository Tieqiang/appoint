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
        <Col span="18">
        <Card>
            <p slot="title">待缴费项目</p>
            <p slot="extra">
                <Button type="primary" size="small" @click="isShowPayWay=true">
                    扫码支付
                </Button>
            </p>
            <Table
                    :columns="payInfoColumns"
                    :data="payInfoList"
            ></Table>
        </Card>
        </Col>
        <selectPayWay v-model="isShowPayWay"></selectPayWay>
    </Row>
</template>
<script>
    import util from "../libs/util";

    import selectPayWay from "./template/select-pay-way.vue";

    let dateFilter = window.Vue.filter("date");
    export default {
        name: 'clinic-pay',
        components:{
            selectPayWay
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
                payInfoList:[]

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
                let query = {visitDate: clinicMaster.visitDate, visitNo: clinicMaster.visitNo};
                util.ajax.post("api/clinic-pay/get-unpayed-info",query).then(function(res) {
                    if (res && res.data) {
                        vm.payInfoList = res.data;
                    } else {
                        vm.payInfoList = [];

                    }
                })
            }
        }
    }
</script>