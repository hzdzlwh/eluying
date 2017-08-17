/**
 * @Author: lwh
 * @Date:   2017-08-14 13:41:42
 * @Last Modified by:   lwh
 * @Last Modified time: 2017-08-14 20:28:33
 */

<template>
    <div class="modal fade" role="dialog" data-backdrop="static" id="orderMenu">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <div>
                        <div class="title">点菜</div>
                        <div class="search">
                            <input type="text" class="dd-input" placeholder="搜索菜品名称/拼音首字母" v-model="searchKey" @keyup.enter="search" ref="searchInput">
                            <img class="search-icon" @click="search" src="//static.dingdandao.com/vipSearch.png">
                        </div>
                    </div>
                    <button type="button" class="close" @click="hideModal"><span>&times;</span></button>
                </div>
                <div class="modal-body">
                    <div class="scroll-left">
                        <div class="left-container" ref="leftScroll">
                            <div class="scroller">
                                <ul>
                                    <li v-for="(item, index) in filterDish" @click="setScroll(index)" :class="{ 'active': currentIndex === index }">
                                        <span>{{item.dishCategoryName}}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="scroll-right">
                        <div class="right-container" ref="rightScroll">
                            <div class="scroller">
                                <div v-for="item in filterDish" class="food-list" ref="foodList">
                                    <h4 ref="foodListHeader">{{item.dishCategoryName}}</h4>
                                    <div class="food-wrapper">
                                        <div v-for="food in item.dishes" class="food" @click="orderMenu(food)">
                                            <div class="name">{{food.dishName}}</div>
                                            <div class="price">￥{{food.dishPrice}}</div>
                                            <div class="inventory" :class="{no:!food.inventoryNum}" v-if="!food.customerDish"><span v-if="food.inventoryNum">剩{{food.inventoryNum}}</span><span v-else>售完</span></div>
                                        </div>
                                        <div class="food" v-if="item.dishCategoryId === -2">
                                            <div class="name">自定义菜品</div>
                                            <div class="price add-dish"><span class="add" @click="addCustomerDish">+</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-foot">
                    <div class="menu-remark">
                        <div>菜品备注</div>
                        <textarea v-model="remark"></textarea>
                    </div>
                    <div class="menu-cart">
                        <div class="cart">
                            <div class="cart-icon" @click="toggleList"></div>
                            <div class="cart-total">
                                <div>共{{selectFood.length}}项</div>
                                <div>合计:￥{{dishPriceTotal}}</div>
                            </div>
                            <transition name="fold">
                                <div class="menuCart-list" v-show="listShow">
                                    <div class="list-header">
                                        <h4>已点菜</h4>
                                        <div class="empty" @click="clearMenuCart">清空</div>
                                    </div>
                                    <div class="list-content" ref="listContent">
                                        <ul class="scroller">
                                            <li v-for="food in selectFood">
                                                <span class="food-name">{{food.dishName}}</span>
                                                <count :del=true :min = -1 :num='food.bookNum' :onNumChange='onNumChange' :id='food.dishId'></count>
                                                <span class="food-price">{{food.bookNum * food.price}}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </transition>
                        </div>
                        <div>
                            <button class="dd-btn dd-btn-ghost" @click="hideModal">取消</button>
                            <button class="dd-btn dd-btn-primary" @click="sendDish">确定</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <add-dish-modal :visible="addDishVisible" @hideAddDishModal="hideAddDishModal" @addDish="addDish"></add-dish-modal>
    </div>
</template>

