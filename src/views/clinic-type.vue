<template>
    <div>
        <Card style="width: 100%" :bordered="false" :dis-hover="true">
            <p slot="title">
                <Icon type="ios-information"></Icon>
                号类维护
            </p>
            <ButtonGroup slot="extra">
                <Button type="primary" @click="addNewClinicType">新增号类</Button>
                <Button type="warning" @click="modifyClinicType">修改号类</Button>
                <Button type="error" @click="deleteClinicType">删除号类</Button>
            </ButtonGroup>
            <Table @on-current-change="selectCurrentRow" highlight-row :data="clinicTypes" :columns="shiftColumns" :broder="true"></Table>
        </Card>
        <Modal  :closable="false" :mask-closable="false" title="号类"
                v-model="editorModal"
                class-name="vertical-center-modal" :width="60" @on-ok="mergeShift">
            <Form :label-width="80" :model="currentSelectRow" label-position="left">
                <FormItem label="号类名称" >
                    <Input type="text" v-model="currentSelectRow.clinicType"></Input>
                </FormItem>
                <FormItem label="号类序号">
                    <Input type="text" v-model="currentSelectRow.serialNo" disabled></Input>
                </FormItem>
                <FormItem label="诊疗费">
                    <Input type="text" v-model="currentSelectRow.tradePrice" :number="true"></Input>
                </FormItem>
                <FormItem label="挂号费">
                    <Input type="text" v-model="currentSelectRow.registPrice" :number="true"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>

</template>

<script>
    import ICol from 'iview/src/components/grid/col';
    import util from "../libs/util";
    import Input from 'iview/src/components/input/input';

    export default {
        components: {
            Input,
            ICol},
        name: 'time-shift',
        data(){
            return {
                shiftColumns:[{
                    type:'index',
                    width:60,
                    align:"center"
                },{
                    title:"号类名称",
                    key:"clinicType"
                },{
                    title:"号类序号",
                    key:"serialNo"
                },{
                    title:"诊疗费",
                    key:"tradePrice"
                },{
                    title:"挂号费",
                    key:"registPrice"
                }],
                clinicTypes:[],
                currentSelectRow:{
                    serialNo:"",
                    clinicType:"",
                    tradePrice:"",
                    registPrice:"",
                    price:""
                },
                editorModal:false,
            }
        },
        created:function(){
            this.init();
        },
        methods:{
            loadAllClinicTypes:function(){
                util.ajax.get("api/clinic-type/list-all").then((res)=>{
                    this.clinicTypes = res.data ;
                })
            },
            init:function(){
                //初始化系统
                this.loadAllClinicTypes();
            },
            selectCurrentRow:function(row) {
                this.currentSelectRow = row;
            },
            addNewClinicType:function(){
                this.editorModal=true ;
                this.newClinicType();
            },
            newClinicType:function(){
                this.currentSelectRow.clinicType="";
                this.currentSelectRow.price=0.0;
                this.currentSelectRow.tradePrice=0.0;
                this.currentSelectRow.registPri=0.0;
                this.getMaxShiftCode();
            },
            getMaxShiftCode:function(){
                util.ajax.get("api/clinic-type/get-max-code").then(res=>{
                    if(res.data){
                        this.currentSelectRow.serialNo = parseInt(res.data)+1+"";
                    }else{
                        this.currentSelectRow.serialNo ="1";
                    }

                })
            },
            mergeShift:function(){
                if(!this.currentSelectRow.clinicType){
                    this.$Message.error("号类名称不能为空");
                    return ;
                }
                this.currentSelectRow.price =  this.currentSelectRow.tradePrice + this.currentSelectRow.registPrice;
                util.ajax.post("api/clinic-type/merge",this.currentSelectRow).then(res=>{
                    if("OK"==res.statusText){
                        this.$Message.success("号类添加成功");
                        this.loadAllClinicTypes();
                        // this.$refs.timeShiftTable.clearCurrentRow();
                    }
                });
            },
            modifyClinicType:function(){
                if(!this.currentSelectRow.clinicType){
                    this.$Message.error("请选择要修改的号类")
                    return ;
                }else{
                    this.editorModal=true ;
                }

            },
            deleteClinicType:function(){
                if(!this.currentSelectRow.clinicType){
                    this.$Message.error("请选择要删除号类")
                    return ;
                }else{
                    util.ajax.post("api/clinic-type/delete?id="+this.currentSelectRow.clinicType).then(res=>{
                        console.log(res.statusText);
                        console.log(res.data);
                        if(res.statusText=="OK"){
                            this.$Message.info(res.data);
                            this.loadAllClinicTypes();
                            this.newClinicType();
                        }
                    })
                }
            }
        }
    };
</script>

<style scoped>
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 0;
        }
    }
</style>