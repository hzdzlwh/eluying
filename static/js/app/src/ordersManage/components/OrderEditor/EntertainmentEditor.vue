<template>
    <div>
        <div class="content-item">
            <p class="content-item-title">
                <span>娱乐信息</span>
                <span class="increase-container" @click="addItem(2)">
                                    <span class="increase-icon"></span> 添加项目
                </span>
            </p>
            <div class="shop-items">
                <div class="shop-item" v-for="(item, index) in enterItems" :key="index">
                    <span class="enter-icon"></span>
                    <div class="shop-item-content">
                        <div v-if="item.usedAmount <= 0">
                            <input class="dd-input" :value="item.name" @click="showEnterSelectModal(index)" />
                        </div>
                        <span v-if="item.usedAmount > 0">{{item.name}}</span>
                        <div class="time-container" style="width: 145px" v-if="!item['unitTime'] && item.usedAmount <= 0">
                        </div>
                        <div class="time-container" v-if="!!item['unitTime'] && item.usedAmount <= 0">
                            <label>时长({{item['timeUnit']}}）</label>
                            <counter @numChange="handleNumChange" :num="item.timeAmount * item['unitTime']" :id="index" :type="-2" :step="item['unitTime']">
                            </counter>
                        </div>
                        <span v-if="item.usedAmount > 0 && item.chargeUnit" style="position: absolute; right: 466px;">
                                            {{`时长(${item.chargeUnit})`}}
                                            <span style="margin-left: 15px;">{{item.timeAmount * item.chargeUnitTime}}</span>
                        </span>
                        <div class="enterDate-container">
                            <label>时间</label>
                            <div class="enterDate">
                                <dd-datepicker placeholder="选择时间" v-model="item.date" @input="modifyEnter(item)" :disabled-date="disabledEndDate(new Date())" :disabled="item.usedAmount > 0" />
                            </div>
                        </div>
                        <div class="shop-item-count">
                            <label>数量</label>
                            <counter @numChange="handleNumChange" :num="item.count" :id="index" :type="2" :min="item.usedAmount >=1 ? item.usedAmount : 1" :max="(item.inventory + item.selfInventory) >= 0 ? (item.inventory + item.selfInventory) : 999">
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
                    <span class="delete-icon" @click="deleteItem(item.type, index)" v-if="item.usedAmount <= 0">
                                    </span>
                    <span v-if="item.usedAmount > 0" class="delete-icon-like"></span>
                    <span class="discount-info" style="top: 28px" v-if="vipDiscountDetail.vipDetail
                                          && getItemDiscountInfo(item.nodeId, item.type, vipDiscountDetail).discount < 1">
                                            <span>原价<span class="origin-price">¥{{ item.originPrice }}</span></span>
                    <span class="discount-num" v-if="Number(item.totalPrice) === Number(((item['price']
                                                                         * getItemDiscountInfo(item.nodeId, item.type, vipDiscountDetail).discount).toFixed(2)
                                                                         * item.count * item.timeAmount).toFixed(2))">
                                                {{`${vipDiscountDetail.isVip ? '会员' : '企业'}${(getItemDiscountInfo(item.nodeId, item.type, vipDiscountDetail).discount * 10).toFixed(1)}折`}}
                                            </span>
                    </span>
                </div>
            </div>
        </div>
        <div v-if="enterList.length > 0">
            <selectProject :show="enterSelectModalShow" :selectDate="enterList" @close="closeEnterSelectModal" @selectProjectDate="setEnterItems" />
        </div>
    </div>
