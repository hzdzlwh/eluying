/*
* @Author: lxj
* @Date:   2017-08-01 14:45:58
* @Last Modified by:   linxinjian
* @Last Modified time: 2017-08-03 18:42:06
* @email: 783384903@qq.com
*/

<template>
    <div class="rest-taday-contain" style="height:auto">
        <div class="rest-taday-count">
            <div class="restDetail-title-tip">桌号</div>
            <div class="restDetail-title-display">
                <div><span class="restDetail-title-dish">大圆桌4</span> <span class="restDetail-type-tag">并</span></div>
                <!-- <div><span class="rest-taday-tag " :class="getState(item.foodState, 'color')">{{getState(item.foodState, 'text')}}</span></div> -->
                 <div><span class="rest-taday-tag yellow" >已预定</span></div>
            </div>
            <div>
                <div class="rest-restDetail-left">
                    <div class="restDetail-title-tip">人数</div>
                    <div>3 <img src="/static/image/icon/edit.png" alt=""></div>
                </div>
                <div class="rest-restDetail-right">
                    <div class="restDetail-title-tip">用餐时间</div>
                    <div class="restDetail-title-data">2017-03-29 12:30</div>
                </div>
            </div>
            <div class="rest-restDetail-other ">
                肖斯昆 13926585665查看详情 <span >>></span>
            </div>
        </div>
        <div class="rest-restDetail-constain">
            <table class="rest-restDetail-table">
                <thead>
                    <tr><td width="150px">菜品名称</td><td width="45px">数量</td><td width='80px'>金额</td></tr>
                </thead>
                <tbody>
                <template v-for='item in restDate.data.itemsMap'>
                    <tr @click='changeItem(item)'> <td><div><span class="rest-restDetail-dishname" :class='{"rest-item-del" : item.serviceState === 1}'> <span  :class='getTriangle(item)'></span>{{item.dishName}}</span><span class="rest-item-send" v-if='item.serviceState === 2'>送</span></div></td><td><div :class='{"rest-item-del" : item.serviceState === 1}'>x{{item.bookNum}}</div></td><td :class='{"rest-item-del" : item.serviceState === 1}'>{{item.price}}</td></tr>
                    <tr v-for='sub in item.subDishList' v-if='item.select' :class='{"rest-item-del" : sub.serviceState === 1}'>
                        <td class="rest-restDetail-trchild">{{sub.dishName}}</td><td><div>x{{sub.bookNum}}</div></td><td></td>
                    </tr>
                </template> 
       
                </tbody>
            </table>
        </div>
        <div class="rest-restDetail-foot">
        <div style="padding:15px;border-bottom:1px solid #e0e6ed">
        <div class="rest-foot-count">            
        <div class="restDetail-title-tip">
                共5项
            </div>
            <div class="rest-restDetail-dishcount">
                <span class="restDetail-title-tip">合计</span>3000.00
                <div><s class="restDetail-title-tip">5000.00</s><span class="rest-restDetail-tag">金卡6.0折</span></div>
            </div>
            </div>
            <div class="restDetail-foot-check">
                <div class="restDetail-check-item" @click='needpay = !needpay'><span ><span :class="getCheckeStatus(needpay)"></span>应收金额</span> <span>3000.00</span></div>
                <div class="restDetail-check-list" v-show='needpay'>
                    <div class="restDetail-check-item"><span>总金额</span> <span>￥2010.20</span></div>
                    <div class="restDetail-check-item"><span>折扣金额</span> <span>￥2010.20</span></div>
                    <div class="restDetail-check-item"><span>整单优惠</span> <span>￥2010.20</span></div>
                    <div class="restDetail-check-item"><span>零头处理</span> <span>￥2010.20</span></div>
                </div>
                 <div class="restDetail-check-item" @click='paied = !paied'><span ><span :class="getCheckeStatus(paied)"></span>实收金额</span> <span>3000.00</span></div>
                <div class="restDetail-check-list" v-show='paied'>
                    <div class="restDetail-check-item"><span>07-04 11:23 星球币抵扣</span> <span>￥2010.20</span></div>
                    <div class="restDetail-check-item"><span>07-04 11:23 会员余额</span> <span>￥2010.20</span></div>
                    <div class="restDetail-check-item"><span>07-04 11:23 现金</span> <span>￥2010.20</span></div>
                </div>
                 <div class="restDetail-check-item"><span><span></span>违约金</span> <span>3000.00</span></div>
                 <div class="restDetail-check-item"><span><span></span>还需收款</span> <span>3000.00</span></div>
            </div>
        </div>
        </div>
    </div>
