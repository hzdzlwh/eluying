/*
* @Author: lxj
* @Date:   2017-08-01 14:45:58
* @Last Modified by:   lxj
* @Last Modified time: 2017-08-15 17:36:53
* @email: 783384903@qq.com
*/

<template>
    <div class="rest-taday-contain" style="height:auto" v-if='openData'>
        <div class="rest-taday-count">
            <div class="restDetail-title-tip">桌号</div>
            <div class="restDetail-title-display">
                 <div><span class="restDetail-title-dish">{{openData.boardDetailResps[0].boardName}}</span> <span v-if='openData.boardDetailResps.length > 1' class="restDetail-type-tag" :title='selectDishText'>并</span></div>
                <!-- <div><span class="rest-taday-tag " :class="getState(item.foodState, 'color')">{{getState(item.foodState, 'text')}}</span></div> -->
                 <div v-if='openData.state !== 2 && openData.orderState !== undefined'><span class="rest-taday-tag " :class='getState("color")' >{{getState("text")}}</span></div>
            </div>
            <div>
                <div class="rest-restDetail-left">
                    <div class="restDetail-title-tip">人数</div>
                    <div>{{openData.peopleNum}}<!-- <inputVaild :value='changeNum' :max='2000' :isInt='true' ></inputVaild> --> <img src="/static/image/icon/edit.png" alt="" @click='editor()'></div>
                </div>
                <div class="rest-restDetail-right">
                    <div class="restDetail-title-tip">{{(!isHasOrder || (openData.orderState === 1)) ? '用餐时长' :'用餐时间' }}</div>
                    <div class="restDetail-title-data" v-if='isHasOrder && (openData.orderState !== 1) '><DatePicker :value='new Date(openData.creationTime)'  @input='changeBookTime' clearable=false type="datetime" placeholder="选择日期时间" size='small' :editable = false :clearable = false format='yyyy-MM-dd HH:mm' :disabled='!editorPromission'/></div>
                    <div class="restDetail-title-data" v-if='!isHasOrder || (openData.orderState == 1)'>{{openData.timer}}</div>
                </div>
            </div>
            <div class="rest-restDetail-other" @click='moreShow = !moreShow' v-if='openData.state !== 2 && openData.orderState'>
                {{openData.customerName}} （{{openData.customerPhone}}）查看详情 <span >>></span>
            </div>
          <div style="z-index:3"  class="rest-restDetail-transform" :style='{maxHeight: moreShow ? "400px" : "0"}' v-if='openData.state !== 2 && openData.orderState'>
                        <div class="rest-restDetail-otherDetail"  >
                    <div>
                        <div><span>客户姓名：</span><span>{{openData.customerName || '无'}}</span></div>
                        <div><span>手机号：</span><span class="rest-restDetail-span">{{openData.customerPhone || '无'}}</span></div>
                    </div>
                     <div>
                        <div><span>客户来源：</span><span>{{cateOrderWay[openData.originType]}}</span></div>
                        <div class=''><span>销售员：</span><span class="rest-restDetail-span ellipsis" :title='openData.salerString'>{{openData.salerString || '无'}}</span></div>
                    </div>
                     <div>
                        <div><span>整单优惠：</span><span>{{openData.discount === 1 ? '无' : openData.discount}}</span></div>
                        <div><span>折扣方案：</span><span :title='openData.showDiscount' class="rest-restDetail-span ellipsis">{{openData.showDiscount || '无'}}</span></div>
                    </div>
                    <div>订单备注：{{openData.remark || '无'}}</div>
                    <div><span><span style="display: inline-block;width: 4em;text-align: right;">订单号：</span>{{openData.orderNum}}</span></div>
                    <div><span>开台时间：{{openData.operatorDate}}</span></div>
                        <div><div><span style="display: inline-block;width: 4em;text-align: right;">操作人：</span>{{openData.operatorName}}</div></div>
                        <div style="color:#178ce6;" v-if='editorPromission' @click="editOrder">编辑详情</div>
                    </div>
                </div>
                </div>
        <div class="rest-restDetail-constain">
            <table class="rest-restDetail-table">
                <thead>
                    <tr><td :width='leftType === 4 ? "100px" : "150px"'>菜品名称</td><td width="45px">数量</td><td width='80px'>金额</td></tr>
                </thead>
                </table>
                <table class="rest-restDetail-table">
                <tbody >
                <template v-for='item in openData.itemsMap' v-if=' leftType !== 4 && openData.itemsMap' >
                    <tr @click='changeItem(item); dishClick(item)' :class="{'reset-tr-click' : item.click}"> <td width="150px"><div><span class="rest-restDetail-dishname" :class='{"rest-item-del" : item.serviceState === 1}'> <span  :class='getTriangle(item)'></span><span >{{item.dishName}}</span></span><span class="rest-item-send" v-if='item.serviceState === 2'>送</span></div></td><td width="45px"><div :class='{"rest-item-del" : item.serviceState === 1}'>x{{item.bookNum}}</div></td><td :class='{"rest-item-del" : item.serviceState === 1}' width='80px'>{{item.price}}</td></tr>
                    <tr v-for='sub in item.subDishList' @click='dishClick(sub)' v-if='item.select' :class='{"rest-item-del" : sub.serviceState === 1,"reset-tr-click" : sub.click}' >
                        <td class="rest-restDetail-trchild" width="150px">{{sub.dishName}}</td><td width='50px'><div>x{{sub.bookNum}}</div></td><td width='80px'></td>
                    </tr>
                </template> 
                <template v-if='leftType === 4'>
                    <tr v-for='(item,index) in addFoodList'>
                        <td class="rest-restDetail-trchild" :width='leftType === 4 ? "100px" : "150px"'>{{item.dishName}}</td><td width="45px"><div style='width:70px;'><count :del=true :min = -1 :num='item.num' :max='item.inventoryNum' @numChange='onNumChange' :id='item.dishId'></count></div></td><td width='80px'>{{(item.num * item.dishPrice).toFixed(2)}}</td>
                    </tr>
                </template>
                </tbody>
            </table>
            <div v-if='leftType === 4'>
            <p class="rest-text-title"><span>备注信息</span></p>
            <textarea name="remark" placeholder="请输入备注信息" maxlength="500" v-model="remark" class="dd-input" style="z-index:1">
                                </textarea>
            </div>
        </div>
        <div class="rest-restDetail-foot" v-if='!dishChange'>
        <div style="padding:15px; 15px 10px;border-bottom:1px solid #e0e6ed">
        <div class="rest-foot-count">            
        <div class="restDetail-title-tip" v-if='leftType !== 4'>
                共{{(openData.itemsMap && openData.itemsMap.length) || 0}}项
            </div>
            <div class="restDetail-title-tip"v-if='leftType === 4' >
                共{{(addFoodList.length) || 0}}项
            </div>
            <div class="rest-restDetail-dishcount" v-if='leftType !== 4'>
                <span class="restDetail-title-tip">合计</span>{{openData.totalPrice || 0}}
                <div><s class="restDetail-title-tip" v-if='openData.showDiscount'>{{openData.originTotalPrice || 0}}</s><span class="rest-restDetail-tag">{{openData.showDiscount}}</span></div>
            </div>
            <div class="rest-restDetail-dishcount" v-if='leftType === 4'>
                <span class="restDetail-title-tip">合计</span>{{addFoodTotal()}}
            </div>
            </div>
            <div class="restDetail-foot-check" v-if='openData.payments && leftType !== 4'>
                <div class="restDetail-check-item" @click='needpay = !needpay'><span ><span :class="getCheckeStatus(needpay)"></span>应收金额</span> <span>{{findTypePrice(openData.payments, 13)}}</span></div>
                <div class="restDetail-check-list" v-show='needpay'>
                    <div class="restDetail-check-item"><span>总金额</span> <span>￥{{findTypePrice(openData.payments, 10)}}</span></div>
                    <div class="restDetail-check-item" v-if='findTypePrice(openData.payments, 5) != 0'><span>折扣金额</span> <span>￥{{findTypePrice(openData.payments, 25)}}</span></div>
                    <div class="restDetail-check-item" v-if='openData.discount != 0'><span>整单优惠</span> <span>￥{{openData.discount}}</span></div>
                    <div class="restDetail-check-item" v-if='findTypePrice(openData.payments, 17) != 0'><span>零头处理</span> <span>￥{{findTypePrice(openData.payments, 17)}}</span></div>
                </div>
                 <div class="restDetail-check-item" @click='paied = !paied'><span ><span :class="getCheckeStatus(paied)"></span>{{findTypePrice(openData.payments, 14) >= 0 ? '实收金额'
                                                : '实退金额'}}</span> <span>¥{{Math.abs(
                                                findTypePrice(openData.payments, 14))}}</span></div>
                <div class="restDetail-check-list" v-show='paied'>
                    <div class="restDetail-check-item" v-if='openData.payments.some(pay => pay.type === 19)'><span>
                    <!-- {{dateFormat(openData.payments.find(pay => pay.type === 19).creationTime)}} -->
                     {{openData.payments.find(pay => pay.type === 19).payChannel}}抵扣</span> <span>￥{{findTypePrice(openData.payments, 19)}}</span></div>
                    <div class="restDetail-check-item" v-if='openData.payments.some(pay => pay.type === 20)'><span>
                    <!-- {{dateFormat(openData.payments.find(pay => pay.type === 20).creationTime)}}  -->
                    会员余额</span> <span>￥{{findTypePrice(openData.payments, 20)}}</span></div>
                    <div class="restDetail-check-item" v-if='openData.payments.some(pay => pay.type === 18)'><span>
                    <!-- {{dateFormat(openData.payments.find(pay => pay.type === 18).creationTime)}}  -->
                    常规</span> <span>￥{{findTypePrice(openData.payments, 18)}}</span></div>
                </div>
                 <div class="restDetail-check-item" v-if='findTypePrice(openData.payments, 4) != 0'><span><span></span>违约金</span> <span>findTypePrice(openData.payments, 4)</span></div>
                 <div class="restDetail-check-item"><span><span></span>还需收款</span> <span class="order-price-num red" :class="{green : !Number(findTypePrice(openData.payments, 15))}">{{findTypePrice(openData.payments, 15)}}</span></div>
            </div>

        </div>
        <div class="resetmange-click-list" v-show='editorPromission'>
            <div class="resetMange-btn-base resetMange-btn-promise" @click='addNewFood' v-if='this.leftType !== 4 && ((isHasOrder && (openData.orderState !== 2 || openData.orderState !== 3 || openData.orderState !== 5 )) || !isHasOrder)'>{{openData.itemsMap && openData.itemsMap.length ? '加' : '点'}}菜</div>
            <div class="resetMange-btn-base " @click='openBoard' v-if='this.leftType !== 4 && ((isHasOrder && (openData.orderState !== 2 || openData.orderState !== 3 || openData.orderState !== 5 )) || !isHasOrder)'>换桌</div>
            <div class="resetMange-btn-base " @click='closeBoard' v-if='this.leftType !== 4 && ((!isHasOrder && !openData.itemsMap) || openData.orderState === 2 && openData.boardDetailResps)'>撤台</div>
            <div class="resetMange-btn-base " v-if='isHasOrder && this.leftType !== 4 && openData.orderState === 4' @click='reject'>拒绝</div>
            <div class="resetMange-btn-base resetMange-btn-lager" v-if='this.leftType === 4' @click='submitAddFood'>下单</div>
            <div class="resetMange-btn-base resetMange-btn-lager" v-if='this.leftType === 4' @click='canlAddFood'>取消</div>
            <div class="resetMange-btn-base " v-if='isHasOrder && openData.orderState === 0 && this.leftType !== 4' @click='canOrder'>取消订单</div>
            <div class="resetMange-btn-base " v-if='isHasOrder && this.leftType !== 4 && (openData.orderState === 1 || openData.orderState === 0 || openData.orderState === 2 || openData.orderState === 8)' @click='printRest'>打印</div>
            <div class="resetMange-btn-base " v-if='isHasOrder && this.leftType !== 4 && (openData.orderState === 1 || openData.orderState === 0 || openData.orderState === 8)' @click="showCashier('collect')">收银</div>
            <div class="resetMange-btn-base " v-if='isHasOrder && this.leftType !== 4 && openData.orderState === 1' @click='showCashier("orderDetail")'>结算</div>

            <div class="resetMange-btn-base " v-if='isHasOrder && this.leftType !== 4 && openData.orderState === 8' @click="reGetMoney">重新结账</div>
            <div class="resetMange-btn-base " v-if='isHasOrder && this.leftType !== 4 && openData.resettleAble' @click="resetOrder">反结账</div>
            <div class="resetMange-btn-base resetMange-btn-promise resetMange-btn-lager" v-if='openData.orderState === 0 && openData.itemsMap && openData.itemsMap.length && this.leftType !== 4' @click='openBoardAndCook'>开台并入厨</div>
            <div class="resetMange-btn-base resetMange-btn-promise resetMange-btn-lager" v-if='openData.orderState === 4 && this.leftType !== 4' @click='agreeAndCook'>同意并入厨</div>
        </div>
        </div>
        <div class="rest-restDetail-foot reset-restDetail-resetChange" v-if='dishChange'>
        <div class='reset-resetChange-detail'>
             <div>菜品备注：{{dishChange.remark}} <span class="reset-resetChange-remark" @click='changeRemarkModal'>修改</span></div>
            <div>点菜员：{{dishChange.operatorName}}</div>
            <div>下单时间：{{changeTime(dishChange.creationTime)}}</div>
        </div>
            <div class="resetChange-foot-btn" v-show='editorPromission'>
                <div class="resetMange-btn-base " v-if='dishChange.serviceState === 0' @click='dishModalChange(0)'>退菜</div>
                <div class="resetMange-btn-base " v-if='dishChange.isSend && dishChange.serviceState !== 2' @click='dishModalChange(1)'>赠送</div>
            </div>
            <div class="">
                <div>
                   
                </div>
                <div>
                
                </div>
            </div>
        </div>
        <changeRemark :visible='changeRemarkVisible':text='dishChange ? dishChange.remark : undefined' @changeRemark='changeRemark' @hideModal='changeRemarkHide'></changeRemark>
        <dishModal :visible='dishModalVisible' :type='dishModalType' :data='dishChange' @hideModal='hideDishModal' @dishChange='dishChangeSub'></dishModal>
