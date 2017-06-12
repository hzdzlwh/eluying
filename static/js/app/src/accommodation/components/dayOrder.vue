<template>
    <div class="taday-calendar">
        <div class="taday-calendar-picker">
            <DateSelect :defaultDate="defaultStartDate" @change='changeDate' :width='185' :disabledDate='true' />
            <roomFilter :categories='categories' :customList='customList' :areaList='areaList' @change='roomFilterHander' :roomTypeCount='roomTypeCount'></roomFilter>
        </div>
        <div class="taday-calendar-body">
            <div class="taday-calendar-status-list">
                <div class="taday-status-box" v-for='(item, contentIndex) in finalRoomStatus'>
                    <div class="taday-status-title">{{item.zoneName}}</div>
                    <div class="taday-status-content">
                        <div class="taday-status-item" v-for='(it, itemIndex) in item.roomList' @contextmenu.prevent="$refs.ctxMenu.open($event, {data: it})" @click='setSelect(it, contentIndex, itemIndex)' :style="{background:colorList[it.roomState]}" @mouseenter="hoverShow($event, it)" @mouseleave="it.hover = false">
                            <hover :date='it' :hoverShow='hoverEvent' class='calendar-glyph-hover' v-if='it.checkInDate'></hover>
                            <div class="taday-status-item-select" v-if='it.isSelect'></div>
                            <div class="taday-status-item-title" :title='it.roomName'>
                                {{it.roomName}}
                            </div>
                            <div class="taday-status-item-name" :title='it.customerName'>{{it.customerName}}</div>
                            <div style='display:inline-block'>
                                <div class="taday-status-item-tag taday-status-item-dirty" v-if='it.isDirty'>脏房</div>
                                <div class="taday-status-item-tag taday-status-item-arrival" v-if='it.isArrival'>预抵</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <contextmenu id="context-menu" ref="ctxMenu" class="taday-calendar-status-action" @ctx-open="onCtxOpen" @ctx-cancel="resetCtxLocals" @ctx-close="onCtxClose">
            <div @click.stop="check('book')" v-if='menuData && !menuData.data.isArrival && (menuData.data.roomState === 0 || menuData.data.roomState === 12)'>
                预定
            </div>
            <div @click.stop="showOrder()" v-if='menuData && menuData.data.isArrival === 1'>
                查看预定
            </div>
            <div @click.stop="showOrder()" v-if='menuData && (menuData.data.roomState === 11  && menuData.data.roomState !== 12)'>
                查看在住
            </div>
            <div @click.stop="check('ing')" v-if='menuData && !menuData.data.isArrival && (menuData.data.roomState === 0 || menuData.data.roomState === 12) && isTaday'>
                直接入住
            </div>
            <div @click.stop="showCheckIn()" v-if='menuData && menuData.data.isArrival '>
                办理入住
            </div>
            <div @click.stop="showCheckOut()" v-if='menuData && (menuData.data.roomState === 11 )'>
                办理退房
            </div>
            <div @click.stop="setDetary(menuData && menuData.data.isDirty)" v-if='menuData && (menuData.data.roomState !== 1 || menuData.data.roomState !== 2 || menuData.data.roomState !== 3 )'>
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
    </div>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
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

.taday-calendar-picker {
    position: relative;
    top: 48px;
    box-shadow:2px 2px 4px 0px rgba(0,0,0,0.15);
}

.taday-calendar-body {
    flex: 1;
    padding-top: 50px;
}

