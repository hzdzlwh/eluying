<template>
    <div class="content-item">
        <p class="content-item-title dashed">
            <span>房间信息
                <span class="increase-container" @click="addRoom" v-if="(checkState !=='editOrder' && checkState !== 'checkIn') || order.rooms || (order.roomInfo && !order.isCombinationOrder)">
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
            <div class="registerRoom-container" v-for="(item,index) in rooms" style="display: flex;flex-direction: row;">
                <input @change="handleIsCheckInChange(item)" type="checkbox" v-model="item.isCheckIn" class="dd-checkbox" v-if="checkState === 'checkIn'" style="width: auto;margin-right: 20px">
                <div style="flex: 1">
                    <div class="registerRoom-item">
                        <span class="room-icon"></span>
                        <div class="shop-item-content">
                            <span class="useless-tip error" v-if="(item.showTip === 2 && item.checkType === 1) || item.showTip === 1">{{item.showTip === 1 ? '该房间不可用' : '该钟点房不在开放时段'}}</span>
                            <div style="display: flex;align-items: center;">
                                <label class="label-text">房间&nbsp;</label>
                                <dd-select v-model="item.categoryType" placeholder="请选择房型" @input="changeRoomType(item, index, 'room')">
                                    <dd-option v-for="category in item.categories" :value="category.typeId" :key="category.typeId"
                                               :label="category.name">
                                    </dd-option>
                                </dd-select>
                                <div class="room-category" >
                                    <dd-select v-model="item.roomType" placeholder="请选择房间" @input="handleRoomChange(item, index)">
                                        <dd-option v-for="room in item.roomList" :value="room.id" :key="room.id" :label="room.name">
                                        </dd-option>
                                    </dd-select>
                                </div>
                            </div>
                            <div class="room-type">
                                入住类型：
                                <dd-select v-model='item.checkType' placeholder="请选择入住类型" @input="changeRoomType(item, index, 'roomType')">
                                    <dd-option v-for="check in item.checkTypes" :value="check.id" :key="check.id" :label="check.name">
                                    </dd-option>
                                </dd-select>
                                <span class="state-icon yellow" style="margin-left: 20px" v-if="canShowBookIcon(item)">
                                    已预订
                                </span>
                            </div>
                            <div class="room-count" v-if="item.checkType === 1">
                                入住时长
                                <counter-step :onNumChange="(a, b, num) => handleRoomNumChange(item, index, num)" :max='item.maxLength' :min='item.startLength' :step='item.unitLength' :num='item.timeAmount' :id='index' :type='3'></counter-step>
                            </div>
                            <span class="delete-icon" @click="deleteRoom(index)" v-if="!item.state || ((item.state !== 1 && item.state !== 8) && ((order.roomInfo && !order.isCombinationOrder) || order.rooms))">
                            </span>
                        </div>
                    </div>
                    <div class="registerRoom-item" style="padding-left: 41px;margin-top: 11px">
                        <div class="shop-item-content">
                            <div class="room-date" style="display: inline-block; position: relative;">
                                <span class="useless-tip error" style="left: 28px;" v-if="checkIsToday(item.room.startDate)">
                                    该房间的入住时间必须为今日！
                                </span>
                                <label class="label-text">到达</label>
                                <div class="enterDate">
                                    <DatePicker v-model='item.room.startDate' @change='()=>handleRoomChange(item, index,"startDate")' :clearable='false' :picker-options='{disabledDate:disabledStartDate(new Date())}' type="datetime" :disabled='order.orderState === 8 || order.timeRoomAuto || order.timeRoomTransform || item.state === 1' placeholder="选择日期时间" format='yyyy-MM-dd HH:mm'>
                                    </DatePicker>
                                </div>
                                <span>~</span>
                                <label class="label-text">离开</label>
                                <div class="enterDate">
                                    <DatePicker v-model='item.room.endDate'
                                                @change='()=>handleRoomChange(item, index, "endDate")'
                                                :clearable='false'
                                                :disabled='order.orderState === 8 || item.checkType === 1'
                                                :picker-options='{disabledDate:disabledEndDate(item.room.endDate)}'
                                                type="datetime"
                                                placeholder="选择日期时间"
                                                format='yyyy-MM-dd HH:mm'>
                                    </DatePicker>
                                </div>
                                <label class="label-text" v-if="item.checkType !== 1">
                                    共{{dateDiff(item.room.startDate, item.room.endDate)}}晚
                                </label>
                                <label class="label-text" v-else>
                                    共{{item.timeAmount}}小时
                                </label>
                            </div>
                            <div class="registerInfoModal-roomPrice" @click.stop="()=>{}">
                                <label class="label-text">房费&nbsp;</label>
                                <p class="fee-container">
                                    <span class="fee-symbol">¥</span>
                                    <input class="dd-input fee-input" v-model.number="item.price" @input="changeRoomFee(item)" @blur="setFirstDayFee(item)" @focus="setFirstDayFee(item)" @click.stop="showPriceList(index)" />
                                </p>
                                <div class="registerInfoModal-roomPriceList" v-if="item.showPriceList && item.datePriceList.length > 1" v-clickoutside="hidePriceList">
                                    <dl class="price-item" v-for="priceItem in item.datePriceList">
                                        <dt>{{priceItem.date.slice(5)}}</dt>
                                        <dd v-show="!priceItem.showInput" @click="changShowInput(item, priceItem)">
                                            ¥{{priceItem.dateFee}}
                                        </dd>
                                        <dd v-show="priceItem.showInput">
                                            <input class="dd-input" style="width: 60px;" v-model.number="priceItem.dateFee" @input="setTotalPrice(item)">
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <span v-if="item.state === 1" class="delete-icon-like"></span>
                        <span class="discount-info">
                            <span >
                                <span v-if="(item.showDiscount && !item.priceModified) || (item.checkType === 2 || item.checkType === 3)">原价<span class="origin-price">¥{{ item.originPrice }}</span></span>
                        <span class="discount-num" v-if="item.showDiscount && !item.priceModified">
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
                    <CheckInPerson :personsObj="{id: index, persons: item.idCardList}" @addPerson="addPerson" @deletePerson="deletePerson" />
                    <!-- 其他消费开始 -->
                    <div class="extra-items" v-if="(checkState === 'checkIn' && item.isCheckIn) || checkState === 'finish' || checkState === 'ing' || item.state === 1 || item.state === 8">
                        <div class="extra-items-title">
                            <span class="extra-item-icon"></span>
                            <span>其他消费</span>
                            <span @click="addExtraItem(item)" class="increase-container" style="margin-left: 16px"><span class="increase-icon"></span>添加项目</span>
                        </div>
                        <div class="extra-items-content">
                            <div v-for="extra in item.extraItems">
                                <div v-if="extra.date" class="extra-items-date">{{extra.date}}</div>
                                <div>
                                    <div v-for="(good, index) in extra.itemList" class="extra-items-row">
                                        <span class="extra-items-name">{{good.goodsName}}</span>
                                        <span class="extra-items-num">数量
                                        <counter :onNumChange="(a,b,num) => handleExtraNumChange(good, num)" :num="good.amount" :id="index" :type="3" />
                                        </span>
                                        <span class="extra-items-total">小计
                                            <p class="fee-container">
                                                <span class="fee-symbol">¥</span>
                                        <input class="dd-input fee-input" v-model.number="good.subtotal" />
                                        </p>
                                        </span>
                                        <span class="delete-icon" @click="deleteExtra(extra, index)"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 其他消费结束 -->
                    <span v-show="false">{{totalPrice}}</span>
                </div>
            </div>
        </div>
        <div v-if="otherGoodsList.length > 0">
            <selectGoods :show="goodsSelectModalShow" :goodsDate="otherGoodsList" title="选择其他消费" @selectGoodsDate="setOtherGoodsItems" @Modalclose="closeShopSelectModal" />
        </div>
    </div>
