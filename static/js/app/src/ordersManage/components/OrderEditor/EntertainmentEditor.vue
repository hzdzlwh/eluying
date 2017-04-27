<template>
    <div>
        <div class="content-item">
            <p class="content-item-title">
                <span>娱乐信息</span>
                <span class="increase-container" @click="addItem(2)" v-if='order.type === ORDER_TYPE.ACCOMMODATION || order.type === ORDER_TYPE.COMBINATION || order.type === undefined'>
                                    <span class="increase-icon"></span> 添加项目
                </span>
            </p>
            <div class="shop-items">
                <div class="shop-item" v-for="(item, index) in enterItems" v-if='order.orderState === 8 || !orderType || item.state === 0 ||item.state === 8 || item.state === 1 || item.state === undefined' :key="index">
                    <span class="enter-icon"></span>
                    <div class="shop-item-content">
                        <div>
                            <input class="dd-input" :value="item.name " @click="showEnterSelectModal(index)" :disabled="orderType === 0 || item.usedAmount > 0 || order.orderState === 8 && !item.isnew" />
                        </div>
                        <!-- <span v-if="item.usedAmount > 0">{{item.name}}</span> -->
                      <!--   <div class="time-container" style="width: 145px" v-if="!item['unitTime'] && item.usedAmount <= 0">
                        </div> -->
                        <div class="time-container" v-if="!!item['unitTime'] && item.usedAmount <= 0">
                            <label>时长({{item['timeUnit'] || item.chargeUnit}}）</label>
                            <span v-if='order.orderState === 1 || order.state === 1  && !item.isnew' class="counterSpan">{{item.timeAmount * item['unitTime']}}</span>
                            <counter @numChange="handleNumChange" :num="item.timeAmount * item['unitTime']" :id="index" :type="-2" :step="item['unitTime']" v-else>
                            </counter>

                        </div>
                        <span v-if="item.usedAmount > 0 && item.chargeUnit" >
                                            {{`时长(${item.chargeUnit})`}}
                                            <span style="margin-left: 15px;">{{item.timeAmount * item.chargeUnitTime}}</span>
                        </span>
                        <div class="enterDate-container">
                            <label>时间</label>
                            <div class="enterDate">
                                <dd-datepicker placeholder="选择时间" v-model="item.date" @input="modifyEnter(item)" :disabled-date="disabledEndDate(new Date(), item)"  />
                                <!-- :disabled="item.usedAmount > 0" 如果有项目开了也可以编辑 -->
                            </div>
                        </div>
                        <div class="shop-item-count">
                            <label>数量</label>
                            <span v-if='order.orderState === 8 && !item.isnew' class="counterSpan">{{item.count}}</span>
                            <counter @numChange="handleNumChange" :num="item.count" :id="index" :type="2" :min="item.usedAmount >=1 ? item.usedAmount : 1" :max="(item.inventory + item.selfInventory) >= 0 ? (item.inventory + item.selfInventory) : 999" v-else>
                                <p class="valid" v-if="(item.inventory + item.selfInventory) >= 0 && checkState !== 'finish'" :class="(item.inventory + item.selfInventory) <= 0 ? 'error' : ''">
                                    <span style="vertical-align: text-bottom">&uarr;</span> 服务上限剩余{{item.inventory + item.selfInventory}}
                                </p>
                            </counter>

                            <p class="shop-item-price">
                                <label>小计</label>
                                <p class="fee-container">
                                    <span class="fee-symbol">¥</span>
                                    <input type="number" class="dd-input fee-input" style="width: 80px" v-model="item.totalPrice" />
                                </p>
                            </p>
                        </div>
                    </div>
                    <span class="delete-icon" @click="deleteItem(item.type, index)" v-if="orderType && item.usedAmount <= 0 && orderType && (item.state === 0 || item.state === undefined ) ">
                                    </span>
                    <span v-if="item.usedAmount > 0" class="delete-icon-like"></span>
                    <span class="discount-info" style="top: 28px" v-if="vipDiscountDetail.vipDetail
                                          && getItemDiscountInfo(item.nodeId).discount < 1">
                                            <span>原价<span class="origin-price">¥{{ item.originPrice }}</span></span>
                    <span class="discount-num" v-if="Number(item.totalPrice) === Number(((item['price']
                                                                         * getItemDiscountInfo(item.nodeId).discount).toFixed(2)
                                                                         * item.count * item.timeAmount).toFixed(2))">
                                                {{`${vipDiscountDetail.isVip ? '会员' : '企业'}${(getItemDiscountInfo(item.nodeId, item.type, vipDiscountDetail).discount * 10).toFixed(1)}折`}}
                                            </span>
                    </span>
                </div>
            </div>
        </div>
        <div v-if="enterList.length > 0">
            <selectProject :show="enterSelectModalShow" :selectDate="enterList" @close="closeEnterModal" @selectProjectDate="setEnterItems" />
        </div>
    </div>
