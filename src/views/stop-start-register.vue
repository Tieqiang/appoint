<template>
    <Card :dis-hover="true" :bordered="false">
        <p slot="extra">号表调整</p>
        <div slot="title">
            门诊科室：
            <Select style="width: 150px" v-model="deptCode" @on-change="deptSelectChange">
                <Option v-for="dept in depts" :value="dept.deptId" :key="dept.deptName">{{dept.deptName}}</Option>
            </Select>
            号别信息：
            <Select style="width: 150px;" v-model="clinicIndex" @on-change="clinicIndexChange">
                <Option v-for="index in clinicIndexes" :value="index.clinicLabel">{{index.clinicLabel}}</Option>
            </Select>
            时间段：
            <Input type="date" style="width: 130px" v-model="startTime"></Input>至<Input type="date" v-model="endTime"
                                                                                        style="width: 130px;"></Input>
            <ButtonGroup>
                <Button type="primary" @click="searchClinicForRegist">查询号表</Button>
            </ButtonGroup>
        </div>
        <Table size="small" :loading="reigistLoading" :columns="clinicRegisterCols" border
               :data="clinicRegistes"></Table>
    </Card>
</template>
<script>
    import util from '../libs/util';

    export default {
        name: 'stop-start-register',
        data() {
            return {
                depts: [],
                deptCode: '',
                clinicIndex: '',
                clinicSchdule: '',
                startTime: '',
                endTime: '',
                clinicIndexes: [],
                clinicScheduleEntities: [],
                clinicRegistes: [],
                reigistLoading: false,
                clinicRegisterCols: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                }, {
                    title: '号表日期',
                    key: 'clinicDate',
                    render: (h, param) => {
                        let time = param.row.clinicDate;
                        let date = new Date(time);
                        let year = date.getFullYear();
                        let month = date.getMonth() + 1;
                        month = month < 10 ? ('0' + month) : month;
                        let day = date.getDate();
                        day = day < 10 ? ('0' + day) : day;
                        return h('strong', year + '-' + month + '-' + day);
                    }
                }, {
                    title: '号别名称',
                    key: 'clinicLabel'
                }, {
                    title: '号别时间段',
                    key: 'timeDesc'
                }, {
                    title: '限预约数',
                    key: 'appointmentLimits'

                },{
                    title:"当前预约数",
                    key:"appointmentNum"
                },{
                    title: '限挂号数',
                    key: 'registrationLimits'
                },{
                    title:"当前挂号数",
                    key:"registrationNum"
                },{
                    title:"总剩余数",
                    key:"registrationNum",
                    render:(h,param)=>{
                        let letfNuber = param.row.appointmentLimits+param.row.registrationLimits -param.row.registrationNum - param.row.appointmentNum;
                        return h('div',letfNuber);
                    }
                },{
                    title: '状态',
                    key: 'stopFlag',
                    render:(h,param)=>{
                        let labelText = "" ;
                        if(param.row.stopFlag=="0"){
                            labelText="停诊"
                            return h('Button',{
                                props:{
                                    type: 'warning',
                                    size: 'small'
                                },
                                on:{
                                    click:()=>{
                                        this.changeRegistFlag(param.row);
                                    }
                                }
                            },labelText)
                        }else{
                            labelText = "复诊";
                            return h('Button',{
                                props:{
                                    type: 'primary',
                                    size: 'small'
                                },
                                on:{
                                    click:()=>{
                                        this.changeRegistFlag(param.row);
                                    }
                                }
                            },labelText)
                        }


                    }
                }],
                selectClinicIndexes:[]
            };
        },
        created: function () {
            this.depts = this.$store.state.depts;
            console.log(this.depts);
        },
        methods: {
            deptSelectChange: function (row) {
                this.searchClinicIndex(row);
            },
            clinicIndexChange: function (row) {
                // this.loadSchedule(row);
                this.selectClinicIndexes = [] ;
                for(let key in this.clinicIndexes){
                    if(this.clinicIndexes[key].clinicLabel==row){
                        this.selectClinicIndexes.push(this.clinicIndexes[key]);
                    }
                }
            },
            searchClinicIndex: function (deptId) {
                let reqUrl = 'api/clinic-index/get-clinic-index?1=1';
                reqUrl += '&deptId=' + deptId;
                util.ajax.get(reqUrl).then(res => {
                    this.clinicIndexes = res.data;
                });
            },
            loadSchedule: function (value) {
                util.ajax.get('api/clinic-schedule/get-clinic-schedule?clinicLabel=' + value).then(res => {
                    this.clinicScheduleEntities = res.data;
                });
            },
            searchClinicForRegist: function () {
                if (!this.startTime) {
                    this.$Message.error('开始时间不能为空');
                    return;
                }
                if (!this.endTime) {
                    this.$Message.error('结束时间不能为空');
                    return;
                }
                if (this.selectClinicIndexes.length <= 0) {
                    this.$Message.error('必须选择号别');
                    return;
                }
                this.reigistLoading = true;
                util.ajax.post('api/clinic-for-register/get-clinic-for-regists-by-index?startDate=' + this.startTime + '&endDate=' + this.endTime, this.selectClinicIndexes).then(res => {
                    this.clinicRegistes = res.data;
                    this.reigistLoading = false;
                });

            },
            changeRegistFlag:function(row){
                console.log("修改前数据：")
                console.log(row);
                if(row.stopFlag =="0"){
                    row.stopFlag="1"
                } else if(row.stopFlag =="1"){
                    row.stopFlag = "0";
                }
                console.log("修改后数据");
                console.log(row);
                util.ajax.post("api/clinic-for-register/merge",row).then(res=>{
                    if(res.statusText=="OK"){
                        this.$Message.success("操作成功!");
                        this.searchClinicForRegist();
                    }
                });
            }
        }
    };
</script>

<style scoped>

</style>