<script>
import http from '../../http';
import IScroll from 'iscroll';
import bus from '../../eventBus';
import count from '../../components/counter.vue';
import addDishModal from '../../../restaurantMange/components/addDish';
import { mapActions } from 'vuex';
import types from '../store/types';
import PySearch from '../../PySearch';
export default{
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        restOrder: {
            type: Object
        }
    },
    data() {
        return {
            scrollY: 0,
            heightList: [],
            foodClassify: [],
            fold: true,
            selectFood: [],
            addDishVisible: false,
            restId: undefined,
            remark: '',
            filterDish: [],
            searchKey: ''
        };
    },
    created() {
    },
    computed: {
        currentIndex() {
            for (let i = 0; i < this.heightList.length; i ++) {
                const preHeight = this.heightList[i];
                const nextHeight = this.heightList[i + 1];
                if (!nextHeight || (this.scrollY >= preHeight && this.scrollY < nextHeight)) {
                    return i;
                }
            }
        },
        listShow() {
            if (!this.selectFood.length) {
                this.fold = true;
                return false;
            }
            const show = !this.fold;
            if (show) {
                setTimeout(() => {
                    this.$nextTick(() => {
                        if (!this.menuCartScroll) {
                            this.menuCartScroll = new IScroll(this.$refs.listContent, { probeType: 3, mouseWheel: true, scrollbars: false });
                        } else {
                            this.menuCartScroll.refresh();
                        }
                    });
                }, 600);
            }
            return show;
        },
        dishPriceTotal() {
            var total = 0;
            this.selectFood.forEach(el => {
                total += el.bookNum * el.price;
            });
            return total.toFixed(2);
        }
    },
    methods: {
        ...mapActions([types.GET_CATER_ORDER_DETAIL]),
        search() {
            const filterArr = [];
            this.foodClassify.forEach(classify => {
                classify.dishes.forEach(dish => {
                    if (PySearch(this.searchKey)[0] === dish.dishName || PySearch(this.searchKey)[0] === dish.spell[0]) {
                        const tempClassify = { ...classify };
                        tempClassify.dishes = [dish];
                        filterArr.push(tempClassify);
                    }
                });
            });
            if (filterArr.length > 0) {
                this.filterDish = filterArr;
            } else {
                this.filterDish = this.foodClassify;
            }
        },
        setScroll(index) {
            this.rightScroll.scrollToElement(this.$refs.foodList[index], 300);
        },
        initScroll() {
            var _this = this;
            this.leftScroll = new IScroll(this.$refs.leftScroll, { probeType: 3, mouseWheel: true, scrollbars: false });
            this.rightScroll = new IScroll(this.$refs.rightScroll, { probeType: 3, mouseWheel: true, scrollbars: false });
            this.rightScroll.on('scroll', function() {
                _this.scrollY = Math.abs(this.y);
            });
        },
        calculateHeight() {
            const foodList = this.$refs.foodList;
            let height = 0;
            this.heightList.push(height);
            foodList.map(area => {
                height += area.clientHeight;
                this.heightList.push(height);
            });
        },
        onNumChange(type, index, num) {
            this.selectFood.forEach((el, i) => {
                if (el.dishId === index) {
                    if (num > 0) {
                        el.bookNum = num;
                    } else {
                        this.selectFood.splice(i, 1);
                    }
                }
            });
        },
        clearMenuCart() {
            this.selectFood = [];
        },
        orderMenu(food) {
            if (food.inventoryNum > 0) {
                const isHasFood = this.selectFood.find(el => {
                    return el.dishId === food.dishId;
                });
                if (isHasFood) {
                    isHasFood.bookNum += 1;
                } else {
                    const cacheFood = { ...food };
                    cacheFood.bookNum = 1;
                    cacheFood.price = cacheFood.dishPrice
                    this.selectFood.push(cacheFood);
                }
            }
        },
        getMenuList() {
            return new Promise((resolve, reject) => {
                http.get('/catering/getMenu', { restId: this.restId }).then(res => {
                    if (res.code === 1) {
                        this.foodClassify = res.data.list;
                        this.foodClassify.forEach(classify => {
                            classify.dishes.forEach(dish => {
                                dish.spell = PySearch(dish.dishName);
                            });
                        });
                        this.filterDish = this.foodClassify;
                        resolve();
                    }
                });
            });
        },
        hideModal() {
            bus.$emit('hideOrderMenu');
        },
        toggleList() {
            if (!this.selectFood.length) {
                return;
            }
            this.fold = !this.fold;
        },
        addCustomerDish() {
            this.addDishVisible = true;
        },
        hideAddDishModal() {
            this.addDishVisible = false;
        },
        addDish(dish) {
            this.foodClassify[this.foodClassify.length - 1].dishes.push(dish);
        },
        sendDish() {
            const params = { caterOrderId: this.restOrder.caterOrderId, oprType: 3, totalPrice: this.dishPriceTotal };
            params.dishes = [];
            this.selectFood.forEach(el => {
                params.dishes.push({ bookNum: el.bookNum, dishId: el.dishId, dishName: el.dishName, price: el.price, remark: this.remark });
            });
            params.dishes = JSON.stringify(params.dishes);
            http.get('/dish/dishOpr', params).then(res => {
                if (res.code === 1) {
                    this[types.GET_CATER_ORDER_DETAIL]({ orderId: this.restOrder.caterOrderId });
                    this.hideModal();
                }
            });
        }
    },
    watch: {
        visible(newValue) {
            var _this = this;
            if (newValue) {
                $('#orderMenu').modal('show');
                $('#orderMenu').on('shown.bs.modal', function() {
                    _this.initScroll();
                    _this.calculateHeight();
                });
            } else {
                $('#orderMenu').modal('hide');
            }
        },
        restOrder(newValue) {
            if (newValue) {
                this.restId = newValue.restId;
                this.selectFood = newValue.itemsMap.slice(0);
                this.getMenuList();
            }
        }
    },
    components: {
        count,
        addDishModal
    }
};
</script>

