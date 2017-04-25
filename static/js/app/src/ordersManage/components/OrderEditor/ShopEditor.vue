<template>
    <div class="shopEditor">
        <div class="content-item">
            <p class="content-item-title">
                <span>商超信息</span>
                <span class="increase-container" @click="addItem">
                    <span class="increase-icon"></span>
                    添加项目
                </span>
            </p>
            <div  class="items">
                <div class="shop-item"
                     :class="shopGoodsItems.length > 0 ? 'shopItem-border-style' : ''"
                     style="align-items: stretch;flex-direction: column"
                     v-for="item in editShopList">
                    <div class="orderDetailModal-shop-item">
                        <span class="shop-icon"></span>
                        <div class="item-content">
                            <span class="shop-time small-font">{{item.time.slice(0, 16)}}</span>
                        </div>
                    </div>
                    <div class="item-content" v-for="(option, index) in item['items']">
                        <div class="shop-item-content">
                            <input class="dd-input shopEditor-shopName" :value="option.name" disabled />
                            <div class="shop-item-count">
                                <label>数量</label>
                                <counter @numChange="handleNumChange" :num="option.amount" :id="index" :type="3" :orderId="option.goodsOrderId">
                                </counter>
                                <p class="shop-item-price">
                                    <label>小计</label>
                                    <span>
                                    ¥{{((option['originPrice'] * getItemDiscountInfo(option.type, vipDiscountDetail).discount).toFixed(2) * option.amount).toFixed(2)}}
                                </span>
                                </p>
                            </div>
                        </div>
                        <span class="delete-icon" @click="deleteItem(index, option.goodsOrderId)"></span>
                        <span class="discount-info"
                              style="top:24px"
                              v-if="vipDiscountDetail.vipDetail
                              && getItemDiscountInfo(option.type, vipDiscountDetail).discount < 1">
                            <span>
                                原价
                                <span class="origin-price">
                                    ¥{{ (option['originPrice'] * option.amount).toFixed(2) }}
                                </span>
                            </span>
                            <span class="discount-num">
                                {{ `${vipDiscountDetail.isVip ? '会员' : '企业'}${(getItemDiscountInfo(option.type, vipDiscountDetail).discount * 10).toFixed(1)}折` }}
                            </span>
                        </span>
                    </div>
                </div>
                <div class="shop-item"
                     style="align-items: stretch;flex-direction: column"
                     v-if="shopGoodsItems.length > 0">
                    <div class="orderDetailModal-shop-item">
                        <span class="shop-icon"></span>
                    </div>
                    <div class="item-content" v-for="(option, index) in shopGoodsItems">
                        <div class="shop-item-content">
                            <input class="dd-input shopEditor-shopName" :value="option.name" disabled />
                            <div class="shop-item-count">
                                <label>数量</label>
                                <counter @numChange="handleNumChange" :num="option.amount" :id="index" :type="3">
                                </counter>
                                <p class="shop-item-price">
                                    <label>小计</label>
                                    <span>
                                    ¥{{((option['originPrice'] * getItemDiscountInfo(option.type, vipDiscountDetail).discount).toFixed(2) * option.amount).toFixed(2)}}
                                </span>
                                </p>
                            </div>
                        </div>
                        <span class="delete-icon" @click="deleteItem(index, false)"></span>
                        <span class="discount-info"
                              style="top:24px"
                              v-if="vipDiscountDetail.vipDetail
                          && getItemDiscountInfo(option.type, vipDiscountDetail).discount < 1">
                            <span>
                                原价
                                <span class="origin-price">
                                    ¥{{ (option['originPrice'] * option.amount).toFixed(2) }}
                                </span>
                            </span>
                            <span class="discount-num">
                                {{ `${vipDiscountDetail.isVip ? '会员' : '企业'}${(getItemDiscountInfo(option.type, vipDiscountDetail).discount * 10).toFixed(1)}折` }}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="shopList.length > 0">
            <selectGoods
                    :show="goodsSelectModalShow"
                    :goodsDate="shopList"
                    @selectGoodsDate="setShopGoodsItems"
                    @Modalclose="closeShopSelectModal"/>
        </div>
        <span v-show="false">{{totalPrice}}</span>
    </div>
</template>
<style lang="scss">
    .shopEditor {
        .item-content {
            margin-bottom: 10px;
        }
        .shopEditor-shopName {
            margin-left: 32px;
        }
    }
