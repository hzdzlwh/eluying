/*
* @Author: lxj
* @Date:   2017-08-01 14:45:58
* @Last Modified by:   lxj
* @Last Modified time: 2017-08-11 16:40:48
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
                    <div class="restDetail-title-tip">{{!isHasOrder ? '用餐时长' :'用餐时间' }}</div>
                    <div class="restDetail-title-data" v-if='isHasOrder'><DatePicker :value='new Date(openData.creationTime)'  @input='changeBookTime' clearable=false type="datetime" placeholder="选择日期时间" size='small' editable = false :clearable = false format='yyyy-MM-dd HH:mm'/></div>
                    <div class="restDetail-title-data" v-if='!isHasOrder'>{{openData.timer}}</div>
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
                </table>
                <table>
                <tbody>
                <template v-for='item in openData.itemsMap' v-if='restDate.data.itemsMap && leftType !== 4 && openData.itemsMap'>
                    <tr @click='changeItem(item); dishClick(item)' > <td width="150px"><div><span class="rest-restDetail-dishname" :class='{"rest-item-del" : item.serviceState === 1}'> <span  :class='getTriangle(item)'></span><span >{{item.dishName}}</span></span><span class="rest-item-send" v-if='item.serviceState === 2'>送</span></div></td><td width="45px"><div :class='{"rest-item-del" : item.serviceState === 1}'>x{{item.bookNum}}</div></td><td :class='{"rest-item-del" : item.serviceState === 1}' width='80px'>{{item.price}}</td></tr>
                    <tr v-for='sub in item.subDishList' @click='dishClick(sub)' v-if='item.select' :class='{"rest-item-del" : sub.serviceState === 1}'>
                        <td class="rest-restDetail-trchild" width="150px">{{sub.dishName}}</td><td width='80px'><div>x{{sub.bookNum}}</div></td><td width='80px'></td>
                    </tr>
                </template> 
                <template v-if='leftType === 4'>
                    <tr v-for='(item,index) in addFood'>
                        <td class="rest-restDetail-trchild" width="150px">{{item.name}}</td><td width="45px"><div style='width:100px;'><count :del=true :min = -1 :num='item.num' :onNumChange='onNumChange' :id='item.id'></count></div></td><td width='80px'>{{item.price * item.num }}</td>
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
        <div class="rest-restDetail-foot" v-if='!dishChange'>
        <div style="padding:15px; 15px 10px;border-bottom:1px solid #e0e6ed">
        <div class="rest-foot-count">            
        <div class="restDetail-title-tip" >
                共{{(openData.itemsMap && openData.itemsMap.length) || 0}}项
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
                 <div class="restDetail-check-item"><span><span></span>还需收款</span> <span class="order-price-num red" :class="{green : !Number(findTypePrice(openData.payments, 15))}">{{findTypePrice(openData.payments, 15)}}</span></div>
            </div>

        </div>
        <div class="resetmange-click-list">
            <div class="resetMange-btn-base resetMange-btn-promise" @click='addNewFood' v-if='this.leftType !== 4'>{{openData.itemsMap && openData.itemsMap.length ? '加' : '点'}}菜</div>
            <div class="resetMange-btn-base " @click='openBoard' v-if='this.leftType !== 4'>换桌</div>
            <div class="resetMange-btn-base " @click='closeBoard' v-if='this.leftType !== 4'>撤台</div>
            <div class="resetMange-btn-base resetMange-btn-lager" v-if='this.leftType === 4' @click='submitAddFood'>下单</div>
            <div class="resetMange-btn-base resetMange-btn-lager" v-if='this.leftType === 4' @click='canlAddFood'>取消</div>
            <div class="resetMange-btn-base " v-if='isHasOrder && this.leftType !== 4' @click='canOrder'>取消订单</div>
            <div class="resetMange-btn-base " v-if='isHasOrder && this.leftType !== 4'>打印</div>
            <div class="resetMange-btn-base " v-if='isHasOrder && this.leftType !== 4' @click='crash'>收银</div>
            <div class="resetMange-btn-base resetMange-btn-promise resetMange-btn-lager" v-if='isHasOrder && this.leftType !== 4' @click='openBoardAndCook'>开台并入厨</div>
        </div>
        </div>
        <div class="rest-restDetail-foot reset-restDetail-resetChange" v-if='dishChange'>
        <div class='reset-resetChange-detail'>
             <div>菜品备注：{{dishChange.remark}} <span class="reset-resetChange-remark" @click='changeRemarkModal'>修改</span></div>
            <div>点菜员：{{dishChange.operatorName}}</div>
            <div>下单时间：{{dishChange.creationTime}}</div>
        </div>
            <div class="resetChange-foot-btn">
                <div class="resetMange-btn-base " v-if='dishChange.serviceState === 0' @click='dishModalChange(0)'>退菜</div>
                <div class="resetMange-btn-base " v-if='dishChange.isSend' @click='dishModalChange(1)'>赠送</div>
            </div>
            <div class="">
                <div>
                   
                </div>
                <div>
                
                </div>
            </div>
        </div>
        <changeRemark :visible='changeRemarkVisible':data='dishChange.remark' @changeRemark='changeRemark'></changeRemark>
        <dishModal :visible='dishModalVisible' :type='dishModalType' :data='dishChange' @hideModal='hideDishModal' @dishChange='dishChangeSub'></dishModal>
<!--         <bookInfo :visible='bookInfoVisible' :num='bookPeopleNUm' :data='bookData' @hideModal='hidebookInfo' :type='isHasOrder' @changeBook='changeBook'></bookInfo> -->
<keyBoard :visible ='bookInfoVisible' @close='hidebookInfo' :num ='openData.peopleNum' :dish='openData.boardDetailResps[0].boardName + openData.boardDetailResps[0].boardId' @numChange='changeBookNum'></keyBoard>
    </div>
</template>
<style lang='scss'>
    

</style>
<script>
import { ORDER_TYPE, ORDER_STATE_TEXT } from '../../ordersManage/constant.js';
import http from '../../common/http.js';
import { mapState, mapMutations } from 'vuex';
import { orderWay } from '../orderWay.js';
import inputVaild from '../../common/components/inputVaild.vue';
import count from '../../common/components/counter.vue';
import util from 'util';
import bus from '../../common/eventBus.js';
import restBus from '../event.js';
import bookInfo from './changeBookInfo.vue';
import dishModal from './dishModal.vue';
import { DatePicker } from 'element-ui';
import keyBoard from '../../common/components/inputKeyboard.vue';
import changeRemark from './changeRemark.vue';
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
            moreShow: false,
            remark: '',
            bookInfoVisible: false,
            bookPeopleNUm: 0,
            bookData: '',
            dishChange: undefined,
            dishModalVisible: false,
            dishModalType: 0,
            // 0退，1换
            changeRemarkVisible: false,
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
            if (this.openData.isHasOrder || this.openData.caterOrderId) {
                return true;
            }
            return false;
        }
    },
    methods: {
        ...mapMutations([
            'setLeftType',
            'changeFood',
            'canlFood',
            'setOpenData'
        ]),
        changeRemarkModal() {
            this.changeRemarkVisible = true;
        },
        changeRemarkHide() {
            this.changeRemarkVisible = false;
        },
        changeRemark(val) {
            http.get('/order/modifyCaterOrderRemark', { caterOrderId: this.openData.caterOrderId, remark: val }).then(res => {
                restBus.$emit('refeshView');
            });
        },
        hideDishModal() {
            this.dishModalVisible = false;
        },
        dishChangeSub(val) {
            const dishes = [];
            dishes.push({ dishId: this.dishChange.dishId, oprNum: val, serviceId: this.dishChange.serviceId });
            http.get('/dish/dishOpr', { caterOrderId: this.openData.caterOrderId,
                dishes: JSON.stringify(dishes),
                oprType: this.dishModalType ? 4 : 2
            }).then(res => {
                restBus.$emit('refeshView');
            });
        },
        dishModalChange(type) {
            this.dishModalVisible = true;
            this.dishModalType = type;
        },
        dishClick(dish) {
            if (dish.serviceState === 1) {
                return;
            }
            this.dishChange = dish;
        },
        changeBookTime(value) {
            this.changeBook({ orderTime: util.dateFormatLong(value) });
        },
        changeBookNum(value) {
            this.changeBook({ peopleNum: value });
        },
        changeBook(parm) {
            let parms = parm;
            if (this.openData.list) {
                parms.boardLogIds = JSON.stringify(this.openData.list);
            }
            if (this.openData.caterOrderId) {
                parms.caterOrderId = this.openData.caterOrderId;
            }
            parms = Object.assign(parms, parm);
            http.get('/catering/modifyPeopleNum', parms).then(res => {
                restBus.$emit('refeshView');
            });
        },
        hidebookInfo() {
            this.bookInfoVisible = false;
        },
        openBoard() {
            bus.$emit('changeBoard', { data: this.openData });
        },
        openBoardAndCook() {
            http.get('/board/openBoardAndCook', { restId: this.restId, caterOrderId: this.openData.caterOrderId }).then;
        },
        crash() {
            bus.$emit('showCashier', { type: 'orderDetail' });
        },
        canOrder() {
            bus.$emit('showCancelOrder');
        },
        closeBoard() {
            const parms = {
            };
            if (this.openData.boardDetailResps.length) {
                parms.boardId = this.openData.boardDetailResps[0].boardId;
            } else {
                if (this.openData.list) {
                    parms.boardLogIds = JSON.stringify(this.openData.list);
                } else {
                    if (this.openData.caterOrderId) {
                        parms.caterOrderId = this.openData.caterOrderId;
                    } else {
                        return;
                    }
                }
            }
            parms.restId = this.restId;
            http.get('/board/closeBoard', parms).then(res => {
                this.setLeftType({ leftType: 0 });
            });
        },
        submitAddFood() {
            const parms = {
            };
            if (this.openData.boardDetailResps.length) {
                const boardList = [];
                this.openData.boardDetailResps.forEach(el => {
                    boardList.push(el.boardId);
                });
                parms.boardList = JSON.stringify(boardList);
            } else {
                parms.boardList = [];
            }
            if (this.openData.list) {
                parms.boardLogIds = JSON.stringify(this.openData.list);
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
                bus.$emit('setRestDetail', data.data);
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
            this.bookPeopleNUm = this.openData.peopleNum;
            if (this.isHasOrder) {
                this.bookData = this.openData.expectStartTime;
            }
            this.bookInfoVisible = true;
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
        count,
        bookInfo,
        dishModal,
        keyBoard,
        DatePicker,
        changeRemark
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
