/**
 * @Author: lwh
 * @Date:   2017-08-14 13:41:42
 * @Last Modified by:   lwh
 * @Last Modified time: 2017-08-14 17:25:32
 */

<template>
    <div class="modal fade" role="dialog" data-backdrop="static" id="orderMenu">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <div>
                        <div class="title">点菜</div>
                        <div class="search">
                            <input type="text" class="dd-input" placeholder="搜索菜品名称/拼音首字母" @keyup.enter="search" ref="searchInput">
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
                                    <li v-for="(item, index) in foodClassify" @click="setScroll(index)" :class="{ 'active': currentIndex === index }">
                                        <span>{{item.dishCategoryName}}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="scroll-right">
                        <div class="right-container" ref="rightScroll">
                            <div class="scroller">
                                <div v-for="item in foodClassify" class="food-list" ref="foodList">
                                    <h4 ref="foodListHeader">{{item.dishCategoryName}}</h4>
                                    <div class="food-wrapper">
                                        <div v-for="food in item.dishes" class="food" @click="orderMenu(food)">
                                            <div class="name">{{food.dishName}}</div>
                                            <div class="price">￥{{food.dishPrice}}</div>
                                            <div class="inventory" :class="{no:!food.inventoryNum}" v-if="!food.customerDish"><span v-if="food.inventoryNum">剩{{food.inventoryNum}}</span><span v-else>售完</span></div>
                                        </div>
                                        <div class="food" v-if="item.dishCategoryId === -2">
                                            <div class="name">自定义菜品</div>
                                            <div class="price add-dish"><span class="add" @click="">+</span></div>
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
                        <textarea></textarea>
                    </div>
                    <div class="menu-cart">
                        <div class="cart">
                            <div class="cart-icon"></div>
                            <div class="cart-total">
                                <div>共3项</div>
                                <div>合计:￥3000</div>
                            </div>
                            <transition name="fold">
                                <div class="menuCart-list" v-show="listShow">
                                    <div class="list-header">
                                        <h4>已点菜</h4>
                                        <span class="empty">清空</span>
                                    </div>
                                    <div class="list-content" ref="listContent">
                                        <ul>
                                            <li>
                                                
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </transition>
                        </div>
                        <div>
                            <button class="dd-btn dd-btn-ghost" @click="hideModal">取消</button>
                            <button class="dd-btn dd-btn-primary" @click="">确定</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import http from '../../common/http';
import IScroll from 'iscroll';
import { mapState } from 'vuex';
export default{
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            scrollY: 0,
            heightList: [],
            foodClassify: [],
            listShow: false,
            selectFood: []
        };
    },
    created() {
    },
    computed: {
        ...mapState(['restId']),
        currentIndex() {
            for (let i = 0; i < this.heightList.length; i ++) {
                const preHeight = this.heightList[i];
                const nextHeight = this.heightList[i + 1];
                if (!nextHeight || (this.scrollY >= preHeight && this.scrollY < nextHeight)) {
                    return i;
                }
            }
        }
    },
    methods: {
        search() {
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
        orderMenu(food) {
            const isHasFood = this.selectFood.find(el => {
                return el.dishId === food.dishId;
            });
            if (isHasFood) {
                isHasFood.num ++;
            } else {
                const cacheFood = { ...food };
                cacheFood.num = 1;
                this.selectFood.push(cacheFood);
            }
        },
        getMenuList() {
            return new Promise((resolve, reject) => {
                http.get('/catering/getMenu', { restId: this.restId }).then(res => {
                    if (res.code === 1) {
                        this.foodClassify = res.data.list;
                        resolve();
                    }
                });
            });
        },
        hideModal() {
            this.$emit('hideModal');
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
        restId(newValue) {
            this.getMenuList();
        }
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
                            .cart-icon{
                                width: 32px;
                                height: 36px;
                                margin-right: 16px;
                                cursor: pointer;
                                background: url('../../../../../image/menu-cart.png');
                            }
                            .cart-total{
                                > div{
                                    text-align: left;
                                }
                            }
                        }
                    }
                }
            }
        }
    } 
</style>
