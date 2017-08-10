/*
* @Author: lxj
* @Date:   2017-07-31 10:52:58
* @Last Modified by:   Tplant
* @Last Modified time: 2017-08-10 11:13:17
* @email: 783384903@qq.com
*/

'use strict';
import types from './types';
import Vuex from 'vuex';
import Vue from 'vue';
import { dateFormat } from '../../common/util';

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        restId: 0,
        date: dateFormat(new Date()),
        leftType: 0,
        // 0:今日营业额，1:空桌选中，2:订单详情，4:加菜点菜
        board: {
            id: 1122,
            boardName: '大圆桌',
            boardId: ''
        },
        selectDish: [],
        // openData: {
        //     list: [1, 2, 3, 4],
        //     boardDetailResps: [{ id: 123, boardName: '大圆桌', boardId: '2' }, { id: 123, boardName: '大圆桌', boardId: '3' }],
        //     openTime: new Date(),
        //     operatorName: 'mockDate',
        //     peopleNum: 10,
        //     restName: 'asdasd',
        //     state: 2,
        //     isHasOrder: false
        // },
        openData: {
            '_isExistComplimentary': 26442, '_isExistDish': 10012, '_isExistPackage': 34036, 'boardDetailResps': [
                {
                    'boardId': 26261, 'boardName': '测试内容g513'
                }
            ], 'boardInfoStatus': 1, 'boardState': 2, 'canCancelSaleOrder': false, 'cancelAble': true, 'caterOrderId': 82277, 'changeBoard': false, 'channelDiscount': 74151, 'colseBoardTime': '测试内容6j36', 'creationTime': '2017-08-09 03:31', 'customerName': '测试内容3j6x', 'customerPhone': '测试内容y660', 'customerType': 0, 'discount': 70867, 'discountChannel': 80888, 'discountRelatedId': 47872, 'discountRelatedName': '测试内容6b42', 'dishCount': 41686, 'editAble': false, 'expectStartTime': '测试内容0y5g', 'hasPrinter': false, 'hasRole': true, 'infoStatus': 1, 'isCombinationOrder': false, 'itemsMap': [
                {
                    'bookNum': 73288, 'creationTime': '测试内容9j85', 'dishId': 67121, 'dishName': '测试内容1', 'dishType': 0, 'isDiscount': 80244, 'isSend': true, 'operatorName': '测试内容174e', 'originPrice': 53437, 'price': 76435, 'remark': '测试内容fy1c', 'serviceId': 48870, 'serviceState': 0, 'subDishList': [
                        {
                            'bookNum': 30437, 'dishId': 24056, 'dishName': '测试内容8888', 'price': 78155, 'serviceState': 0
                        }
                    ]
                },
                {
                    'bookNum': 73288, 'creationTime': '测试内容9j85', 'dishId': 67121, 'dishName': '测试内容2', 'dishType': 0, 'isDiscount': 80244, 'isSend': true, 'operatorName': '测试内容174e', 'originPrice': 53437, 'price': 76435, 'remark': '测试内容fy1c', 'serviceId': 48870, 'serviceState': 1, 'subDishList': [
                        {
                            'bookNum': 30437, 'dishId': 24056, 'dishName': '测试内容8888', 'price': 78155, 'serviceState': 1
                        }
                    ]
                }
            ], 'needPrint': false, 'onePass': false, 'operationId': 83872, 'operatorDate': '测试内容kuiy', 'operatorName': '测试内容eiqm', 'orderId': 36267, 'orderNum': '测试内容f3c6', 'orderState': 1, 'orderTime': new Date(), 'orderType': 55432, 'origin': '测试内容4k7s', 'originId': 23866, 'originTotalPrice': 23653, 'originType': 3, 'payments': [
                {
                    'creationTime': 85015, 'fee': 15676, 'payChannel': '测试内容6x1i', 'payId': 47618, 'state': 14174, 'type': 71631
                }
            ], 'peopleNum': 66541, 'quickDescription': '测试内容i3y3', 'quickDiscountId': 82750, 'relationStatus': 12018, 'remark': '测试内容3iam', 'reserveName': '测试内容2n81', 'resettleAble': false, 'restId': 31210, 'restName': '测试内容s9sl', 'salerId': 48816, 'salerString': '测试内容47tk', 'scan': 85426, 'showDiscount': '测试内容f2g2', 'showPrint': false, 'totalPrice': 10464, 'type': 0, 'vipDiscount': 25671, 'vipId': 18617, 'vipLevel': '测试内容42gy'
        },
        addFood: [{ id: 1, name: '西湖醋鱼', num: 0, price: 20 }, { id: 2, name: '可乐', num: 0, price: 30 }]
    },
    mutations: {
        [types.CANL_FOOD](state) {
            state.addFood = [];
        },
        [types.ADD_FOOD](state, { food }) {
            const selectFood = state.addFood.find((el, index) => {
                el.id === food.id;
            });
            if (selectFood) {
                selectFood.num = selectFood.num + 1;
            } else {
                state.addFood.push(food);
            }
        },
        [types.CHANGE_FOOD](state, { food }) {
            state.addFood.forEach((el, index) => {
                if (el.id === food.id) {
                    if (food.num > 0) {
                        el.num = food.num;
                    } else {
                        state.addFood.splice(index, 1);
                    }
                }
            });
        },
        [types.SET_OPEN_DATA](state, { openData }) {
            state.openData = openData;
        },
        [types.SET_LEFT_TYPE](state, { leftType }) {
            state.leftType = leftType;
        },
        [types.SET_REST](state, { restId }) {
            state.restId = restId;
        },
        [types.SET_DATE](state, { date }) {
            state.date = date;
        },
        [types.SET_SELECT_DISH](state, { dish }) {
            state.selectDish.push(dish);
        },
        [types.DELETE_SELECT_DISH](state, { dish }) {
            state.selectDish.splice(state.selectDish.indexOf(dish), 1);
        }
    },
    actions: {
    }
});
export default store;
