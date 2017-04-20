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
                                       @input="modifyRoom(item)">
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
                                               @input="modifyRoom(item)"
                                               :disabled-date="disabledStartDate(new Date())"
                                               :disabled="item.state === 1"/>
                            </div>
                            <span>~</span>
                            <div class="enterDate">
                                <dd-datepicker placeholder="选择时间" v-model="item.room.endDate"
                                               @input="modifyRoom(item)"
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
                                       @blur="setFirstDateFee(item)"
                                       @focus="setFirstDateFee(item)"
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
                          v-if="(vipDiscountDetail.vipDetail
                                && vipDiscount < 1) || item.quickDiscountId">
                        <span>原价<span class="origin-price">¥{{ item.originPrice }}</span></span>
                        <span class="discount-num"
                              v-if="!item.quickDiscountId && Number(item.price) === getVipPrice(item)">
                            {{vipDiscountDetail.isVip ? '会员' : '企业'}}{{(vipDiscount * 10).toFixed(1)}}折
                        </span>
                        <span class="discount-num" v-if="item.quickDiscountId">
                            {{getQuickDiscountById(item.quickDiscountId).description}}{{getQuickDiscountById(item.quickDiscountId).discount}}折
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
                    <span v-if="(order.rooms || !order.isCombinationOrder) && index === 0 && registerRooms.length > 1" style="margin-left: 16px">
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
                quickDiscounts: []
            };
        },
        created() {
            bus.$on('submitOrder', this.changeRooms);
            bus.$on('hideOrderEditor', this.cleanRooms);
            bus.$on('editOrder', this.initRooms);
            this.initRooms(this.order);
            this.getQuickDiscounts();
        },
        beforeDestroy() {
            bus.$off('submitOrder', this.changeRooms);
            bus.$off('hideOrderEditor', this.cleanRooms);
            bus.$off('editOrder', this.initRooms);
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
            order: {
                type: Object,
                default: {}
            }
        },
        watch: {
            order(order) {
                // this.initRooms(order);
            },
            registerRooms() {

            },
            vipDiscountDetail(newVal, oldVal) {
                if (!newVal.vipDetail && !oldVal.vipDetail) {
                    return false;
                }

                this.rooms.forEach(room => {
                    // 快捷折扣优先级最高
                    if (room.quickDiscountId) {
                        return false;
                    }

                    room.price = this.getVipPrice(room);
                    this.setDateFee(room);
                });
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
                    nodeType: 1
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
                room.price = this.getPrice(room);
                this.setDateFee(room);
            },
            // 计算vip折扣价，如果没有vip折扣价返回原价
            getVipPrice(room) {
                return Number((room.originPrice * this.vipDiscount).toFixed(2));
            },
            // 计算折扣后房间总价，考虑快捷折扣和vip折扣
            getPrice(room) {
                if (!room.quickDiscountId) {
                    return this.getVipPrice(room);
                }

                const quickDiscount = this.quickDiscounts.find(i => i.id === room.quickDiscountId);
                return Number((room.originPrice * (quickDiscount.discount / 10)).toFixed(2));
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
                            })
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
                        })
                    };

                    this.rooms = [room];
                }

                if (this.checkState !== 'editOrder') {
                    this.registerRooms.forEach(item => {
                        let id;
                        this.categories.forEach(category => {
                            category.rooms.forEach(room => {
                                if (room.i === item.roomId) {
                                    id = category.cId;
                                }
                            });
                        });
                        item.endDate = util.diffDate(item.endDate, 1);
                        const duration = this.getDateDiff(item.startDate, item.endDate);
                        http.get('/room/getRoomStaus', { id: item.roomId,
                            date: util.dateFormat(item.startDate),
                            days: duration })
                            .then(res => {
                                const datePriceList = [];
                                let price = 0;
                                res.data.rs.status.forEach((option, index) => {
                                    const fee = Number((option.p * this.getItemDiscountInfo(0, 0, this.vipDiscountDetail).discount).toFixed(2));
                                    datePriceList.push({ date: util.dateFormat(util.diffDate(item.startDate, index)), dateFee: fee, showInput: false });
                                    price += option.p;
                                });
                                // 每日房价分配比例
                                const priceScale = datePriceList.map(dat => {
                                    return dat.dateFee / price;
                                });
                                this.rooms.push({ categoryType: id,
                                    roomType: item.roomId,
                                    price: Number((price * this.getItemDiscountInfo(0, 0, this.vipDiscountDetail).discount).toFixed(2)),
                                    originPrice: Number(price.toFixed(2)),
                                    room: item, idCardList: [],
                                    changeTimes: 0,
                                    showPriceList: false,
                                    datePriceList: datePriceList,
                                    haveRequest: true,
                                    priceScale: priceScale,
                                    showTip: false
                                });
                            });
                    });
                }
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
                    this.modifyRoom(item);
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
            modifyRoom(room) {
                if (room.haveRequest) {
                    room.haveRequest = false;
                    return false;
                }

                const duration = this.dateDiff(room.room.startDate, room.room.endDate);
                if (duration < 1) {
                    room.room.endDate = util.diffDate(new Date(room.room.endDate), 1);
                    return false;
                }
                if (duration > 400) {
                    const currentTime = + new Date();
                    if (currentTime - this.lastModifyRoomTime > 2000) {
                        modal.alert('入住上限最大为400天，请重新选择入住时间！');
                        this.lastModifyRoomTime = currentTime;
                    }
                    return false;
                }
                const startDate = util.dateFormat(new Date(room.room.startDate));
                const endDate = util.dateFormat(new Date(room.room.endDate));

                const params = { id: room.roomType, date: startDate, days: duration < 1 ? 1 : duration };
                if (room.roomOrderId) {
                    params.roomOrderId = room.roomOrderId;
                }
                http.get('/room/getRoomStaus', params)
                    .then(res => {
                        if (res.code === 1) {
                            const datePriceList = [];
                            let countTotalPrice = 0;
                            let price = 0;
                            let oldPrice = 0;
                            let originPrice = 0;
                            const discount = this.vipDiscount;
                            res.data.rs.status.forEach((option, index) => {
                                datePriceList.push({
                                    date: util.dateFormat(util.diffDate(new Date(room.room.startDate), index)),
                                    dateFee: option.p,
                                    originDateFee: option.p,
                                    showInput: false
                                });
                                countTotalPrice += option.p;
                            });
                            // 每日房价分配比例
                            const priceScale = datePriceList.map(dat => {
                                return dat.dateFee / countTotalPrice;
                            });
                            datePriceList.forEach(date => {
                                price += date.dateFee;
                                originPrice += date.originDateFee;
                                if (room.originDatePriceList) {
                                    date.hasFind = false;
                                    room.originDatePriceList.forEach(dat => {
                                        if (date.date === dat.date) {
                                            date.hasFind = true;
                                            oldPrice += dat.dateFee;
                                            price -= date.dateFee;
                                            date.dateFee = dat.dateFee;
                                        }
                                    });
                                }
                            });
                            room.price = Number((Number((price * discount).toFixed(2)) + oldPrice).toFixed(2));
                            room.originPrice = Number(originPrice.toFixed(2));
                            room.datePriceList = datePriceList;
                            room.priceScale = priceScale;
                            // 打折逻辑
                            if (!room.originDatePriceList) {
                                this.setDateFee(room);
                            } else {
                                room.datePriceList.forEach(date => {
                                    if (!date.hasFind) {
                                        date.dateFee = Number((date.dateFee * discount).toFixed(2));
                                    }
                                });
                                const index = room.datePriceList.findIndex(dat => {
                                    return !dat.hasFind;
                                });
                                if (index >= 0) {
                                    const totalPrice = room.datePriceList.reduce((a, b) => {
                                        return a + Number(b.dateFee);
                                    }, 0);
                                    room.datePriceList[index].dateFee = + ((Number(room.datePriceList[index].dateFee) + (room.price - totalPrice)).toFixed(2));
                                }
                            }
                        }
                    });
                const param = {
                    roomId: room.roomType,
                    startDate: startDate,
                    endDate: endDate,
                };
                if (room.roomOrderId) {
                    param.roomOrderId = room.roomOrderId;
                }

                http.get('/room/getStatusAndTotalPrice', param)
                    .then(res => {
                        // 不可用
                        room.showTip = !res.data.available;
                        /* room.datePriceList = res.data.datePriceList;
                        room.datePriceList.map(i => {
                            i.originDateFee = i.dateFee;
                            i.showInput = false;
                        });
                        // 计算价格比例
                        room.priceScale = room.datePriceList.map(dat => {
                            return dat.dateFee / res.data.fee;
                        });
                        room.originPrice = res.data.fee;
                        room.price = this.getPrice(room);
                        if (!room.originDatePriceList) {
                            this.setDateFee(room);
                        } else {
                            room.datePriceList.map(date => {
                                const originDate = this.originDatePriceList.find(i => i.date === date.date);
                                if (!originDate) {
                                    date.dateFee = Number((date.dateFee * this.vipDiscount).toFixed(2));
                                }
                            });
                        } */
                    });
            },
            changeRoomFee(room) {
                // 手动修改价格需要把快捷折扣置为无
                room.quickDiscountId = '';
                this.setDateFee(room);
            },
            // 设置每日房价
            setDateFee(room) {
                const price = room.price;
                const priceScale = room.priceScale;
                room.datePriceList.forEach((item, index) => {
                    item.dateFee = Number((price * priceScale[index]).toFixed(2));
                });
                this.setFirstDateFee(room);
            },
            // 误差处理，将误差加至第一天
            setFirstDateFee(room) {
                const price = room.price;
                const totalPrice = room.datePriceList.reduce((a, b) => {
                    return a + Number(b.dateFee);
                }, 0);
                room.datePriceList[0].dateFee = + ((Number(room.datePriceList[0].dateFee) + (price - totalPrice)).toFixed(2));
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
