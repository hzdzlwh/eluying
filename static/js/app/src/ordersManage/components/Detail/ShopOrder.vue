<template>
    <div class="content-item">
        <p class="content-item-title"><span>商超信息</span></p>
        <div class="items">
            <div class="item" v-for="item in filterShopList">
                <div class="orderDetailModal-shop-item">
                    <span class="shop-icon"></span>
                    <div class="item-content">
                        <span class="shop-time small-font">{{item.time.slice(0, 16)}}
                            <span class="state-icon" v-if="!order.caterOrderId"
                                  :class="getOrderState(item, 'color')"
                            >
                                {{getOrderState(item, 'text')}}
                            </span>
                        </span>
                        <div style="display: inline-flex; align-items: center;">
                            <label class="label-text">小计</label>
                            <span>¥{{getTotalPrice(item['items'], true)}}</span>
                            <span class="single-order-btn"
                                  v-text="!order.goodsOrderId ? '查看': ''"
                                  :class="!order.goodsOrderId ? 'cursor' : ''"
                                  @click="showSingleOrder(item['items'][0])">
                            </span>
                        </div>
                        <span class="discount-info" v-if="item.items[0].vipShowDiscount" style="top: 20px">
                            <span>原价<span class="origin-price">¥{{ getTotalPrice(item['items'], false) }}</span></span>
                            <span class="discount-num">
                                {{ item.items[0].vipShowDiscount }}
                            </span>
                        </span>
                    </div>
                </div>
                <div class="item-content" v-for="option in item['items']">
                    <span style="padding-left: 32px; width: 120px;">{{option.name}}</span>
                    <span>x{{option.amount}}</span>
                    <span style="margin-right: 304px;width: 120px; text-align: right">¥{{(option.price * option.amount).toFixed(2)}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" type="text/css" rel="stylesheet/scss">
</style>
<script>
    import bus from '../../../common/eventBus.js';
    import {
        ORDER_TYPE,
        ORDER_STATE_TEXT
    } from '../../constant';
    export default{
        props: {
            order: Object
        },
        data() {
            return {};
        },
        computed: {
            filterShopList() {
                const shopList = {};
                if (this.order.pcGoodsItems) {
                    this.order.pcGoodsItems.forEach(item => {
                        if (shopList[item.goodsOrderId]) {
                            shopList[item.goodsOrderId]['items'].push(item);
                        } else {
                            shopList[item.goodsOrderId] = {};
                            shopList[item.goodsOrderId]['time'] = item.date;
                            shopList[item.goodsOrderId]['state'] = item.state;
                            shopList[item.goodsOrderId]['items'] = [];
                            shopList[item.goodsOrderId]['items'].push(item);
                        }
                    });
                } else if (this.order.goodsOrderId) {
                    const orderId = this.order.goodsOrderId;
                    shopList[orderId] = {};
                    shopList[orderId]['time'] = this.order.creationTime;
                    shopList[orderId]['state'] = this.order.state;
                    shopList[orderId]['items'] = this.order.itemList;
                    shopList[orderId]['items'][0]['vipShowDiscount'] = this.order.vipShowDiscount;
                }
                return shopList;
            }
        },
        methods: {
            getTotalPrice(arr, dis) {
                let price = 0;
                if (arr) {
                    arr.forEach(item => {
                        price += (dis ? item.price : item.originPrice) * item.amount;
                    });
                }
                return price.toFixed(2);
            },
            showSingleOrder(order) {
                if (!this.order.goodsOrderId) {
                    bus.$emit('onShowDetail',
                        {
                            orderId: order.goodsOrderId,
                            type: 2
                        });
                } else {
                    return false;
                }
            },
            getOrderState(item, prop) {
                if (item.state === undefined || !ORDER_STATE_TEXT[ORDER_TYPE.RETAIL][item.state]) {
                    return '';
                }

                return ORDER_STATE_TEXT[ORDER_TYPE.RETAIL][item.state][prop];
            }
        }
    };
</script>
