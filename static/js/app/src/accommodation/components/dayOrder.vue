<template>
    <div class="taday-calendar" :class='{haveRoomOutTip: this.$store.state.orderSystem.roomTipStatus.show}'>
        <div class="taday-calendar-picker">
            <dayOrderLeft>
                <DateSelect slot="timePicker" :defaultDate="defaultStartDate" @change='changeDate' :width='185' :disabledDate='true' />
                <roomFilter slot="filterCondition" v-if="$route.path === '/nowOrders/houseMap'" :categories='categories' :customList='customList' :areaList='areaList' @change='roomFilterHander' :roomTypeCount='roomTypeCount'></roomFilter>
            </dayOrderLeft>
        </div>
        <div class="taday-calendar-body">
            <div class="taday-calendar-status-list">
                <div class="taday-status-box" v-for='(item, contentIndex) in finalRoomStatus'>
                    <div class="taday-status-title">{{item.zoneName}}</div>
                    <div class="taday-status-content">
                        <div class="taday-status-item" v-for='(it, itemIndex) in item.roomList' @contextmenu.prevent="$refs.ctxMenu.open($event, {data: it})" @click='setSelect(it, contentIndex, itemIndex)' :style="{background:colorList[it.roomState]}" @mouseenter="hoverShow($event, it)" @mouseleave="it.hover = false">
                            <div class="taday-status-mark" v-if='it.roomState === 1 || it.roomState === 2 ||it.roomState === 3 '>
                                {{it.roomState === 1 ? '保留': it.roomState === 2 ? '维修' : '停用'}}
                            </div>
                            <hover :date='it' :hoverShow='hoverEvent' class='calendar-glyph-hover' v-if='it.eventList && it.eventList.length'></hover>
                            <div class="taday-status-item-select" v-if='it.isSelect'></div>
                            <div class="taday-status-item-title" :title='it.roomName + it.roomNum'>
                                <div class="taday-status-item-title2">{{it.roomName}}</div>
                                <div class="taday-status-item-title3">{{it.roomNum}}</div>
                            </div>
                            <div class="taday-status-item-name" :title='it.customerName'>{{it.customerName}}</div>
                            <div style='display:inline-block'>
                                <div class="taday-status-item-tag taday-status-item-dirty" v-if='it.isDirty'>脏房</div>
                                <div class="taday-status-item-tag taday-status-item-arrival" v-if='it.isArrival'>预抵</div>
                            </div>
                            <div v-if='it.checkType !== null' class="taday-status-roomCheckType">{{getCheckType(it.checkType)}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <contextmenu id="context-menu" ref="ctxMenu" class="taday-calendar-status-action" :class='{ctxBottom: ctxStatus === "buttom"}' @ctx-open="onCtxOpen" @ctx-cancel="resetCtxLocals" @ctx-close="onCtxClose">
            <div @click.stop="check('book')" v-if='menuData && !menuData.data.isArrival && (menuData.data.roomState === 0 || menuData.data.roomState === 12)'>
                预订
            </div>
            <div @click.stop="showOrder('reserve')" v-if='menuData && menuData.data.isArrival === 1'>
                查看预订
            </div>
            <div @click.stop="showOrder()" v-if='menuData && (menuData.data.roomState === 11 || menuData.data.roomState === 12)'>
                查看在住
            </div>
            <div @click.stop="check('ing')" v-if='menuData && !menuData.data.isArrival && (menuData.data.roomState === 0 ) && isTaday'>
                直接入住
            </div>
            <div @click.stop="showCheckIn()" v-if='menuData && menuData.data.isArrival && menuData.data.roomState !==12'>
                办理入住
            </div>
            <div @click.stop="showCheckOut()" v-if='menuData && (menuData.data.roomState === 11 || menuData.data.roomState === 12)'>
                办理退房
            </div>
            <div @click.stop="setDetary(menuData && menuData.data.isDirty)" v-if='menuData && (menuData.data.roomState !== 1 && menuData.data.roomState !== 2 && menuData.data.roomState !== 3 )'>
                转为{{(menuData && menuData.data.isDirty) ? '净' : '脏'}}房
            </div>
            <div @click.stop="openForm(1,1)" v-if='menuData && menuData.data.roomState === 0 && menuData.data.isArrival === 0'>
                转维修房
            </div>
            <div @click.stop="openForm(2,1)" v-if='menuData && menuData.data.roomState === 0 && menuData.data.isArrival === 0'>
                转停用房
            </div>
            <div @click.stop="openForm(0,1)" v-if='menuData && menuData.data.roomState === 0 && menuData.data.isArrival === 0'>
                转保留房
            </div>
            <div @click.stop="openForm(1,0)" v-if='menuData && menuData.data.hasRepair === 1'>
                查看维修房
            </div>
            <div @click.stop="openOrCloseStatus(2)" v-if='menuData && menuData.data.roomState === 2'>
                结束维修房
            </div>
            <div @click.stop="openForm(2,0)" v-if='menuData && menuData.data.hasBlockUp === 1'>
                查看停用房
            </div>
            <div @click.stop="openOrCloseStatus(3)" v-if='menuData && menuData.data.roomState === 3'>
                结束停用房
            </div>
            <div @click.stop="openForm(0,0)" v-if='menuData && menuData.data.hasPersist === 1'>
                查看保留房
            </div>
            <div @click.stop="openOrCloseStatus(1)" v-if='menuData && menuData.data.roomState === 1'>
                结束保留房
            </div>
        </contextmenu>
        <dayOrderForm :visible='dayOrderFormVisible' :formNumber='formNumber' :outOrIn='outOrIn' @close='closeDayForm' :date='String(date)' :room='roomdata'></dayOrderForm>
        <div class="datFixMenu"><span @click="check('team')">团队<br/>预订</span><span @click="check('quick')">快速<br/>预订</span></div>
    </div>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
.haveRoomOutTip{
    .taday-calendar-picker, .taday-calendar-header{
        top:72px;
    }
    .taday-calendar-body{
        top:152px;
    }
}
.datFixMenu{
    position:fixed;
    bottom:100px;
    right:100px;
}
.taday-calendar {
    display: flex;
    flex-flow: row;
}

.taday-calendar-status-list {
    margin: 16px;
}

.taday-calendar-status-action {
    div {
        background: #fafafa;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
        text-align: center;
        line-height: 32px;
        z-index: 1;
        cursor: pointer;
        &:hover {
            background: #e4f3ff;
        }
    }
}

.taday-status-mark {
    position: absolute;
    top: 40px;
    left: 60px;
    opacity: 0.2;
    font-size: 30px;
}

.taday-calendar-picker {
    position: relative;
    top: 48px;
    box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.15);
}

