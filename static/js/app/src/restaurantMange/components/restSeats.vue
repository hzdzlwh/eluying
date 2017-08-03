/**
 * @Author: lwh
 * @Date:   2017-08-02 16:04:29
 * @Last Modified by:   Tplant
 * @Last Modified time: 2017-08-03 14:56:00
 */

 <template>
    <div>
         <div class="select-container">
            <div class="time-select">
                <date-select @change="handleDateChange" :defaultDate="defaultStrDate" :disabledDate="true"></date-select>
            </div>
            <div class="area-select">
                <div v-for="area in areas" @click="toggleArea(area)" :class="{selected: area.selected}">{{area.name}}</div>
            </div>
            <div class="state-select">
                <customer-radio name="area" value="a" v-model="selectState" checked>全部座位</customer-radio>
                <customer-radio name="area" value="b" v-model="selectState">使用中</customer-radio>
                <customer-radio name="area" value="c" v-model="selectState">空闲</customer-radio>
                <customer-radio name="area" value="d" v-model="selectState">开台未点菜</customer-radio>
                <customer-radio name="area" value="e" v-model="selectState">已预订</customer-radio>
            </div>
            <div class="order-menu">
                <div class="order">预订</div>
                <div class="menu">点菜</div>
            </div>
        </div>
        <div class="area-container">
            <h3>A区</h3>
            <div class="seats-container">
                <div v-for="(i, index) in 20" class="seat" @click="getSeatOrder($event)" @contextmenu.prevent="$refs.ctxMenu.open($event, {data: 1})">
                    <div class="state-twoCode">
                        <div class="state">已结账</div>
                        <div class="two-dimensionalcode"></div>
                    </div>
                    <div class="seat-num">桌位1</div>
                    <div class="eating-time">1小时20分钟</div>
                    <div class="reserve-time">预12:00</div>
                    <div class="order-list" v-if="i === 1">
                        <div class="rest-arrow-up"></div>
                        <div><span>桌位1</span><span>空闲</span></div>
                        <div v-for="i in 2" @click.prevent="getSeatOrder($event)">
                            <div class="order-list-item">
                                <div><span>人数: 2</span><span>用餐时间: 2017-07-18 17:00</span></div>
                                <div>已预订</div>
                            </div>
                            <div class="order-list-item">
                                <div>张三 11111111111 会员</div>
                                <div>前台下单</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <contextmenu id="context-menu" ref="ctxMenu" @ctx-open="onCtxOpen" @ctx-cancel="resetCtxLocals" @ctx-close="onCtxClose">
            <div class="rest-add-order" @click="addRestOrder">新增预订</div>
        </contextmenu>
    </div>
 </template>

 <script>
 import types from '../store/types';
 import { mapState, mapMutations } from 'vuex';
 import customerRadio from './customerRadio.vue';
 import DateSelect from '../../accommodation/components/DateSelect';
 import contextmenu from '../../common/components/contextmenu';
