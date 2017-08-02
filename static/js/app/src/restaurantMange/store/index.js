/*
* @Author: lxj
* @Date:   2017-07-31 10:52:58
* @Last Modified by:   Tplant
* @Last Modified time: 2017-08-02 15:07:50
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
        date: dateFormat(new Date())
    },
    mutations: {
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
