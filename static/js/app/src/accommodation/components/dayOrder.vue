<template>
    <div class="taday-calendar">
        <div class="taday-calendar-picker">
            <DateSelect  :defaultDate="defaultStartDate" @change='changeDate' />
            <RoomFilter @change="handleRoomFilter" :categories="categories" />
        </div>
        <div class="taday-calendar-body">
            <div class="taday-calendar-status-list" @scroll="handleStatusScroll">
                <div class="taday-status-box" v-for='item in finalRoomStatus'>
                    <div class="taday-status-title">{{item.zoneName}}</div>
                    <div class="taday-status-content">
                        <div class="taday-status-item" v-for='it in item.roomList' @contextmenu.prevent="$refs.ctxMenu.open($event, {data: it})" :style="{background:colorList[it.roomState]}">
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
                <!--             <table class="calendar-status-table">
                    <tbody>
                        <template v-for="room in finalRoomStatus">
                            <tr class="calendar-status-row" v-if="room.selected && !room.folded">
                                <td class="calendar-status" v-for="(status, index) in room.st" :key="room.i + status.dateStr" :room="room.i" :date="status.dateStr" @contextmenu.prevent="$refs.ctxMenu.open($event, {data: room, index: index})">
                                    <div v-if="status.s !== 100" class="day-calendar-status-inner" :key="room.i + status.dateStr" :class="{'selected': status.selected}" @click="selectStatus(status)">
                                        <div class="calendar-status-info">
                                            <div class="calendar-status-date">{{dateRange[index].dateStr}}</div>
                                            <div class="calendar-status-price">￥{{status.p}}</div>
                                            <div class="calendar-status-name">{{room.sn}}({{room.cName}})</div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table> -->
            </div>
        </div>
        <contextmenu id="context-menu" ref="ctxMenu" class="taday-calendar-status-action" @ctx-open="onCtxOpen" @ctx-cancel="resetCtxLocals" @ctx-close="onCtxClose">
            <div @click.stop="check('book')" v-if='menuData && menuData.data.roomState === 0'>
                预定
            </div>
            <div @click.stop="check('ing')" v-if='menuData && menuData.data.isArrival'>
                办理入住
            </div>
            <div @click.stop="setDetary(menuData && menuData.data.isDirty)" v-if='menuData && (menuData.data.isArrival || menuData.data.roomState === 0)'>
                转为{{(menuData && (menuData.data.isDirty || menuData.data.roomState === 12 )) ? '净' : '脏'}}房
            </div>
            <div @click.stop="openForm(1,1)" v-if='menuData && menuData.data.roomState === 0'>
                转维修房
            </div>
            <div @click.stop="openForm(2,1)" v-if='menuData && menuData.data.roomState === 0'>
                转停用房
            </div>
            <div @click.stop="openForm(0,1)" v-if='menuData && menuData.data.roomState === 0'>
                转保留房
            </div>
            <div @click.stop="showOrder()" v-if='menuData && (menuData.data.roomState === 11 || menuData.data.roomState === 12)'>
                查看在住
            </div>
            <div @click.stop="showCheckOut()" v-if='menuData && (menuData.data.roomState === 11 || menuData.data.roomState === 12)'>
                办理退房
            </div>
            <div @click.stop="openForm(0,0)" v-if='menuData && menuData.data.roomState === 2'>
                查看维修房
            </div>
            <div @click.stop="openOrCloseStatus(2)" v-if='menuData && menuData.data.roomState === 2'>
                结束维修房
            </div>
            <div @click.stop="openForm(1,0)" v-if='menuData && menuData.data.roomState === 3'>
                查看停用房
            </div>
            <div @click.stop="openOrCloseStatus(3)" v-if='menuData && menuData.data.roomState === 3'>
                结束停用房
            </div>
            <div @click.stop="openForm(0,0)" v-if='menuData && menuData.data.roomState === 1'>
                查看保留房
            </div>
            <div @click.stop="openOrCloseStatus(1)" v-if='menuData && menuData.data.roomState === 1'>
                结束保留房
            </div>
        </contextmenu>
        <dayOrderForm :visible='dayOrderFormVisible' :formNumber='formNumber' :outOrIn='outOrIn' @close='dayOrderFormVisible = false' :date='String(date)' :room='roomdata && roomdata.data'></dayOrderForm>
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
}

.taday-calendar-body {
    flex: 1;
    padding-top: 50px;
}

.taday-status-content {
    flex: 1;
    padding: 8px;
    .taday-status-item {
        padding: 8px;
        border-radius: 4px;
        width: 108px;
        height: 66px;
        color: #ffffff;
        display: inline-block;
        margin: 4px 8px;
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
    padding: 15px;
    padding-bottom: 28px;
}

.taday-status-title {
    font-size: 24px;
    color: #178ce6;
    line-height: 24px;
    text-align: left;
}
</style>
<script>
import DateSelect from './DateSelect.vue';
import RoomFilter from './RoomFilter.vue';
import dayOrderForm from './dayOrderForm.vue';
import util from 'util';
import http from '../../common/http';
import Clickoutside from 'dd-vue-component/src/utils/clickoutside';
import bus from '../../common/eventBus';
import modal from '../../common/modal';
import {
    colorList
} from '../colorList';
import contextmenu from '../../common/components/contextmenu';
export default {
    props: {
        categories: Array,
        holidays: Array,
        roomStatus: Array,
        defaultStartDate: String,
        orderList: Array,
        startDate: Date,
        leftMap: Object,
        DAYS: Number
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
            roomdata: undefined
        };
    },
    components: {
        DateSelect,
        RoomFilter,
        dayOrderForm,
        contextmenu
    },
    computed: {
        finalRoomStatus() {
            return this.roomStatus;
            // return this.roomStatus.map(room => {
            //     const category = this.categories.find(category => category.cId === room.ti);
            //     room.selected = category.selected;
            //     room.folded = category.folded;
            //     room.cName = category.cName;
            //     return room;
            // });
        }
    },
    methods: {
        showOrder() {
            bus.$emit('onShowDetail', {
                type: this.menuData.data.roomOrderId ? 3 : -1,
                orderId: this.menuData.data.roomOrderId || this.menuData.data.orderId
            });
        },
        showCheckOut() {
            // this.showOrder().then(bus.$emit('showCheckout'));
        },
        setDetary(type) {
            http.get('/room/addRemoveDirtyRoom', {
                actionType: !type,
                roomId: this.menuData.data.roomId
            }).then(res => {
                this.$emit('add');
            });
        },
        changeDate(date) {
            this.date = date;
        },
        openForm(formNumber, outOrIn) {
            this.formNumber = formNumber;
            this.outOrIn = outOrIn;
            this.dayOrderFormVisible = true;
        },
        check(type) {
            const temp = [];
            temp.push({
                roomId: this.menuData.data.roomId,
                startDate: this.date,
                endDate: this.date,
                categoryType: this.menuData.data.cId
            });
            bus.$emit('changeCheckState', type, temp);
        },
        onCtxOpen(locals) {
            this.menuData = locals;
            this.roomdata = JSON.parse(JSON.stringify(locals));
        },
        onCtxClose(locals) {
            window.console.log('close', locals);
        },
        resetCtxLocals() {
            this.menuData = undefined;
        },

        handleStatusScroll(ev) {
            if (!this.scrollTicking) {
                // this.$refs.calendarLeftHeader.scrollTop = ev.target.scrollTop;
                // this.$refs.calendarHeader.scrollLeft = ev.target.scrollLeft;
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
                this.$emit('add');
            });
        }

    }
};
</script>
