/**
 * @Author: lwh
 * @Date:   2017-08-03 15:13:42
 * @Last Modified by:   lwh
 * @Last Modified time: 2017-08-14 13:33:33
 */

 <template>
     <div>
        <div class="search">
            <input type="text" class="dd-input" placeholder="搜索菜品名称/拼音首字母" @keyup.enter="search" ref="searchInput">
            <img class="search-icon" @click="search" src="//static.dingdandao.com/vipSearch.png">
        </div>
        <div class="rest-menu">
            <div class="menu-left">
                <div class="classify-container" ref="classifyContainer">
                    <div class="scroller">
                        <h3>菜品分类</h3>
                        <ul>
                            <li v-for="(item, index) in foodClassify" :class="{ 'active': currentIndex === index }" @click="setMenu(index, $event)"><span :class="{'tow-line': item.twoLine}">{{item.dishCategoryName}}</span></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="menu-right" ref="menuRight">
                <div class="food-container" ref="menu" id="menu">
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
                                    <div class="price add-dish"><span class="add" @click="newDish">+</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <add-dish-modal :visible="addDishVisible" @hideModal="hideModal" @addDish="addDish"></add-dish-modal>
     </div>
 </template>

 <script>
import http from '../../common/http';
import types from '../store/types';
import { mapState, mapMutations } from 'vuex';
import addDishModal from './addDish';
import IScroll from 'iscroll';
export default {
    data() {
        return {
            heightList: [],
            scrollY: 0,
            addDishVisible: false,
            foodClassify: []
        };
    },
    created() {
        this.getMenu().then(() => {
            this.$nextTick(() => {
                this.initScroll();
                this.calculateHeight();
            });
        });
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
        ...mapMutations([
            types.ADD_FOOD
        ]),
        search() {
        },
        setMenu(index, event) {
            const foodList = this.$refs.foodList;
            const el = foodList[index];
            this.foodScroll.scrollToElement(el, 300);
        },
        initScroll() {
            var _this = this;
            this.$refs.menuRight.style.height = (window.innerHeight - 236) + 'px';
            this.$refs.menu.style.height = (window.innerHeight - 236) + 'px';
            this.$refs.classifyContainer.style.height = (window.innerHeight - 236) + 'px';
            this.classifyScroll = new IScroll(this.$refs.classifyContainer, { probeType: 3, mouseWheel: true, scrollbars: false });
            this.foodScroll = new IScroll('#menu', { probeType: 3, mouseWheel: true, scrollbars: false });
            this.foodScroll.on('scroll', function() {
                _this.scrollY = Math.abs(this.y);
            });
        },
        calculateHeight() {
            const foodList = this.$refs.foodList;
            let height = 0;
            this.heightList.push(height);
            foodList.map(food => {
                height += food.clientHeight;
                this.heightList.push(height);
            });
        },
        orderMenu(food) {
            this[types.ADD_FOOD]({ food: food });
        },
        getMenu() {
            return new Promise((resolve, reject) => {
                http.get('/catering/getMenu', { restId: this.restId }).then(res => {
                    if (res.code === 1) {
                        this.foodClassify = res.data.list;
                        resolve();
                    }
                });
            });
        },
        newDish() {
            this.addDishVisible = true;
        },
        addDish(dish) {
            this.foodClassify[this.foodClassify.length - 1].dishes.push(dish);
        },
        hideModal() {
            this.addDishVisible = false;
        }
    },
    components: {
        addDishModal
    }
};
 </script>

 <style lang="scss" scoped>
    .search{
        height: 72px;
        background: #fafafa;
        box-shadow: 0 0 4px 4px rgba(0,0,0,0.1);
        border-radius: 0 0 8px 8px;
        padding: 28px 0 0 16px;
        position: relative;
        input{
            width: 270px;
            height: 25px;
        }
        img{
            position: absolute;
            left: 268px;
            top: 35px;
            cursor: pointer;
        }
    }
    .rest-menu{
        margin-top: 24px;
        display: flex;
        justify-content: space-between;
        .menu-left{
            width: 104px;
            background: #f0f0f0;
            border-radius: 8px;
            .classify-container{
                position: absolute;
                z-index: 1;
                width: 104px;
                overflow: hidden;
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
                    li{
                        cursor: pointer;
                    }
                }
            }
            h3{
                text-align: center;
                line-height: 50px;
                border-bottom: 1px solid #ccc;
            }
            ul{
                padding: 0 10px;
                li{
                    text-align: center;
                    line-height: 50px;
                    border-bottom: 1px solid #ccc;
                    &.active{
                        color: #178ce6;
                    }
                    .tow-line{
                        display: block;
                        line-height: 25px;
                    }
                }
            }
        }
        .menu-right{
            width: 669px;
            .search{
                width: 300px;
                position: relative;
                img{
                    position: absolute;
                    right: 8px;
                    top: 6px;
                }
            }
            .food-container{
                position: absolute;
                z-index: 1;
                width: 669px;
                overflow: hidden;
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
 </style>
