/*
* @Author: lxj
* @Date:   2017-07-31 13:58:30
* @Last Modified by:   linxinjian
* @Last Modified time: 2017-08-02 16:48:18
* @email: 783384903@qq.com
*/

<template>
    <div class="rest-taday-contain">
        <div class="rest-taday-count">
            <div><span class="rest-taday-tip">今日营业额</span></div>
            <div class="rest-taday-num">￥{{DayDate.priceSum}}</div>
            <div class="rest-taday-otherDate rest-taday-headleft">今日订单总数<div >{{DayDate.peopleCount}}</div></div>
            <div class="rest-taday-otherDate rest-taday-headright">今日到店人数<div >{{DayDate.orderCount}}</div></div>
        </div>
       <div class="rest-taday-new">
        <div class="rest-taday-title">
            新订单 
        </div>
            <div class="rest-taday-list">
                <div class="rest-taday-item" v-for='item in DayDate.newOrders' :key='item.orderNum'>
                <div>
                    <div><span class="rest-taday-smallTip">{{orderWay[item.orderWay]}}</span>  <span>桌位{{item.borardList[0]}} - {{item.peopleNum}}人</span> </div>
                    <div class="rest-taday-smallTip">订单号：{{item.orderNum}}</div>
                </div>
                <div><span class="rest-taday-tag " :class="getState(item.foodState, 'color')">{{getState(item.foodState, 'text')}}</span></div>
                </div>
            </div>
       </div>

    </div>
</template>
<style scoped lang="scss">
    .rest-taday-contain{
            background:#fafafa;
            box-shadow:0 0 4px 4px rgba(0,0,0,0.10);
            border-radius:8px;
            width:318px;
            height:605px;
            margin-top: 20px;
        .rest-taday-count{
            border-top-right-radius: 8px;
            border-top-left-radius: 8px;
            padding:15px;
            background:#ffffff;
            box-shadow:0 4px 4px 0 rgba(154,162,167,0.19);
            height:122px;
        }
        .rest-taday-tip{
                font-size:12px;
                color:#8492a6;
                line-height:12px;
                text-align:left;
        }
        .rest-taday-num{
            font-size: 24px;
            color: #178ce6;
            line-height: 30px;
            text-align: left;
            margin-bottom: 10px;
        }
        .rest-taday-otherDate{
            font-size:12px;
            color:#8492a6;
            line-height:12px;
            display: inline-block;;
            div{
                font-size:18px;
                color:#536178;
                line-height:24px;
            }
        }
        .rest-taday-headleft{
            width:140px;
            border-right:1px dotted #c0ccda;
        }
        .rest-taday-headright{
            padding-left:15px;
        }
        .rest-taday-new{
            padding:15px;
            .rest-taday-title{
            font-size:16px;
            color:#238ee3;
            height:40px;
            border-bottom:1px dotted #c0ccda;
            padding-bottom:15px;
            }
            .rest-taday-list{
                .rest-taday-item{
                        font-size: 14px;
                        color: #475669;
                        display: flex;
                        justify-content: space-between;
                        font-size:14px;
                        color:#475669;
                        padding: 15px 0;
                        border-bottom: 1px dotted #c0ccda;
                    .rest-taday-smallTip{
                        font-size:12px;
                        color:#99a9bf;
                        line-height:12px;
                        margin-top:5px;
                    }
                    .rest-taday-tag{
                        color: #ffffff;
                        font-size: 12px;
                        display: inline-flex;
                        width: 40px;
                        height: 22px;
                        justify-content: center;
                        align-items: center;
                        border-radius: 1px;
                        padding-right: 3px;
                        position: relative;
                        margin-left: 32px;
                        margin-top:8px;
                    &::before{
                        position: absolute;
                        content: '';
                        display: inline-block;
                        border-right: 12px solid;
                        border-top: 11px solid transparent;
                        border-bottom: 11px solid transparent;
                        border-left: 0;
                        left: -12px;
                    }
                    &.yellow {
                        background: #ffba75;
                        &::before {
                            border-right-color: #ffba75;
                        }
                    }
                    &.grey {
                        background: #bfbfbf;
                        &::before {
                            border-right-color: #bfbfbf;
                        }
                    }
                    &.blue {
                        background: #82beff;
                        &::before {
                            border-right-color: #82beff;
                        }
                    }
                    &.red {
                        background: #f27979;
                        &::before {
                            border-right-color: #f27979;
                        }
                    }
                    &.green {
                        background: #62d99d;
                        &::before {
                            border-right-color: #62d99d;
                        }
                    }
                }
                }
            }
            }
    }
</style>
<script>
import { ORDER_TYPE, ORDER_STATE_TEXT } from '../../ordersManage/constant.js';
import http from '../../common/http.js';
import { mapState } from 'vuex';
import { orderWay } from '../orderWay.js';
export default {
    props: {
    },
    data() {
        return {
            ORDER_TYPE,
            ORDER_STATE_TEXT,
            orderWay,
            DayDate: {}
        };
    },
    computed: mapState([
        'restId'
    ]),
    methods: {
        getState(id, type) {
            return this.ORDER_STATE_TEXT[this.ORDER_TYPE.CATERING][id][type];
        },
        fetchDate() {
            // http.get('/catering/getDayTurnover',{restId: this.restId},{loading: false}).then()
            window.console.log('refresh');
            this.DayDate = 
                {
                    "newOrders":[
                    {
                        "borardList":["string1","string2","string3","string4","string5"],"date":"测试内容o0mt","foodOrderId":86546,"foodState":1,"orderNum":"测试内容ntvx","orderWay":1,"peopleNum":25
                    }
                    ],"orderCount":(Math.random() * 1000).toFixed(0),"peopleCount":(Math.random() * 1000).toFixed(0),"priceSum":(Math.random() * 1000).toFixed(0)
                }
        }
    },
    watch: {
        resetId() {
            this.fetchDate();
        }
    },
    components: {
    },
    created() {
        this.fetchDate();
    },
    mounted() {
        window.restinter = window.setInterval(this.fetchDate, 5000);
    },
    beforeDestroy() {
        window.clearInterval(window.restinter);
    }
};
</script>
