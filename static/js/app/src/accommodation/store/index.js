/**
 * Created by lingchenxuan on 2017/1/3.
 */
import Vuex from 'vuex';
import Vue from 'vue';
import AJAXService from '../../common/AJAXService';
import types from './types';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        orderDetail: {}
    },
    mutations: {
        [types.SET_ORDER_DETAIL](state, { orderDetail }) {
            state.orderDetail = orderDetail;
        }
    },
    actions: {
        [types.LOAD_ORDER_DETAIL]({ commit }, { orderId }) {
            return new Promise((resolve, reject) => {
                AJAXService.ajaxWithToken('get', '/order/getOrderDetail', { orderId })
                    .then((res) => {
                        if (res.code === 1) {
                            commit(types.SET_ORDER_DETAIL, { orderDetail: res.data });
                            resolve(res);
                        } else {
                            reject(res);
                        }
                    });
            })
        }
    }
});

export default store;