<!--         <bookInfo :visible='bookInfoVisible' :num='bookPeopleNUm' :data='bookData' @hideModal='hidebookInfo' :type='isHasOrder' @changeBook='changeBook'></bookInfo> -->
<keyBoard :visible ='bookInfoVisible' @close='hidebookInfo' :num ='openData.peopleNum' :dish='openData.boardDetailResps[0].boardName + openData.boardDetailResps[0].boardId' v-if='openData' @numChange='changeBookNum'></keyBoard>
        <handlePoint v-if="handlePoint" :caterOrderId="openData.caterOrderId" :restId="restId" @closeHandlePoint="() => {this.handlePoint = false;}"/>
    </div>
</template>
<style lang='scss'>
    

</style>
<script>
import { ORDER_TYPE, ORDER_STATE_TEXT } from '../../ordersManage/constant.js';
import http from '../../common/http.js';
import { mapState, mapMutations } from 'vuex';
import { orderWay, cateOrderWay } from '../orderWay.js';
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
import handlePoint from './handlePoint.vue';
import modal from '../../common/modal.js';
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
            restDate: undefined,
            backDish: undefined,
            addFoodList: [],
            handlePoint: false,
            cateOrderWay
        };
    },
    computed: {
        ...mapState([
            'restId',
            'board',
            'selectDish',
            'openData',
            'leftType',
            'addFood',
            'editorPromission'
        ]),
        selectDishText() {
            let str = '';
            if (this.openData.boardDetailResps.length) {
                this.openData.boardDetailResps.forEach((el, index) => {
                    if (index !== 0) {
                        str += '\r\n';
                    }
                    str += el.boardName + el.boardId;
                });
                return str;
            }
        },
        isHasOrder() {
            if (this.openData && (this.openData.isHasOrder || this.openData.caterOrderId)) {
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
        printRest() {
            this.handlePoint = true;
        },
        showCashier(type) {
            bus.$emit('showCashier', { type: type });
        },
        reGetMoney() {
            bus.$emit('showCashier', { type: 'resetOrder' });
        },
        resetOrder() {
            http.get('/order/resettle', { orderId: this.openData.caterOrderId, type: 0 }).then(res => {
                restBus.$emit('refeshView');
            });
        },
        reject() {
            const callBack = function() {
                http.get('/order/confirmOrder', { caterOrderId: this.openData.caterOrderId, type: 0
                }).then(res => restBus.$emit('refeshView'));
            };
            modal.confirm({ title: '提示', message: '确定拒绝该扫码订单？' }, callBack);
        },
        changeRemarkModal() {
            this.changeRemarkVisible = true;
        },
        changeRemarkHide() {
            this.changeRemarkVisible = false;
        },
        changeRemark(val) {
            http.get('/catering/modifyDishRemark', { caterOrderId: this.openData.caterOrderId, remark: val, serviceId: this.dishChange.serviceId }).then(res => {
                restBus.$emit('refeshView');
            });
        },
        hideDishModal() {
            this.dishModalVisible = false;
        },
        dishChangeSub(val) {
            const dishes = [];
            dishes.push({ dishId: this.dishChange.dishId, bookNum: val, serviceId: this.dishChange.serviceId });
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
            restBus.$emit('refeshView');
        },
        dishClick(dish) {
            if (dish.serviceState === 1 && (this.openData.orderState === 1 || (this.openData.orderState === 2 && this.openData.itemsMap.length && this.openData.itemsMap) || this.openData.orderState === 4 || this.openData.orderState === 8)) {
                return;
            }
            const dishClick = !dish.click;
            this.$set(dish, 'click', dishClick);
            if (this.backDish && dish.serviceId === this.backDish.serviceId && !dishClick) {
                this.dishChange = undefined;
                this.backDish = undefined;
                return;
            }
            if (this.backDish && this.backDish.click) {
                this.backDish.click = false;
                this.backDish = dish;
            }
            if (!this.backDish) {
                this.backDish = dish;
            }
            this.dishChange = dish;
        },
        changeTime(value) {
            if (!value) {
                return '';
            }
            return util.dateFormatLong(new Date(value));
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
            restBus.$emit('changeBoard', { data: this.openData });
        },
        openBoardAndCook() {
            http.get('/board/openBoardAndCook', { restId: this.restId, caterOrderId: this.openData.caterOrderId }).then(res => restBus.$emit('refeshView'));
        },
        agreeAndCook() {
            http.get('/order/confirmOrder', { caterOrderId: this.openData.caterOrderId, type: 1 }).then(res => restBus.$emit('refeshView'));
        },
        crash() {
            bus.$emit('showCashier', { type: 'orderDetail' });
        },
        canOrder() {
            const callBack = function() {
                bus.$emit('showCancelOrder');
            };
            modal.confirm({ title: '提示', message: '确定取消订单' }, callBack);
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
                restBus.$emit('refeshView');
            });
        },
        submitAddFood() {
            if (!this.openData.boardDetailResps[0].boardId) {       // 无桌位下单
                const params = {};
                params.boardList = JSON.stringify([]);
                params.dishItems = [];
                if (this.addFoodList.length > 0) {
                    this.addFoodList.forEach(food => {
                        if (food.customerDish) {    // 自定义菜
                            params.dishItems.push({ bookNum: food.num, dishName: food.dishName, price: food.price });
                        } else {    // 非自定义菜
                            params.dishItems.push({ bookNum: food.num, dishId: food.dishId, dishName: food.dishName, price: food.dishPrice });
                        }
                    });
                }
                params.dishItems = JSON.stringify(params.dishItems);
                params.operationType = 0;
                params.restId = this.restId;
                http.get('/catering/addOrder', params).then(res => {
                    if (res.code === 1) {
                    }
                });
                return;
            }
            if (this.openData.caterOrderId && this.openData.itemsMap.length) {
                const addFoodDishList = this.addFoodList.map(el => {
                    return {
                        bookNum: el.num,
                        dishId: el.dishId,
                        dishName: el.dishName,
                        price: el.dishPrice,
                        remark: this.remark
                    };
                });
                const addFoodParms = {
                    caterOrderId: this.openData.caterOrderId,
                    dishes: JSON.stringify(addFoodDishList),
                    oprType: 3,
                    totalPrice: this.addFoodTotal()
                };
                http.get('/dish/dishOpr', addFoodParms).then(res => {
                    return http.get('/catering/getCaterOrderDetail', { caterOrderId: this.openData.caterOrderId });
                }
                ).then(data => {
                // this.setLeftType({ leftType: 2 });
                    bus.$emit('setRestDetail', data.data);
                    this.setOpenData({ openData: data.data });
                    this.canlAddFood();
                });
                return;
            }
            const parms = {
                remark: this.remark,
                totalPrice: this.addFoodTotal()
            };
            const addFoodDishList = this.addFoodList.map(el => {
                return {
                    bookNum: el.num,
                    dishId: el.dishId,
                    dishName: el.dishName,
                    price: el.dishPrice
                };
            });
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
            } else {
                parms.operationType = 4;
            }
            parms.dishItems = JSON.stringify(addFoodDishList);
            http.get('/catering/addOrder', parms).then(res => {
                return res.data.caterOrderId;
            }).then(id => {
                return http.get('/catering/getCaterOrderDetail', { caterOrderId: id });
            }).then(data => {
                // this.setLeftType({ leftType: 2 });
                bus.$emit('setRestDetail', data.data);
                this.setOpenData({ openData: data.data });
                this.canlAddFood();
            });
        },
        canlAddFood() {
            this.canlFood();
            this.remark = '';
            this.addFoodList = [];
            this.setLeftType({ leftType: 2 });
        },
        addFoodTotal() {
            if (!this.addFoodList || !this.addFoodList.length) {
                return 0;
            }
            let price = 0;
            this.addFoodList.forEach(el => {
                price += Number((el.dishPrice * el.num).toFixed(2));
            });
            // const price = this.addFood.reduce((pre, cur) => {
            //     return pre + Number(cur.price * cur.num.toFixed(2));
            // }, Number(this.addFood[0].price * this.addFood[0].num.toFixed(2)));
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
            if (!this.editorPromission) {
                return;
            }
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
        getTotalPrice(item) {
            return (item.num * item.dishPrice).toFixed(2);
        },
        onNumChange(type, index, num) {
            // this.changeFood({ food: { dishId: index, num: num } });
            this.addFoodList.forEach((el, ind) => {
                if (el.dishId === index) {
                    if (num > 0) {
                        el.num = num;
                    } else {
                        this.addFood.splice(ind, 1);
                        this.addFoodList.splice(ind, 1);
                    }
                }
            });
        },
        editOrder() {
            this.$emit('editOrder');
            restBus.$emit('setOrderInfo', this.openData);
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
        },
        addFood(val) {
            val.forEach(el => {
                if (!this.addFoodList.some(list => {
                    return list.dishId === el.dishId;
                })) {
                    this.addFoodList.push(Object.assign({}, el));
                }
            });
            // this.addFoodList = val;
        },
        openData(val) {
            if (this.openData && !this.openData.isHasOrder) {
                this.timer();
                window.inter = window.setInterval(this.timer, 1000 * 60);
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
        changeRemark,
        handlePoint
    },
    mounted() {
        if (this.openData && !this.openData.isHasOrder) {
            this.timer();
            window.inter = window.setInterval(this.timer, 1000 * 60);
        }
    },
    beforeDestroy() {
        window.clearInterval(window.inter);
    }

};
</script>