</template>
<style>
</style>
<script>
import {
    DdDatepicker
} from 'dd-vue-component';
import counter from '../../../common/components/counter.vue';
import SelectProject from './selectProject.vue';
import AJAXService from 'AJAXService';
import modal from 'modal';
import event from '../../event';
import util from '../../../common/util';
export default {
    props: {
        enterList: {
            type: Array,
            default: []
        },
        checkState: {
            type: String,
            default: ''
        },
        enterItem: Array,
        vipDiscountDetail: Object,
    },
    data() {
        return {
            enterItems: [],
            enterSelectModalShow: false,
            modifyEnterOrShopIndex: undefined,
            // vipDiscountDetail: {},
        }
    },
    created() {
        event.$on('submitOrder', this.changeRooms);
    },
    beforeDestroy() {
        event.$off('submitOrder', this.changeRooms);
    },
    watch: {
        enterItem(val) {
            this.enterItems = val;
        }
    },
    components: {
        DdDatepicker,
        counter,
        SelectProject
    },
    methods: {
        addItem() {
            if (this.enterItems.length >= 99) {
                modal.somethingAlert('一次做多添加99个娱乐项目!');
                return false;
            }
            if (this.enterList.length <= 0) {
                modal.somethingAlert('请到"网络设置－业务设置"中添加娱乐项目！');
                return false;
            }

            this.enterSelectModalShow = true;
        },
        showEnterSelectModal(index) {
            this.modifyEnterOrShopIndex = index;
            this.enterSelectModalShow = true;
        },
        handleNumChange(type, tag, num) {
            this.enterItems.forEach((item, index) => {
                let price = item['price'];
                let discount = this.getItemDiscountInfo(item.nodeId, item.type, this.vipDiscountDetail).discount;
                item.count = (index === tag) ? num : item.count;
                item.totalPrice = ((price * discount).toFixed(2) * item.count * item.timeAmount).toFixed(2);
                item.originPrice = (price * item.count * item.timeAmount).toFixed(2);
            });
        },
        /**
         * 获取单个项目的优惠信息
         **/
        getItemDiscountInfo(nodeId, nodeType, obj) {
            let item = {
                discount: 1
            };
            if (obj.vipDetail && obj.vipDetail.discountList.length > 0) {
                obj.vipDetail.discountList.forEach(list => {
                    if ((nodeType === 0 || nodeType === 3) && list.nodeId === 0 && list.nodeType === nodeType) {
                        item = {...list
                        };
                    } else if ((nodeType !== 0 && nodeType !== 3) && (list.nodeId === nodeId && list.nodeType === nodeType)) {
                        item = {...list
                        };
                    }
                });
            }

            return item;
        },
        modifyEnter(item) {
            if (item.playOrderId) {
                item.changeTimes++;
            }
            if (item.playOrderId && item.changeTimes < 2) {
                return false;
            }
            /*if (item.id) {
                const price = item['price'];
                const discount = this.getItemDiscountInfo(item.nodeId, item.type, this.vipDiscountDetail).discount;
                item.totalPrice = ((price * discount).toFixed(2) * item.count * item.timeAmount).toFixed(2);
                item.originPrice = (price * item.count * item.timeAmount).toFixed(2);
            }*/

            if (item.id && item.date) {
                let date = util.dateFormat(new Date(item.date));
                let lastItem = this.lastEnterItem;
                if (lastItem.id === item.id && lastItem.date === date) {
                    return false;
                }
                this.lastEnterItem.id = item.id;
                this.lastEnterItem.date = item.date;
                AJAXService.ajaxWithToken('get', '/item/getInventory', {
                        id: item.id,
                        date: date
                    })
                    .then(res => {
                        if (res.code === 1) {
                            const price = item['price'];
                            const discount = this.getItemDiscountInfo(item.nodeId, item.type, this.vipDiscountDetail).discount;
                            item.inventory = res.data.inventory;
                            item.count = (item.inventory + item.selfInventory) === 0 ? 0 : item.count;
                            item.totalPrice = ((price * discount).toFixed(2) * item.count * item.timeAmount).toFixed(2);
                            item.originPrice = (price * item.count * item.timeAmount).toFixed(2);
                        } else {
                            modal.somethingAlert(res.msg);
                        }
                    });
            }
        },
        deleteItem(type, index) {
            this.enterItems.splice(index, 1);
        },
        closeEnterSelectModal(value) {
            this.modifyEnterOrShopIndex = -1;
            this.enterSelectModalShow = false;
        },
        disabledEndDate(startDate) {
            if (this.checkState === 'finish') {
                if (util.isSameDay(new Date(startDate), new Date())) {
                    const str1 = util.dateFormat(new Date());
                    const arr1 = str1.split('-');
                    return (date) => {
                        let disable = (date.valueOf() > (new Date(arr1[0], arr1[1] - 1, arr1[2])).valueOf());
                        return disable;
                    }
                } else {
                    const str = util.dateFormat(new Date(startDate));
                    const arr = str.split('-');
                    const str1 = util.dateFormat(new Date());
                    const arr1 = str1.split('-');
                    return (date) => {
                        let disable = (date.valueOf() <= (new Date(arr[0], arr[1] - 1, arr[2])).valueOf()) || (date.valueOf() > (new Date(arr1[0], arr1[1] - 1, arr1[2])).valueOf());
                        return disable;
                    }
                }
            } else {
                const str = util.dateFormat(new Date(startDate));
                const arr = str.split('-');
                return (date) => {
                    return date.valueOf() < (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                }
            }
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
                    ...data
                });
            } else {
                let index = this.modifyEnterOrShopIndex;
                for (let key in data) {
                    this.enterItems[index][key] = data[key];
                }
                if (this.enterItems[index].count === 0) {
                    this.enterItems[index].count = 1;
                }
                this.modifyEnter(this.enterItems[index]);
            }
        },
    }
}
</script>