.taday-status-content {
    flex: 1;
    margin: 0 -4px;
    .taday-status-item {
        padding: 8px;
        border-radius: 4px;
        width: 124px;
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
        .taday-status-item-title {
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 14px;
            line-height: 14px;
            text-align: left;
            font-weight: bold;
        }
        .taday-status-item-name {
            width: 100%;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 12px;
            line-height: 12px;
            text-align: left;
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
    width: 108px;
    height: 66px;
    margin: -8px;
    position: absolute;
    background-repeat: no-repeat;
    background-position: center;
    border: 2px solid #178ce6;
    border-radius: 4px;
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
}

.taday-status-title {
    font-size: 24px;
    color: #178ce6;
    line-height: 24px;
    text-align: left;
    margin-bottom:16px;
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
import {
    colorList
} from '../colorList';
import contextmenu from '../../common/components/contextmenu';
import {
    mapActions
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
            hoverEvent: undefined
        };
    },
    components: {
        DateSelect,
        roomFilter,
        dayOrderForm,
        contextmenu,
        hover
    },
    created() {
        bus.$on('refreshView', this.refreshView);
    },
    beforeDestroy() {
        bus.$off('refreshView', this.refreshView);
    },
    computed: {
        finalRoomStatus() {
            return this.roomStatus;
        },
        isTaday() {
            return util.isSameDay(new Date(), new Date(this.date));
        }
    },
    methods: {
        ...mapActions([type.LOAD_ROOM_BUSINESS_INFO_DAYORDER, type.GET_ORDER_DETAIL]),
        hoverShow(e, it) {
            this.hoverEvent = e;
            it.hover = true;
        },
        tadayClick(it) {
            this.menuData = {
                data: it
            };
            switch (it.roomState) {
                case 11:
                    this.showOrder();
                    break;
                case 12:
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
            if (it.isArrival) {
                this.showOrder();
            }
        },
        roomFilterHander(parms) {
            bus.$emit('refreshView', parms);
        },
        closeDayForm() {
            this.dayOrderFormVisible = false;
        },
        refreshView() {
            this.selectRooms = {};
        },
        setSelect(it, contentIndex, itemIndex) {
            if ((it.roomState !== 0 && it.roomState !== 12) || it.isArrival) {
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
                        cName: this.selectRooms[item].roomName.split(' ')[0],
                        rName: this.selectRooms[item].roomName.split(' ')[1],
                        selected: true
                    });
                }
            }

            this.$emit('changeEnter', temp);
        },
        showOrder() {
            bus.$emit('onShowDetail', {
                type: this.menuData.data.roomOrderId ? 3 : -1,
                orderId: this.menuData.data.roomOrderId || this.menuData.data.orderId
            });
        },
        showCheckOut(types) {
            // const handel = this.hideCheckout;
            this[type.GET_ORDER_DETAIL]({
                orderId: this.menuData.data.roomOrderId ? this.menuData.data.roomOrderId : this.menuData.data.orderId,
                orderType: this.menuData.data.roomOrderId ? 3 : -1
            }).then(
                this[type.LOAD_ROOM_BUSINESS_INFO_DAYORDER]({
                    businessType: 2,
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
                orderId: this.menuData.data.roomOrderId ? this.menuData.data.roomOrderId : this.menuData.data.orderId,
                orderType: this.menuData.data.roomOrderId ? 3 : -1
            }).then(
                this[type.LOAD_ROOM_BUSINESS_INFO_DAYORDER]({
                    businessType: 0,
                    orderId: this.menuData.data.orderId
                }).then(

                    $('#checkIn').modal({
                        backdrop: 'static'
                    }),
                    bus.$emit('changeOutOrInSelect', this.menuData.data.roomId),
                )
            );
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
            this.formNumber = formNumber;
            this.outOrIn = outOrIn;
            this.dayOrderFormVisible = true;
        },
        check(type) {
            const temp = [];
            temp.push({
                id: this.menuData.data.roomId,
                date: new Date(this.date),
                cId: this.menuData.data.typeId,
                cName: this.menuData.data.roomName.split(' ')[0],
                rName: this.menuData.data.roomName.split(' ')[1],
                selected: true
            });
            bus.$emit('changeCheckState', type, this.getRoomsWithDate(temp));
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
                this.$emit('refreshView');
            });
        }

    }
};
</script>
