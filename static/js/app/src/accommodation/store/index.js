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
        shopList: [],
        enterList: [],
        orderDetail: {},
        roomBusinessInfo: {}
    },

    mutations: {
        [types.SET_SHOP_LIST](state, { shopList }) {
            state.shopList = shopList;
        },
        [types.SET_ENTER_LIST](state, { enterList }) {
            state.enterList = enterList;
        },
        [types.SET_ORDER_DETAIL](state, { orderDetail }) {
            state.orderDetail = orderDetail;
        },
        [types.SET_ROOM_BUSINESS_INFO](state, { roomBusinessInfo }) {
            state.roomBusinessInfo = roomBusinessInfo;
        }
    },

    actions: {
        [types.LOAD_SHOP_LIST]({ commit }) {
            return new Promise((resolve, reject) => {
                AJAXService.ajaxWithToken('get', '/shop/list', {})
                    .then(res => {
                        if (res.code === 1) {
                            let shopList = [];
                            res.data.list.forEach((d) => {
                                d.gList.forEach((dd) => {
                                    shopList.push({
                                        id: dd.i,
                                        price: dd.p,
                                        name: dd.n,
                                        type: 3
                                    });
                                });
                            });
                            commit(types.SET_SHOP_LIST, { shopList });
                            resolve(res);
                        } else {
                            reject(res);
                        }
                    });
            })
        },
        [types.LOAD_ENTER_LIST]({ commit }) {
            return new Promise((resolve, reject) => {
                AJAXService.ajaxWithToken('get', '/entertainment/getCategoryList' , {})
                    .then(res => {
                        if (res.code === 1) {
                            let enterList = [];
                            res.data.list.map(el => {
                                el.id = el.categoryId;
                                el.nodeId = el.enterId;
                                el.type = 2;
                                enterList.push(el);
                            });
                            commit(types.SET_ENTER_LIST, { enterList });
                            resolve(res);
                        } else {
                            reject(res);
                        }
                    });
            })
        },
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
        },
        [types.LOAD_ROOM_BUSINESS_INFO]({ state, commit }, { businessType }) {
            return new Promise((resolve, reject) => {
                AJAXService.ajaxWithToken('get', '/order/getRoomBusinessInfo', { orderId: state.orderDetail.orderId, businessType })
                    .then((res) => {
                        if (res.code === 1) {
                            res.data.businessType = businessType;
                            commit(types.SET_ROOM_BUSINESS_INFO, { roomBusinessInfo: res.data });
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