.taday-calendar-body {
    flex: 1;
    padding-top: 50px;
}

.taday-status-content {
    flex: 1;
    margin: 0 -4px;
    .taday-status-item {
        padding: 4px 8px;
        border-radius: 4px;
        width: 130px;
        height: 82px;
        color: #ffffff;
        display: inline-block;
        margin: 4px 4px;
        position: relative;
        &:hover {
            .calendar-glyph-hover {
                display: block;
                position: absolute;
            }
        }
        .taday-status-item-title2 {
            display: inline-block;
            width: 70px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 14px;
            text-align: left;
            font-weight: bold;
            float: left;
        }
        .taday-status-item-title3 {
            display: inline-block;
            font-size: 14px;
            text-align: right;
            font-weight: bold;
            width: 40px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            float:right;
        }
        .taday-status-item-name {
            width: 100%;
            display: inline-table;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 12px;
            text-align: left;
        }
        .taday-status-roomCheckType{
            position: absolute;
            background: rgba(255, 255, 255, 0.23);
            height: 16px;
            width: 130px;
            left: 0;
            bottom: 4px;
            font-size: 12px;
            padding-left: 8px;
        }
        .taday-status-item-tag {
            display: inline;
            font-size: 12px;
            line-height: 12px;
            text-align: left;
            padding: 2px;
            border-radius: 2px;
        }
        .taday-status-item-dirty {
            background-color: #907154;
        }
        .taday-status-item-arrival {
            background-color: #F29130;
        }
    }
}

.taday-status-item-select {
    background: url(/static/image/modal/roomSelect.png);
    background-color: rgba(255, 255, 255, 0.4);
    width: 100%;
    height: 100%;
    margin: -8px;
    position: absolute;
    background-repeat: no-repeat;
    background-position: center;
    border: 2px solid #178ce6;
    border-radius: 4px;
    top:8px;
}

.day-calendar-status-inner {
    width: 96px;
    height: 44px;
    margin: auto;
    margin-top: 2px;
    font-size: 12px;
    position: relative;
    line-height: 48px;
    text-align: center;
    border: 1px solid #178ce6;
    cursor: pointer;
}

