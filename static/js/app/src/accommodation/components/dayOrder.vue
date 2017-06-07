<template>
    <div class="calendar">
        <div class="legend-box">
            <span class="room-legend">
                <span class="room-legend-icon blue"></span>
            <span>已入住</span>
            </span>
            <span class="room-legend">
                <span class="room-legend-icon red"></span>
            <span>已预订</span>
            </span>
            <span class="room-legend">
                <span class="room-legend-icon grey"></span>
            <span>已退房、已关闭</span>
            </span>
            <span class="room-legend">
                <span class="dirty"></span>
            <span>脏房</span>
            </span>
        </div>
        <div class="calendar-picker">
            <DateSelect @change="handleDateChange" :defaultDate="defaultStartDate" />
            <RoomFilter @change="handleRoomFilter" :categories="categories" />
        </div>
        <div class="calendar-body">
            <div class="calendar-status-list" @scroll="handleStatusScroll">
                <table class="calendar-status-table">
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
                </table>
            </div>
        </div>
        <contextmenu id="context-menu" ref="ctxMenu" class="calendar-status-action" @ctx-open="onCtxOpen" @ctx-cancel="resetCtxLocals" @ctx-close="onCtxClose">
            <div @click.stop="check('book')">
                预定
            </div>
            <div @click.stop="check('ing')">
                办理入住
            </div>
            <div @click.stop="openOrCloseStatus()">
                转为房
            </div>
            <div @click.stop="openForm(0,1)">
                转维修房
            </div>
            <div @click.stop="openForm(2,1)">
                转停用房
            </div>
            <div @click.stop="openForm(1,1)">
                转保留房
            </div>
            <div @click.stop="openOrCloseStatus()">
                查看在住
            </div>
            <div @click.stop="openOrCloseStatus()">
                办理退房
            </div>
            <div @click.stop="openForm(0,0)">
                查看维修房
            </div>
            <div @click.stop="openOrCloseStatus()">
                结束维修房
            </div>
            <div @click.stop="openForm(2,0)">
                查看停用房
            </div>
            <div @click.stop="openOrCloseStatus()">
                结束停用房
            </div>
            <div @click.stop="openForm(1,0)">
                查看保留房
            </div>
            <div @click.stop="openOrCloseStatus()">
                结束保留房
            </div>
        </contextmenu>
         <dayOrderForm :visible='dayOrderFormVisible' :formNumber='formNumber' :outOrIn='outOrIn' @close='dayOrderFormVisible = false'></dayOrderForm>
    </div>
   
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
.calendar-status-action {
    height: auto;
    div {
        border-bottom: 1px solid #000;
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
            outOrIn: 0
        };
    },
    components: {
        DateSelect,
        RoomFilter,
        dayOrderForm,
        contextmenu
    },
    computed: {
        dateRange() {
            const arr = [];
            const startDate = this.startDate;
            for (let i = 0; i < this.DAYS; i ++) {
                const date = util.diffDate(startDate, i);
                const holiday = this.holidays.find(d => d.date === util.dateFormat(date));
                const isToday = util.isSameDay(date, new Date());

                let left = 0;
                this.categories.map(c => {
                    if (!this.leftMap[c.cId] || !c.selected) {
                        return false;
                    }

                    left += this.leftMap[c.cId][i];
                });

                arr.push({
                    date: util.dateFormat(date),
                    isToday,
                    holiday,
                    left,
                    dateStr: holiday && holiday.type === 0 ? holiday.holiday : (isToday ? '今天' : util.dateFormatWithoutYear(date)),
                    weekday: util.getWeek(date)
                });
            }

            return arr;
        },
        finalRoomStatus() {
            return this.roomStatus.map(room => {
                const category = this.categories.find(category => category.cId === room.ti);
                room.selected = category.selected;
                room.folded = category.folded;
                room.cName = category.cName;
                return room;
            });
        },
        roomIndexMap() {
            // 房间的顺序，用于计算订单图元的位置
            const map = {};
            let index = 0;
            this.categories.map(c => {
                // 过滤未选中的房间
                if (!c.rooms || !c.selected) {
                    return false;
                }

                //  折叠的房间占一行
                if (c.folded) {
                    index ++;
                    return false;
                }

                c.rooms.map(r => {
                    map[r.i] = index ++;
                });
            });
            return map;
        },
        glyphs() {
            // 生成订单图元
            const glyphs = [];
            const GRID_WIDTH = 100;
            const GRID_HEIGHT = 48;
            const startDate = this.startDate;
            this.orderList.map(order => {
                // 过滤未选中的房型
                const category = this.categories.find(category => category.cId === order.id);
                if (!category.selected || category.folded) {
                    return false;
                }

                // seeStart用于标志订单开始时间是否在查看日期范围内
                let checkInDate = new Date(order.checkInDate);
                let seeStart = true;
                if (checkInDate < startDate && !util.isSameDay(checkInDate, startDate)) {
                    checkInDate = startDate;
                    seeStart = false;
                }

                let checkOutDate = new Date(order.checkOutDate);
                let seeEnd = true;
                if (checkOutDate > util.diffDate(startDate, this.DAYS)) {
                    checkOutDate = util.diffDate(startDate, this.DAYS);
                    seeEnd = false;
                }

                let diff = util.DateDiff(checkInDate, checkOutDate);
                if (diff === 0) {
                    diff = 1;
                }

                const startDiff = util.DateDiff(startDate, checkInDate);
                const room = this.roomIndexMap[order.accommodationId];
                const top = GRID_HEIGHT * room + 2;
                const left = GRID_WIDTH * startDiff + 2;
                const width = GRID_WIDTH * diff - 4;
                const glyph = { ...order
                };
                glyph.top = top;
                glyph.left = left;
                glyph.width = width;
                glyph.checkInDateShort = order.checkInDate.substr(5, 5);
                glyph.checkOutDateShort = order.checkOutDate.substr(5, 5);
                glyph.seeStart = seeStart;
                glyph.draggable = seeStart && seeEnd;
                glyphs.push(glyph);
            });
            return glyphs;
        }
    },
    methods: {
        openForm(formNumber, outOrIn) {
            this.formNumber = formNumber;
            this.outOrIn = outOrIn;
            this.dayOrderFormVisible = true;
        },
        check(type) {
            const temp = [];
            temp.push({
                roomId: this.menuData.data.id,
                startDate: this.menuData.data.date,
                endDate: this.menuData.data.date,
                categoryType: this.menuData.data.cId
            });
            bus.$emit('changeCheckState', type, temp);
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
        fold(c) {
            this.$emit('fold', c.cId);
        },
        selectStatus(status) {
            this.$set(status, 'selected', !status.selected);
        },
        toggleStatus(status) {
            status.actionVisible = true;
        },
        openOrCloseStatus(room, status) {
            return;
            // http.get('modifyRoomStatusUrl', {
            //     isAll: false,
            //     dateList: JSON.stringify([util.dateFormat(status.date)]),
            //     open: status.s === 100 ? 1 : 0,
            //     roomId: room.i
            // }).then(
            //         result => {
            //             status.s = status.s === 100 ? -1 : 100;
            //             // 修改库存
            //             const index = util.DateDiff(this.startDate, status.date);
            //             const oldV = this.leftMap[room.ti][index];
            //             this.$set(this.leftMap[room.ti], index, status.s === -1 ? oldV + 1 : oldV - 1);
            //             status.actionVisible = false;
            //         })
            //     .catch(() => {
            //         status.actionVisible = false;
            //     });
        },
        showOrder(room) {
            if (this.isDrag) {
                return false;
            }
            bus.$emit('onShowDetail', {
                type: room.orderType,
                orderId: room.orderType === -1 ? room.orderId : room.roomOrderId
            });
        },
        openAction(status, ev) {
            ev.preventDefault();
            this.currentAction && (this.currentAction.actionVisible = false);
            this.$set(status, 'actionVisible', true);
            this.currentAction = status;
            return false;
        },
        setDirtyRoom(room) {
            http.get('/room/addRemoveDirtyRoom', {
                actionType: !room.isDirty,
                roomId: room.i
            })
                .then(result => {
                    room.isDirty = !room.isDirty;
                });
        },
        clearAllSelected() {
            this.roomStatus.map(r => {
                r.st.map(s => {
                    if (s.selected) {
                        s.selected = false;
                    }
                });
            });
        },
        bindDragRoom() {
            const that = this;
            $(document).on('mousedown', '.calendar-glyph', function() {
                that.isDrag = false;
            });
            $(document).on('mouseover', '.calendar-glyph.draggable', function() {
                const $element = $(this);
                let startX = 0;
                let startY = 0;
                $element.data('init_draggable') || $element.data('init_draggable', true).draggable({
                    containment: '.calendar-status-table',
                    cursor: 'move',
                    addClasses: false,
                    zIndex: 1,
                    start: function(e, ui) {
                        if (!ui.helper.is('.draggable')) {
                            return false;
                        }
                        that.clearAllSelected();
                        startX = Number(ui.helper.css('left').replace(/px/, ''));
                        startY = Number(ui.helper.css('top').replace(/px/, ''));
                    },
                    drag: function() {
                        that.isDrag = true;
                    },
                    stop: function(e, ui) {
                        const box = $('.calendar-status');
                        const width = box.width() + 1;
                        const height = box.height() + 1;
                        const offsetLeft = Math.round(ui.position.left / width);
                        const offsetTop = Math.round(ui.position.top / height);
                        const originalOffsetLeft = Math.round(ui.originalPosition.left / width);
                        const originalOffsetTop = Math.round(ui.originalPosition.top / height);
                        const tr = $('.calendar-status-row').eq(offsetTop);
                        const td = tr.find('td').eq(offsetLeft);
                        const date = td.attr('date');
                        const room = td.attr('room');

                        function rest() {
                            ui.helper.css({
                                top: startY + 'px',
                                left: startX + 'px'
                            });
                            targetOrder && targetOrder.css({
                                top: targetStartY + 'px',
                                left: targetStartX + 'px'
                            });
                        }
                        if (offsetLeft === originalOffsetLeft && offsetTop === originalOffsetTop) {
                            rest();
                            return;
                        }
                        let targetOrder;
                        let targetStartX;
                        let targetStartY;
                        // 第一次先检验能否拖拽，可以的话预览，并提示确认框，不行的话重置
                        http.post('/room/dragChangeRoom', {
                            checkRoomOnly: true,
                            roomId: room,
                            startDate: date,
                            roomOrderId: ui.helper.attr('roomOrderId')
                        })
                            .then(res => {
                                $('.calendar-glyph').each(function(index, el) {
                                    if ($(el).attr('date') === date && $(el).attr('room') === room) {
                                        targetOrder = $(el);
                                    }
                                });
                                // 调换房间
                                if (targetOrder) {
                                    targetStartX = Number(targetOrder.css('left').replace(/px/, ''));
                                    targetStartY = Number(targetOrder.css('top').replace(/px/, ''));
                                    targetOrder.css({
                                        top: startY + 'px',
                                        left: startX + 'px'
                                    });
                                }
                                // 修正位置
                                ui.helper.css({
                                    top: offsetTop * height + 2 + 'px',
                                    left: offsetLeft * width + 2 + 'px'
                                });
                                modal.confirm({
                                    title: '换房',
                                    message: '确定要换房吗？'
                                },
                                    function() {
                                        http.post('/room/dragChangeRoom', {
                                            checkRoomOnly: false,
                                            roomId: room,
                                            startDate: date,
                                            roomOrderId: ui.helper.attr('roomOrderId')
                                        })
                                            .then(res => {
                                                bus.$emit('refreshView');
                                            })
                                            .catch(rest);
                                    },
                                    rest
                                );
                            })
                            .catch(rest);
                    }
                });
            });
        }
    },
    directives: {
        Clickoutside
    },
    created() {
        document.body.addEventListener('click', () => {
            this.currentAction && (this.currentAction.actionVisible = false);
        });
        this.bindDragRoom();
    },
    beforeDestroy() {
        $(document).off('mousedown', '.calendar-glyph');
        $(document).off('mouseover', '.calendar-glyph.draggable');
    }
};
</script>
