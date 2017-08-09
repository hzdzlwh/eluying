/*
* @Author: lxj
* @Date:   2017-07-31 10:52:58
* @Last Modified by:   Tplant
* @Last Modified time: 2017-08-09 15:21:49
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
        leftType: 3,
        // 0:今日营业额，1:空桌选中，2:订单详情，4:加菜点菜
        board: {
            id: 1122,
            boardName: '大圆桌',
            boardId: '3'
        },
        selectDish: [{ id: 123, boardName: '大圆桌', boardId: '2' }, { id: 123, boardName: '大圆桌', boardId: '3' }],
        openData: {
            list: [1, 2, 3, 4],
            boardDetailResps: [{ id: 123, boardName: '大圆桌', boardId: '2' }, { id: 123, boardName: '大圆桌', boardId: '3' }],
            openTime: new Date(),
            operatorName: 'mockDate',
            peopleNum: 10,
            restName: 'asdasd',
            state: 2,
            isHasOrder: false
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
