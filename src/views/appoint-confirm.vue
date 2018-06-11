<template>
    <div>
        <Input size="large" v-model="idNo" style="width: 500px;" placeholder="请输入身份证号进行检索" @on-enter="searchOrder"></Input>
        <Button type="primary"  shape="circle" icon="ios-search" @click="searchOrder">查询预约信息</Button>
        <Table border size="large" style="margin-top: 10px" :columns="appointOrderCols" :data="appointOrders">

        </Table>
    </div>
</template>

<script>
    import util from "../libs/util"
    export default {
        name: 'appoint-confirm',
        data(){
            return {
                idNo:"",
                appointOrderCols:[{
                    title:"订单号",
                    key:"orderId"
                },{
                    title:"预约诊室",
                    key:"deptId"
                },{
                    title:"预约时间",
                    key:"orderTime"
                },{
                    title:"预约人",
                    key:"patientName"
                },{
                    title:"预约号别",
                    key:"scheduleId"
                },{
                    title:"操作",
                    key:"id",
                    align:'center',
                    render:(h,param)=>{
                        return h('Button',{
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            on:{
                                click:()=>{
                                    this.appointConfirm(param.row.id);
                                }
                            }
                        },"确认预约")
                    }
                }],//表格列定义
                appointOrders:[]//表格数据
            }
        },
        methods:{
            appointConfirm:function(id){

                if(id==null ||id==""){
                    this.$Message.error("请选择确认的预约单");
                    return ;
                }
                util.ajax.post("api/appoint/confirm?id="+id).then(res=>{
                    console.log(res);
                    console.log(res.statusText=="OK");
                    if(res.statusText=="OK"){
                        this.$Message.success("恭喜，取号成功！");
                        this.searchOrder();
                    }
                })

            },
            searchOrder:function(){
                if(!this.idNo){
                    this.$Message.error("请输入请输入身份证号！！")
                    return ;
                }

                util.ajax.get("api/appoint/get-order?idNo="+this.idNo).then(res=>{
                    this.appointOrders = res.data ;
                })
            }
        }
    };
</script>

<style scoped>

</style>