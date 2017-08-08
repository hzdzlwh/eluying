/*
* @Author: lxj
* @Date:   2017-08-01 14:45:58
* @Last Modified by:   lxj
* @Last Modified time: 2017-08-08 15:23:40
* @email: 783384903@qq.com
*/

<template>
    <div class="rest-taday-contain" style="height:auto">
        <div class="rest-taday-count">
            <div class="restDetail-title-tip">桌号</div>
            <div class="restDetail-title-display">
                 <div><span class="restDetail-title-dish">{{openData.boardDetailResps[0].boardName}}{{openData.boardDetailResps[0].boardId}}</span> <span v-if='openData.boardDetailResps.length > 1' class="restDetail-type-tag" :title='selectDishText'>并</span></div>
                <!-- <div><span class="rest-taday-tag " :class="getState(item.foodState, 'color')">{{getState(item.foodState, 'text')}}</span></div> -->
                 <div v-if='openData.state !== 2 && openData.orderState'><span class="rest-taday-tag " :class='getState("color")' >{{getState("text")}}</span></div>
            </div>
            <div>
                <div class="rest-restDetail-left">
                    <div class="restDetail-title-tip">人数</div>
                    <div>{{openData.peopleNum}}<!-- <inputVaild :value='changeNum' :max='2000' :isInt='true' ></inputVaild> --> <img src="/static/image/icon/edit.png" alt="" @click='editor()'></div>
                </div>
                <div class="rest-restDetail-right">
                    <div class="restDetail-title-tip">{{!openData.isHasOrder ? '用餐时长' :'用餐时间' }}</div>
                    <div class="restDetail-title-data" v-if='openData.isHasOrder'>{{openData.creationTime}}</div>
                    <div class="restDetail-title-data" v-if='!openData.isHasOrder'>{{openData.timer}}</div>
                </div>
            </div>
            <div class="rest-restDetail-other" @click='moreShow = !moreShow' v-if='openData.state !== 2 && openData.orderState'>
                {{openData.customerName}} {{openData.customerPhone}}查看详情 <span >>></span>
            </div>
        </div>  <div  class="rest-restDetail-transform" :style='{maxHeight: moreShow ? "400px" : "0"}' v-if='openData.state !== 2 && openData.orderState'>
                        <div class="rest-restDetail-otherDetail"  >
                    <div>
                        <div><span>客户姓名：</span><span>{{openData.customerName || '无'}}</span></div>
                        <div><span>手机号：</span><span class="rest-restDetail-span">{{openData.customerPhone || '无'}}</span></div>
                    </div>
                     <div>
                        <div><span>客户来源：</span><span>{{orderWay[openData.originType]}}</span></div>
                        <div><span>销售员：</span><span class="rest-restDetail-span">{{openData.salerString || '无'}}</span></div>
                    </div>
                     <div>
                        <div><span>整单优惠：</span><span>{{openData.discount === 1 ? '无' : openData.discount}}</span></div>
                        <div><span>折扣方案：</span><span class="rest-restDetail-span">{{openData.discountRelatedName || '无'}}</span></div>
                    </div>
                    <div>订单备注：{{openData.remark || '无'}}</div>
                    <div><span><span style="display: inline-block;width: 4em;text-align: right;">订单号：</span>{{openData.caterOrderId}}</span></div>
                    <div><span>开台时间：{{openData.operatorDate}}</span></div>
                    <div>
                        <div><span style="display: inline-block;width: 4em;text-align: right;">操作人</span>{{openData.operatorName}}</div>
                        <div style="color:#178ce6;">编辑详情</div>
                    </div>
                </div>
                </div>
        <div class="rest-restDetail-constain">
            <table class="rest-restDetail-table">
                <thead>
                    <tr><td width="150px">菜品名称</td><td width="45px">数量</td><td width='80px'>金额</td></tr>
                </thead>
                <tbody>
                <template v-for='item in restDate.data.itemsMap' v-if='restDate.data.itemsMap && leftType !== 4 && openData.itemsMap'>
                    <tr @click='changeItem(item)'> <td><div><span class="rest-restDetail-dishname" :class='{"rest-item-del" : item.serviceState === 1}'> <span  :class='getTriangle(item)'></span>{{item.dishName}}</span><span class="rest-item-send" v-if='item.serviceState === 2'>送</span></div></td><td><div :class='{"rest-item-del" : item.serviceState === 1}'>x{{item.bookNum}}</div></td><td :class='{"rest-item-del" : item.serviceState === 1}'>{{item.price}}</td></tr>
                    <tr v-for='sub in item.subDishList' v-if='item.select' :class='{"rest-item-del" : sub.serviceState === 1}'>
                        <td class="rest-restDetail-trchild">{{sub.dishName}}</td><td><div>x{{sub.bookNum}}</div></td><td></td>
                    </tr>
                </template> 
                <template v-if='leftType === 4'>
                    <tr v-for='(item,index) in addFood'>
                        <td class="rest-restDetail-trchild">{{item.name}}</td><td><div style='width:100px;'><count :del=true :min = -1 :num='item.num' :onNumChange='onNumChange' :id='item.id'></count></div></td><td>{{item.price * item.num }}</td>
                    </tr>
                </template>
                </tbody>
            </table>
            <div v-if='leftType === 4'>
            <p class="rest-text-title"><span>备注信息</span></p>
            <textarea name="remark" placeholder="请输入备注信息" maxlength="500" v-model="remark" class="dd-input">
                                </textarea>
            </div>
        </div>
        <div class="rest-restDetail-foot">
        <div style="padding:15px; 15px 10px;border-bottom:1px solid #e0e6ed">
        <div class="rest-foot-count">            
        <div class="restDetail-title-tip" v-if='leftType !== 4'>
                共{{(openData.itemsMap && openData.itemsMap.length) || 0}}项
            </div>
        <div class="restDetail-title-tip" v-if='leftType === 4'>
                共{{addFood.length}}项
            </div>
            <div class="rest-restDetail-dishcount" v-if='leftType !== 4'>
                <span class="restDetail-title-tip">合计</span>{{openData.totalPrice || 0}}
                <div><s class="restDetail-title-tip" v-if='openData.showDiscount'>{{openData.originTotalPrice || 0}}</s><span class="rest-restDetail-tag">{{openData.showDiscount}}</span></div>
            </div>
            <div class="rest-restDetail-dishcount" v-if='leftType === 4'>
                <span class="restDetail-title-tip">合计</span>{{addFoodTotal()}}
            </div>
            </div>
            <div class="restDetail-foot-check" v-if='openData.payments'>
                <div class="restDetail-check-item" @click='needpay = !needpay'><span ><span :class="getCheckeStatus(needpay)"></span>应收金额</span> <span>{{findTypePrice(openData.payments, 13)}}</span></div>
                <div class="restDetail-check-list" v-show='needpay'>
                    <div class="restDetail-check-item"><span>总金额</span> <span>￥{{findTypePrice(openData.payments, 10)}}</span></div>
                    <div class="restDetail-check-item" v-if='findTypePrice(openData.payments, 5) != 0'><span>折扣金额</span> <span>￥{{findTypePrice(openData.payments, 5)}}</span></div>
                    <div class="restDetail-check-item" v-if='openData.discount != 0'><span>整单优惠</span> <span>￥{{openData.discount}}</span></div>
                    <div class="restDetail-check-item" v-if='findTypePrice(openData.payments, 17) != 0'><span>零头处理</span> <span>￥{{findTypePrice(openData.payments, 17)}}</span></div>
                </div>
                 <div class="restDetail-check-item" @click='paied = !paied'><span ><span :class="getCheckeStatus(paied)"></span>{{findTypePrice(openData.payments, 14) >= 0 ? '实收金额'
                                                : '实退金额'}}</span> <span>¥{{Math.abs(
                                                findTypePrice(openData.payments, 14))}}</span></div>
                <div class="restDetail-check-list" v-show='paied'>
                    <div class="restDetail-check-item" v-if='openData.payments.some(pay => pay.type === 19)'><span>{{dateFormat(openData.payments.find(pay => pay.type === 19).creationTime)}} {{openData.payments.find(pay => pay.type === 19).payChannel}}抵扣</span> <span>￥findTypePrice(openData.payments, 19)</span></div>
                    <div class="restDetail-check-item" v-if='openData.payments.some(pay => pay.type === 20)'><span>{{dateFormat(openData.payments.find(pay => pay.type === 20).creationTime)}}会员余额</span> <span>￥findTypePrice(openData.payments, 20)</span></div>
                    <div class="restDetail-check-item" v-if='openData.payments.some(pay => pay.type === 18)'><span>{{dateFormat(openData.payments.find(pay => pay.type === 18).creationTime)}} 常规</span> <span>￥findTypePrice(openData.payments, 18)</span></div>
                </div>
                 <div class="restDetail-check-item" v-if='findTypePrice(openData.payments, 4) != 0'><span><span></span>违约金</span> <span>findTypePrice(openData.payments, 4)</span></div>
                 <div class="restDetail-check-item"><span><span></span>还需收款</span> <span class="order-price-num red" :class="{green : !Number(findTypePrice(openData.payments, 15))}">findTypePrice(openData.payments, 15)</span></div>
            </div>

        </div>
        <div class="resetmange-click-list">
            <div class="resetMange-btn-base resetMange-btn-promise" @click='addNewFood' v-if='this.leftType !== 4'>{{openData.itemsMap && openData.itemsMap.length ? '加' : '点'}}菜</div>
            <div class="resetMange-btn-base " v-if='this.leftType !== 4'>换桌</div>
            <div class="resetMange-btn-base " v-if='this.leftType !== 4'>撤台</div>
            <div class="resetMange-btn-base resetMange-btn-lager" v-if='this.leftType === 4'>下单</div>
            <div class="resetMange-btn-base resetMange-btn-lager" v-if='this.leftType === 4' @click='canlAddFood'>取消</div>
            <div class="resetMange-btn-base " v-if='isHasOrder && this.leftType !== 4'>取消订单</div>
            <div class="resetMange-btn-base " v-if='isHasOrder && this.leftType !== 4'>打印</div>
            <div class="resetMange-btn-base " v-if='isHasOrder && this.leftType !== 4'>收银</div>
            <div class="resetMange-btn-base resetMange-btn-promise resetMange-btn-lager" v-if='isHasOrder && this.leftType !== 4'>开台并入厨</div>
        </div>
        </div>
    </div>
