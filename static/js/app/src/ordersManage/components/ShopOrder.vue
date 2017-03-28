<template>
    <div class="content-item">
        <p class="content-item-title"><span>商超信息</span></p>
        <div class="items">
            <div class="item" v-for="item in filterShopList">
                <div class="orderDetailModal-shop-item">
                    <span class="shop-icon"></span>
                    <div class="item-content">
                        <span class="shop-time small-font">{{item.time.slice(5, 16)}}</span>
                        <div style="margin-right: 81px">
                            <label class="label-text">小计</label>
                            <span>¥{{getTotalPrice(item['items'], true)}}</span>
                        </div>
                        <span class="discount-info" v-if="item.items[0].vipShowDiscount" style="top: 14px">
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
    export default{
        props: {
            order: Object
        },
        data() {
            return {
            };
        },
        computed: {
            filterShopList() {
                let shopList = {};
                if (this.order.pcGoodsItems) {
                    this.order.pcGoodsItems.forEach(item => {
                        if (shopList[item.goodsOrderId]) {
                            shopList[item.goodsOrderId]['items'].push(item);
                        } else {
                            shopList[item.goodsOrderId] = {};
                            shopList[item.goodsOrderId]['time'] = item.date;
                            shopList[item.goodsOrderId]['items'] = [];
                            shopList[item.goodsOrderId]['items'].push(item);
                        }
                    });
                }
                return shopList;
            },
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
            }
        }
    };
</script>