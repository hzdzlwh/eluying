/**
 * @Author: lwh
 * @Date:   2017-08-03 15:13:42
 * @Last Modified by:   lwh
 * @Last Modified time: 2017-08-08 10:06:35
 */

 <template>
     <div class="rest-menu">
         <div class="menu-left">
             <h3>菜品分类</h3>
             <ul>
                 <li v-for="(item, index) in foodClassify" :class="{ 'active': currentIndex === index }" @click="setMenu(index, $event)"><span :class="{'tow-line': item.twoLine}">{{item.name}}</span></li>
             </ul>
         </div>
         <div class="menu-right">
             <div class="search">
                <input type="text" class="dd-input" placeholder="搜索菜品名称/拼音首字母" @keyup.enter="search" ref="searchInput">
                <img class="search-icon" @click="search" src="//static.dingdandao.com/vipSearch.png">
            </div>
            <div class="food-container" @scroll="handleScroll" ref="menu">
                <div v-for="item in foodClassify" class="foo-list" ref="foodList">
                    <h4 ref="foodListHeader">{{item.name}}</h4>
                    <div class="food-wrapper">
                        <div v-for="food in item.foods" class="food">
                            <div>{{food.name}}</div>
                            <div>{{food.price}}</div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
     </div>
 </template>

 <script>
import http from '../../common/http';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            heightList: [],
            scrollY: 0,
            foodClassify: [
                {
                    name: '套餐',
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
                    name: '自定义菜品好吃',
                    twoLine: true,
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
                }
            ]
        };
    },
    created() {
        this.$nextTick(() => {
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
        search() {
        },
        handleScroll(ev) {
            this.scrollY = ev.target.scrollTop;
            if (this.scrollY > this.heightList[this.currentIndex]) {
                for (let i = 0; i < this.$refs.foodListHeader.length; i ++) {
                    this.$refs.foodListHeader[i].style.position = 'static';
                }
                /* this.$refs.foodListHeader[this.currentIndex].style.position = 'fixed';
                this.$refs.foodListHeader[this.currentIndex].style.top = 155 + 'px';
                this.$refs.foodListHeader[this.currentIndex].style.width = 640 + 'px';
                this.$refs.foodListHeader[this.currentIndex].style.background = '#fafafa'; */
                if (this.currentIndex === 0) {
                    if (this.scrollY >= 30) {
                        $(this.$refs.foodListHeader[this.currentIndex]).css({ 'position': 'fixed', 'top': '160px', 'width': '640px', 'background': '#fff' });
                    }
                } else {
                    $(this.$refs.foodListHeader[this.currentIndex]).css({ 'position': 'fixed', 'top': '160px', 'width': '640px', 'background': '#fff' });
                }
                // $(this.$refs.foodListHeader[this.currentIndex]).css({ 'position' : 'fixed', 'top' : '155px', 'width' : '640px', 'background' : '#fff' });
            }
        },
        setMenu(index, event) {
            $(this.$refs.menu).animate({ scrollTop: this.heightList[index] }, 200);
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
        getMenu() {
            http.get('/catering/getMenu', {}).then(res => {
            });
        }
    },
    watch: {
        scrollY(newValue) {
            if (newValue === 0) {
                this.$refs.foodListHeader[0].style.position = 'static';
            }
        }
    }
};
 </script>

 <style lang="scss" scoped>
    .rest-menu{
        display: flex;
        justify-content: space-between;
        .menu-left{
            width: 100px;
            border: 1px solid #ccc;
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
            width: 682px;
            border: 1px solid #ccc;
            padding: 16px;
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
                margin-top: 30px;
                height: 600px;
                overflow: scroll;
                h4{
                    line-height: 30px;
                    border-bottom: 1px solid #ccc;
                }
                .food-wrapper{
                    display: flex;
                    flex-wrap: wrap;
                    .food{
                        width: 88px;
                        height: 88px;
                        margin: 4px;
                        border: 1px solid #ccc;
                    }
                }
            }
        }
    }
 </style>