</style>
<script>
    import { mapState } from 'vuex';
    import counter from '../../../common/components/counter.vue';
    import selectGoods from './SelectGoods.vue';
    import modal from 'modal';
    import bus from '../../../common/eventBus';
    export default{
        props: {
            vipDiscountDetail: {
                type: Object,
                default: function() { return {}; }
            },
            order: {
                type: Object,
                default: function() { return {}; }
            }
        },
        data() {
            return {
                goodsSelectModalShow: false,
                shopGoodsItems: [],
                editShopList: {}
            };
        },
        created() {
            bus.$on('submitOrder', this.changeGoods);
            bus.$on('refreshView', this.resetShop);
        },
        beforeDestroy() {
            bus.$off('submitOrder', this.changeGoods);
            bus.$off('refreshView', this.resetShop);
        },
        computed: {
            ...mapState({ shopList: 'shopList' }),
            totalPrice() {
                let totalPrice = 0;
                for (const key in this.editShopList) {
                    totalPrice = this.editShopList[key].items.reduce((a, b) => {
                        const itemPrice = ((b['originPrice'] * this.getItemDiscountInfo(b.type, this.vipDiscountDetail).discount).toFixed(2) * b.amount).toFixed(2);
                        return a + Number(itemPrice);
                    }, totalPrice);
                }
                if (this.shopGoodsItems.length > 0) {
                    totalPrice = this.shopGoodsItems.reduce((a, b) => {
                        const itemPrice = ((b['originPrice'] * this.getItemDiscountInfo(b.type, this.vipDiscountDetail).discount).toFixed(2) * b.amount).toFixed(2);
                        return a + Number(itemPrice);
                    }, totalPrice);
                }
                this.$emit('priceChange', totalPrice);
                return totalPrice;
            }
        },
        methods: {
            // 添加商超项目
            addItem() {
                if (this.shopGoodsItems.length >= 99) {
                    modal.alert('一次最多添加99个商超项目!');
                    return false;
                }

                if (this.shopList.length <= 0) {
                    modal.alert('请到"网络设置－业务设置"中添加商超项目！');
                    return false;
                }

                this.goodsSelectModalShow = true;
            },
            // 关闭商超选择弹窗
            closeShopSelectModal() {
                this.goodsSelectModalShow = false;
            },
            // 更新已选择的商超项目
            setShopGoodsItems(data) {
                const goodsList = data;
                goodsList.forEach(good => {
                    good.type = 3;
                    good.originPrice = good.p;
                    good.price = good.p;
                    good.name = good.n;
                    good.amount = good.num;
                    // 判断是单个订单，还是组合订单
                    if (this.order.goodsOrderId) {
                        good.goodsOrderId = this.order.goodsOrderId;
                    }
                });
                // 判断是单个商超订单，还是组合订单
                if (this.order.goodsOrderId) {
                    const orderId = this.order.goodsOrderId;
                    this.editShopList[orderId]['items'].forEach(item => {
                        goodsList.forEach((good, index) => {
                            if (Number(item.id) === Number(good.id)) {
                                item.amount += good.amount;
                                goodsList.splice(index, 1);
                            }
                        });
                    });
                    this.editShopList[orderId]['items'] = this.editShopList[orderId]['items'].concat(goodsList);
                } else {
                    this.shopGoodsItems.forEach(item => {
                        goodsList.forEach((good, index) => {
                            if (Number(item.id) === Number(good.id)) {
                                item.amount += good.amount;
                                goodsList.splice(index, 1);
                            }
                        });
                    });
                    this.shopGoodsItems = this.shopGoodsItems.concat(goodsList);
                }
                const goods = JSON.parse(JSON.stringify(this.editShopList));
                const items = JSON.parse(JSON.stringify(this.shopGoodsItems));
                this.$emit('change', { goods: goods, items: items });
            },
            // 处理商超项目数量变化事件
            handleNumChange(type, tag, num, orderId = -1) {
                if (orderId === -1) {
                    this.shopGoodsItems.forEach((item, index) => { item.amount = (index === tag) ? num : item.amount; });
                } else {
                    this.editShopList[orderId].items.forEach((item, index) => { item.amount = (index === tag) ? num : item.amount; });
                }
            },
            /**
             * 获取商超优惠信息
             * @param nodeType 商超类型－3
             * @param discountInfo 折扣信息－object
             * @returns {{discount: number}}
             */
            getItemDiscountInfo(nodeType, discountInfo) {
                let item = { discount: 1 };
                if (discountInfo.vipDetail && discountInfo.vipDetail.discountList.length > 0) {
                    discountInfo.vipDetail.discountList.forEach(discount => {
                        if (discount.nodeId === 0 && discount.nodeType === nodeType) {
                            item = { ...discount };
                        }
                    });
                }

                return item;
            },
            deleteItem(index, shopOrderId) {
                if (!shopOrderId) {
                    this.shopGoodsItems.splice(index, 1);
                } else {
                    if (this.editShopList[shopOrderId].items.length <= 1) {
                        modal.alert('最后一个商品不可删除，请到商超订单中取消订单！');
                        return false;
                    }
                    this.editShopList[shopOrderId].items.splice(index, 1);
                }
            },
            changeGoods() {
                const goods = JSON.parse(JSON.stringify(this.editShopList));
                const items = JSON.parse(JSON.stringify(this.shopGoodsItems));
                this.$emit('change', { goods: goods, items: items });
            },
            resetShop() {
                this.shopGoodsItems = [];
            }
        },
        components: {
            counter,
            selectGoods
        },
        watch: {
            order(newVal) {
                const shopList = {};
                if (newVal.pcGoodsItems && newVal.pcGoodsItems.length > 0) {
                    newVal.pcGoodsItems.forEach(item => {
                        if (item.state === 1) {
                            item.id = item.goodsId;
                            if (shopList[item.goodsOrderId]) {
                                shopList[item.goodsOrderId]['items'].push(item);
                            } else {
                                shopList[item.goodsOrderId] = {};
                                shopList[item.goodsOrderId]['time'] = item.date;
                                shopList[item.goodsOrderId]['items'] = [];
                                shopList[item.goodsOrderId]['items'].push(item);
                            }
                        }
                    });
                } else if (newVal.goodsOrderId && newVal.goodsOrderId.state === 1) {
                    const orderId = newVal.goodsOrderId;
                    shopList[orderId] = {};
                    shopList[orderId]['time'] = this.order.creationTime;
                    shopList[orderId]['items'] = this.order.itemList;
                    shopList[orderId]['items'].map(good => {
                        good.goodsOrderId = orderId;
                        good.id = good.goodsId;
                    });
                    shopList[orderId]['items'][0]['vipShowDiscount'] = this.order.vipShowDiscount;
                }
                this.editShopList = shopList;
            }
        }
    };
</script>
