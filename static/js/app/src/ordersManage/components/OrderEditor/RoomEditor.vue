<template>
    <div class="content-item">
        <p class="content-item-title">
            <span>房间信息</span>
            <span class="increase-container" @click="addRoom" v-if="order.rooms || (order.roomInfo && !order.isCombinationOrder)">
                <span class="increase-icon"></span>添加房间
            </span>
        </p>
        <div class="registerRoom-items">
            <div class="registerRoom-container" v-for="(item,index) in rooms">
                <div class="registerRoom-item">
                    <span class="room-icon"></span>
                    <div class="shop-item-content">
                        <span class="useless-tip error" v-if="item.showTip">该房间已被占用</span>
                        <dd-select v-model="item.categoryType" placeholder="请选择房型"
                                   @input="changeRoomType(item)">
                            <dd-option v-for="category in categories" :value="category.typeId" :key="category.typeId"
                                       :label="category.name">
                            </dd-option>
                        </dd-select>
                        <div class="room-category">
                            <dd-select v-model="item.roomType" placeholder="请选择房间"
                                       @input="handleRoomChange(item)">
                                <dd-option v-for="room in getRoomsList(item.categoryType)" :value="room.id"
                                           :key="room.id"
                                           :label="room.name">
                                </dd-option>
                            </dd-select>
                        </div>
                        <div class="room-date" style="display: inline-block; position: relative;">
                            <span class="useless-tip error" style="left: 28px;"
                                  v-if="checkIsToday(item.room.startDate)">
                                该房间的入住时间必需为今日！
                            </span>
                            <label class="label-text">入住</label>
                            <div class="enterDate">
                                <dd-datepicker placeholder="选择时间" v-model="item.room.startDate"
                                               @input="handleRoomChange(item)"
                                               :disabled-date="disabledStartDate(new Date())"
                                               :disabled="item.state === 1"/>
                            </div>
                            <span>~</span>
                            <div class="enterDate">
                                <dd-datepicker placeholder="选择时间" v-model="item.room.endDate"
                                               @input="handleRoomChange(item)"
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
                            <div class="registerInfoModal-roomPriceList" v-if="item.showPriceList" v-clickoutside="hidePriceList">
                                <dl class="price-item" v-for="priceItem in item.datePriceList">
                                    <dt>{{priceItem.date.slice(5)}}</dt>
                                    <dd v-show="!priceItem.showInput"
                                        @click="changShowInput(item, priceItem)">
                                        ¥{{priceItem.dateFee}}
                                    </dd>
                                    <dd v-show="priceItem.showInput">
                                        <input class="dd-input" style="width: 60px;"
                                               v-model="priceItem.dateFee"
                                               @input="setTotalPrice(item)">
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <span class="delete-icon" @click="deleteRoom(index)"
                          v-if="(!item.state || item.state !== 1) && ((order.roomInfo && !order.isCombinationOrde) || order.rooms)">
                    </span>
                    <span v-if="item.state === 1" class="delete-icon-like"></span>
                    <span class="discount-info"
                          v-if="item.showDiscount && !item.priceModified">
                        <span>原价<span class="origin-price">¥{{ item.originPrice }}</span></span>
                        <span class="discount-num"
                              v-if="item.showDiscount">
                            {{item.showDiscount}}
                        </span>
                    </span>
                </div>
                <div style="margin-top: 15px;padding-left: 41px">
                    <span>快捷折扣</span>
                    <span style="width: 179px;display: inline-block" class="room-category">
                        <dd-select v-model="item.quickDiscountId" placeholder="请选择快捷折扣" @input="quickDiscountIdChange(item)">
                            <dd-option v-for="discount in quickDiscounts"
                                       :value="discount.id"
                                       :key="discount.id"
                                       :label="discount.label">
                            </dd-option>
                        </dd-select>
                    </span>
                    <span v-if="(order.rooms || !order.isCombinationOrder) && index === 0 && rooms.length > 1" style="margin-left: 16px">
                        <input style="width: auto" v-model="allQuick" type="checkbox" class="dd-checkbox">
                        <span>应用到所有房间</span>
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
</style>
<script>
    import CheckInPerson from '../CheckInPerson.vue';
    import modal from '../../../common/modal';
    import { DdSelect, DdOption, DdDatepicker } from 'dd-vue-component';
    import Clickoutside from 'dd-vue-component/src/utils/clickoutside';
    import http from '../../../common/http';
    import util from '../../../common/util';
    import bus from '../../../common/eventBus';
    export default{
        data() {
            return {
                rooms: [],
                quickDiscounts: [],
                lastRoomsToken: {}
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
            DdDatepicker
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
            order: {
                type: Object,
                default: {}
            }
        },
        watch: {
            userOriginType(origin) {
                if (this.rooms.length > 0) {
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
            }
        },
        computed: {
            totalPrice() {
                const price = this.rooms.reduce((sum, room) => {
                    return sum + room.price;
                }, 0);
                this.$emit('priceChange', price);
                return price;
            },
            allQuick: {
                get() {
                    if (this.rooms.length < 2) {
                        return false;
                    }

                    const firstId = this.rooms[0].quickDiscountId;
                    return this.rooms.every(room => room.quickDiscountId === firstId);
                },
                set(val) {
                    if (val === true) {
                        const firstId = this.rooms[0].quickDiscountId;
                        this.rooms.map(room => room.quickDiscountId = firstId);
                    }
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
                        // 默认选项
                        this.quickDiscounts.unshift({
                            id: '',
                            label: '无'
                        });
                    });
            },
            getQuickDiscountById(id) {
                return this.quickDiscounts.find(i => id === i.id) || {};
            },
            quickDiscountIdChange(room) {
                this.modifyRooms([room]);
            },
            // 计算vip折扣价，如果没有vip折扣价返回原价
            getVipPrice(room) {
                return Number((room.originPrice * this.vipDiscount).toFixed(2));
            },
            initRooms() {
                const order = this.order;

                // 组合订单
                if (order.rooms) {
                    const filterRooms = order.rooms.filter(room => {
                        return room.state === 0 || room.state === 1;
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
                                return dat.dateFee / item.fee;
                            }),
                            showDiscount: item.showDiscount
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
                            return dat.dateFee / roomInfo.totalPrice;
                        }),
                        showDiscount: order.discountRelatedName
                    };

                    this.rooms = [room];
                }
                this.rooms.map(room => {
                    this.lastRoomsToken[room.roomType] = JSON.stringify(room);
                });
            },
            initRegisterRooms(rooms) {
                rooms.forEach(item => {
                    item.endDate = util.diffDate(item.endDate, 1);
                    const duration = this.dateDiff(item.startDate, item.endDate);
                    http.get('/room/getRoomStaus', { id: item.roomId,
                        date: util.dateFormat(item.startDate),
                        days: duration })
                        .then(res => {
                            const datePriceList = [];
                            let price = 0;
                            res.data.rs.status.forEach((option, index) => {
                                const fee = option.p;
                                datePriceList.push({ date: util.dateFormat(util.diffDate(item.startDate, index)), dateFee: fee, showInput: false });
                                price += option.p;
                            });
                            // 每日房价分配比例
                            const priceScale = datePriceList.map(dat => {
                                return dat.dateFee / price;
                            });
                            this.rooms.push({
                                categoryType: item.categoryType,
                                roomType: item.roomId,
                                price: Number(price.toFixed(2)),
                                originPrice: Number(price.toFixed(2)),
                                room: item, idCardList: [],
                                changeTimes: 0,
                                showPriceList: false,
                                datePriceList: datePriceList,
                                haveRequest: true,
                                priceScale: priceScale,
                                showTip: false,
                                quickDiscountId: ''
                            });
                        });
                });
                this.rooms.map(room => {
                    this.lastRoomsToken[room.roomType] = JSON.stringify(room);
                });
            },
            addRoom() {
                const len = this.rooms.length;
                if (this.rooms.length >= 99) {
                    modal.alert('一个订单最多添加99间房!');
                    return false;
                }

                // 新增房间，房型时间同上一间
                const room = JSON.parse(JSON.stringify(this.rooms[len - 1]));
                room.idCardList = [];
                if (room.roomOrderId) {
                    delete room.roomOrderId;
                    delete room.state;
                    delete room.originDatePriceList;
                    delete room.haveRequest;
                }

                this.rooms.push(room);
            },
            dateDiff(date1, date2) {
                const d1 = new Date(date1);
                const d2 = new Date(date2);
                return util.DateDiff(d1, d2);
            },
            changeRoomType(item) {
                this.$nextTick(function() {
                    item.roomType = this.getRoomsList(item.categoryType)[0].id;
                    this.handleRoomChange(item);
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
            handleRoomChange(room) {
                if (JSON.stringify(room) === this.lastRoomsToken[room.roomType]) {
                    return false;
                }

                const duration = this.dateDiff(room.room.startDate, room.room.endDate);
                if (duration < 1) {
                    room.room.endDate = util.diffDate(new Date(room.room.endDate), 1);
                    return false;
                }

                // 最多400天
                if (duration > 400) {
                    const currentTime = + new Date();
                    if (currentTime - this.lastModifyRoomTime > 2000) {
                        modal.alert('入住上限最大为400天，请重新选择入住时间！');
                        this.lastModifyRoomTime = currentTime;
                    }
                    return false;
                }

                this.modifyRooms([room]);
            },
            modifyRooms(rooms) {
                // 会员-1，企业-2
                const discountChannel = { '-4': 1, '-5': 2 }[this.userOriginType && this.userOriginType.id];
                let discountRelatedId; // eslint-disable-line
                if (this.userOriginType && this.userOriginType.id === -5) {
                    discountRelatedId = this.userOriginType.companyId;
                } else if (this.userOriginType && this.userOriginType.id === -4) {
                    discountRelatedId = this.vipDiscountDetail.vipDetail.vipId;
                }

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
                            roomId: room.roomType
                        };
                    }))
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
                                    return i.dateFee / item.totalFee;
                                });
                                currentRoom.showDiscount = item.showDiscount;
                                currentRoom.priceModified = false;
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
                // 每日房价相加
                const totalPrice = room.datePriceList.reduce((a, b) => {
                    return a + Number(b.dateFee);
                }, 0);
                room.datePriceList[0].dateFee = (Number(room.datePriceList[0].dateFee) + (price - totalPrice)).toFixed(2);
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
                room.price = + (room.datePriceList.reduce((a, b) => {
                    return a + Number(b.dateFee);
                }, 0).toFixed(2));
            },
            deleteRoom(index) {
                this.rooms.splice(index, 1);
            },
            addPerson(id, preson) {
                this.rooms.forEach((item, index) => {
                    if (index === id) {
                        if (item.idCardList && item.idCardList.length >= 20) {
                            modal.alert('一间房最多添加20个入住人');
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
            }
        }
    };
</script>
