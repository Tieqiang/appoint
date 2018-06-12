<template>
    <div>
        <Form inline>
            <FormItem>
                <Select style="width:300px" v-model="selectDept" filterable>
                    <Option value="">--请选择---</Option>
                    <Option v-for="dept in depts" :value="dept.deptId" :key="dept.deptName" >{{dept.deptName}}</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Select style="width: 300px;" v-model="selectUser" filterable>
                    <Option value="">--请选择---</Option>
                    <Option v-for="user in users" :value="user.userId" :key="user.userId">{{user.userName}}</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Input type="text" placeholder="请输入拼音码检索" v-model="inputCode" ></Input>
            </FormItem>

            <FormItem>
                <Button type="primary" @click="searchClinicIndex">查询</Button>
                <Button type="success" @click="addClinicIndex">添加号别</Button>
                <Button type="info" @click="modifyIndex">修改号别</Button>
                <Button type="warning" @click="deleteIndex">删除号别</Button>
            </FormItem>
        </Form>
        <Table border highlight-row ref="currentRowTable" @on-current-change="selectChange":loading="loading" :columns="clinicIndexCols" :data="clinicIndexes"></Table>

        <Modal title="号别维护" v-model="modifyClinicIndex" :closable="false" :mask-closable="false"
               @on-ok="mergeClinicIndex"
               :width="40">
            <Form  :label-width="80">
                <FormItem label="号别名称">
                    <Input v-model="currentClinicIndex.clinicLabel" :disabled="modifyFlag"></Input>
                </FormItem>
                <FormItem label="号类名称">
                    <Input v-model="currentClinicIndex.clinicType"></Input>
                </FormItem>
                <FormItem label="拼音简码">
                    <Input v-model="currentClinicIndex.inputCode"></Input>
                </FormItem>

                <FormItem label="科室">
                    <Select  v-model="currentClinicIndex.clinicDept" filterable>
                        <Option value="">--请选择---</Option>
                        <Option v-for="dept in depts" :value="dept.deptId" :key="dept.deptName" >{{dept.deptName}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="出诊医生">
                    <Select v-model="currentClinicIndex.doctor" filterable>
                        <Option value="">--请选择---</Option>
                        <Option v-for="user in users" :value="user.userId" :key="user.userId">{{user.userName}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="医生职称">
                    <Select v-model="currentClinicIndex.doctorTitle">
                        <Option value="">--请选择---</Option>
                        <Option v-for="title in titleDicts" :value="title.titleCode" :key="title.titleCode">{{title.titleName}}</Option>
                    </Select>
                </FormItem>
            </Form>
        </Modal>

    </div>
</template>

<script>
    import util from '../libs/util'
    export default {
        name: 'clinic-index',
        data(){
          return {
              clinicIndexCols:[{
                  title:"号别名称",
                  key:'clinicLabel'
              },{
                  title:"科室",
                  key:'clinicDept',
                  render: (h, params) => {
                      let deptName = params.row.clinicDept
                      for(let dept in this.$store.state.depts){
                          if(this.$store.state.depts[dept].deptId===params.row.clinicDept){
                              deptName = this.$store.state.depts[dept].deptName;
                              break;
                          }
                      }
                      return h('div',[h('strong',deptName)])
                  }
              },{
                  title:"号类名称",
                  key:'clinicType'
              },{
                  title:"医生",
                  key:'doctor',
                  render:(h,params)=>{
                      let doctorId = params.row.doctor ;
                      let userName = "";
                      for(let key in this.$store.state.users){
                          if(this.$store.state.users[key].userId==doctorId){
                              userName= this.$store.state.users[key].userName
                              break;
                          }
                      }
                      return h('div',[h('strong',userName)]);
                  }
              },{
                  title:"医生职称",
                  key:'doctorTitle',
                  render:(h,param)=>{
                      let doctorTitleName = "";
                      for(let key in this.titleDicts){
                          if(this.titleDicts[key].titleCode==param.row.doctorTitle){
                              doctorTitleName = this.titleDicts[key].titleName;
                          }
                      }
                      return h("div",doctorTitleName)
                  }
              },{
                  title:"输入码",
                  key:"inputCode"
              },{
                  title:"出诊安排",
                  key:"inputCode",
                  render:(h,param)=>{
                      return h('Button',{
                          props: {
                              type: 'primary',
                              size: 'small'
                          },
                          on:{
                              click:()=>{
                                  this.setClinicSchedule(param.row)
                              }
                          }
                      },"出诊设置")
                  }
              }],
              clinicIndexes:[],//号别信息
              depts:[],//科室信息
              users:[],//人员信息
              users:[],//医生信息
              titleDicts:[],//职称字典
              selectDept:'',
              loading:false,
              inputCode:'',
              selectUser:"",
              modifyClinicIndex:false,
              modifyFlag:false,
              currentClinicIndex:{
                  inputCode:'',
                  doctorTitle:'',
                  doctor:'',
                  clinicDept:'',
                  clinicLabel:'',
                  clinicType:''
              },
              addFlag:false
          }
        },
        created:function(){
            this.init();
            this.depts = this.$store.state.depts;
            this.users=this.$store.state.users;
            console.log(this.depts)
        },
        methods:{
            init:function(){
                // this.loadClinicIndex();
                if(this.users.length==0){
                    this.loadUsers();
                }

                if(this.depts.length==0){
                    this.loadDepts();
                }

                this.loadDoctorTitle();
            },

            loadUsers:function(){
                util.ajax.get("api/comm/get-user-info").then(res=>{
                    this.users= res.data;
                })
            },
            loadDoctorTitle:function(){
                util.ajax.get("api/comm/get-doctor-title-dict").then(res=>{
                    this.titleDicts = res.data;
                })
            },
            loadDepts:function(){
                util.ajax.get("api/comm/get-dept-info").then(res=>{
                    this.depts = res.data;
                })
            },
            searchClinicIndex:function(){
                this.loading=true
                let reqUrl = "api/clinic-index/get-clinic-index?1=1";
                if(this.selectDept){
                    reqUrl+="&deptId="+this.selectDept
                }
                if(this.inputCode){
                    reqUrl+="&inputCode="+this.inputCode
                }

                if(this.selectUser){
                    reqUrl+="&doctorId="+this.selectUser
                }
                console.log(reqUrl)
                util.ajax.get(reqUrl).then(res=>{
                    this.clinicIndexes = res.data;
                    this.loading=false
                })
            },
            selectChange:function(currentRow,oldRow){
                this.currentClinicIndex = currentRow;
            },
            modifyIndex:function(){
                this.modifyClinicIndex=true
                this.modifyFlag=true
                this.addFlag = false;
            },
            deleteIndex:function(){
                this.$Message.info("暂未开通此功能，请等待......")
            },
            addClinicIndex:function(){
                //添加号别
                for(let key in this.currentClinicIndex){
                    this.currentClinicIndex[key]=""
                }
                this.modifyClinicIndex=true
                this.modifyFlag=false
                this.addFlag=true;
            },
            mergeClinicIndex:function(){
                if(!this.currentClinicIndex.clinicLabel){
                    this.$Message.error('号别不能为空，请填写号别');
                    return ;
                }
                util.ajax.post("api/clinic-index/merge-clinic-index",this.currentClinicIndex).then(res=>{
                    // console.log(res)
                    if(res.statusText=="OK"){
                        this.$Message.success("修改或添加号别成功");
                        if(this.addFlag){
                            this.addFlag=false;
                            this.$store.commit("addClinicIndex",this.currentClinicIndex)
                        }
                        this.searchClinicIndex();
                    }
                })

            },

            setClinicSchedule:function(currentRow){
                console.log(currentRow);
                this.$router.push({path:"/index/clinic-schedule",query:{clinicLabel:currentRow.clinicLabel}})
            }
        }

    };
</script>

<style scoped>

</style>