export default {
    data() {
        return {
            defaultStrDate: this.date,
            selectState: '',
            areas: [
                {
                    id: 1,
                    name: '全部区域',
                    selected: true
                },
                {
                    id: 2,
                    name: 'A区',
                    selected: false
                },
                {
                    id: 3,
                    name: 'B区',
                    selected: false
                }
            ]
        }
    },
    computed: {
        ...mapState(['date'])
    },
    methods: {
        ...mapMutations([
            types.SET_DATE
        ]),
        handleDateChange(date) {
            this.defaultStrDate = date;
        },
        getSeatOrder(event, data) {
            event.cancelBubble = true;
            console.log(data);
        },
        toggleArea(area) {
            area.selected = !area.selected;
        },
        onCtxOpen(locals) {
            console.log(locals)
        },
        resetCtxLocals() {
        },
        onCtxClose() {
        },
        addRestOrder() {
        }
    },
    watch: {
        defaultStrDate(newValue) {
            console.log(newValue)
            this[types.SET_DATE]({ date: newValue });
        }
    },
    components: {
        customerRadio,
        DateSelect,
        contextmenu
    }
}
 </script>

 <style lang="scss" scoped>
    .select-container{
        padding: 16px;
        box-shadow: 0 0 4px 4px rgba(0,0,0,0.1);
        position: relative;
        .time-select{
            .calendar-date-select{
                height: 30px;
                line-height: 30px;
            }
        }
        .area-select{
            display: flex;
            flex-wrap: wrap;
            width: 632px;
            margin-top: 12px;
            div{
                min-width: 72px;
                height: 30px;
                line-height: 30px;
                padding: 0 7px;
                border: 1px solid #ccc;
                text-align: center;
                color: #a3a3a3;
                margin: 4px 8px 4px 0;
                cursor: pointer;
                &.selected{
                    color: #178ce6;
                    border: 1px solid #178ce6;
                }
            }
        }
        .state-select{
            display: flex;
            margin-top: 12px;
            > div{
                margin-right: 10px;
            }
        }
        .order-menu{
            display: flex;
            width: 128px;
            position: absolute;
            top: 48px;
            right: 16px;
            > div{
                width: 56px;
                height: 56px;
                border-radius: 50%;
                color: #fff;
                line-height: 56px;
                text-align: center;
                cursor: pointer;
                &.order{
                    background: #f29130;
                    margin-right: 16px;
                }
                &.menu{
                    background: #178ce6;
                }
            }
        }
    }
    .area-container{
        margin-top: 24px;
        background: #f0f0f0;
        padding: 16px;
        h3{
            font-size: 24px;
            color: #178ce6;
            font-weight: bold;
        }
        .seats-container{
            display: flex;
            flex-wrap: wrap;
            margin-top: 12px;
            .seat{
                width: 88px;
                height: 88px;
                border-radius: 8px;
                box-shadow: 0 0 2px 0 rgba(0,0,0,0.3);
                margin: 4px;
                &:nth-child(8n+1){
                    margin-left: 0;
                }
                &:nth-child(8n){
                    margin-right: 0;
                }
                .state{
                    width: 50px;
                    height: 16px;
                    line-height: 16px;
                    border-radius: 0 8px 8px 0;
                    background: #178ce6;
                    font-size: 12px;
                    padding-left: 8px;
                    color: #fff;
                    position: relative;
                }
                .state-twoCode{
                    display: flex;
                    justify-content: space-between;
                    padding: 6px 6px 0 0;
                    .two-dimensionalcode{
                        width: 16px;
                        height: 16px;
                        background: url('../../../../../image/two-dimensionalcode.png');
                    }
                }
                .seat-num{
                    padding-top: 7px;
                    text-align: center;
                    font-size: 14px;
                    color: #333333;
                    opacity: 0.87;
                }
                .eating-time{
                    font-size: 12px;
                    color: #999999;
                    text-align: center;
                    opacity: 0.87;
                }
                .reserve-time{
                    width: 58px;
                    height: 16px;
                    font-size: 12px;
                    color: #fff;
                    background: #ffba75;
                    text-align: center;
                    margin-left: 15px;
                    border-radius: 8px;
                }
                .order-list{
                    position: absolute;
                    width: 300px;
                    background: #fafafa;
                    z-index: 2;
                    padding: 10px 8px;
                    display: none;
                    .rest-arrow-up{
                        position: absolute;
                        left: 20px;
                        top: -10px;
                        width: 0;
                        height: 0;
                        border-left: 10px solid transparent;
                        border-right: 10px solid transparent;
                        border-bottom: 10px solid #fafafa;
                        line-height: 0;
                    }
                    .order-list-item{
                        display: flex;
                        justify-content: space-between;
                        height: 30px;
                        line-height: 30px;
                    }
                }
                &:hover{
                    .order-list{
                        display: block;
                    }
                }
                
            }
        }
        
    }
    #context-menu{
        .rest-add-order{
            background: #fafafa;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
            text-align: center;
            line-height: 32px;
            z-index: 1;
            cursor: pointer;
        }
    }
 </style>

