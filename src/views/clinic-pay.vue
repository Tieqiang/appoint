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
                <Button type="primary" size="small" @click="pay">
                    扫码支付
                </Button>
            </p>
            <Form :label-width="80">
                <Row>
                    <Col span="12">
                    <FormItem label="待缴费项目">
                        {{totalCount}}
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="待缴费金额">
                        {{totalCosts|currency}}
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <Table
                    border
                    :columns="payInfoColumns"
                    :data="payInfoList"
                    height="500"
                    @on-select="payInfoSelected"
                    @on-select-cancel="payInfoSelectCanceled"
                    @on-select-all="selectAll"
                    @on-selection-change="payInfoSelectChanged"
            ></Table>
        </Card>
        </Col>
        <selectPayMode
                v-model="isShowPayWay"
                @ok="ok"
                :costs="totalCosts"
        ></selectPayMode>
    </Row>
</template>
<script>
    import util from "../libs/util";

    import selectPayMode from "./template/select-pay-mode.vue";

    let dateFilter = window.Vue.filter("date");
    let currencyFilter = window.Vue.filter("currency");
    export default {
        name: 'clinic-pay',
        components: {
            selectPayMode
        },
        computed: {
            totalCount: function () {
                let count = 0;
                for (let item of this.payInfoList) {
                    if (item._checked) {
                        count++;
                    }
                }
                return count;
            },
            totalCosts: function () {
                let costs = 0;
                for (let item of this.payInfoList) {
                    if (item._checked) {
                        costs += item.costs;
                    }
                }
                return costs;
            }
        },
        data() {
            return {
                isShowPayWay: false,
                query: {},
                clinicMasterColumns: [
                    {
                        title: '姓名',
                        key: 'name'
                    },
                    {
                        title: '就诊日期',
                        key: 'visitDate',
                        render: (h, params) => {
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
                payInfoColumns: [
                    {
                        title: '选择',
                        type: 'selection',
                        width: 50
                    },
                    {
                        title: '处方号',
                        render: (h, params) => {
                            return h("div", params.row.id.serialNo+"|"+params.row.id.orderClass+"|"+params.row.id.orderNo);
                        }
                    },
                    {
                        title: '项目名称',
                        key: 'itemName'
                    },
                    {
                        title: '规格',
                        key: 'spec'
                    },
                    {
                        title: '单位',
                        key: 'units'
                    },
                    {
                        title: '数量',
                        key: 'amount'
                    },
                    {
                        title: '金额',
                        key: 'costs',
                        render:(h,params)=> {
                            return h("div", currencyFilter(params.row.costs));
                        }
                    }
                ],
                payInfoList: [],
            }
        },
        methods: {
            payInfoSelectChanged(selection) {
              if(selection.length==0) {
                  //取消全选的情况
                  for (let item of this.payInfoList) {
                      this.$set(item, '_checked', false);
                  }
              }
            },
            selectAll(selection) {
                //由于select-all事件不会触发组件刷新，故添加以下事件强行触发
                for (let item of this.payInfoList) {
                    this.$set(item, '_checked', true);
                }
            },
            payInfoSelected(selection, row) {
                for (let item of this.payInfoList) {
                    console.log(item.id);
                    console.log(row.id);
                    if (item.id.serialNo == row.id.serialNo&&item.id.orderClass==row.id.orderClass&&item.id.orderNo==row.id.orderNo) {
                        this.$set(item, '_checked', true);
                    }
                }
            },
            payInfoSelectCanceled(selection, row) {
                for (let item of this.payInfoList) {
                    if (item.id.serialNo == row.id.serialNo&&item.id.orderClass==row.id.orderClass&&item.id.orderNo==row.id.orderNo) {
                        this.$set(item, '_checked', false);
                    }
                }
            },
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
            patientClicked(clinicMaster, index) {
                let vm = this;
                vm.payInfoList = [];//清空未支付费用列表信息
                let query = {visitDate: clinicMaster.visitDate, visitNo: clinicMaster.visitNo};
                util.ajax.post("api/clinic-pay/get-unpayed-info", query).then(function (res) {
                    if (res && res.data) {
                        vm.payInfoList = res.data;
                    }
                })
            },
            pay() {
                if(this.totalCosts==0) {
                    this.$Message.error("没有需要支付的收费项目！");
                    return;
                }
                this.isShowPayWay = true;
            },
            ok({authCode, payMode}) {
                let vm = this;
                let query = {authCode, payMode};
                let serialSet = new Set();
                for (let item of vm.payInfoList) {
                    if(item._checked) {
                        serialSet.add(item.id.serialNo+"|"+item.id.orderClass+"|"+item.id.orderNo);
                    }
                }
                query.serialNoList = Array.from(serialSet);
                console.log(query);
                util.ajax.post("api/clinic-pay/pay", query).then(function (res) {
                    if (res && res.data && res.data == 0) {
                        vm.$Message.success("付款成功！");
                    }
                })
            }
        }
    }
</script>