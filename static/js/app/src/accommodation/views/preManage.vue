<template>
    <div style="display: flex;">
        <dayOrderLeft>
            <DateSelect slot="timePicker" :defaultDate="defaultStartDate" @change='changeDate' :width='185' :disabledDate='true' />
        </dayOrderLeft>
        <div class="content">
            <p>当日到店预定</p>
            <div class="table-content">
                <table style="border: none;border-top: 4px solid #178ce6;">
                    <colgroup>
                        <col width="80">
                        <col width="40">
                        <col width="80">
                        <col width="200">
                        <col width="400">
                        <col width="60">
                        <col width="60">
                        <col width="120">
                        <col width="90">
                    </colgroup>
                    <tr style="background: #f0f0f0;">
                        <th>订单详情</th>
                        <th>数量</th>
                        <th>入住类型</th>
                        <th>房号</th>
                        <th>入住时间</th>
                        <th>状态</th>
                        <th>联系人</th>
                        <th>手机号</th>
                        <th>操作</th>
                    </tr>
                </table>
                <div class="tbody-item" v-for="item in orderLists">
                    <table>
                        <colgroup>
                            <col width="80">
                            <col width="40">
                            <col width="80">
                            <col width="200">
                            <col width="400">
                            <col width="60">
                            <col width="60">
                            <col width="120">
                            <col width="90">
                        </colgroup>
                        <tr style="background: #f0f0f0; height: 30px;">
                            <td colspan="9">订单号：{{item.orderNum}} {{item.creationTime}}</td>
                        </tr>
                        <tr v-for="(row, index) in item.roomTypes">
                            <td>{{row.typeName}}</td>
                            <td>{{row.count}}</td>
                            <td>{{checkTypes[row.checkType]}}</td>
                            <td>
                                <span v-for="room in row.rooms">{{room.roomNum}}</span>
                                <span style="color: #178ce6; cursor: pointer;" @click="arrangeHouse($event, item, index)">排房</span>
                            </td>
                            <td>{{row.startTime}}~{{row.endTime}} 共{{row.night}}晚</td>
                            <td><span>已预定</span></td>
                            <td v-if="index === 0" :rowspan="item.roomTypes.length" :class="{leftBorder: item.roomTypes.length !== 1}">{{item.customerName}}</td>
                            <td v-if="index === 0" :rowspan="item.roomTypes.length" :class="{rightBorder: item.roomTypes.length !== 1}">{{item.customerPhone}}</td>
                            <td style="color: #178ce6; cursor: pointer;"><span @click="showOrder(item)">详情</span>/<span>入住</span></td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="selectable-house" ref="selectableHouse">
                
            </div>
        </div>
    </div>
</template>

<script>
    import dayOrderLeft from '../components/dayOrderLeft.vue';
    import DateSelect from '../components/DateSelect.vue';
    import http from '../../common/http';
    import bus from '../../common/eventBus';

    export default {
        data() {
            return {
                defaultStartDate: undefined,
                date: new Date(),
                orderLists: [],
                checkTypes: ['正常入住', '钟点房', '自用房', '免费房']
            };
        },
        components: {
            dayOrderLeft,
            DateSelect
        },
        methods: {
            changeDate(date) {
                this.date = date;
            },
            getLists() {
                http.get('/room/getBookListByDate', { date: this.date }).then(res => {
                    if (res.code === 1) {
                        this.orderLists = res.data.list;
                    }
                });
            },
            showOrder(item) {
                bus.$emit('onShowDetail', {
                    type: item.orderType,
                    orderId: item.orderType === -1 ? item.orderId : item.roomOrderId
                });
            },
            arrangeHouse(event, item, index) {
                http.get('/room/getSelectRoomList', { checkType: item.roomTypes[index].checkType, date: this.date, endTime: item.roomTypes[index].endTime, orderId: item.orderId, orderType: item.orderType, startTime: item.roomTypes[index].startTime, typeId: item.roomTypes[index].typeId }).then(res => {
                    console.log(res);
                });
                console.log(event);
                this.$refs.selectableHouse.style.top = event.y + 'px';
            }
        },
        watch: {
            date() {
                this.getLists();
            }
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .content{
        flex: 1;
        padding: 50px 0 0 30px;
        position: relative;
        .table-content{
            table{
                border: 1px solid #ccc;
            }
            tr{
                height: 50px;
                td{
                    border-top: 1px solid #ccc;
                    &.leftBorder{
                        border-left: 1px solid #ccc;
                    }
                    &.rightBorder{
                        border-right: 1px solid #ccc;
                    }
                }
            }
            .tbody-item{
                margin-top: 20px;
            }
        }
        .selectable-house{
            width: 1200px;
            height: 60px;
            position: absolute;
            border: 1px solid green;
            &:after, &:before{
                bottom: 100%;
                left: 50%;
                border: solid transparent;
                content: '';
                height: 0;
                width: 0;
                position: absolute;
                pointer-events: none;
            }
            &:after{
                border-color: rgba(214, 240, 238, 0);
                border-bottom-color: #fff;
                border-width: 10px;
                margin-left: -10px;
            }
            &:before{
                border-color: rgba(214, 240, 238, 0);
                border-bottom-color: green;
                border-width: 13px;
                margin-left: -13px;
            }
        }
    }
</style>
