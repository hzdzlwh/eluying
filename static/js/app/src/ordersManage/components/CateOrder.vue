<template>
    <div>
        <div class="content-item">
            <p class="content-item-title"><span>餐饮信息</span></p>
            <div class="items">
                <div class="item" v-for="item in order.foodItems">
                    <div class="food-item">
                        <span class="food-icon"></span>
                        <div class="item-content">
                            <div class="item-name">
                                <span class="item-name">{{item.restName}}</span>
                                <span class="food-state-icon"
                                      :style="{background: getRoomOrFoodState(0, item.foodState).backgroundColor}">
                                                    {{getRoomOrFoodState(0, item.foodState).text}}
                                </span>
                            </div>
                            <div class="item-date">
                                <label class="label-text">时间</label>
                                <span>{{item.date.slice(5)}}</span>
                            </div>
                            <div class="item-count">
                                <label class="label-text">人数</label>
                                <span>{{item.peopleNum}}</span>
                            </div>
                            <div class="item-price" style="margin-right: 81px">
                                <label class="label-text">小计</label>
                                <span>¥{{item.foodPrice}}</span>
                            </div>
                            <span class="discount-info" v-if="item.vipShowDiscount" style="top: 14px">
                                <span>原价<span class="origin-price">¥{{ item.originTotalPrice  }}</span></span>
                                <span class="discount-num">
                                    {{ item.vipShowDiscount }}
                                </span>
                            </span>
                        </div>
<!--
                        <div class="info-icon" @mouseenter="getFoodDetail(item)" @mouseleave="setInfoContentVisible(item)">
                            <div class="info-content" v-if="item.visible" style="left: 0;">
                                <p class="info-title">{{item.detail.restName}}</p>
                                <p class="deskNum">
                                    <span>桌号:{{ item.detail.boardDetailResps ? item.detail.boardDetailResps.join(',') : '' }}</span>
                                    <span>人数:{{item.detail.peopleNum}}</span>
                                </p>
                                <p class="foodTime">就餐时间:{{ item.detail.orderTime ? item.detail.orderTime.slice(0, 16) : ''}}</p>
                                <div class="food-container">
                                    <div v-for="food in item.detail.itemsMap">
                                        <div class="food-sub-item" v-for="dish in food.dishItemResp">
                                            <p class="dish-name-container">
                                                                <span :class="{'item-indent': dish.dishId !== null && dish.dishId !== 0}" class="dish-name">
                                                                    {{dish.categoryName}}
                                                                </span>
                                                <span class="dish-discount-icon" v-if="dish.discountable === 1 && !(dish.dishId > 0)">折</span>
                                            </p>
                                            <span class="dish-numAndPrice">
                                                                <span>x{{dish.bookNum}}</span>
                                                                <span>¥{{(dish.price * dish.bookNum).toFixed(2)}}</span>
                                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="money-container">
                                    <p class="money-item">
                                        <span class="money-type">订单金额</span>
                                        <span class="money-num">¥{{findTypePrice(item.detail.payments, 13)}}</span>
                                    </p>
                                    <div class="item-indent" v-if="findTypePrice(item.detail.payments, 5) > 0">
                                        <p class="money-item">
                                            <span class="money-type">商品总价</span>
                                            <span class="money-num">¥{{findTypePrice(item.detail.payments, 10)}}</span>
                                        </p>
                                        <p class="money-item">
                                            <span class="money-type">优惠</span>
                                            <span class="money-num">-¥{{Math.abs(findTypePrice(item.detail.payments, 5))}}</span>
                                        </p>
                                        <p class="money-item" v-if="findTypePrice(item.detail.payments, 11) > 0">
                                            <span class="money-type">取消订单</span>
                                            <span class="money-num">-¥{{Math.abs(findTypePrice(item.detail.payments, 11))}}</span>
                                        </p>
                                    </div>
                                    <p class="money-item" v-if="findTypePrice(item.detail.payments, 4) > 0">
                                        <span class="money-type">违约金</span>
                                        <span class="money-num">¥{{findTypePrice(item.detail.payments, 4)}}</span>
                                    </p>
                                    <p class="money-item">
                                        <span class="money-type">已付金额</span>
                                        <span class="money-num">¥{{findTypePrice(item.detail.payments, 14)}}</span>
                                    </p>
                                    <p class="money-item">
                                        <span class="money-type">需补金额</span>
                                        <span class="money-num">¥{{findTypePrice(item.detail.payments, 15)}}</span>
                                    </p>
                                </div>
                                <div class="operator-container">
                                    <p>订单状态:{{item.detail.orderState === -1 ? '待付款' : FOOD_STATE[item.detail.orderState]}}</p>
                                    <p>预订时间:{{item.detail.creationTime}}</p>
                                    <p>操作员:{{item.detail.reserveName}}</p>
                                </div>
                            </div>
                        </div>
-->
                    </div>
                </div>
            </div>
        </div>
        <div class="content-item" v-if="order.caterOrderId">
            <p class="content-item-title"><span>菜单详情</span></p>
            <div class="items">
                <div class="item"></div>
            </div>
        </div>
        <div class="content-item" v-if="order.caterOrderId && order.remark && order.remark !== ''">
            <p class="content-item-title"><span>备注信息</span></p>
            <div>{{order.remark}}</div>
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
        methods: {
            getRoomOrFoodState(type, state){
                switch(state){
                    case 0:
                        return {text: '预', backgroundColor: '#ffba75'};
                    case 1:
                        return {text: type === 0 ? '餐' : '住', backgroundColor: '#82beff'};
                    case 2:
                        return {text: type === 0 ? '完' : '退', backgroundColor: '#bfbfbf'};
                    case 3:
                        return {text: '消', backgroundColor: '#bfbfbf'};
                    default:
                        return {};
                }
            }
        }
    };
</script>