</template>
<style scoped>
.counterSpan{
    width: 66px;
    text-align: center;
    display: inline-block;
}
</style>
<script>
import {
    DdDatepicker
} from 'dd-vue-component';
import {
    mapState
} from 'vuex';
import counter from '../../../common/components/counter.vue';
import SelectProject from './SelectProject.vue';
import http from 'http';
import modal from 'modal';
import bus from '../../../common/eventBus';
import util from '../../../common/util';
import { ORDER_TYPE } from '../../constant';
export default {
    props: {
        checkState: {
            type: String,
            default: ''
        },
        order: {
            type: Object,
            default: {}
        },
        vipDiscountDetail: Object

    },
    data() {
        return {
            lastEnterItem: {},
            enterSelectModalShow: false,
            modifyEnterOrShopIndex: -1,
            enterItems: this.getplayItems(),
            orderType: this.order.playItems ? 1 : 0, // 1组合订单，0子订单
            ORDER_TYPE,
            totalprice: 0
        };
    },
    watch: {
        order: {
            handler(c, o) {
                this.enterItems = this.getplayItems();
                this.orderType = (this.order.playItems || this.order.campName === undefined) ? 1 : 0;
                // 如果是预定order为空的也判断为组合订单
            },
            deep: true
        },
        enterItems: {
            handler(c, o) {
                let totalprice = 0;
                this.enterItems.filter(function(el) {
                    // 统计预定中和新加项目的总价
                    return el.state === 0 || el.state === 1 || el.state === 8 || el.state === undefined;
                }).forEach(function(el) {
                    totalprice += Number(el.totalPrice);
                });
                this.totalprice = totalprice;
                this.$emit('priceChange', totalprice);
            },
            deep: true
        },
        vipDiscountDetail: {
            handler(c, o) {
                const _this = this;
                let totalprice = 0;
                this.enterItems.forEach((el) => {
                    const newPrice = Number(((el['price'] * _this.getItemDiscountInfo(el.nodeId).discount).toFixed(2) * el.count * el.timeAmount).toFixed(2));
                    if (Number(el.totalPrice) !== newPrice && !!o.vipDetail) { // 判断是改变了折扣信息
                        el.totalPrice = newPrice;
                    }
                    if (el.state === 0 || el.state === 1 || el.state === 8 || el.state === undefined) {
                        totalprice += Number(el.totalPrice);
                    }
                });
                this.$emit('priceChange', totalprice);
            },
            deep: true
        }
    },
    created() {
        // 确认按钮事件
        bus.$on('submitOrder', this.emitchange);
    },
    components: {
        DdDatepicker,
        counter,
        SelectProject
    },
    computed: {
        ...mapState({
            enterList: 'enterList'
        })
    },
    methods: {
        emitchange() {
            this.$emit('change', this.enterItems);
        },
        // 组合订单和子订单key统一化处理
        getplayItems() {
            const enterItems = [];
            let filterEnters = [];
            if (this.order.type) {
                if (this.order.type === ORDER_TYPE.ACCOMMODATION || this.order.type === ORDER_TYPE.COMBINATION) {
                    filterEnters = (this.order.playItems || []).filter(enter => {
                        return enter.state !== 3 && enter.state !== 2;
                    });
                    filterEnters.forEach(item => {
                        const enter = { ...item
                        };
                    // enter.price = Number((item.originPrice).toFixed(2));
                        enter.name = item.name || item.itemName;
                        enter.price = item.originPrice;
                        enter.changeTimes = 0;
                        enter.id = item.categoryId;
                        enter.count = item.amount;
                        enter.selfInventory = item.amount;
                        enter.type = 2;
                        enter.inventory = undefined;
                        enter.originPrice = item.originPrice.toFixed(2);
                    // enter.originPrice = (item.originPrice * item.amount * item.timeAmount).toFixed(2);
                        enter.totalPrice = item.totalPrice;
                        enterItems.push(enter);
                        if (enter.unitTime === undefined) {
                            enter.unitTime = item.chargeUnitTime;
                        }
                    });
                    return (JSON.parse(JSON.stringify(enterItems)));
                } else if (this.order.type === ORDER_TYPE.ENTERTAINMENT) {
                    filterEnters = [this.order];
                    filterEnters.forEach(item => {
                        const enter = { ...item
                        };
                        enter.name = item.itemName;
                        enter.usedAmount = item.bookNum - item.enableAmount;
                        enter.unitTime = item.chargeUnitTime;
                        enter.price = item.originPrice;
                        enter.changeTimes = 0;
                        enter.id = item.categoryId;
                        enter.count = item.bookNum;
                        enter.selfInventory = item.bookNum;
                        enter.type = 2;
                        enter.inventory = undefined;
                        enter.originPrice = item.originPrice.toFixed(2);
                        enter.totalPrice = item.totalPrice;
                        enterItems.push(enter);
                    });
                    return (JSON.parse(JSON.stringify(enterItems)));
                }
            }
            return [];
        },
        addItem() {
            if (this.enterItems.length >= 99) {
                modal.warn('一次做多添加99个娱乐项目!');
                return false;
            }
            if (this.enterList.length <= 0) {
                modal.warn('请到"网络设置－业务设置"中添加娱乐项目！');
                return false;
            }

            this.enterSelectModalShow = true;
        },
        showEnterSelectModal(index) {
            this.modifyEnterOrShopIndex = index;
            this.enterSelectModalShow = true;
        },
        closeEnterSelectModal(value) {
            this.modifyEnterOrShopIndex = -1;
            this.enterSelectModalShow = value;
        },
        handleNumChange(type, tag, num) {
            if (type === 2) {
                this.enterItems.forEach((item, index) => {
                    const price = item['price'];
                    const discount = this.getItemDiscountInfo(item.nodeId, item.type, this.vipDiscountDetail).discount;
                    item.count = (index === tag) ? num : item.count;
                    item.totalPrice = Number(((price * discount).toFixed(2) * (item.count || item.amount) * item.timeAmount).toFixed(2));
                    item.originPrice = (price * (item.count || item.amount) * item.timeAmount).toFixed(2);
                });
            } else if (type === -2) {
                this.enterItems.forEach((item, index) => {
                    const price = item['price'];
                    const discount = this.getItemDiscountInfo(item.nodeId, item.type, this.vipDiscountDetail).discount;
                    item.timeAmount = (index === tag) ? num : item.timeAmount;
                    item.totalPrice = Number(((price * discount).toFixed(2) * (item.count || item.amount) * item.timeAmount).toFixed(2));
                    item.originPrice = (price * (item.count || item.amount) * item.timeAmount).toFixed(2);
                });
            }
        },
        /**
         * 获取单个项目的优惠信息
         **/
        getItemDiscountInfo(nodeId = function() {
            throw new Error('nodeId参数缺少');
        }, nodeType = 2) {
            let item = {
                discount: 1
            };
            if (this.vipDiscountDetail.vipDetail && this.vipDiscountDetail.vipDetail.discountList.length > 0) {
                this.vipDiscountDetail.vipDetail.discountList.forEach(list => {
                    if (list.nodeId === nodeId && list.nodeType === nodeType) {
                        item = { ...list };
                    }
                });
            }

            return item;
        },
        modifyEnter(item) {
            if (item.playOrderId) {
                item
                .changeTimes++;
            }
            if (item.type === 2 && item.changeTimes < 2) {
                return false;
            }
            /* if (item.id) {
                const price = item['price'];
                const discount = this.getItemDiscountInfo(item.nodeId, item.type, this.vipDiscountDetail).discount;
                item.totalPrice = ((price * discount).toFixed(2) * item.count * item.timeAmount).toFixed(2);
                item.originPrice = (price * item.count * item.timeAmount).toFixed(2);
            }*/

            if (item.id && item.date) {
                const date = util.dateFormat(new Date(item.date));
                const lastItem = this.lastEnterItem;
                if (lastItem.id === item.id && lastItem.date === date) {
                    return false;
                }
                this.lastEnterItem.id = item.id;
                this.lastEnterItem.date = item.date;
                http.get('/item/getInventory', {
                    id: item.id,
                    date: date
                })
                    .then(res => {
                        const price = item['price'];
                        const discount = this.getItemDiscountInfo(item.nodeId, item.type, this.vipDiscountDetail).discount;
                        item.inventory = res.data.inventory;
                        item.count = (item.inventory + item.selfInventory) === 0 ? 0 : item.count;
                        item.totalPrice = ((price * discount).toFixed(2) * item.count * item.timeAmount).toFixed(2);
                        item.originPrice = (price * item.count * item.timeAmount).toFixed(2);
                    });
            }
        },
        deleteItem(type, index) {
            this.enterItems.splice(index, 1);
        },
        closeEnterModal(value) {
            this.modifyEnterOrShopIndex = -1;
            this.enterSelectModalShow = false;
        },
        disabledEndDate(startDate, item) {
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

                if (item.state === 8 || item.orderState === 8) {
                    return (date) => {
                        return date.valueOf() > (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                    };
                };
                if (item.state === undefined && item.orderState === undefined) {
                    return (date) => {
                        return date.valueOf() < (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                    };
                };
                return (date) => {
                    return false;
                };
            }
            // if (this.order.orderState === 8) {
            //     const str = util.dateFormat(new Date(startDate));
            //     const arr = str.split('-');
            //     return (date) => {
            //         return date.valueOf() > (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
            //     };
            // }
            // if (this.order.orderState === 0) {
            //     const str = util.dateFormat(new Date(startDate));
            //     const arr = str.split('-');
            //     return (date) => {
            //         return date.valueOf() < (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
            //     };
            // }
            // return (date) => {
            //     return true;
            // };
        },
        setEnterItems(data) {
            if (this.modifyEnterOrShopIndex === -1) {
                this.enterItems.push({
                    count: 1,
                    date: undefined,
                    timeAmount: 1,
                    inventory: undefined,
                    usedAmount: 0,
                    selfInventory: 0,
                    totalPrice: 0,
                    originPrice: 0,
                    isnew: true,
                    ...data
                });
            } else {
                const index = this.modifyEnterOrShopIndex;
                for (const key in data) {
                    this.enterItems[index][key] = data[key];
                }
                if (this.enterItems[index].count === 0) {
                    this.enterItems[index].count = 1;
                }
                this.modifyEnter(this.enterItems[index]);
            }
        }
    }
};
</script>
