<template>
    <div class="content-item">
        <p class="content-item-title dashed">
            <span>房间信息
                <span class="increase-container" @click="addRoom">
                    <span class="increase-icon"></span>添加房间
            </span>
            </span>
            <span class="content-item-discount">
                折扣方案：
                <span style="width: 120px">
                    <dd-select placeholder="组合优惠" v-model="discountPlan">
                        <dd-option :value="0" label="不使用">
                        </dd-option>
                        <dd-group-option v-for="item in discountPlans" :label="item.label"
                             :key="item" v-if="item.discounts && item.discounts.length > 0">
                            <dd-option v-for="discount in item.discounts" :key="discount" :value="discount.id" :label="discount.name">
                                <span :title="discount.serialNum">{{discount.name}}</span>
            </dd-option>
            </dd-group-option>
            </dd-select>
            </span>
            </span>
        </p>
        <div class="registerRoom-items">
            <div class="registerRoom-container" v-for="(item,index) in rooms">
                <span class="room-icon"></span>
                <div class="registerRoom-content">
                    <div class="shop-item-content">
                        <!-- <span class="useless-tip error" v-if="item.showTip">该房间已被占用</span> -->
                        <div style="display: flex;line-height: 24px;">
                            房间
                            <dd-select v-model="item.roomId" placeholder="请选择房型" @input="changeRoomType(item ,index)">
                                <dd-option v-for="category in categories" :value="category.typeId" :key="category.typeId" :label="category.name">
                                </dd-option>
                            </dd-select>
                        </div>
                        <div class="room-count" style="display: inline-block; position: relative;">
                            数量
                            <counter :onNumChange="(a,b,num) => handleRoomNumChange(item, index,num)" :num='item.amount' :id="index" :type="3" /> <span class="room-vailble" v-if='item.canReserveCount != undefined'>可预订数 {{item.canReserveCount}}</span>
                        </div>
                        <div class="room-type">
                            入住类型：
                            <dd-select v-model="item.checkRoomType" placeholder="请选择入住类型" @input="changeRoomType(item ,index)">
                                <dd-option v-for="check in checkType" :value="check.id" :key="check.id" :label="check.name">
                                </dd-option>
                            </dd-select>
                        </div>
                    </div>
                    <div class="shop-item-content" style="margin-top:15px;">
                        <div class="room-date" style="display: inline-block; position: relative;" v-if='checkState === "quick"'>
                            <span class="useless-tip error" style="left: 28px;" v-if="checkIsToday(item.room.startDate)">
                                该房间的入住时间必需为今日！
                            </span>
                            <label class="label-text">入住</label>
                            <div class="enterDate">
                                <DatePicker v-model="item.room.startDate" @change="handleRoomChange(item, index)" :picker-options='{disabledDate:disabledStartDate(new Date())}' type="datetime" placeholder="选择日期时间" format='yyyy-MM-dd HH:mm'>
                                </DatePicker>
                                <!--  <dd-datepicker placeholder="选择时间" v-model="item.room.startDate"
                                               @input="handleRoomChange(item, index)"
                                               :disabled-date="disabledStartDate(new Date())"
                                               :disabled="item.state === 1 || item.state === 8"/> -->
                            </div>
                            <span>~</span>
                            <div class="enterDate">
                                <DatePicker v-model="item.room.endDate" @change="handleRoomChange(item, index)" :picker-options='{disabledDate:disabledStartDate(item.room.startDate)}' type="datetime" placeholder="选择日期时间" format='yyyy-MM-dd HH:mm'>
                                </DatePicker>
                            </div>
                            <label class="label-text">
                                共{{dateDiff(item.room.startDate, item.room.endDate)}}晚
                            </label>
                        </div>
                        <div class="registerInfoModal-roomPrice" @click.stop="()=>{}">
                            <label class="label-text">房费</label>
                            <p class="fee-container">
                                <span class="fee-symbol">¥</span>
                                <input class="dd-input fee-input" v-model.number="item.price" @input="changeRoomFee(item)" />
                            </p>
                            <span class="discount-info">
                        <span>
                            <span>原价<span class="origin-price">¥{{ item.originPrice }}</span></span>
                            <span class="discount-num" v-if="item.showDiscount">
                                {{item.showDiscount}}
                            </span>
                            </span>
                            <span class="more-discount" :id="'js-more-discount-' + index">
                            <span class="more-discount-handle" @click="handleMoreDiscountClick(index, $event)">
                                <span>更多折扣</span>
                            <span class="more-discount-icon"></span>
                            </span>
                            <span class="more-discount-select">
                                <dd-select v-model="item.moreDiscount" @input="moreDiscountChange(item)">
                                    <dd-option :value="0" label="不使用">
                                    </dd-option>
                                    <dd-group-option v-for="item in discountPlans" :label="item.label"
                                                     :key="item" v-if="item.discounts && item.discounts.length > 0">
                                        <dd-option v-for="discount in item.discounts" :key="discount" :value="discount.id" :label="discount.name + ' ' + discount.discount + '折'">
                                            <span :title="discount.serialNum">{{discount.name + ' ' + discount.discount + '折'}}</span>
                            </dd-option>
                            </dd-group-option>
                            </dd-select>
                            </span>
                            </span>
                            </span>
                        </div>
                        <span v-if="item.state === 1" class="delete-icon-like"></span>
                    </div>
                </div>
                <span class="delete-icon" @click="deleteRoom(index)" v-if="!item.state || ((item.state !== 1 && item.state !== 8) && ((order.roomInfo && !order.isCombinationOrder) || order.rooms))">
                    </span>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.el-input__inner {
    height: 25px!important;
}
.registerRoom-content {
    width: 100%;
    margin-right: 100px;
    margin-bottom:10px;
}