</template>
<style lang='scss'>
    @mixin flex-just-between {
        display: flex;
        justify-content: space-between;
    }
    .resetMange-btn-base {
        border-radius:4px;
        width:70px;
        text-align: center;
        height:32px;
        line-height: 32px;
        font-size:14px;
        color:#99a9bf;
        border:1px solid #99a9bf;
        display: inline-block;
        margin-top: 10px;
        cursor: pointer;
    }
    .resetMange-btn-lager{
        width: 140px;
    }
    .resetMange-btn-promise{
        border-color: #178ce6;
        background:#178ce6;
        color: #fff;
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
        .resetmange-click-list{
            padding: 0 8px 8px;
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            flex-wrap: wrap;
        }
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
            cursor: pointer;
        }
    }
    .rest-restDetail-left{
        width: 100px;
        border-right: 1px dashed #99a9bf;
        display: inline-block;
        img{
            cursor: pointer;
        }
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
        & > span{
            transform: scaleY(0.7) scaleX(1.7) rotate(90deg);
            display: inline-block;
        }
    }
    .rest-restDetail-transform{
         transition: max-height 0.6s;
        overflow: hidden;
        position: absolute;
        width: 318px;
    }
    .rest-restDetail-otherDetail{
       
            padding: 15px;
    background-color: #fff;
    box-shadow: 0 4px 4px 0 rgba(154,162,167,0.19);
font-size:12px;
color:#475669;
& > div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    .rest-restDetail-span{
        width: 80px;
        display: inline-block;
    }
}
    }
    .rest-restDetail-constain{
        .rest-text-title{
            font-size: 12px;
            color: #99a9bf;
            padding: 10px 0;
        }
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
                    & > div{
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
import { mapState, mapMutations } from 'vuex';
import { orderWay } from '../orderWay.js';
import inputVaild from '../../common/components/inputVaild.vue';
import count from '../../common/components/counter.vue';
import util from 'util';
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
            editNum: false,
            moreShow: false,
            remark: '',
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
    computed: {
        ...mapState([
            'restId',
            'board',
            'selectDish',
            'openData',
            'leftType',
            'addFood'
        ]),
        selectDishText() {
            let str = '';
            this.openData.boardDetailResps.forEach((el, index) => {
                if (index !== 0) {
                    str += '\r\n';
                }
                str += el.boardName + el.boardId;
            });
            return str;
        },
        isHasOrder() {
            return !!this.openData.isHasOrder;
        }
    },
    methods: {
        ...mapMutations([
            'setLeftType',
            'changeFood',
            'canlFood',
            'setOpenData'
        ]),
        submitAddFood() {
            const parms = {
            };
            if (this.openData.boardDetailResps.length) {
                this.openData.boardDetailResps.forEach(el => {
                    parms.boardList.push(el.id);
                });
            } else {
                parms.boardList = [];
            }
            if (this.openData.list) {
                parms.boardLogIds = this.this.openData.list;
            }
            parms.restId = this.restId;
            if (!this.isHasOrder) {
                parms.operationType = 1;
            }
            http.get('/catering/addOrder', parms).then(res => {
                return res.data.caterOrderId;
            }).then(id => {
                http.get('/catering/getCaterOrderDetail', { caterOrderId: id });
            }).then(data => {
                this.setOpenData(data.data);
                this.canlAddFood;
            });
        },
        canlAddFood() {
            this.canlFood();
            this.remark = '';
            this.setLeftType({ leftType: 2 });
        },
        addFoodTotal() {
            if (!this.addFood || !this.addFood.length) {
                return 0;
            }
            const price = this.addFood.reduce((pre, cur) => {
                return pre + Number(cur.price * cur.num.toFixed(2));
            }, Number(this.addFood[0].price * this.addFood[0].num.toFixed(2)));
            return price.toFixed(2);
        },
        findTypePrice(arr, type) {
            let price = 0;
            if (arr) {
                arr.forEach(item => {
                    if (item.type === type) {
                        price += item.fee;
                    }
                });
            }
            return Number(price.toFixed(2));
        },
        addNewFood() {
            this.setLeftType({ leftType: 4 });
        },
        dateFormat(date) {
            return util.timeFormat(date);
        },
        editor() {
            this.editNum = !this.editNum;
        },
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
        getState(type) {
            const state = this.openData.orderState;
            return this.ORDER_STATE_TEXT[this.ORDER_TYPE.CATERING][state][type];
        },
        timer() {
            const now = new Date();
            const time = now - new Date(this.openData.expectStartTime || this.openData.openTime);
            const ht = parseInt(time / (1000 * 60 * 60));
            const mt = parseInt((time / (1000 * 60)) % 60);
            if (!this.openData.timer) {
                this.$set(this.openData, 'timer', this.getNumSte(ht, 2) + ':' + this.getNumSte(mt, 2));
            } else {
                this.openData.timer = this.getNumSte(ht, 2) + ':' + this.getNumSte(mt, 2);
            }
        },
        getNumSte(str, fill) {
            const full = '00000' + str;
            return full.slice(full.length - fill, full.length);
        },
        onNumChange(type, index, num) {
            this.changeFood({ food: { id: index, num: num } });
        }
    },
    watch: {
        isHasOrder(val) {
            if (val) {
                this.timer();
                window.inter = window.setInterval(this.timer, 1000 * 60);
            } else {
                window.clearInterval(window.inter);
            }
        }
    },
    components: {
        inputVaild,
        count
    },
    created() {
        if (!this.openData.isHasOrder) {
            this.timer();
            window.inter = window.setInterval(this.timer, 1000 * 60);
        }
    },
    beforeDestroy() {
        window.clearInterval(window.inter);
    }

};
</script>