.taday-status-box {
    box-shadow: 0px 0px 4px 4px rgba(0, 0, 0, 0.10);
    background: #fafafa;
    border-radius: 16px;
    padding: 16px;
    cursor: pointer;
    margin-bottom:20px;
}
.datFixMenu span{
    width: 56px;
    height: 56px;
    line-height: 24px;
    background-color: #ff9326;
    display: inline-block;
    border-radius: 28px;
    text-align: center;
    margin-right: 10px;
    cursor: pointer;
    color: #fff;
    font-size: 16px;
    padding-top: 4px;
    font-weight:300;
}
.taday-status-title {
    font-size: 24px;
    color: #178ce6;
    line-height: 24px;
    text-align: left;
    margin-bottom: 16px;
}
</style>
<script>
import DateSelect from './DateSelect.vue';
import roomFilter from './filter.vue';
import dayOrderForm from './dayOrderForm.vue';
import hover from './hover.vue';
import util from 'util';
import http from '../../common/http';
import bus from '../../common/eventBus';
import type from '../../common/orderSystem/store/types';
import { roomCheckType } from '../../common/orderSystem/roomCheckType.js';
import {
    colorList
} from '../colorList';
import contextmenu from '../../common/components/contextmenu';
import dayOrderLeft from './dayOrderLeft';
import {
    mapActions,
    mapState
} from 'vuex';
export default {
    props: {
        categories: Array,
        holidays: Array,
        roomStatus: Array,
        defaultStartDate: String,
        orderList: Array,
        startDate: Date,
        leftMap: Object,
        DAYS: Number,
        customList: Array,
        areaList: Array,
        roomTypeCount: Object
    },
    data() {
        return {
            checkType: roomCheckType,
            scrollTicking: false,
            lastScrollTop: 0,
            lastScrollLeft: 0,
            currentAction: undefined,
            isDrag: false,
            menuData: undefined,
            dayOrderFormVisible: false,
            formNumber: 0,
            outOrIn: 0,
            colorList,
            date: new Date(),
            roomdata: undefined,
            selectRooms: {},
            hoverEvent: undefined,
            ctxStatus: undefined
        };
    },
    components: {
        DateSelect,
        roomFilter,
        dayOrderForm,
        contextmenu,
        hover,
        dayOrderLeft
    },
    created() {
        bus.$on('refreshView', this.refreshView);
        bus.$on('tadayClick', this.tadayClick);
    },
    beforeDestroy() {
        bus.$off('refreshView', this.refreshView);
        bus.$off('tadayClick', this.tadayClick);
    },
    computed: {
        finalRoomStatus() {
            return this.roomStatus;
        },
        isTaday() {
            return util.isSameDay(new Date(), new Date(this.date));
        },
        ...mapState({ order: state => state.orderSystem.orderDetail })
    },
    methods: {
        ...mapActions([type.LOAD_ROOM_BUSINESS_INFO_DAYORDER, type.GET_ORDER_DETAIL, type.LOAD_ROOMTIP]),
        hoverShow(e, it) {
            this.hoverEvent = e;
            it.hover = true;
        },
        tadayClick(it) {
            this.menuData = {
                data: it
            };
            if (it.isArrival) {
                this.showOrder('reserve');
            }
            switch (it.roomState) {
                case 11:
                    this.showOrder();
                    break;
                case 12:
                    this.showOrder();
                    break;
                case 13:
                    this.showOrder();
                    break;
                case 2:
                    this.openForm(1, 0);
                    break;
                case 3:
                    this.openForm(2, 0);
                    break;
                case 1:
                    this.openForm(0, 0);
                    break;
            }
        },
        getCheckType(val) {
            return this.checkType.find(el => el.id === val).name;
        },
        roomFilterHander(parms) {
            bus.$emit('refreshView', parms);
            // this[type.LOAD_ROOMTIP]();
        },
        closeDayForm() {
            this.dayOrderFormVisible = false;
        },
        refreshView() {
            this.selectRooms = {};
        },
        setSelect(it, contentIndex, itemIndex) {
            if (it.roomState !== 0 || it.isArrival) {
                this.tadayClick(it);
                return;
            }
            // const element = this.finalRoomStatus[contentIndex].roomList[itemIndex];
            this.$set(it, 'isSelect', !(it.isSelect));
            if (it.isSelect) {
                this.$set(this.selectRooms, it.roomId, it);
            } else {
                this.$delete(this.selectRooms, it.roomId);
            }
            const temp = [];
            for (const item in this.selectRooms) {
                if (this.selectRooms.hasOwnProperty(item)) {
                    temp.push({
                        id: this.selectRooms[item].roomId,
                        date: new Date(this.date),
                        cId: this.selectRooms[item].typeId,
                        cName: this.selectRooms[item].roomName,
                        rName: this.selectRooms[item].roomNum,
                        selected: true
                    });
                }
            }

            this.$emit('changeEnter', temp);
        },
        showOrder(type) {
            if (type === 'reserve') {
                bus.$emit('onShowDetail', {
                    type: this.menuData.data.reserveRoomOrderId ? 3 : -1,
                    orderId: this.menuData.data.reserveRoomOrderId || this.menuData.data.reserveOrderId
                });
            } else {
                bus.$emit('onShowDetail', {
                    type: this.menuData.data.roomOrderId ? 3 : -1,
                    orderId: this.menuData.data.roomOrderId || this.menuData.data.orderId
                });
            }
        },
        showCheckOut(types) {
            // const handel = this.hideCheckout;
            this[type.GET_ORDER_DETAIL]({
                orderId: this.menuData.data.roomOrderId ? this.menuData.data.roomOrderId : this.menuData.data.orderId,
                orderType: this.menuData.data.roomOrderId ? 3 : -1
            }).then(
                this[type.LOAD_ROOM_BUSINESS_INFO_DAYORDER]({
                    businessType: (this.menuData.data.roomState === 12 || this.menuData.data.checkType === 1) ? 1 : 2,
                    orderId: this.menuData.data.orderId
                }).then(
                    $('#checkOut').modal({
                        backdrop: 'static'
                    })
                )
            );
        },
        showCheckIn(types) {
            // const handel = this.hideCheckout;
            this[type.GET_ORDER_DETAIL]({
                orderId: this.menuData.data.reserveRoomOrderId ? this.menuData.data.reserveRoomOrderId : this.menuData.data.reserveOrderId,
                orderType: this.menuData.data.reserveRoomOrderId ? 3 : -1
            }).then(
                res => this[type.LOAD_ROOM_BUSINESS_INFO_DAYORDER]({
                    businessType: 0,
                    orderId: this.menuData.data.reserveOrderId
                })
            ).then(res => {
                bus.$emit('editOrder', 'checkIn', this.order);
            });
        },
        hideCheckout() {
            $('#checkOut').modal('hide');
        },
        setDetary(type) {
            http.get('/room/addRemoveDirtyRoom', {
                actionType: !type,
                roomId: this.menuData.data.roomId
            }).then(res => {
                bus.$emit('refreshView');
            });
        },
        changeDate(date) {
            this.date = date;
            this.$emit('changeDate', new Date(date));
        },
        openForm(formNumber, outOrIn) {
            this.roomdata = JSON.parse(JSON.stringify(this.menuData.data));
            this.roomdata.dateStr = this.date;
            this.formNumber = formNumber;
            this.outOrIn = outOrIn;
            this.dayOrderFormVisible = true;
        },
        check(type) {
            const temp = [];
            if (type === 'team' || type === 'quick') {
                bus.$emit('changeCheckState', type, []);
            } else {
                temp.push({
                    id: this.menuData.data.roomId,
                    date: new Date(this.date),
                    cId: this.menuData.data.typeId,
                    cName: this.menuData.data.roomName,
                    rName: this.menuData.data.roomNum,
                    selected: true
                });
                bus.$emit('changeCheckState', type, this.getRoomsWithDate(temp));
            }
        },
        getRoomsWithDate(data) {
            const temp = [];
            data.map(e => {
                if (!e.selected) {
                    return false;
                }

                if (temp.length === 0) {
                    temp.push({
                        roomId: e.id,
                        startDate: e.date,
                        endDate: e.date,
                        categoryType: e.cId
                    });
                } else {
                    const lastItem = temp[temp.length - 1];
                    // 将时间连续的房子放到一起
                    if (e.id === lastItem.roomId && util.DateDiff(lastItem.endDate, e.date) === 1) {
                        lastItem.endDate = e.date;
                    } else {
                        temp.push({
                            roomId: e.id,
                            startDate: e.date,
                            endDate: e.date,
                            categoryType: e.cId
                        });
                    }
                }
            });
            return temp;
        },
        onCtxOpen(locals) {
            this.menuData = locals;
            const elHeight = $('#context-menu .ctx-menu').offsetHeight;
            if (window.document.body.clientHeight - event.x < elHeight + 50) {
                this.ctxStatus = elHeight;
            }
        },
        onCtxClose(locals) {
            window.console.log('close', locals);
        },
        resetCtxLocals() {
            this.menuData = undefined;
        },

        handleStatusScroll(ev) {
            if (!this.scrollTicking) {
                window.requestAnimationFrame(() => {
                    this.scrollTicking = false;
                });
            }

            this.scrollTicking = true;
        },
        handleDateChange(date) {
            this.$emit('dateChange', date);
        },
        handleRoomFilter(data) {
            this.$emit('roomFilterChange', data);
        },
        openOrCloseStatus(type) {
            http.get('/room/endStopInfo', {
                type: type,
                roomId: this.menuData.data.roomId
            }).then(res => {
                bus.$emit('refreshView');
            });
        }

    }
};
</script>