</template>
<style lang="scss">
.more-discount {
    position: relative;
    color: #666;
    .more-discount-handle {
        margin-left: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
    }
    .more-discount-icon {
        margin-left: 2px;
        border-bottom: none;
        border-top: 3px solid grey;
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
    }
    .more-discount-select {
        position: absolute;
        top: 10px;
        left: -55px;
        width: 0;
        height: 0;
    }
    .dd-select {
        width: 120px;
    }
    .dd-select-menu {
        top: 0;
    }
    .dd-select-input {
        display: none;
    }
    .dd-select-icon {
        visibility: hidden;
    }
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
import counterStep from '../../../components/counterStep.vue';
import selectGoods from './SelectGoods.vue';
import {
    DatePicker
} from 'element-ui';
import {
    checkType,
    roomCheckType
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
                initCategories: {},
                whenCheckInDeleteRooms: [],
                checkType,
                roomCheckType
            };
        },
        created() {
            bus.$on('submitOrder', this.changeRooms);
            bus.$on('hideOrderEditor', this.cleanRooms);
            // bus.$on('editOrder', this.initRooms);
            bus.$on('register', this.initRegisterRooms);
            this.getQuickDiscounts();
        },
        beforeDestroy() {
            bus.$off('submitOrder', this.changeRooms);
            bus.$off('hideOrderEditor', this.cleanRooms);
            // bus.$off('editOrder', this.initRooms);
            bus.$off('register', this.initRegisterRooms);
        },
        components: {
            CheckInPerson,
            DdSelect,
            DdOption,
            DdDatepicker,
            DdGroupOption,
            counter,
            selectGoods,
            DatePicker,
            counterStep
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
            orderEditorVisible: Boolean,
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
            orderEditorVisible(v, oV) {
                if (v && !oV) {
                    this.initRooms();
                }
            }
        },
        computed: {
            ...mapState({
                otherGoodsList: state => state.orderSystem.otherGoodsList
            }),
            totalPrice() {
                let price = this.rooms.reduce((sum, room) => {
                    return sum + (room.price || 0);
                }, 0);
                this.rooms.map(r => {
                    r.extraItems.map(e => {
                        e.itemList.map(g => {
                            price = price + Number(g.subtotal);
                        });
                    });
                });
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
                if ((this.checkState !== 'editOrder' && this.checkState !== 'checkIn') || forceChange) {
                    this.rooms.map(r => {
                        r.moreDiscount = id;
                    });
                }
                if (Number(this.vipCardInfo.discount) === 10 && ((this.checkState !== 'editOrder' && this.checkState !== 'checkIn') || forceChange)) {
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
                this.whenCheckInDeleteRooms = [];
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
                this.initCategories = {};

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
                        })
                        .filter(room => this.checkState !== 'checkIn' ||
                            (room.state === 0 && (util.isSameDay(new Date(room.startDate), new Date()) || new Date(room.startDate) <= new Date())));
                    this.rooms = filterRooms.map(item => {
                        return {
                            ...item,
                            categoryType: item.typeId,
                            roomType: item.roomId || 0,
                            originPrice: item.originPrice,
                            price: item.fee,
                            originStartDate: new Date(item.startDate),
                            room: {
                                roomId: item.roomId || 0,
                                startDate: this.checkState === 'checkIn' ? new Date() : new Date(item.startDate),
                                endDate: new Date(item.endDate)
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
                            extraItems: [...item.extraItems],
                            checkType: item.checkType,
                            isCheckIn: this.checkState === 'checkIn',
                            checkTypes: [...checkType],
                        };
                    });
                }

                // 住宿独立订单
                if (order.roomInfo) {
                    const roomInfo = order.roomInfo;
                    const RoomEndDate = new Date(roomInfo.checkOutDate);
                    const RoomStartDate = new Date(roomInfo.checkInDate);
                    const room = {
                        ...roomInfo,
                        categoryType: roomInfo.subTypeId,
                        roomType: roomInfo.roomId || 0,
                        originPrice: roomInfo.originPrice,
                        price: roomInfo.totalPrice,
                        originStartDate: new Date(roomInfo.checkInDate),
                        room: {
                            roomId: roomInfo.roomId || 0,
                            startDate: this.checkState === 'checkIn' ? new Date() : new Date(roomInfo.checkInDate),
                            endDate: order.timeRoomTransform ? new Date(RoomStartDate.getFullYear(), RoomStartDate.getMonth(), RoomStartDate.getDate() + 1, 12, 0, 0) : (order.timeRoomAuto ? new Date(RoomEndDate.getFullYear(), RoomEndDate.getMonth(), RoomEndDate.getDate(), 12, 0, 0) : new Date(roomInfo.checkOutDate))
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
                        extraItems: [...order.extraItems],
                        checkType: order.timeRoomTransform ? 0 : (order.timeRoomAuto ? 0 : order.checkType),
                        checkTypes: [...checkType],
                        isCheckIn: this.checkState === 'checkIn',
                        categories: this.categories
                    };

                    this.rooms = [room];
                }
                this.rooms.map((room, index) => {
                    this.lastRoomsToken[index] = JSON.stringify(room);
                    this.initCategories[room.categoryType] = this.initCategories[room.categoryType] ? this.initCategories[room.categoryType] + 1 : 1;
                    this.getRoomsList(room);
                });
            },
            initRegisterRooms(rooms) {
                this.forceChangePrice = false;
                this.lastRoomsToken = {};
                this.rooms = rooms.map(room => {
                    room.startDate.setHours(12);
                    room.startDate.setMinutes(0);
                    room.endDate = util.diffDate(room.endDate, 1);
                    room.endDate.setHours(12);
                    room.endDate.setMinutes(0);
                    if (this.checkState === 'ing') {
                        room.startDate.setHours(new Date().getHours());
                        room.startDate.setMinutes(new Date().getMinutes());
                    }
                    const r = {
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
                        extraItems: [],
                        checkType: 0,
                        checkTypes: this.checkType.slice(0)
                    };
                    this.getRoomsList(r);
                    return r;
                });
                this.modifyRooms(this.rooms);
            },
            addRoom() {
                const len = this.rooms.length;
                if (this.rooms.length >= 99) {
                    modal.warn('一个订单最多添加99间房!');
                    return false;
                }

                let room;
                if (len === 0 || this.rooms[len - 1].roomType === undefined) {
                    const startDate = new Date();
                    if (this.checkState !== 'checkIn' && this.checkState !== 'ing') {
                        startDate.setHours(12);
                        startDate.setMinutes(0);
                    }
                    const endDate = util.diffDate(new Date(), 1);
                    endDate.setHours(12);
                    endDate.setMinutes(0);
                    room = {
                        categoryType: undefined,
                        roomType: undefined,
                        originPrice: undefined,
                        price: undefined,
                        room: {
                            roomId: 0,
                            startDate: startDate,
                            endDate: endDate
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
                        isCheckIn: this.checkState === 'checkIn',
                        extraItems: [],
                        checkTypes: this.checkState === 'book' ? this.checkType : this.roomCheckType
                    };
                } else {
                    // 新增房间，房型时间同上一间
                    room = JSON.parse(JSON.stringify(this.rooms[len - 1]));
                    room.room.startDate = new Date(Date.parse(this.rooms[len - 1].room.startDate));
                    room.room.endDate = new Date(Date.parse(this.rooms[len - 1].room.endDate));
                    room.room.roomId = 0;
                    room.originStartDate = new Date(Date.parse(this.rooms[len - 1].originStartDate));
                    room.roomType = 0;
                    room.extraItems = [];
                    room.idCardList = [];
                    room.checkTypes = JSON.parse(JSON.stringify(this.rooms[len - 1].checkTypes));
                    if (room.roomOrderId) {
                        delete room.roomOrderId;
                        delete room.state;
                        delete room.originDatePriceList;
                    }
                }
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
            changeRoomType(item, index, type) {
                if (type === 'endDate' && item.roomCheckType === 1) {
                    return;
                }
                if (type === 'roomType') {
                    if (item.checkType === 1) {
                        item.room.endDate = new Date(item.room.startDate.getTime() + 1000 * 60 * 60 * (item.timeAmount || 1));
                    }
                    http.get('/room/getRoomsList', {
                        checkType: item.checkType,
                        endDate: util.dateFormatLong(item.room.endDate),
                        startDate: util.dateFormatLong(item.room.startDate)
                    })
                    .then(res => {
                        if (this.checkState !== 'finish') {
                            item.categories = res.data.list;
                        }
                    });
                }
                this.getRoomsList(item);
                this.$nextTick(function() {
                    if (type !== 'roomType') {
                        item.roomType = 0;
                    }
                    this.handleRoomChange(item, index, type);
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
                        // return date.valueOf() !== (new Date(arr[0], arr[1] - 1, arr[2])).valueOf() && date.valueOf() !== (new Date(arr[0], arr[1] - 1, arr[2] - 1)).valueOf();
                        return date.valueOf() > (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                    };
                } else if (this.checkState === 'checkIn') {
                    // return date => false;
                    return date => date.valueOf() > (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
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
                    if (this.checkState === 'ing') {
                        const str = util.dateFormat(new Date(startDate));
                        const arr = str.split('-');
                        return (date) => {
                            return date.valueOf() < (new Date(arr[0], arr[1] - 1, arr[2] - 1)).valueOf();
                        };
                    } else {
                        const str = util.dateFormat(new Date(startDate));
                        const arr = str.split('-');
                        return (date) => {
                            return date.valueOf() < (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                        };
                    }
                }
            },
            getRoomsList(room) {
                if (!room.categoryType) {
                    return [];
                }

                http.get('/room/getRoomsList', {
                    startDate: util.dateFormat(room.room.startDate),
                    endDate: util.dateFormat(room.room.endDate),
                    roomOrderId: room.roomOrderId,
                    checkType: room.checkType
                })
                    .then(res => {
                        const categories = res.data.list;
                        const rooms = categories.find(c => c.typeId === room.categoryType)
                            .rooms.map(r => {
                                return {
                                    id: r.roomId,
                                    name: r.serialNum
                                };
                            });
                        if (!room.state) {
                            rooms.unshift({
                                id: 0,
                                name: '未排房'
                            });
                        }
                        this.$set(room, 'roomList', rooms);
                        this.$set(room, 'categories', res.data.list);
                    });
            },
            checkIsToday(date) {
                return false;
                // return !util.isSameDay(new Date(date), new Date()) && this.checkState === 'ing';
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
            handleRoomChange(room, index, type) {
                if (JSON.stringify(room) === this.lastRoomsToken[index]) {
                    return false;
                }
                if (type === 'endDate' && room.checkType === 1) {
                    return
                }
                this.lastRoomsToken[index] = JSON.stringify(room);
                const duration = util.DateDiff(room.room.startDate, room.room.endDate);
                if (duration < 1 && room.checkType !== 1) {
                    const toDate = new Date(room.room.endDate);
                    room.room.endDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate() + 1 , 12, 0,0);
                    return false;
                }
                if (new Date(room.room.startDate) > new Date(room.room.endDate)) {
                    if (room.checkType === 1) {
                        room.room.endDate = new Date(room.room.startDate.getTime() + 1000 * 60 * 60 * room.timeAmount);
                    } else {
                        room.room.startDate = new Date(room.room.endDate);
                        return false;
                    }
                }
                // if (type === 'startDate' && room.checkRoomType === 1) {
                //     room.room.endDate = new Date(room.room.startDate.getTime() + 1000 * 60 * 60 * room.timeAmount);
                // }
                // 最多400天
                if (duration > 400) {
                    const currentTime = +new Date();
                    if (currentTime - this.lastModifyRoomTime > 2000) {
                        modal.warn('入住上限最大为400天，请重新选择入住时间！');
                        this.lastModifyRoomTime = currentTime;
                    }
                    return false;
                }

                this.modifyRooms([room], type);
            },
            /**
             * 根据条件获取价格
             * @param rooms
             */
            modifyRooms(rooms, type) {
                // 过滤没有房间id的房间
                // rooms = rooms.filter(r => r.roomType);
                if (rooms.length === 0) {
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
                            startDate: util.dateFormatLong(room.room.startDate),
                            endDate: util.dateFormatLong(room.room.endDate),
                            quickDiscountId: room.quickDiscountId,
                            roomOrderId: room.roomOrderId,
                            roomId: room.roomType || null,
                            typeId: room.categoryType,
                            useDiscount: !!room.moreDiscount,
                            checkType: room.checkType
                        };
                    })),
                    forceChangePrice: this.forceChangePrice
                };
                http.get('/room/getRoomStatusAndPriceList', params)
                    .then(res => {
                        // 嘻嘻
                        res.data.list.map((item, index) => {
                            const currentRoom = rooms[index];
                            if (res.data.timestamp <= (currentRoom.timestamp || 0)) {
                                return;
                            }

                            currentRoom.datePriceList = item.datePriceList.map(i => {
                                return {
                                    ...i,
                                    showInput: false
                                };
                            });
                            currentRoom.showTip = !item.available ? 1 : (!item.isOpenTime ? 2 : 0);
                            // currentRoom.showTip = !item.isOpenTime;
                            currentRoom.price = item.totalFee;
                            // 每日房价分配比例
                            currentRoom.priceScale = item.datePriceList.map(i => {
                                return item.totalFee === 0 ? 1 / item.datePriceList.length : i.dateFee / item.totalFee;
                            });
                            currentRoom.showDiscount = item.showDiscount;
                            currentRoom.priceModified = false;
                            currentRoom.originPrice = item.originTotalFee;
                            currentRoom.timestamp = res.data.timestamp;
                            if (this.checkState !== 'book' && this.checkState !== 'finish') {
                            if (item.hasHourRoom) {
                                if (!currentRoom.checkTypes.some(el => {
                                        return el.id === 1;
                                    })) {
                                    currentRoom.checkTypes.push({
                                        id: 1,
                                        name: '钟点房'
                                    });
                                }
                            } else {
                                currentRoom.checkTypes.forEach(function(el, index) {
                                    if (el.id === 1) {
                                        currentRoom.checkTypes.splice(index, 1);
                                    }
                                });
                                if (currentRoom.checkType === 1) {
                                    currentRoom.checkType = 0;
                                }
                            }
                            }

                            if (currentRoom.checkType === 1 && (type === 'room' || type === 'roomType')) {
                                currentRoom.unitLength = Number(item.unitLength);
                                currentRoom.maxLength = Number(item.maxLength);
                                currentRoom.startLength = Number(item.startLength);
                                this.$set(currentRoom,'timeAmount',Number(item.startLength));
                                currentRoom.price = item.startPrice;
                            }
                            if (currentRoom.checkType === 1) {
                                currentRoom.room.endDate = new Date(currentRoom.room.startDate.getTime() + 1000 * 60 * 60 * (currentRoom.timeAmount || currentRoom.checkInLength))
                            }
                        });
                    });
            },
            changeRoomFee(room) {
                // 手动修改价格需要把快捷折扣置为无
                room.quickDiscountId = '';
                this.setDayFee(room);
                room.priceModified = true; // 手动改过的价格不显示折扣标签
                room.moreDiscount = 0;
            },
            // 设置每日房价
            setDayFee(room) {
                const price = room.price;
                const priceScale = room.priceScale;
                room.datePriceList.forEach((item, index) => {
                    item.dateFee = Number((price * priceScale[index]).toFixed(2));
                });
                this.setFirstDayFee(room);
            },
            // 误差处理，将误差加至第一天
            setFirstDayFee(room) {
                const price = room.price;
                if (price === undefined || price === '') {
                    return false;
                }

                // 每日房价相加
                const totalPrice = room.datePriceList.reduce((a, b) => {
                    return a + Number(b.dateFee);
                }, 0);
                room.datePriceList[0].dateFee = Number((room.datePriceList[0].dateFee + price - totalPrice).toFixed(2));
            },
            showPriceList(id) {
                this.rooms.forEach((item, index) => {
                    if (index === id) {
                        const duration = util.DateDiff(item.room.startDate, item.room.endDate);
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
                room.price = +(room.datePriceList.reduce((a, b) => {
                    return a + Number(b.dateFee);
                }, 0).toFixed(2));
                room.priceModified = true; // 手动改过的价格不显示折扣标签
            },
            deleteRoom(index) {
                if (this.rooms[index].roomOrderId && this.checkState === 'checkIn') {
                    this.whenCheckInDeleteRooms.push(this.rooms[index].roomOrderId);
                }
                this.rooms.splice(index, 1);
            },
            addPerson(id, preson) {
                this.rooms.forEach((item, index) => {
                    if (index === id) {
                        if (item.idCardList && item.idCardList.length >= 20) {
                            modal.warn('一间房最多添加20个入住人');
                            return false;
                        }

                        if (item.idCardList) {
                            item.idCardList.push(preson);
                        } else {
                            item.idCardList = [];
                            item.idCardList.push(preson);
                        }
                    }
                });
            },
            deletePerson(id, num) {
                this.rooms.forEach((item, index) => {
                    if (index === id) {
                        item.idCardList.splice(num, 1);
                    }
                });
            },
            changeRooms() {
                this.$emit('change', this.rooms);
                this.$emit('whenCheckInDeleteRooms', this.whenCheckInDeleteRooms);
            },
            moreDiscountChange(room) {
                this.forceChangePrice = true;
                this.modifyRooms([room]);
            },
            addExtraItem(room) {
                if (this.otherGoodsList.length <= 0) {
                    modal.warn('请到"网络设置－业务设置"中添加其他消费！');
                    return false;
                }

                this.currentSelectOtherRoom = room;
                this.goodsSelectModalShow = true;
            },
            setOtherGoodsItems(data) {
                const goodsList = data;
                let newItems = this.currentSelectOtherRoom.extraItems.find(i => !i.logId);
                if (!newItems) {
                    newItems = {
                        itemList: []
                    };
                    this.currentSelectOtherRoom.extraItems.push(newItems);
                }
                goodsList.map(i => {
                    let flag = false;
                    newItems.itemList.map(n => {
                        if (n.goodsId === i.id) {
                            n.amount = n.amount + i.num;
                            n.subtotal = Number((n.amount * i.p).toFixed(2));
                            flag = true;
                        }
                    });
                    if (!flag) {
                        newItems.itemList.push({
                            amount: i.num,
                            subtotal: Number((i.num * i.p).toFixed(2)),
                            price: i.p,
                            goodsName: i.n,
                            goodsId: i.id
                        });
                    }
                });
            },
            handleExtraNumChange(good, num) {
                if (good.price === null) {
                    modal.warn('该商品已删除');
                    return false;
                }
                good.amount = num;
                good.subtotal = Number((num * good.price).toFixed(2));
            },
            // 关闭商超选择弹窗
            closeShopSelectModal() {
                this.goodsSelectModalShow = false;
            },
            deleteExtra(extra, index) {
                this.$delete(extra.itemList, index);
            },
            canShowBookIcon(room) {
                if (this.checkState !== 'checkIn') {
                    return false;
                }

                const rs = this.rooms.filter(r => r.categoryType === room.categoryType);
                const index = rs.indexOf(room);
                return index !== -1 && index < this.initCategories[room.categoryType];
            },
            handleIsCheckInChange(room) {
                if (room.isCheckIn) {
                    room.room.startDate = new Date();
                } else {
                    room.room.startDate = room.originStartDate;
                    room.extraItems = [];
                }
            },
            handleRoomNumChange(item, index, num) {
                this.$set(item, 'timeAmount', Number(num));
                item.room.endDate = new Date(item.room.startDate.getTime() + 1000 * 60 * 60 *  item.timeAmount);
                this.modifyRooms([item]);
            }
        }
};
</script>
