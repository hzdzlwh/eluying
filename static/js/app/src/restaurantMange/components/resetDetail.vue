/*
* @Author: lxj
* @Date:   2017-08-01 14:45:58
* @Last Modified by:   linxinjian
* @Last Modified time: 2017-08-03 16:50:38
* @email: 783384903@qq.com
*/

<template>
    <div class="rest-taday-contain">
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
                    <tr> <td><div><span class="rest-restDetail-dishname"> <span class="triangle-down"></span>{{item.dishName}}</span><span>送</span></div></td><td><div>x{{item.bookNum}}</div></td><td>{{item.price}}</td></tr>
                    <tr v-for='sub in item.subDishList' >
                        <td class="rest-restDetail-trchild">{{sub.dishName}}</td><td><div>x{{sub.bookNum}}</div></td><td></td>
                    </tr>
                </template> 
       
                </tbody>
            </table>
        </div>
    </div>
</template>
<style lang='scss'>
    .triangle-down {
        width: 0;
        height: 0;
        border-left: 12px solid transparent;
        border-right: 12px solid transparent;
        border-top: 8px solid red;
    }
    .rest-restDetail-constain{
        padding: 0 20px;
    }
    @mixin flex-just-between {
        display: flex;
        justify-content: space-between;
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
            restDate: {
                'code': 61058, 'data':
                {
                    'boardDetailResps': [
                        {
                            'boardId': 86250, 'boardName': '测试内容u2fj'
                        }
                    ], 'boardInfoStatus': 60315, 'boardState': 15170, 'canCancelSaleOrder': true, 'cancelAble': false, 'caterOrderId': 82081, 'changeBoard': false, 'channelDiscount': 75345, 'colseBoardTime': '测试内容76o1', 'creationTime': '测试内容98xi', 'customerName': '测试内容o8su', 'customerPhone': '测试内容9b4v', 'customerType': 46771, 'discount': 34406, 'discountChannel': 72281, 'discountRelatedId': 10840, 'discountRelatedName': '测试内容rh4n', 'editAble': false, 'expectStartTime': '测试内容1173', 'hasPrinter': true, 'hasRole': true, 'infoStatus': 53553, 'isCombinationOrder': false, 'isExistComplimentary': 13066, 'isExistDish': 83004, 'isExistPackage': 71415, 'itemsMap': [
                        {
                            'bookNum': 12266, 'creationTime': '测试内容7ih9', 'dishId': 65546, 'dishName': '测试内容161y', 'dishType': 15172, 'isSend': false, 'operatorName': '测试内容k432', 'price': 57527, 'remark': '测试内容4fm6', 'serviceState': 14473, 'subDishList': [
                                {
                                    'bookNum': 45563, 'dishId': 15876, 'dishName': '测试内容4285', 'price': 74613, 'serviceState': 37527
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
