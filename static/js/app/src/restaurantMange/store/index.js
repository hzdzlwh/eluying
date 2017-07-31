/*
* @Author: lxj
* @Date:   2017-07-31 10:52:58
* @Last Modified by:   linxinjian
* @Last Modified time: 2017-07-31 10:57:48
* @email: 783384903@qq.com
*/

'use strict';
import types from './types';
import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        restId: 0
    },
    mutations: {
        [types.SET_REST](state, { restId }) {
            state.restId = restId;
        }
    },
    actions: {
    }
});
export default store;
