<template>
    <div>
        <Card style="width: 100%" :bordered="false" :dis-hover="true">
            <p slot="title">
                <Icon type="ios-information"></Icon>
                班别维护
            </p>
            <ButtonGroup slot="extra">
                <Button type="primary" @click="addNewShiftCode">新增班别</Button>
                <Button type="warning" @click="modifyShiftCode">修改版别</Button>
                <Button type="error" @click="deleteShiftCode">删除班别</Button>
                <Button type="ghost">维护班别时段</Button>
                <Button type="dashed">刷新</Button>
            </ButtonGroup>
            <Table @on-current-change="selectCurrentRow" highlight-row :data="timeShifts" :columns="shiftColumns" ref="timeShiftTable" :broder="true"></Table>
        </Card>
        <Modal  :closable="false" :mask-closable="false" title="班别编辑"
                v-model="editorModal"
                class-name="vertical-center-modal" :width="60" @on-ok="mergeShift">
            <Form :label-width="80" :model="currentSelectRow" label-position="left">
                <FormItem label="班别名称" >
                    <Input type="text" v-model="currentSelectRow.shiftName"></Input>
                </FormItem>
                <FormItem label="班别代码">
                    <Input type="text" v-model="currentSelectRow.shiftCode" disabled></Input>
                </FormItem>
                <FormItem label="开始时间">
                    <Input type="text" v-model="currentSelectRow.startTime" placeholder="请输入开始时间，格式为：HH24:MI"></Input>
                </FormItem>
                <FormItem label="结束时间">
                    <Input type="text" v-model="currentSelectRow.endTime" placeholder="请输入结束时间，格式为：HH24:MI"></Input>
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
                    title:"班别名称",
                    key:"shiftName"
                },{
                    title:"班别代码",
                    key:"shiftCode"
                },{
                    title:"开始时间",
                    key:"startTime"
                },{
                    title:"结束时间",
                    key:"endTime"
                }],
                timeShifts:[],
                currentSelectRow:{
                    id:"",
                    shiftName:"",
                    shiftCode:"",
                    startTime:"",
                    endTime:""
                },
                editorModal:false,
            }
        },
        created:function(){
            this.init();
        },
        methods:{
            loadAllShiftTimes:function(){
                util.ajax.get("api/time-shift/list-all").then((res)=>{
                    this.timeShifts = res.data ;
                })
            },
            init:function(){
                //初始化系统
                this.loadAllShiftTimes();
            },
            selectCurrentRow:function(row) {
                this.currentSelectRow = row;
            },
            addNewShiftCode:function(){
                this.editorModal=true ;
                this.newShiftCode();
            },
            newShiftCode:function(){
                this.currentSelectRow.id="";
                this.currentSelectRow.shiftName="";
                this.currentSelectRow.shiftCode="";
                this.currentSelectRow.startTime="";
                this.currentSelectRow.endTime="";
                this.getMaxShiftCode();
            },
            getMaxShiftCode:function(){
                util.ajax.get("api/time-shift/get-max-code").then(res=>{
                    if(res.data){
                        this.currentSelectRow.shiftCode = parseInt(res.data)+1+"";
                    }else{
                        this.currentSelectRow.shiftCode = 1+"";
                    }

                })
            },
            mergeShift:function(){
                if(!this.currentSelectRow.shiftName||!this.currentSelectRow.shiftCode){
                    this.$Message.error("班别名称和班别代码都不能为空");
                    return ;
                }
                if(!this.currentSelectRow.startTime||!this.currentSelectRow.endTime){
                    this.$Message.error("开始时间和结束时间不能为空");
                    return ;
                }

                util.ajax.post("api/time-shift/merge",this.currentSelectRow).then(res=>{
                    if("OK"==res.statusText){
                        this.$Message.success("添加班别成功");
                        this.loadAllShiftTimes();
                        // this.$refs.timeShiftTable.clearCurrentRow();
                    }
                });
            },
            modifyShiftCode:function(){
                if(!this.currentSelectRow.id){
                    this.$Message.error("请选择要修改的班别")
                    return ;
                }else{
                    this.editorModal=true ;
                }

            },
            deleteShiftCode:function(){
                if(!this.currentSelectRow.id){
                    this.$Message.error("请选择要删除的班别")
                    return ;
                }else{
                    util.ajax.post("api/time-shift/delete?id="+this.currentSelectRow.id).then(res=>{
                        console.log(res.statusText);
                        console.log(res.data);
                        if(res.statusText=="OK"){
                            this.$Message.info(res.data);
                            this.loadAllShiftTimes();
                            this.newShiftCode();
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