<template>
    <div>
        <div class="content-item">
            <p class="content-item-title">
                <span>商超信息</span>
                <span class="increase-container" @click="addItem">
                    <span class="increase-icon"></span>
                    添加项目
                </span>
            </p>
<!--
            <div v-if="order.orderState && showOrder" class="items">
                <div class="shop-item"
                     :class="shopGoodsItems.length > 0 ? 'shopItem-border-style' : ''"
                     style="align-items: stretch;flex-direction: column"
                     v-for="item in filterShopList">
                    <div class="orderDetailModal-shop-item">
                        <span class="shop-icon"></span>
                        <div class="item-content">
                            <span class="shop-time small-font">{{item.time.slice(5, 16)}}</span>
                            <div style="margin-right: 81px">
                                <label class="label-text">小计</label>
                                <span>¥{{getTotalPrice(item['items'], true)}}</span>
                                <span class="discount-info" v-if="item.items[0].showDiscount" style="top: 14px">
                                    <span>
                                        原价
                                        <span class="origin-price">¥{{ getTotalPrice(item['items'], false) }}</span>
                                    </span>
                                    <span class="discount-num">
                                        {{ item.items[0].showDiscount }}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="item-content" v-for="option in item['items']">
                        <span style="padding-left: 32px; width: 120px;">{{option.name}}</span>
                        <span>x{{option.amount}}</span>
                        <span style="margin-right: 304px;width: 120px; text-align: right">{{`¥${(option.price * option.amount).toFixed(2)}`}}</span>
                    </div>
                </div>
            </div>
-->
            <div class="shop-items">
                <div class="shop-item" v-for="(item, index) in shopGoodsItems">
                    <span class="shop-icon"></span>
                    <div class="shop-item-content">
                        <input class="dd-input" :value="item.name" disabled />
                        <div class="shop-item-count">
                            <label>数量</label>
                            <counter @numChange="handleNumChange" :num="item.count" :id="index" :type="3">
                            </counter>
                            <p class="shop-item-price">
                                <label>小计</label>
                                <span>
                                    ¥{{((item['price'] * getItemDiscountInfo(item.type, vipDiscountDetail).discount).toFixed(2) * item.count).toFixed(2)}}
                                </span>
                            </p>
                        </div>
                    </div>
                    <span class="delete-icon" @click="deleteItem(item.type, index)"></span>
                    <span class="discount-info"
                          style="top:24px"
                          v-if="vipDiscountDetail.vipDetail
                          && getItemDiscountInfo(item.type, vipDiscountDetail).discount < 1">
                            <span>
                                原价
                                <span class="origin-price">
                                    ¥{{ (item['price'] * item.count).toFixed(2) }}
                                </span>
                            </span>
                            <span class="discount-num">
                                {{ `${vipDiscountDetail.isVip ? '会员' : '企业'}${(getItemDiscountInfo(item.type, vipDiscountDetail).discount * 10).toFixed(1)}折` }}
                            </span>
                    </span>
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
    </div>
</template>
<style lang="scss">
</style>
<script>
    import counter from '../../../common/components/counter.vue';
    import selectGoods from './SelectGoods.vue';
    import modal from 'modal';
    export default{
        props: {
            goodsItems: {
                type: Array,
                default: function() { return []; }
            },
            shopList: {
                type: Array,
                default: function() { return []; }
            },
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
                shopGoodsItem: JSON.parse(JSON.stringify(this.goodsItems))
            };
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
                    good.price = good.p;
                    good.name = good.n;
                    good.count = good.num;
                });
                this.shopGoodsItems.forEach(item => {
                    goodsList.forEach((good, index) => {
                        if (good.id === item.id) {
                            item.count += good.count;
                            goodsList.splice(index, 1);
                        }
                    });
                });
                this.shopGoodsItems = this.shopGoodsItems.concat(goodsList);
                this.$emit('changeGoodsItem', this.shopGoodsItems);
            },
            // 处理商超项目数量变化事件
            handleNumChange(type, tag, num) {
                if (type === 3) {
                    this.shopGoodsItems.forEach((item, index) => { item.count = (index === tag) ? num : item.count; });
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
                    discountInfo.vipDetail.discountList.forEach(list => {
                        if (list.nodeId === 0 && list.nodeType === nodeType) {
                            item = { ...list };
                        }
                    });
                }

                return item;
            }
        },
        components: {
            counter,
            selectGoods
        }
    };
</script>
