/*
* @Author: lxj
* @Date:   2017-07-28 16:16:45
* @Last Modified by:   linxinjian
* @Last Modified time: 2017-08-02 17:32:14
* @email: 783384903@qq.com
*/

<template>
    <div class="restContain">
        <div class="rest-order-left">
            <div v-if="true">
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
                    <h4>A区</h4>
                </div>
                
            </div>
            <div v-else>
                    <div style="position:absolute;width: 200px;height: 400px;border: 1px solid #ccc;overflow:scroll;display:flex" @scroll="handleScroll" ref="menu">
                        <div>
                            <ul>
                                <li @click="setMenu(1, $event)">a</li>
                                <li>b</li>
                                <li>c</li>
                            </ul>
                        </div>
                        <div>
                            <ul>
                                <li v-for="i in 40">{{i}}</li>
                            </ul>
                        </div>
                    </div>
            </div>
        </div>
        <div class="rest-order-right">
            <taday v-if='leftType === 0'></taday>
            <resetContain v-if='leftType === 1'></resetContain>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .restContain{
        width: 1210px;
        margin: auto;
        justify-content: space-between;
        display: flex;
        padding-top:50px;
    }
    .rest-order-left{
        width: 792px;
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
    }
    .rest-order-right{
        width: 400px;
    }
</style>
<script>
import types from '../../store/types';
import taday from '../../components/tadayRestDate.vue';
import DateSelect from '../../../accommodation/components/DateSelect';
import { dateFormat } from '../../../common/util';
import customerRadio from '../../components/customerRadio.vue';
import { mapState, mapMutations } from 'vuex';
import resetContain from '../../components/resetConstain.vue';
export default {
    props: {

    },
    data() {
        return {
            defaultStrDate: this.date,
            selectArea: ''
        };
    },
    computed: {
        ...mapState(['date', 'leftType'])
    },
    methods: {
        ...mapMutations([
            types.SET_DATE,
            types.SET_LEFT_TYPE
        ]),
        handleDateChange(date) {
            this.defaultStrDate = date;
        },
        setMenu(index, event) {
            // this.$refs.menu.scrollTop = 200;
            $(this.$refs.menu).animate({ scrollTop: 200 }, 400);
        },
        handleScroll(ev) {
            console.log(ev.target.scrollTop);
        }
    },
    watch: {
        defaultStrDate(newValue) {
            console.log(newValue)
            this[types.SET_DATE]({ date: newValue });
        }
    },
    components: {
        taday,
        DateSelect,
        customerRadio,
        resetContain
    },
    created() {

    }

};
</script>
