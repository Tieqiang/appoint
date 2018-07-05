<template>
    <div>
        <Card :bordered="false" :dis-hover="true">
            <p slot="title">时段维护</p>
            <div slot="extra" style="width: 400px;">
                <Select style="width: 30%" v-model="currentTimeShift" @on-change="timeShiftChange">
                    <Option v-for="timeShift in timeShifts" :value="timeShift.shiftCode">{{timeShift.shiftName}}
                    </Option>
                </Select>
                <Button type="primary" @click="addNewTimeInerval">添加时段</Button>
                <Button type="info" @click="mergeNewTimeInterval">修改时段</Button>
                <Button type="error" @click="deleteTimeInerval">删除时段</Button>
            </div>
            <Table highlight-row @on-current-change="tableSelectChange" :columns="timeIntervalCols" :data="timeIntervals"
                   :border="true" ref="timeIntervalTable"></Table>
        </Card>
        <Modal v-model="editorAble" :mask-closable="false" :closable="false" @on-ok="mergeTimeInterval">
            <Form :label-width="80" :model="currentTimeInterval">
                <FormItem label="时段名称">
                    <Input v-model="currentTimeInterval.timeIntervalName"></Input>
                </FormItem>
                <FormItem label="时段代码">
                    <Input v-model="currentTimeInterval.timeIntervalCode" disabled></Input>
                </FormItem>
                <FormItem label="开始时间">
                    <Input v-model="currentTimeInterval.startTime"></Input>
                </FormItem>
                <FormItem label="结束时间">
                    <Input v-model="currentTimeInterval.endTime"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import util from '../libs/util';

    export default {
        name: 'time-interval',
        data() {
            return {
                timeIntervalCols: [
                    {
                        title: '时段名称',
                        key: 'timeIntervalName'
                    }, {
                        title: '时段代码',
                        key: 'timeIntervalCode'
                    }, {
                        title: '开始时间',
                        key: 'startTime'
                    }, {
                        title: '结束时间',
                        key: 'endTime'
                    }
                ],
                timeIntervals: [],
                timeShifts: [],
                currentTimeShift: '',
                currentTimeInterval: {
                    id: '',
                    timeIntervalCode: '',
                    timeIntervalName: '',
                    startTime: '',
                    entTime: '',
                    inputCode: '',
                    shiftCode:""
                },
                editorAble: false,
            };
        },
        created: function () {
            this.init();
        },
        methods: {
            init: function () {
                this.loadAllShiftTimes();
            },
            loadAllShiftTimes: function () {
                util.ajax.get('api/time-shift/list-all').then((res) => {
                    this.timeShifts = res.data;
                });
            },
            timeShiftChange: function () {
                this.loadTimeIntervalByCode(this.currentTimeShift);
            },
            loadTimeIntervalByCode: function (shiftCode) {
                //加载当前的号别的时段信
                util.ajax.get('api/time-interval/get-by-shift-code?shiftCode=' + shiftCode).then(res => {
                    if (res.statusText == 'OK') {
                        // this.$Message.info(res.data);
                        this.timeIntervals = res.data;
                    }
                });
            },
            tableSelectChange: function (selectRow) {
                console.log(selectRow);
                this.currentTimeInterval = selectRow;
            },
            addNewTimeInerval: function () {
                this.currentTimeInterval = this.createNewTimeInterval();
                this.editorAble = true;
                this.getMaxCode();
            },
            getMaxCode:function(){
                util.ajax.get("api/time-interval/get-max-code").then(res=>{
                    if(res.data){
                        this.currentTimeInterval.timeIntervalCode=parseInt(res.data) + 1+"";
                    }else{
                        this.currentTimeInterval.timeIntervalCode= 1+"";
                    }

                })
            },
            createNewTimeInterval: function () {
                return {
                    id: '',
                    timeIntervalCode: '',
                    timeIntervalName: '',
                    startTime: '',
                    entTime: '',
                    inputCode: '',
                    shiftCode:this.currentTimeShift
                };
                this.editorAble = true;
            },
            mergeNewTimeInterval: function () {
                if (!this.currentTimeInterval.timeIntervalName) {
                    this.$Message.error('请选择要修改的时段信息');
                    return;
                }
                this.editorAble = true;
            },
            deleteTimeInerval: function () {
                if (!this.currentTimeInterval.timeIntervalName) {
                    this.$Message.error('请选择要删除的时段信息');
                    return;
                }

                util.ajax.post('api/time-interval/delete?timeIntervalName=' + this.currentTimeInterval.timeIntervalName).then(res => {
                    if (res.statusText == 'OK') {
                        this.$Message.info(res.data);
                        this.loadTimeIntervalByCode(this.currentTimeShift);
                    }
                });
            },
            mergeTimeInterval: function () {
                if (!this.currentTimeInterval.timeIntervalName) {
                    this.$Message.error('时段名称不能为空!');
                    return;
                }
                if (!this.currentTimeInterval.timeIntervalCode) {
                    this.$Message.error('时段代码不能为空！');
                    return;
                }

                util.ajax.post('api/time-interval/merge', this.currentTimeInterval).then(res => {
                   if(res.statusText=="OK"){
                       this.$Message.info("保存成功");
                       this.loadTimeIntervalByCode(this.currentTimeShift);
                   }
                });
            }
        }
    };
</script>

<style scoped>

</style>