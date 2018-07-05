<template>
    <div>
        <Card :bordered="false" :dis-hover="true">
            <p slot="title">号表生成</p>
            <div slot="extra" style="width: 800px">
                <Select style="width: 150px" v-model="deptCode" @on-change="searchClinicIndex">
                    <Option value="">----请选择----</Option>
                    <Option v-for="dept in depts" :value="dept.deptId" :key="dept.deptName">{{dept.deptName}}</Option>
                </Select>
                <Input type="date" style="width: 130px" v-model="startTime"></Input>至<Input type="date" v-model="endTime" style="width: 130px;"></Input>
                <ButtonGroup>
                    <Button type="success" @click="searchClinicIndex">查询</Button>
                    <Button type="info" @click="searchClinicForRegist">查询号表</Button>
                    <Button type="primary" @click="createClinicForRegist">生成号表</Button>
                    <Button type="error" @click="deleteClinicForRegist">删除号表</Button>
                </ButtonGroup>
            </div>
            <Row>
                <i-col span="6">
                    <Table size="small" @on-selection-change="clinicIndexSelectionChange" :columns="clinicIndexCols" border :data="clinicIndexes" :height="tableHeight"></Table>
                </i-col>
                <i-col span="18">
                    <Table size="small" :loading="reigistLoading" @on-selection-change="clinicForRegistSelectionChange" :columns="clinicRegisterCols" border :height="tableHeight" :data="clinicRegistes"></Table>
                </i-col>
            </Row>
        </Card>
    </div>

</template>

<script>
    import ICol from 'iview/src/components/grid/col';
    import util from "../libs/util";
    export default {
        components: {ICol},
        name: 'clinic-register',
        data(){
            return {
                clinicIndexCols: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },{
                    title: "号别名称",
                    key: "clinicLabel"
                }],
                clinicRegisterCols:[{
                    type:"selection",
                    width:60,
                    align:'center'
                },{
                    title:"号表日期",
                    key:"clinicDate",
                    render:(h,param)=>{
                        let time = param.row.clinicDate;
                        let date = new Date(time);
                        let year = date.getFullYear();
                        let month = date.getMonth() +1;
                        month = month<10?('0'+month):month;
                        let day = date.getDate();
                        day= day < 10 ? ('0' + day) : day;
                        return h("strong",year+"-"+month+"-"+day)
                    }
                },{
                    title:"号别名称",
                    key:"clinicLabel"
                },{
                    title:"号别时间段",
                    key:'timeDesc'
                },{
                    title:"限预约数",
                    key:"appointmentLimits"

                },{
                    title:"限挂号数",
                    key:"registrationLimits"
                }],
                users:[],
                depts:[],
                deptCode:"",
                doctorId:"",
                startTime:"",
                endTime:"",
                clinicIndexes:[],
                tableHeight:"",
                selectClinicIndexes:[],//选择的号别信息
                clinicRegistes:[],
                selectedClinicRegistes:[],//选择的号表安排信息
                reigistLoading:false,
            }
        },
        created:function(){
            this.users = this.$store.state.users;
            this.depts = this.$store.state.depts;
            this.tableHeight=document.documentElement.clientHeight -270
        },
        methods:{
            searchClinicIndex:function(){
                let reqUrl = "api/clinic-index/get-clinic-index?1=1";
                if(!this.deptCode&&!this.doctorId){
                    this.$Message.error("请选择查询条件，科室和人员至少需要一个");
                    return ;
                }else{
                    if(this.deptCode){
                        reqUrl+="&deptId="+this.deptCode
                    }
                    if(this.doctorId){
                        reqUrl+="&doctorId="+this.doctorId
                    }
                }
                util.ajax.get(reqUrl).then(res=>{
                    this.clinicIndexes = res.data;
                    this.selectClinicIndexes = [] ;
                })


            },
            searchClinicForRegist:function(){
                if(!this.startTime){
                    this.$Message.error("开始时间不能为空");
                    return ;
                }
                if(!this.endTime){
                    this.$Message.error("结束时间不能为空");
                    return ;
                }
                if(this.selectClinicIndexes.length<=0){
                    this.$Message.error("必须选择号别")
                    return ;
                }
                this.reigistLoading=true
                util.ajax.post("api/clinic-for-register/get-clinic-for-regists-by-index?startDate="+this.startTime+"&endDate="+this.endTime,this.selectClinicIndexes).then(res=>{
                    this.clinicRegistes = res.data ;
                    this.reigistLoading=false
                });

            },
            createClinicForRegist:function(){
                let that = this ;
                this.$Modal.confirm({
                    title:"生成挂号确认",
                    content:"此操作，将会将原有的号表信息删除，并生成新的号表，确定要进行此操作吗？",
                    onOk:function(){
                        that.buildNewRegist();
                    },
                    onCancel:function(){

                    }
                })
            },
            buildNewRegist:function(){
                if(!this.startTime){
                    this.$Message.error("开始时间不能为空");
                    return ;
                }
                if(!this.endTime){
                    this.$Message.error("结束时间不能为空");
                    return ;
                }
                if(this.selectClinicIndexes.length<=0){
                    this.$Message.error("必须选择号别")
                    return ;
                }
                this.reigistLoading=true
                util.ajax.post("api/clinic-for-register/create-regist?startDate="+this.startTime+"&endDate="+this.endTime,this.selectClinicIndexes).then(res=>{
                    this.clinicRegistes = res.data;
                    this.reigistLoading=false
                })

            },
            clinicIndexSelectionChange:function(selection){
                this.selectClinicIndexes = selection;
            },
            clinicForRegistSelectionChange:function(selection){
                //选择的号表
                this.selectedClinicRegistes = selection;
            },
            deleteClinicForRegist:function(){
                if(this.selectedClinicRegistes.length<=0){
                    this.$Message.error("请选择要删除掉的号表安排!");
                    return;
                }
                this.reigistLoading=true
                util.ajax.post("api/clinic-for-register/delete",this.selectedClinicRegistes).then(res=>{
                    this.reigistLoading=false
                    if(res.statusText=="OK"){
                        this.$Message.success("删除成功");
                        this.searchClinicForRegist();
                        this.selectedClinicRegistes=[] ;
                    }else{
                        this.$Message.error("操作失败")
                    }
                })
            }
        }
    };
</script>

<style scoped>

</style>