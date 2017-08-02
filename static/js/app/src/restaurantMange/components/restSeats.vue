/**
 * @Author: lwh
 * @Date:   2017-08-02 16:04:29
 * @Last Modified by:   Tplant
 * @Last Modified time: 2017-08-02 20:30:25
 */

 <template>
    <div>
         <div class="select-container">
            <div class="time-select">
                <date-select @change="handleDateChange" :defaultDate="defaultStrDate" :disabledDate="true"></date-select>
            </div>
            <div class="area-select">
                <div>全部区域</div>
                <div>A区</div>
                <div>希尔顿贵宾</div>
            </div>
            <div class="state-select">
                <customer-radio name="area" value="a" v-model="selectArea" checked>全部座位</customer-radio>
                <customer-radio name="area" value="b" v-model="selectArea">使用中</customer-radio>
                <customer-radio name="area" value="c" v-model="selectArea">空闲</customer-radio>
                <customer-radio name="area" value="d" v-model="selectArea">开台未点菜</customer-radio>
                <customer-radio name="area" value="e" v-model="selectArea">已预订</customer-radio>
            </div>
            <div class="order-menu">
                <div class="order">预订</div>
                <div class="menu">点菜</div>
            </div>
        </div>
        <div class="area-container">
            <h3>A区</h3>
            <div class="seats-container">
                <div v-for="i in 20" class="seat">
                    
                </div>
            </div>
        </div>
    </div>
 </template>

 <script>
 import types from '../store/types';
 import { mapState, mapMutations } from 'vuex';
 import customerRadio from './customerRadio.vue';
 import DateSelect from '../../accommodation/components/DateSelect';
export default {
    data() {
        return {
            defaultStrDate: this.date,
            selectArea: ''
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
        DateSelect
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
            }
        }
        
    }
 </style>