.roomModals-body .el-input__inner {
    width: auto;
}

.roomModals-body .registerRoom-item {
    align-items: baseline;
}

.room-vailble {
    font-size: 14px;
    color: #13ce66;
}

.roomModals-body .registerRoom-container {
    flex-direction: inherit;
    justify-content: space-between;
}
.registerInfoModal-roomPrice{
    position:relative
}
.roomModals-body .room-icon, .delete-icon{
        background-repeat: no-repeat;
            margin-top: 8px;
}
.roomModals-body .discount-info{
    display: inline-flex;
    position: absolute;
    font-size: 12px;
    color: #999999;
    top: 30px;
    min-width: 1000px;
    align-items: center;
    left: 0;
}
</style>
<script>
import CheckInPerson from '../CheckInPerson.vue';
import modal from '../../../modal';
import {
    DdSelect,
    DdOption,
    DdDatepicker,
    DdGroupOption
} from 'dd-vue-component';
import Clickoutside from 'dd-vue-component/src/utils/clickoutside';
import http from '../../../http';
import util from '../../../util';
import bus from '../../../eventBus';
import Vue from 'vue';
import {
    mapState
} from 'vuex';
import counter from '../../../components/counter.vue';
import selectGoods from './SelectGoods.vue';
import {
    DatePicker
} from 'element-ui';
import {
    checkType
} from '../../roomCheckType';
export default {
    data() {
            return {
                rooms: [],
                quickDiscounts: [],
                forceChangePrice: false, // 更改过渠道后，不保留原始价格，请求价格都需要传这个
                lastRoomsToken: {}, // 这个东西是为了防止相同的请求数据而去重复请求价格列表，同时防止初始化数据时调用接口
                discountPlans: [],
                goodsSelectModalShow: false,
                currentSelectOtherRoom: undefined,
                checkType,
                startDate: undefined,
                endDate: undefined,
                checkRoomType: undefined
            };
        },
        created() {
            bus.$on('submitOrder', this.changeRooms);
            bus.$on('OrderExtInfochange', this.handleRoomChange);
            bus.$on('hideOrderEditor', this.cleanRooms);
            bus.$on('editOrder', this.initRooms);
            bus.$on('register', this.initRegisterRooms);
            this.getQuickDiscounts();
        },
        beforeDestroy() {
            bus.$off('submitOrder', this.changeRooms);
            bus.$off('hideOrderEditor', this.cleanRooms);
            bus.$off('editOrder', this.initRooms);
            bus.$off('register', this.initRegisterRooms);
            bus.$off('OrderExtInfochange', this.handleRoomChange);
        },
        components: {
            CheckInPerson,
            DdSelect,
            DdOption,
            DdDatepicker,
            DdGroupOption,
            counter,
            selectGoods,
            DatePicker
        },
        directives: {
            Clickoutside
        },
        props: {
            checkState: String,
            categories: Array,
            vipDiscountDetail: Object,
            registerRooms: Array,
            userOriginType: Object,
            vipId: Number,
            vipCardId: Number,
            vipCardInfo: {
                type: Object,
                default: {}
            },
            order: {
                type: Object,
                default: {}
            }
        },
        watch: {
            userOriginType(origin, oldOrigin) {
                // 如果之前的渠道是undefined，代表初始化
                if (!oldOrigin) {
                    return false;
                }

                if (this.rooms.length > 0) {
                    // 切成其他的渠道，要把会员和企业的折扣设为不使用
                    if (origin.id !== -4 || origin.id !== -5) {
                        this.rooms.map(r => {
                            if (r.moreDiscount < 0) {
                                r.moreDiscount = 0;
                            }
                        });
                    }
                    this.forceChangePrice = true;
                    // 更改渠道
                    this.modifyRooms(this.rooms);
                }
            },
            vipCardInfo(vipCardInfo, oldVipCardInfo) {
                if (!this.userOriginType ||
                    JSON.stringify(vipCardInfo) === JSON.stringify(oldVipCardInfo) ||
                    this.userOriginType.id > 0) {
                    return;
                }
                const discounts = vipCardInfo.discount && vipCardInfo.discount < 10 ? [{
                    id: this.userOriginType.id,
                    name: vipCardInfo.name,
                    serialNum: vipCardInfo.serialNum,
                    discount: vipCardInfo.discount
                }] : [];
                Vue.set(this.discountPlans, 1, {
                    label: vipCardInfo.tag,
                    discounts: discounts
                });
                this.handleVipCardChange(this.userOriginType.id, oldVipCardInfo.name !== undefined);
            },
            vipCardId(id, oldId) {
                // 会员折扣id为-4
                if (!this.userOriginType) {
                    return;
                }
                const discounts = this.vipCardInfo.discount && this.vipCardInfo.discount < 10 ? [{
                    id: this.userOriginType.id,
                    name: this.vipCardInfo.name,
                    serialNum: this.vipCardInfo.serialNum,
                    discount: this.vipCardInfo.discount
                }] : [];
                Vue.set(this.discountPlans, 1, {
                    label: this.vipCardInfo.tag,
                    discounts: discounts
                });
                const changeId = id === 0 ? 0 : this.userOriginType.id;
                this.handleVipCardChange(changeId, oldId !== undefined);
            },
            vipDiscountDetail(newVal, oldVal) {
                if (!newVal.vipDetail || !oldVal.vipDetail) {
                    return false;
                }

                if (newVal.vipDetail.vipId !== oldVal.vipDetail.vipId) {
                    this.modifyRooms(this.rooms);
                }
            },
            vipId(id, oldId) {
                // 防止初始化的时候调接口
                if (!oldId && !this.userOriginType) {
                    return false;
                }

                if (this.rooms.length > 0) {
                    this.modifyRooms(this.rooms);
                }
            },
            rooms() {
                const price = this.rooms.reduce((sum, room) => {
                    return sum + (room.price || 0);
                }, 0);
                this.$emit('priceChange', price);
            }
        },
        computed: {
            ...mapState({
                otherGoodsList: state => state.orderSystem.otherGoodsList
            }),
            totalPrice() {
                const price = this.rooms.reduce((sum, room) => {
                    return sum + (room.price || 0);
                }, 0);
                this.$emit('priceChange', price);
                return price;
            },
            discountPlan: {
                get() {
                    if (this.rooms.length === 0) {
                        return undefined;
                    }

                    const flag = this.rooms.every(i => i.moreDiscount === this.rooms[0].moreDiscount);
                    if (flag) {
                        return this.rooms[0].moreDiscount;
                    } else {
                        return undefined;
                    }
                },
                set(val) {
                    if (val === undefined) {
                        return;
                    }
                    this.rooms.map(room => room.moreDiscount = val);
                    this.forceChangePrice = true;
                    this.modifyRooms(this.rooms);
                }
            },
            vipDiscount() {
                const vipDetail = this.vipDiscountDetail.vipDetail;
                if (vipDetail && vipDetail.discountList) {
                    const node = vipDetail.discountList.find(i => i.nodeId === 0 && i.nodeType === 0);
                    return node ? node.discount : 1;
                }

                // 没有折扣时返回1
                return 1;
            }
        },
        methods: {
            handleVipCardChange(id, forceChange) {
                // 切换了会员卡后房间更多折扣的处理逻辑，没有折扣选择不使用
                if (this.checkState !== 'editOrder' || forceChange) {
                    this.rooms.map(r => {
                        r.moreDiscount = id;
                    });
                }
                if (Number(this.vipCardInfo.discount) === 10 && (this.checkState !== 'editOrder' || forceChange)) {
                    this.rooms.map(r => {
                        r.moreDiscount = 0;
                    });
                }
                if (this.rooms.length > 0) {
                    if (forceChange) {
                        this.forceChangePrice = true;
                    }
                    // 更改渠道
                    this.modifyRooms(this.rooms);
                }
            },
            handleMoreDiscountClick(index, ev) {
                ev.stopPropagation();
                document.querySelector(`#js-more-discount-${index} .dd-select-input`).click();
            },
            cleanRooms() {
                this.rooms = [];
            },
            getQuickDiscounts() {
                http.get('/quickDiscount/getList', {
                        nodeId: 0,
                        nodeType: 0
                    })
                    .then(res => {
                        this.quickDiscounts = res.data.list.map(item => {
                            return {
                                ...item,
                                label: item.description + '  ' + item.discount + '折'
                            };
                        });
                        this.discountPlans = [];
                        this.discountPlans.push({
                            label: '快捷折扣',
                            discounts: res.data.list.map(item => {
                                return {
                                    id: item.id,
                                    name: item.description,
                                    discount: item.discount
                                };
                            })
                        });
                    });
            },
            quickDiscountIdChange(room) {
                this.forceChangePrice = true;
                this.modifyRooms([room]);
            },
            // 计算vip折扣价，如果没有vip折扣价返回原价
            getVipPrice(room) {
                return Number((room.originPrice * this.vipDiscount).toFixed(2));
            },
            initRooms() {
                this.forceChangePrice = false;
                this.lastRoomsToken = {};
                const order = this.order;

                // 0-不使用折扣，-4会员，-5企业，正数-快捷折扣
                function getMoreDiscount(item) {
                    const useDiscount = item.roomInfo ? item.roomInfo.useDiscount : item.useDiscount;
                    if (!useDiscount) {
                        return 0;
                    }

                    if (item.quickDiscountId) {
                        return item.quickDiscountId;
                    }

                    const discountChannel = item.discountChannel || item.roomInfo.discountChannel;
                    if (discountChannel) {
                        return discountChannel === 2 ? -5 : -4;
                    }
                }

                // 组合订单
                if (order.rooms) {
                    const filterRooms = order.rooms.filter(room => {
                        return room.state === 0 || room.state === 1 || room.state === 8;
                    });
                    this.rooms = filterRooms.map(item => {
                        return {
                            categoryType: item.typeId,
                            roomType: item.roomId,
                            originPrice: item.originPrice,
                            price: item.fee,
                            room: {
                                roomId: item.roomId,
                                startDate: item.startDate,
                                endDate: item.endDate
                            },
                            idCardList: item.idCardList,
                            datePriceList: item.datePriceList.map(dat => {
                                const newDate = {
                                    showInput: false
                                };
                                newDate.date = dat.date;
                                newDate.dateFee = dat.dateFee;
                                return newDate;
                            }),
                            originDatePriceList: JSON.parse(JSON.stringify(item.datePriceList)),
                            showPriceList: false,
                            showTip: false,
                            state: item.state,
                            roomOrderId: item.serviceId,
                            quickDiscountId: item.quickDiscountId || '',
                            priceScale: item.datePriceList.map(dat => {
                                return item.fee === 0 ? 1 / item.datePriceList.length : dat.dateFee / item.fee;
                            }),
                            showDiscount: item.showDiscount,
                            moreDiscount: getMoreDiscount(item),
                            extraItems: item.extraItems
                        };
                    });
                }

                // 住宿独立订单
                if (order.roomInfo) {
                    const roomInfo = order.roomInfo;
                    const room = {
                        categoryType: roomInfo.subTypeId,
                        roomType: roomInfo.roomId,
                        originPrice: roomInfo.originPrice,
                        price: roomInfo.totalPrice,
                        room: {
                            roomId: roomInfo.roomId,
                            startDate: roomInfo.checkInDate,
                            endDate: roomInfo.checkOutDate
                        },
                        idCardList: order.idCardsList,
                        datePriceList: order.datePriceList.map(dat => {
                            const newDate = {
                                showInput: false
                            };
                            newDate.date = dat.date;
                            newDate.dateFee = dat.dateFee;
                            return newDate;
                        }),
                        originDatePriceList: JSON.parse(JSON.stringify(order.datePriceList)),
                        showPriceList: false,
                        showTip: false,
                        state: roomInfo.state,
                        roomOrderId: order.roomOrderId,
                        quickDiscountId: order.quickDiscountId || '',
                        priceScale: order.datePriceList.map(dat => {
                            return roomInfo.totalPrice === 0 ? 1 / order.datePriceList.length : dat.dateFee / roomInfo.totalPrice;
                        }),
                        showDiscount: roomInfo.showDiscount,
                        moreDiscount: getMoreDiscount(order),
                        extraItems: order.extraItems
                    };

                    this.rooms = [room];
                }
                this.rooms.map((room, index) => {
                    this.lastRoomsToken[index] = JSON.stringify(room);
                });
            },
            initRegisterRooms(rooms) {
                this.forceChangePrice = false;
                this.lastRoomsToken = {};
                this.rooms = rooms.map(room => {
                    room.endDate = util.dateFormat(util.diffDate(room.endDate, 1));
                    room.startDate = util.dateFormat(room.startDate);
                    return {
                        categoryType: room.categoryType,
                        roomType: room.roomId,
                        price: undefined,
                        originPrice: undefined,
                        room: room,
                        idCardList: [],
                        changeTimes: 0,
                        showPriceList: false,
                        datePriceList: [],
                        priceScale: [],
                        showTip: false,
                        quickDiscountId: '',
                        showDiscount: undefined,
                        moreDiscount: 0,
                        extraItems: []
                    };
                });
            },
            addRoom() {
                if (this.rooms.length >= 99) {
                    modal.warn('一个订单最多添加99间房!');
                    return false;
                }

                // if (len === 0 || !this.rooms[len - 1].roomType) {
                const room = {
                    categoryType: undefined,
                    originPrice: undefined,
                    price: undefined,
                    amount: 1,
                    checkRoomType: 0,
                    room: {
                        roomId: undefined,
                        startDate: util.dateFormat(new Date()),
                        endDate: util.dateFormat(util.diffDate(new Date(), 1))
                    },
                    idCardList: [],
                    datePriceList: [],
                    originDatePriceList: [],
                    showPriceList: false,
                    showTip: false,
                    state: undefined,
                    roomOrderId: undefined,
                    quickDiscountId: '',
                    priceScale: [],
                    showDiscount: undefined,
                    extraItems: []
                };
                if (this.vipCardInfo && this.vipCardInfo.discount && Number(this.vipCardInfo.discount) !== 10) {
                    room.moreDiscount = this.userOriginType.id;
                } else {
                    room.moreDiscount = 0;
                }
                this.rooms.push(room);
            },
            dateDiff(date1, date2) {
                const d1 = new Date(date1);
                const d2 = new Date(date2);
                return util.DateDiff(d1, d2);
            },
            changeRoomType(item, index) {
                this.$nextTick(function() {
                    // item.roomType = this.getRoomsList(item.categoryType)[0].id;
                    this.handleRoomChange(item, index);
                });
            },
            disabledStartDate(endDate) {
                const str = util.dateFormat(new Date(endDate));
                const arr = str.split('-');
                if (this.checkState === 'finish') {
                    return (date) => {
                        return date.valueOf() >= (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                    };
                } else if (this.checkState === 'ing') {
                    return (date) => {
                        return date.valueOf() !== (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                    };
                } else {
                    return (date) => {
                        return date.valueOf() < (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                    };
                }
            },
            disabledEndDate(startDate) {
                if (this.checkState === 'finish') {
                    if (util.isSameDay(new Date(startDate), new Date())) {
                        const str1 = util.dateFormat(new Date());
                        const arr1 = str1.split('-');
                        return (date) => {
                            return (date.valueOf() > (new Date(arr1[0], arr1[1] - 1, arr1[2])).valueOf());
                        };
                    } else {
                        const str = util.dateFormat(new Date(startDate));
                        const arr = str.split('-');
                        const str1 = util.dateFormat(new Date());
                        const arr1 = str1.split('-');
                        return (date) => {
                            return (date.valueOf() <= (new Date(arr[0], arr[1] - 1, arr[2])).valueOf()) || (date.valueOf() > (new Date(arr1[0], arr1[1] - 1, arr1[2])).valueOf());
                        };
                    }
                } else {
                    const str = util.dateFormat(new Date(startDate));
                    const arr = str.split('-');
                    return (date) => {
                        return date.valueOf() < (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                    };
                }
            },
            handleRoomNumChange(item , index, num ) {
                item.amount = num;
                this.modifyRooms([item]);

            },
            getRoomsList(id) {
                if (!id) {
                    return [];
                }

                const category = this.categories.find(c => c.typeId === id);
                return category.rooms.map(r => {
                    return {
                        id: r.roomId,
                        name: r.serialNum
                    };
                });
            },
            checkIsToday(date) {
                return !util.isSameDay(new Date(date), new Date()) && this.checkState === 'ing';
            },
            hidePriceList() {
                this.rooms.forEach(item => {
                    item.showPriceList = false;
                    item.datePriceList.forEach(date => {
                        date.showInput = false;
                    });
                });
                this.vipListShow = false;
                this.vipList = [];
            },
            handleRoomChange(room, index) {
                if (index === -1) {
                    this.rooms.forEach(function(element, index) {
                        this.checkRoomType = room.checkType;
                        this.startDate = room.startDate;
                        this.endDate = room.endDate;
                    });
                    this.modifyRooms(this.rooms);
                    return;
                }
                // 团队预订
                if (JSON.stringify(room) === this.lastRoomsToken[index]) {
                    return false;
                }

                this.lastRoomsToken[index] = JSON.stringify(room);
                const duration = this.dateDiff(room.room.startDate, room.room.endDate);
                if (duration < 1) {
                    room.room.endDate = util.diffDate(new Date(room.room.endDate), 1);
                    return false;
                }

                // 最多400天
                if (duration > 400) {
                    const currentTime = +new Date();
                    if (currentTime - this.lastModifyRoomTime > 2000) {
                        modal.warn('入住上限最大为400天，请重新选择入住时间！');
                        this.lastModifyRoomTime = currentTime;
                    }
                    return false;
                }

                this.modifyRooms([room]);
            },
            /**
             * 根据条件获取价格
             * @param rooms
             */
            modifyRooms(rooms) {
                // 过滤没有房间id的房间
                rooms = rooms.filter(r => r.roomId);
                if (!rooms || rooms.length === 0) {
                    return false;
                }

                // 会员-1，企业-2,会员卡-4
                let discountChannel;
                let discountRelatedId; // eslint-disable-line
                if (this.userOriginType && this.userOriginType.id === -5) {
                    discountRelatedId = this.userOriginType.companyId;
                    discountChannel = 2;
                } else if (this.userOriginType && (this.userOriginType.id === -4 || this.userOriginType.id === -3)) {
                    // 会员渠道分为会员等级和会员卡
                    if (!this.vipId || this.vipCardId === undefined) {
                        return false;
                    }

                    if (this.vipCardId > 0) {
                        discountRelatedId = this.vipCardId;
                        discountChannel = 4;
                    }

                    if (this.vipCardId === 0) {
                        discountRelatedId = null;
                        discountChannel = null;
                    }

                    if (this.vipCardId < 0) {
                        discountRelatedId = this.vipId;
                        discountChannel = 1;
                    }
                }

                rooms.map(room => {
                    if (room.moreDiscount > 0) {
                        room.quickDiscountId = room.moreDiscount;
                    } else {
                        room.quickDiscountId = '';
                    }
                });

                const params = {
                    discountChannel: discountChannel,
                    discountRelatedId: discountRelatedId,
                    orderId: this.order.orderId,
                    rooms: JSON.stringify(rooms.map(room => {
                        return {
                            checkType: this.checkState === 'team' ? this.checkRoomType : room.checkRoomType,
                            amount: room.amount,
                            startDate: util.dateFormatLong(this.checkState === 'team' ? this.startDate : room.room.startDate),
                            endDate: util.dateFormatLong(this.checkState === 'team' ? this.endDate : room.room.endDate),
                            subTypeId: room.roomId,
                            quickDiscountId: room.quickDiscountId,
                            subTypeId: room.roomId,
                            useDiscount: !!room.moreDiscount
                        };
                    }))
                    // forceChangePrice: this.forceChangePrice
                };
                http.get('/room/canReserveCountAndTotalPrice', params)
                    .then(res => {
                        // 嘻嘻
                        res.data.list.map((item, index) => {
                            const currentRoom = rooms[index];
                            // if (res.data.timestamp <= (currentRoom.timestamp || 0)) {
                            //     return;
                            // }

                            // currentRoom.datePriceList = item.datePriceList.map(i => {
                            //     return {
                            //         ...i,
                            //         showInput: false
                            //     };
                            // });
                            // currentRoom.showTip = !item.available;
                            currentRoom.price = item.totalFee;
                            // 每日房价分配比例
                            // currentRoom.priceScale = item.datePriceList.map(i => {
                            //     return item.totalFee === 0 ? 1 / item.datePriceList.length : i.dateFee / item.totalFee;
                            // });
                            currentRoom.showDiscount = item.showDiscount;
                            currentRoom.priceModified = false;
                            currentRoom.originPrice = item.originTotalPrice;
                            currentRoom.timestamp = res.data.timestamp;
                            currentRoom.canReserveCount = item.canReserveCount;
                             const price = this.rooms.reduce((sum, room) => {
                    return sum + (room.price || 0);
                }, 0);
                this.$emit('priceChange', price);
                            
                        });
                    });
            },
            changeRoomFee(room) {
                // 手动修改价格需要把快捷折扣置为无
                room.quickDiscountId = '';
                // this.setDayFee(room);
                room.priceModified = true; // 手动改过的价格不显示折扣标签
                room.moreDiscount = 0;
            },
            // 设置每日房价
            // setDayFee(room) {
            //     const price = room.price;
            //     const priceScale = room.priceScale;
            //     room.datePriceList.forEach((item, index) => {
            //         item.dateFee = Number((price * priceScale[index]).toFixed(2));
            //     });
            //     this.setFirstDayFee(room);
            // },
            // // 误差处理，将误差加至第一天
            // setFirstDayFee(room) {
            //     const price = room.price;
            //     if (price === undefined || price === '') {
            //         return false;
            //     }

            //     // 每日房价相加
            //     const totalPrice = room.datePriceList.reduce((a, b) => {
            //         return a + Number(b.dateFee);
            //     }, 0);
            //     room.datePriceList[0].dateFee = Number((room.datePriceList[0].dateFee + price - totalPrice).toFixed(2));
            // },
            showPriceList(id) {
                this.rooms.forEach((item, index) => {
                    if (index === id) {
                        const duration = this.dateDiff(item.room.startDate, item.room.endDate);
                        if (duration > 1) {
                            item.showPriceList = true;
                        }
                    } else {
                        item.showPriceList = false;
                    }
                });
            },
            changShowInput(item, option) {
                item.datePriceList.forEach(datePrice => {
                    datePrice.showInput = false;
                });
                option.showInput = true;
            },
            setTotalPrice(room) {
                // 手动修改价格需要把快捷折扣置为无
                room.quickDiscountId = '';
                // room.price = +(room.datePriceList.reduce((a, b) => {
                //     return a + Number(b.dateFee);
                // }, 0).toFixed(2));
                room.priceModified = true; // 手动改过的价格不显示折扣标签
            },
            deleteRoom(index) {
                this.rooms.splice(index, 1);
            },
            changeRooms() {
                this.$emit('change', this.rooms);
            },
            moreDiscountChange(room) {
                this.forceChangePrice = true;
                this.modifyRooms([room]);
            }
        }
};
</script>
