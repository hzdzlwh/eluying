<template>
    <div class="content-item">
        <p class="content-item-title dashed">
            <span>房间信息
                <span class="increase-container" @click="addRoom" v-if="checkState !=='editOrder' || order.rooms || (order.roomInfo && !order.isCombinationOrder)">
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
                <div class="registerRoom-item">
                    <span class="room-icon"></span>
                    <div class="shop-item-content">
                        <span class="useless-tip error" v-if="item.showTip">该房间已被占用</span>
                        <div style="display: flex">
                            <dd-select v-model="item.categoryType" placeholder="请选择房型"
                                       @input="changeRoomType(item ,index)">
                                <dd-option v-for="category in categories" :value="category.typeId" :key="category.typeId"
                                           :label="category.name">
                                </dd-option>
                            </dd-select>
                            <div class="room-category">
                                <dd-select v-model="item.roomType" placeholder="请选择房间"
                                           @input="handleRoomChange(item, index)">
                                    <dd-option v-for="room in getRoomsList(item.categoryType)" :value="room.id"
                                               :key="room.id"
                                               :label="room.name">
                                    </dd-option>
                                </dd-select>
                            </div>
                        </div>
                        <div class="room-date" style="display: inline-block; position: relative;">
                            <span class="useless-tip error" style="left: 28px;"
                                  v-if="checkIsToday(item.room.startDate)">
                                该房间的入住时间必需为今日！
                            </span>
                            <label class="label-text">入住</label>
                            <div class="enterDate">
                                <dd-datepicker placeholder="选择时间" v-model="item.room.startDate"
                                               @input="handleRoomChange(item, index)"
                                               :disabled-date="disabledStartDate(new Date())"
                                               :disabled="item.state === 1 || item.state === 8"/>
                            </div>
                            <span>~</span>
                            <div class="enterDate">
                                <dd-datepicker placeholder="选择时间" v-model="item.room.endDate"
                                               @input="handleRoomChange(item, index)"
                                               :disabled="item.state === 8"
                                               :disabled-date="disabledEndDate(item.room.startDate)"/>
                            </div>
                            <label class="label-text">
                                共{{dateDiff(item.room.startDate, item.room.endDate)}}晚
                            </label>
                        </div>
                        <div class="registerInfoModal-roomPrice" @click.stop="()=>{}">
                            <label class="label-text">房费</label>
                            <p class="fee-container">
                                <span class="fee-symbol">¥</span>
                                <input class="dd-input fee-input" v-model.number="item.price"
                                       @input="changeRoomFee(item)"
                                       @blur="setFirstDayFee(item)"
                                       @focus="setFirstDayFee(item)"
                                       style="width: 80px"
                                       @click.stop="showPriceList(index)"/>
                            </p>
                            <div class="registerInfoModal-roomPriceList" v-if="item.showPriceList && item.datePriceList.length > 1" v-clickoutside="hidePriceList">
                                <dl class="price-item" v-for="priceItem in item.datePriceList">
                                    <dt>{{priceItem.date.slice(5)}}</dt>
                                    <dd v-show="!priceItem.showInput"
                                        @click="changShowInput(item, priceItem)">
                                        ¥{{priceItem.dateFee}}
                                    </dd>
                                    <dd v-show="priceItem.showInput">
                                        <input class="dd-input" style="width: 60px;"
                                               v-model.number="priceItem.dateFee"
                                               @input="setTotalPrice(item)">
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <span class="delete-icon" @click="deleteRoom(index)"
                          v-if="!item.state || ((item.state !== 1 && item.state !== 8) && ((order.roomInfo && !order.isCombinationOrder) || order.rooms))">
                    </span>
                    <span v-if="item.state === 1" class="delete-icon-like"></span>
                    <span class="discount-info">
                        <span v-if="item.showDiscount && !item.priceModified">
                            <span>原价<span class="origin-price">¥{{ item.originPrice }}</span></span>
                            <span class="discount-num"
                                  v-if="item.showDiscount">
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
                <CheckInPerson
                        :personsObj="{id: index, persons: item.idCardList}"
                        @addPerson="addPerson"
                        @deletePerson="deletePerson"/>
                <span v-show="false">{{totalPrice}}</span>
            </div>
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
            top: -18px;
            left: -55px;
            width: 0;
            height: 0;
        }
        .dd-select {
            width: 120px;
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
    import { DdSelect, DdOption, DdDatepicker, DdGroupOption } from 'dd-vue-component';
    import Clickoutside from 'dd-vue-component/src/utils/clickoutside';
    import http from '../../../http';
    import util from '../../../util';
    import bus from '../../../eventBus';
    import Vue from 'vue';
    export default{
        data() {
            return {
                rooms: [],
                quickDiscounts: [],
                forceChangePrice: false, // 更改过渠道后，不保留原始价格，请求价格都需要传这个
                lastRoomsToken: {}, // 这个东西是为了防止相同的请求数据而去重复请求价格列表，同时防止初始化数据时调用接口
                discountPlans: []
            };
        },
        created() {
            bus.$on('submitOrder', this.changeRooms);
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
        },
        components: {
            CheckInPerson,
            DdSelect,
            DdOption,
            DdDatepicker,
            DdGroupOption
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
            vipCardInfo(vipCardInfo) {
                const discounts = vipCardInfo.discount && vipCardInfo.discount < 10 ? [{
                    id: -4,
                    name: vipCardInfo.name,
                    serialNum: vipCardInfo.serialNum,
                    discount: vipCardInfo.discount
                }] : [];
                Vue.set(this.discountPlans, 1, {
                    label: vipCardInfo.tag,
                    discounts: discounts
                });
            },
            vipCardId(id, oldId) {
                // 会员折扣id为-4
                const discounts = this.vipCardInfo.discount && this.vipCardInfo.discount < 10 ? [{
                    id: -4,
                    name: this.vipCardInfo.name,
                    serialNum: this.vipCardInfo.serialNum,
                    discount: this.vipCardInfo.discount
                }] : [];
                Vue.set(this.discountPlans, 1, {
                    label: this.vipCardInfo.tag,
                    discounts: discounts
                });
                if (id !== 0) {
                    this.rooms.map(r => {
                        if (!r.quickDiscountId && oldId !== undefined) {
                            r.moreDiscount = this.userOriginType.id;
                        }
                    });
                }
                if (this.rooms.length > 0) {
                    this.forceChangePrice = true;
                    // 更改渠道
                    this.modifyRooms(this.rooms);
                }
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
            }
        },
        computed: {
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
                        return discountChannel === 1 ? -4 : -5;
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
                            room: { roomId: item.roomId, startDate: item.startDate, endDate: item.endDate },
                            idCardList: item.idCardList,
                            datePriceList: item.datePriceList.map(dat => {
                                const newDate = { showInput: false };
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
                            moreDiscount: getMoreDiscount(item)
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
                        room: { roomId: roomInfo.roomId, startDate: roomInfo.checkInDate, endDate: roomInfo.checkOutDate },
                        idCardList: order.idCardsList,
                        datePriceList: order.datePriceList.map(dat => {
                            const newDate = { showInput: false };
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
                        showDiscount: order.roomInfo.showDiscount,
                        moreDiscount: getMoreDiscount(order)
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
                        moreDiscount: 0
                    };
                });
            },
            addRoom() {
                const len = this.rooms.length;
                if (this.rooms.length >= 99) {
                    modal.warn('一个订单最多添加99间房!');
                    return false;
                }

                let room;
                if (len === 0 || !this.rooms[len - 1].roomType) {
                    room = {
                        categoryType: undefined,
                        roomType: undefined,
                        originPrice: undefined,
                        price: undefined,
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
                        showDiscount: undefined
                    };
                } else {
                    // 新增房间，房型时间同上一间
                    room = JSON.parse(JSON.stringify(this.rooms[len - 1]));
                    room.idCardList = [];
                    if (room.roomOrderId) {
                        delete room.roomOrderId;
                        delete room.state;
                        delete room.originDatePriceList;
                    }
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
                    item.roomType = this.getRoomsList(item.categoryType)[0].id;
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
            getRoomsList(id) {
                if (!id) {
                    return [];
                }

                const category = this.categories.find(c => c.typeId === id);
                return category.rooms.map(r => {
                    return { id: r.roomId, name: r.serialNum };
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
                    const currentTime = + new Date();
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
                rooms = rooms.filter(r => r.roomType);
                if (rooms.length === 0) {
                    return false;
                }

                // 会员-1，企业-2,会员卡-4
                let discountChannel;
                let discountRelatedId; // eslint-disable-line
                if (this.userOriginType && this.userOriginType.id === -5) {
                    discountRelatedId = this.userOriginType.companyId;
                    discountChannel = 2;
                } else if (this.userOriginType && this.userOriginType.id === -4) {
                    // 会员渠道分为会员等级和会员卡
                    if (!this.vipId || !this.vipCardId) {
                        return false;
                    }

                    discountRelatedId = this.vipCardId > 0 ? this.vipCardId : this.vipId;
                    discountChannel = this.vipCardId > 0 ? 4 : 1;
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
                            startDate: room.room.startDate,
                            endDate: room.room.endDate,
                            quickDiscountId: room.quickDiscountId,
                            roomOrderId: room.roomOrderId,
                            roomId: room.roomType,
                            useDiscount: !!room.moreDiscount
                        };
                    })),
                    forceChangePrice: this.forceChangePrice
                };
                http.get('/room/getRoomStatusAndPriceList', params)
                    .then(res => {
                        if (res.code === 1) {
                            res.data.list.map((item, index) => {
                                const currentRoom = rooms[index];
                                currentRoom.datePriceList = item.datePriceList.map(i => {
                                    return {
                                        ...i,
                                        showInput: false
                                    };
                                });
                                currentRoom.showTip = !item.available;
                                currentRoom.price = item.totalFee;
                                // 每日房价分配比例
                                currentRoom.priceScale = item.datePriceList.map(i => {
                                    return item.totalFee === 0 ? 1 / item.datePriceList.length : i.dateFee / item.totalFee;
                                });
                                currentRoom.showDiscount = item.showDiscount;
                                currentRoom.priceModified = false;
                                currentRoom.originPrice = item.originTotalFee;
                            });
                        }
                    });
            },
            changeRoomFee(room) {
                // 手动修改价格需要把快捷折扣置为无
                room.quickDiscountId = '';
                this.setDayFee(room);
                room.priceModified = true; // 手动改过的价格不显示折扣标签
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
                room.price = + (room.datePriceList.reduce((a, b) => {
                    return a + Number(b.dateFee);
                }, 0).toFixed(2));
                room.priceModified = true; // 手动改过的价格不显示折扣标签
            },
            deleteRoom(index) {
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
            },
            moreDiscountChange(room) {
                this.forceChangePrice = true;
                this.modifyRooms([room]);
            }
        }
    };
</script>