<style lang="scss" scoped>
    #orderMenu{
        .modal-dialog{
            width: 830px;
            .modal-content{
                border-top: 4px solid #178ce6;
                padding: 0;
                overflow: hidden;
                .modal-header{
                    display: flex;
                    justify-content: space-between;
                    > div{
                        display: flex;
                        align-items: center;
                        .title{
                            margin-right: 16px;
                        }
                        .search{
                            width: 270px;
                            position: relative;
                            .search-icon{
                                position: absolute;
                                top: 8px;
                                left: 253px;
                                cursor: pointer;
                            }
                        }
                    }
                    
                }
                .modal-body{
                    padding: 16px 20px 0;
                    display: flex;
                    justify-content: space-between;
                    .scroll-left{
                        width: 104px;
                        background: #f0f0f0;
                        border-radius: 8px;
                        padding: 0 8px;
                        .left-container{
                            height: 450px;
                            ul{
                                li{
                                    line-height: 43px;
                                    text-align: center;
                                    border-bottom: 1px dashed #99a9bf;
                                    &.active{
                                        color: #178ce6;
                                    }
                                }
                            }
                        }
                    }
                    .scroll-right{
                        width: 669px;
                        .right-container{
                            height: 450px;
                            width: 669px;
                            overflow: hidden;
                            position: absolute;
                            z-index: 1;
                            .scroller{
                                position: absolute;
                                z-index: 1;
                                -webkit-tap-highlight-color: rgba(0,0,0,0);
                                width: 100%;
                                -webkit-transform: translateZ(0);
                                -moz-transform: translateZ(0);
                                -ms-transform: translateZ(0);
                                -o-transform: translateZ(0);
                                transform: translateZ(0);
                                -webkit-touch-callout: none;
                                -webkit-user-select: none;
                                -moz-user-select: none;
                                -ms-user-select: none;
                                user-select: none;
                                -webkit-text-size-adjust: none;
                                -moz-text-size-adjust: none;
                                -ms-text-size-adjust: none;
                                -o-text-size-adjust: none;
                                text-size-adjust: none;
                                .food-list{
                                    padding: 16px;
                                    background: #f0f0f0;
                                    border-radius: 8px;
                                    margin-bottom: 16px;
                                    h4{
                                        font-size: 24px;
                                        color: #178ce6;
                                        margin-bottom: 16px;
                                    }
                                    .food-wrapper{
                                        display: flex;
                                        flex-wrap: wrap;
                                        .food{
                                            width: 120px;
                                            height: 70px;
                                            margin: 8px 9px 0 0;
                                            padding: 8px;
                                            background: #fff;
                                            box-shadow: 0 0 2px 0 rgba(0,0,0,0.3);
                                            border-radius: 8px;
                                            cursor: pointer;
                                            position: relative;
                                            &:nth-child(5n){
                                                margin-right: 0px;
                                            }
                                            .name{
                                                font-size: 16px;
                                                color: #475669;
                                                opacity: 0.87;
                                                font-weight: bold;
                                            }
                                            .price{
                                                margin-top: 20px;
                                                font-size: 14px;
                                                color: #8492a6;
                                                opacity: 0.87;
                                                &.add-dish{
                                                    text-align: right;
                                                    margin-top: 14px;
                                                    .add{
                                                        display:inline-block;
                                                        width:16px;
                                                        height:16px;
                                                        color:#178ce6;
                                                        border:1px solid #178ce6;
                                                        text-align:center;
                                                        line-height:13px;
                                                        cursor:pointer;
                                                    }
                                                }
                                            }
                                            .inventory{
                                                position: absolute;
                                                top: 50px;
                                                right: 0;
                                                height: 16px;
                                                width: 40px;
                                                line-height: 16px;
                                                padding: 0 7px;
                                                border-radius: 8px 0 0 8px;
                                                background: #ffac59;
                                                color: #fff;
                                                font-size: 12px;
                                                &.no{
                                                    background: #f24949;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                .modal-foot{
                    .menu-remark{
                        text-align: left;
                        padding: 0 20px 16px;
                        border-bottom: 1px solid #e6e6e6;
                        > div{
                            font-size: 12px;
                            color: #999;
                        }
                        textarea{
                            width: 286px;
                            height: 67px;
                        }
                    }
                    .menu-cart{
                        padding: 16px 20px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .cart{
                            display: flex;
                            align-items: center;
                            position: relative;
                            .cart-icon{
                                width: 32px;
                                height: 36px;
                                margin-right: 16px;
                                cursor: pointer;
                                background: url('../../../../../../image/menu-cart.png');
                            }
                            .cart-total{
                                > div{
                                    text-align: left;
                                }
                            }
                            .menuCart-list{
                                position: absolute;
                                bottom: 50px;
                                width: 318px;
                                z-index: 9;
                                text-align: left;
                                background: #fafafa;
                                height: 345px;
                                padding: 0 16px;
                                .list-header{
                                    display: flex;
                                    justify-content: space-between;
                                    height: 46px;
                                    line-height: 46px;
                                    border-bottom: 1px dashed #99a9bf;
                                    h4{
                                        line-height: 46px;
                                    }
                                    > div{
                                        color: #178ce6;
                                        cursor: pointer;
                                    }
                                }
                                .list-content{
                                    height: 299px;
                                    width: 286px;
                                    overflow: hidden;
                                    position: absolute;
                                    z-index: 1;
                                    .scroller{
                                        position: absolute;
                                        z-index: 1;
                                        -webkit-tap-highlight-color: rgba(0,0,0,0);
                                        width: 100%;
                                        -webkit-transform: translateZ(0);
                                        -moz-transform: translateZ(0);
                                        -ms-transform: translateZ(0);
                                        -o-transform: translateZ(0);
                                        transform: translateZ(0);
                                        -webkit-touch-callout: none;
                                        -webkit-user-select: none;
                                        -moz-user-select: none;
                                        -ms-user-select: none;
                                        user-select: none;
                                        -webkit-text-size-adjust: none;
                                        -moz-text-size-adjust: none;
                                        -ms-text-size-adjust: none;
                                        -o-text-size-adjust: none;
                                        text-size-adjust: none;
                                    }
                                    li{
                                        height: 46px;
                                        line-height: 46px;
                                        border-bottom: 1px dashed #99a9bf;
                                        .food-name{
                                            display: inline-block;
                                            width: 140px;
                                        }
                                        .food-price{
                                            display: inline-block;
                                            width: 60px;
                                            text-align: right;
                                        }
                                    }
                                    
                                }
                                &.fold-enter-active, &.fold-leave-active{
                                    transition: all 0.5s;
                                }
                                &.fold-enter, &.fold-leave-active{
                                    height: 0;
                                    opacity: 0;
                                    .list-content{
                                        height: 0;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } 
</style>
