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
        setOrderDetail(state, { orderDetail }) {
            state.orderDetail = orderDetail;
        }
    },
    actions: {
        loadOrderDetail({ commit }, { orderId }) {
            return new Promise((resolve, reject) => {
                AJAXService.ajaxWithToken('get', '/order/getOrderDetail', { orderId })
                    .then((res) => {
                        if (res.code = 1) {
                            commit(types.SET_ORDER_DETAIL, { orderDetail: res.date });
                            resolve(res);
                        } else {
                            reject(res)
                        }
                    })
                    .catch(e => reject(e));
            })
        }
    }
});