</template>
<style lang='scss'>
    @mixin flex-just-between {
        display: flex;
        justify-content: space-between;
    }
    .restDetail-foot-check{
        .restDetail-check-list{
            padding-left: 20px;
        }
        .restDetail-check-item{
            @include flex-just-between;
        }
    }
    .rest-restDetail-foot{
        background:#ffffff;
        box-shadow:0 -4px 4px 0 rgba(154,162,167,0.19);
        width:318px;
        border-bottom-right-radius: 8px;
        border-bottom-left-radius: 8px;
        .rest-foot-count{
             @include flex-just-between;
            border-bottom: 1px dashed #99a9bf;
            .rest-restDetail-dishcount{
                .rest-restDetail-tag{
                    background:#ff9326;
                    border-radius:4px;
                    height:16px;
                    color: #fff;
                    font-size: 14px;
                    line-height: 16px;
                    height: 16px;
                }
            }
        }
    }
    .rest-item-del{
        text-decoration: line-through;
    }
    .rest-item-send{
        font-size:14px;
        color:#178ce6;
    }
    .triangle-down {
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 8px solid #8e8e8e;
        display: inline-block;
        margin-right: 5px;
    }
    .triangle-right {
        width: 0;
        height: 0;
        border-bottom: 6px solid transparent;
        border-left: 8px solid #8e8e8e;
        border-top: 6px solid transparent;
        display: inline-block;
        margin-right: 5px;
    }
    .rest-restDetail-constain{
        padding: 10px 20px;
        height: 400px;
        overflow-y: scroll;
    }

    .restDetail-title-tip{
        font-size:12px;
        color:#8492a6;
    }
    .restDetail-title-display{
        @include flex-just-between
        .restDetail-title-dish{
        font-size:24px;
        color:#475669;
        line-height:24px;
        font-weight: bold;
        }
        .rest-taday-tag{
            margin-top: 0;
        }
        .restDetail-type-tag{
            font-size: 14px;
            padding: 4px;
            color: #fff;
            border-radius: 4px;
            background-color: #ffba75;
            font-weight: 200;
            line-height: 24px;
            height: 24px;
            vertical-align: text-bottom;
        }
    }
    .rest-restDetail-left{
        width: 100px;
        border-right: 1px dashed #99a9bf;
        display: inline-block;
    }
    .rest-restDetail-right{
        padding-left: 20px;
        display: inline-block;
    }
    .restDetail-title-data{
        font-size:18px;
        color:#475669;
    }
    .rest-restDetail-other{
        text-align: right;
        font-size:12px;
        color:#c0ccda;
        span{
            transform: scaleY(0.7) scaleX(1.7) rotate(90deg);
            display: inline-block;
        }
    }
    .rest-restDetail-constain{
        .rest-restDetail-table{
            thead{
                font-size:12px;
                color:#99a9bf;
                border-bottom: 1px dashed #99a9bf;
            }
            tr{
                cursor: pointer;
                td:nth-child(1){
                    text-align: left;
                }
                td:nth-child(2){
                    text-align: center;
                }
                td:nth-child(3){
                    text-align: right;
                }
            }
            .rest-restDetail-dishname{
                    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    /* overflow-x: hidden; */
    text-overflow: ellipsis;
    max-width: 130px;
    vertical-align: bottom;
            }
            tbody {
                font-size:14px;
                color:#8492a6;
                .rest-restDetail-trchild{
                    padding-left:25px;
                }
                tr{
                    padding:15px 0;
                    height: 48px;
                    border-bottom: 1px dashed #99a9bf;

                }
                td:nth-child(1){
                    font-size:16px;
                    color:#475669;
                }
                td:nth-child(2){
                    div{
                        border-left:1px dashed #99a9bf;
                        border-right:1px dashed #99a9bf;
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
            needpay: false,
            paied: false,
            restDate: {
                'code': 61058, 'data':
                {
                    'boardDetailResps': [
                        {
                            'boardId': 86250, 'boardName': '测试内容u2fj'
                        }
                    ], 'boardInfoStatus': 60315, 'boardState': 15170, 'canCancelSaleOrder': true, 'cancelAble': false, 'caterOrderId': 82081, 'changeBoard': false, 'channelDiscount': 75345, 'colseBoardTime': '测试内容76o1', 'creationTime': '测试内容98xi', 'customerName': '测试内容o8su', 'customerPhone': '测试内容9b4v', 'customerType': 46771, 'discount': 34406, 'discountChannel': 72281, 'discountRelatedId': 10840, 'discountRelatedName': '测试内容rh4n', 'editAble': false, 'expectStartTime': '测试内容1173', 'hasPrinter': true, 'hasRole': true, 'infoStatus': 53553, 'isCombinationOrder': false, 'isExistComplimentary': 13066, 'isExistDish': 83004, 'isExistPackage': 71415, 'itemsMap': [
                        {
                            'bookNum': 12266, 'creationTime': '测试内容7ih9', 'dishId': 65546, 'dishName': '测试内容161y', 'dishType': 15172, 'isSend': false, 'operatorName': '测试内容k432', 'price': 57527, 'remark': '测试内容4fm6', 'serviceState': 1, 'subDishList': [
                                {
                                    'bookNum': 45563, 'dishId': 15876, 'dishName': '测试内容4285', 'price': 74613, 'serviceState': 1
                                }
                            ]
                        }
                    ], 'needPrint': true, 'onePass': false, 'operationId': 18753, 'operatorDate': '测试内容c4ic', 'operatorName': '测试内容a2g4', 'orderId': 88550, 'orderNum': '测试内容6e11', 'orderState': 48013, 'orderTime': '测试内容1991', 'orderType': 57332, 'origin': '测试内容i91i', 'originId': 33462, 'originType': 46332, 'payments': [
                        {
                            'creationTime': 35243, 'fee': 33384, 'payChannel': '测试内容p4c2', 'payId': 27773, 'state': 74325, 'type': 57076
                        }
                    ], 'peopleNum': 52357, 'quickDescription': '测试内容81e5', 'quickDiscountId': 30240, 'relationStatus': 33666, 'remark': '测试内容41de', 'reserveName': '测试内容3615', 'resettleAble': false, 'restId': 81015, 'restName': '测试内容4ioh', 'salerId': 42716, 'salerString': '测试内容dqm8', 'scan': 74276, 'showDiscount': '测试内容a61c', 'showPrint': true, 'totalPrice': 21370, 'type': 87814, 'vipDiscount': 74287, 'vipId': 45370, 'vipLevel': '测试内容s12s'
                },
                'msg': '测试内容mz33'
            }
        };
    },
    computed: mapState([
        'restId'
    ]),
    methods: {
        changeItem(item) {
            if (!item.subDishList || !item.subDishList.length) {
                return;
            }
            if (item.select === undefined) {
                this.$set(item, 'select', true);
            } else {
                item.select = !item.select;
            }
        },
        getCheckeStatus(falg) {
            if (falg) {
                return 'triangle-down';
            }
            return 'triangle-right';
        },
        getTriangle(item) {
            if (!item.subDishList || !item.subDishList.length) {
                return '';
            }
            if (item.select) {
                return 'triangle-down';
            } else {
                return 'triangle-right';
            }
        },
        getState(id, type) {
            return this.ORDER_STATE_TEXT[this.ORDER_TYPE.CATERING][id][type];
        }
    },
    watch: {
    },
    components: {
    },
    created() {

    }

};
</script>
