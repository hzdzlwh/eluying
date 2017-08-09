/**
 * @Author: lwh
 * @Date:   2017-08-03 15:13:42
 * @Last Modified by:   lwh
 * @Last Modified time: 2017-08-09 15:28:58
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
                            <li v-for="(item, index) in foodClassify" :class="{ 'active': currentIndex === index }" @click="setMenu(index, $event)"><span :class="{'tow-line': item.twoLine}">{{item.name}}</span></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="menu-right" ref="menuRight">
                <div class="food-container" ref="menu" id="menu">
                    <div class="scroller">
                        <div v-for="item in foodClassify" class="food-list" ref="foodList">
                            <h4 ref="foodListHeader">{{item.name}}</h4>
                            <div class="food-wrapper">
                                <div v-for="food in item.foods" class="food" @click="orderMenu(food)">
                                    <div class="name">{{food.name}}</div>
                                    <div class="price" v-if="food.name !== '新增自定义菜'">￥{{food.price}}</div>
                                    <div class="price add-dish" v-else><span class="add" @click="newDish">+</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <add-dish-modal :visible="addDishVisible" @hideModal="hideModal"></add-dish-modal>
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
            foodClassify: [
                {
                    name: '套餐',
                    foods: [
                        {
                            id: 3,
                            name: '红烧肉',
                            price: 50,
                            num: 1
                        },
                        {
                            id: 6,
                            name: '番茄炒蛋',
                            price: 40,
                            num: 1
                        },
                        {   
                            id: 4,
                            name: '干锅土豆',
                            price: 10,
                            num: 1
                        },
                        {   
                            id: 5,
                            name: '大盘鸡',
                            price: 80,
                            num: 1
                        },
                        {
                            name: '酸菜鱼',
                            price: 50
                        },
                        {
                            name: '清蒸鱼',
                            price: 40
                        },
                        {
                            name: '干锅花菜',
                            price: 10
                        },
                        {
                            name: '烤鸭',
                            price: 20
                        }
                    ]
                },
                {
                    name: '热菜',
                    foods: [
                        {
                            name: '红烧肉',
                            price: 50
                        },
                        {
                            name: '番茄炒蛋',
                            price: 40
                        },
                        {
                            name: '干锅土豆',
                            price: 10
                        },
                        {
                            name: '大盘鸡',
                            price: 80
                        },
                        {
                            name: '酸菜鱼',
                            price: 50
                        },
                        {
                            name: '清蒸鱼',
                            price: 40
                        },
                        {
                            name: '干锅花菜',
                            price: 10
                        },
                        {
                            name: '烤鸭',
                            price: 20
                        },
                        {
                            name: '酸菜鱼',
                            price: 50
                        },
                        {
                            name: '清蒸鱼',
                            price: 40
                        },
                        {
                            name: '干锅花菜',
                            price: 10
                        },
                        {
                            name: '烤鸭',
                            price: 20
                        },
                        {
                            name: '酸菜鱼',
                            price: 50
                        },
                        {
                            name: '清蒸鱼',
                            price: 40
                        },
                        {
                            name: '干锅花菜',
                            price: 10
                        },
                        {
                            name: '烤鸭',
                            price: 20
                        }
                    ]
                },
                {
                    name: '冷菜',
                    foods: [
                        {
                            name: '红烧肉',
                            price: 50
                        },
                        {
                            name: '番茄炒蛋',
                            price: 40
                        },
                        {
                            name: '干锅土豆',
                            price: 10
                        },
                        {
                            name: '大盘鸡',
                            price: 80
                        },
                        {
                            name: '酸菜鱼',
                            price: 50
                        },
                        {
                            name: '清蒸鱼',
                            price: 40
                        },
                        {
                            name: '干锅花菜',
                            price: 10
                        },
                        {
                            name: '烤鸭',
                            price: 20
                        }
                    ]
                },
                {
                    name: '酒水',
                    foods: [
                        {
                            name: '红烧肉',
                            price: 50
                        },
                        {
                            name: '番茄炒蛋',
                            price: 40
                        },
                        {
                            name: '干锅土豆',
                            price: 10
                        },
                        {
                            name: '大盘鸡',
                            price: 80
                        },
                        {
                            name: '酸菜鱼',
                            price: 50
                        },
                        {
                            name: '清蒸鱼',
                            price: 40
                        },
                        {
                            name: '干锅花菜',
                            price: 10
                        },
                        {
                            name: '烤鸭',
                            price: 20
                        }
                    ]
                },
                {
                    name: '自定义菜',
                    twoLine: true,
                    foods: [
                        {
                            name: '新增自定义菜',
                            price: ''
                        }
                    ]
                }
            ]
        };
    },
    created() {
        this.getMenu();
        this.$nextTick(() => {
            this.initScroll();
            this.calculateHeight();
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
            http.get('/catering/getMenu', { restId: this.restId }).then(res => {
            });
        },
        newDish() {
            this.addDishVisible = true;
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
                                            line-height:16px;
                                            cursor:pointer;
                                        }
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