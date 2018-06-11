<template>
    <div>
        <Row>
            <i-col span="6">
                <Select filterable v-model="currentClinicLabel">
                    <Option v-for="clinicIndex in clinicIndexes" :value="clinicIndex.clinicLabel" :key="clinicIndex.clinicLabel">{{clinicIndex.clinicLabel}}</Option>
                </Select>
            </i-col>
            <i-col span="16" offset="2">
                <Button type="primary" @click="addClinicSchedule">添加安排</Button>
                <Button type="info" @click="modifyClinicSchedule">修改安排</Button>
                <Button type="warning" @click="deleteClinicSchedule">取消安排</Button>
            </i-col>
        </Row>
        <br>
        <Row>
            <i-col span="24">
                <Table border highlight-row ref="currentRowTable" :columns="tableColumns" :data="clinicScheduleEntities" @on-current-change="selectChange"></Table>
            </i-col>
        </Row>
        <Modal title="出诊安排" v-model="modifyClinicScheduleModel" :closable="false" :mask-closable="false"
               @on-ok="mergeClinicSchedule"
               :width="40">
            <Form :label-width="80">
                <FormItem label="号别名称">
                    <Input type="text" v-model="currentSchedule.clinicLabel" :disabled="true"></Input>
                </FormItem>
                <FormItem label="星期">
                    <Select v-model="currentSchedule.dayOfWeek">
                        <Option :value=1 :key="1">星期一</Option>
                        <Option :value=2 :key="2">星期二</Option>
                        <Option :value=3 :key="3">星期三</Option>
                        <Option :value=4 :key="4">星期四</Option>
                        <Option :value=5 :key="5">星期五</Option>
                        <Option :value=6 :key="6">星期六</Option>
                        <Option :value=7 :key="7">星期日</Option>
                    </Select>
                </FormItem>
                <FormItem label="详细时间">
                    <Select v-model="currentSchedule.timeDesc">
                        <Option v-for="timeInterval in timeIntervals" :value="timeInterval.timeIntervalName" :key="timeInterval.timeIntervalName">{{timeInterval.timeIntervalName}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="限预约数">
                    <Input type="text" v-model="currentSchedule.appointmentLimits"></Input>
                </FormItem>
                <FormItem label="限挂号数">
                    <Input type="text" v-model="currentSchedule.registrationLimits"></Input>
                </FormItem>
            </Form>
        </Modal>

    </div>
</template>

<script>
    import ICol from 'iview/src/components/grid/col';
    import util from '../libs/util'
    export default {
        components: {ICol},
        name: 'clinic-schedule',
        data(){
            return {
                currentClinicLabel:"",
                clinicScheduleEntities:[],
                modifyClinicScheduleModel:false,
                timeIntervals:[],
                tableColumns:[{
                    title:"号别名称",
                    key:"clinicLabel"
                },{
                    title:"星期",
                    key:"dayOfWeek"
                },{
                    title:"详细时间",
                    key:'timeDesc'
                },{
                    title:"限预约号数量",
                    key:'registrationLimits'
                },{
                    title:"限挂号数量",
                    key:"appointmentLimits"
                }],
                clinicIndexes:[],//所有的号别信息
                currentSchedule:{
                    clinicLabel:'',
                    timeDesc:"",
                    dayOfWeek:'',
                    registrationLimits:0,
                    appointmentLimits:0
                }
            }
        },
        watch:{
            currentClinicLabel:function(newValue,oldValue){
                if(newValue){
                    this.loadSchedule(newValue);
                }
            }
        },
        created:function(){
            this.currentClinicLabel = this.$router.currentRoute.query.clinicLabel
            this.clinicIndexes = this.$store.state.clinicIndexes;
            this.timeIntervals = this.$store.state.timeIntervals;
            console.log(this.timeIntervals);
        },
        methods:{
            loadSchedule:function(value){
                util.ajax.get("api/clinic-schedule/get-clinic-schedule?clinicLabel="+value).then(res=>{
                    this.clinicScheduleEntities = res.data ;
                })
            },
            addClinicSchedule:function(){
                this.modifyClinicScheduleModel=true ;
                for(let key in this.currentSchedule){
                    this.currentSchedule[key] = "";
                }
                this.currentSchedule.clinicLabel= this.currentClinicLabel;

            },
            mergeClinicSchedule:function(){
                //修改号别安排
                util.ajax.post("api/clinic-schedule/merge",this.currentSchedule).then(res=>{
                    if(res.statusText=="OK"){
                        this.$Message.success("添加或者修改安排成功");
                        this.loadSchedule(this.currentClinicLabel);
                    }else{
                        this.$Message.error("添加或者修改安排失败，请联系信息科")
                    }
                })
            },
            selectChange:function(newObj){
                this.currentSchedule = newObj;
            },
            modifyClinicSchedule:function(){

                this.modifyClinicScheduleModel = true ;
            },
            deleteClinicSchedule:function(){
                util.ajax.post("api/clinic-schedule/delete",this.currentSchedule).then(res=>{
                    if(res.statusText=="OK"){
                        this.$Message.success("取消安排成功");
                        this.loadSchedule(this.currentClinicLabel);
                    }else{
                        this.$Message.error("取消安排失败，请联系信息科")
                    }
                })
            }


        }
    };
</script>

<style scoped>

</style>