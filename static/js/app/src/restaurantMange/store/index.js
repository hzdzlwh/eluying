/*
* @Author: lxj
* @Date:   2017-07-31 10:52:58
* @Last Modified by:   lxj
* @Last Modified time: 2017-08-07 11:54:25
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
        leftType: 1,
        board: {
            id: 1122,
            dishName: '大圆桌',
            dishId: '4'
        },
        selectDish: [{ id: 123, dishName: '大圆桌', dishId: '2' }],
        openData: {
            list: [1, 2, 3, 4],
            openTime: new Date(),
            operatorName: 'mockDate',
            peopleNum: 10,
            restName: 'asdasd',
            state: 2
        }
    },
    mutations: {
        [types.SET_LEFT_TYPE](state, { leftType }) {
            state.leftType = leftType;
        },
        [types.SET_REST](state, { restId }) {
            state.restId = restId;
        },
        [types.SET_DATE](state, { date }) {
            state.date = date;
        }
    },
    actions: {
    }
});
export default store;
