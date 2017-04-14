<template>
    <div class="content-item">
        <p class="content-item-title">
            <span>房间信息</span>
            <span class="increase-container" @click="addRoom" v-if="order.rooms || (order.roomInfo && !order.isCombinationOrder)">
                <span class="increase-icon"></span>添加房间
            </span>
        </p>
        <div class="registerRoom-items">
            <div class="registerRoom-container" v-for="(item,index) in registerRooms">
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
                                <input class="dd-input fee-input" v-model="item.price"
                                       @input="setDateFee(item.price, item)"
                                       @blur="setFirstDateFee(item.price, item)"
                                       @focus="setFirstDateFee(item.price, item)"
                                       style="width: 80px" type="number"
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
                                        <input class="dd-input" style="width: 60px;" type="number"
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
                          v-if="vipDiscountDetail.vipDetail
                                && getItemDiscountInfo(0, 0, vipDiscountDetail).discount < 1">
                        <span>原价<span class="origin-price">¥{{ item.originPrice }}</span></span>
                        <span class="discount-num"
                              v-if="Number(item.price) === Number((item.originPrice * getItemDiscountInfo(0, 0, vipDiscountDetail).discount).toFixed(2))">
                            {{`${vipDiscountDetail.isVip ? '会员' : '企业'}${(getItemDiscountInfo(0, 0, vipDiscountDetail).discount * 10).toFixed(1)}折`}}
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
</style>
<script>
    import CheckInPerson from '../CheckInPerson.vue';
    import modal from '../../../common/modal';
    import { DdSelect, DdOption, DdDatepicker } from 'dd-vue-component';
    import Clickoutside from 'dd-vue-component/src/utils/clickoutside';
    import http from '../../../common/AJAXService';
    import util from '../../../common/util';
    import event from '../../event';
    export default{
        data() {
            return {
                registerRooms: []
            };
        },
        created() {
            event.$on('submitOrder', this.changeRooms);
            this.initRooms(this.order);
        },
        beforeDestroy() {
            event.$off('submitOrder', this.changeRooms);
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
            order: {
                type: Object,
                default: {}
            }
        },
        watch: {
            order(order) {
                this.initRooms(order);
            }
        },
        computed: {
            totalPrice() {
                const price = this.registerRooms.reduce((sum, room) => {
                    return sum + room.price;
                }, 0);
                this.$emit('priceChange', price);
                return price;
            }
        },
        methods: {
            initRooms(order) {
                if (order.rooms) {
                    const filterRooms = order.rooms.filter(room => {
                        return room.state === 0 || room.state === 1;
                    });
                    this.registerRooms = filterRooms.map(item => {
                        return {
                            categoryType: item.typeId,
                            roomType: item.roomId,
                            originPrice: item.originPrice,
                            price: Number(item.fee.toFixed(2)),
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
                            roomOrderId: item.serviceId
                        };
                    });
                }

                if (order.roomInfo) {
                    const roomInfo = order.roomInfo;
                    const room = {
                        categoryType: roomInfo.subTypeId,
                        roomType: roomInfo.roomId,
                        originPrice: roomInfo.originPrice,
                        price: Number(roomInfo.price.toFixed(2)),
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
                        roomOrderId: order.roomOrderId
                    };
                    this.registerRooms = [room];
                }
            },
            addRoom() {
                const len = this.registerRooms.length;
                if (this.registerRooms.length >= 99) {
                    modal.somethingAlert('一个订单最多添加99间房!');
                    return false;
                }
                // 新增房间，房型时间同上一间
                const room = JSON.parse(JSON.stringify(this.registerRooms[len - 1]));
                room.idCardList = [];
                if (room.roomOrderId) {
                    delete room.roomOrderId;
                    delete room.state;
                    delete room.originDatePriceList;
                    delete room.haveRequest;
                }

                this.registerRooms.push(room);
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
                            const disable = (date.valueOf() > (new Date(arr1[0], arr1[1] - 1, arr1[2])).valueOf());
                            return disable;
                        };
                    } else {
                        const str = util.dateFormat(new Date(startDate));
                        const arr = str.split('-');
                        const str1 = util.dateFormat(new Date());
                        const arr1 = str1.split('-');
                        return (date) => {
                            const disable = (date.valueOf() <= (new Date(arr[0], arr[1] - 1, arr[2])).valueOf()) || (date.valueOf() > (new Date(arr1[0], arr1[1] - 1, arr1[2])).valueOf());
                            return disable;
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
                this.registerRooms.forEach(item => {
                    item.showPriceList = false;
                    item.datePriceList.forEach(date => {
                        date.showInput = false;
                    });
                });
                this.vipListShow = false;
                this.vipList = [];
            },
            modifyRoom(item) {
                if (item.haveRequest) {
                    item.haveRequest = false;
                    return false;
                }

                const duration = this.dateDiff(item.room.startDate, item.room.endDate);
                if (duration < 1) {
                    item.room.endDate = util.diffDate(new Date(item.room.endDate), 1);
                    return false;
                }
                if (duration > 400) {
                    const currentTime = + new Date();
                    if (currentTime - this.lastModifyRoomTime > 2000) {
                        modal.somethingAlert('入住上限最大为400天，请重新选择入住时间！');
                        this.lastModifyRoomTime = currentTime;
                    }
                    return false;
                }
                const startDate = util.dateFormat(new Date(item.room.startDate));
                const endDate = util.dateFormat(new Date(item.room.endDate));

                const paramsObj = { id: item.roomType, date: startDate, days: duration < 1 ? 1 : duration };
                if (item.roomOrderId) {
                    paramsObj.roomOrderId = item.roomOrderId;
                }
                http.get('/room/getRoomStaus', paramsObj)
                    .then(res => {
                        if (res.code === 1) {
                            const datePriceList = [];
                            let countTotalPrice = 0;
                            let price = 0;
                            let oldPrice = 0;
                            let originPrice = 0;
                            const discount = this.getItemDiscountInfo(0, 0, this.vipDiscountDetail).discount;
                            res.data.rs.status.forEach((option, index) => {
                                datePriceList.push({
                                    date: util.dateFormat(util.diffDate(new Date(item.room.startDate), index)),
                                    dateFee: option.p,
                                    originDateFee: option.p,
                                    showInput: false
                                });
                                countTotalPrice += option.p;
                            });
                            const countArr = datePriceList.map(dat => {
                                return dat.dateFee / countTotalPrice;
                            });
                            datePriceList.forEach(date => {
                                price += date.dateFee;
                                originPrice += date.originDateFee;
                                if (item.originDatePriceList) {
                                    date.hasFind = false;
                                    item.originDatePriceList.forEach(dat => {
                                        if (date.date === dat.date) {
                                            date.hasFind = true;
                                            oldPrice += dat.dateFee;
                                            price -= date.dateFee;
                                            date.dateFee = dat.dateFee;
                                        }
                                    });
                                }
                            });
                            item.price = Number((Number((price * discount).toFixed(2)) + oldPrice).toFixed(2));
                            item.originPrice = Number(originPrice.toFixed(2));
                            item.datePriceList = datePriceList;
                            item.countArr = countArr;
                            if (!item.originDatePriceList) {
                                this.setDateFee(item.price, item);
                            } else {
                                item.datePriceList.forEach(date => {
                                    if (!date.hasFind) {
                                        date.dateFee = Number((date.dateFee * discount).toFixed(2));
                                    }
                                });
                                const index = item.datePriceList.findIndex(dat => {
                                    return !dat.hasFind;
                                });
                                if (index >= 0) {
                                    const totalPrice = item.datePriceList.reduce((a, b) => {
                                        return a + Number(b.dateFee);
                                    }, 0);
                                    item.datePriceList[index].dateFee = + ((Number(item.datePriceList[index].dateFee) + (item.price - totalPrice)).toFixed(2));
                                }
                            }
                        }
                    });
                const params = { roomId: item.roomType, startDate: startDate, endDate: endDate };
                if (item.roomOrderId) {
                    params.roomOrderId = item.roomOrderId;
                }

                http.get('/room/getStatusAndTotalPrice', params)
                    .then(res => {
                        if (res.code === 1) {
                            item.showTip = !res.data.available;
                        } else {
                            modal.alert(res.msg);
                        }
                    });
            },
            setDateFee(num, obj) {
                const countArr = obj.countArr;
                obj.datePriceList.forEach((item, index) => {
                    item.dateFee = Number((num * countArr[index]).toFixed(2));
                });
                this.setFirstDateFee(num, obj);
            },
            setFirstDateFee(num, obj) {
                const totalPrice = obj.datePriceList.reduce((a, b) => {
                    return a + Number(b.dateFee);
                }, 0);
                obj.datePriceList[0].dateFee = + ((Number(obj.datePriceList[0].dateFee) + (num - totalPrice)).toFixed(2));
            },
            showPriceList(id) {
                this.registerRooms.forEach((item, index) => {
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
            setTotalPrice(obj) {
                obj.price = + (obj.datePriceList.reduce((a, b) => {
                    return a + Number(b.dateFee);
                }, 0).toFixed(2));
            },
            deleteRoom(index) {
                if (this.registerRooms.length <= 1) {
                    modal.alert('已经是最后一间房间了!');
                    return false;
                }
                this.registerRooms.splice(index, 1);
            },
            getItemDiscountInfo(nodeId, nodeType, obj) {
                let item = { discount: 1 };
                if (obj.vipDetail && obj.vipDetail.discountList.length > 0) {
                    obj.vipDetail.discountList.forEach(list => {
                        if ((nodeType === 0 || nodeType === 3) && list.nodeId === 0 && list.nodeType === nodeType) {
                            item = { ...list };
                        } else if ((nodeType !== 0 && nodeType !== 3) && (list.nodeId === nodeId && list.nodeType === nodeType)) {
                            item = { ...list };
                        }
                    });
                }

                return item;
            },
            addPerson(id, obj) {
                this.registerRooms.forEach((item, index) => {
                    if (index === id) {
                        if (item.idCardList && item.idCardList.length >= 20) {
                            modal.alert('一间房最多添加20个入住人');
                            return false;
                        }

                        if (item.idCardList) {
                            item.idCardList.push(obj);
                        } else {
                            item.idCardList = [];
                            item.idCardList.push(obj);
                        }
                    }
                });
            },
            deletePerson(id, num) {
                this.registerRooms.forEach((item, index) => {
                    if (index === id) {
                        item.idCardList.splice(num, 1);
                    }
                });
            },
            changeRooms() {
                this.$emit('change', this.registerRooms);
            }
        }
    };
</script>
