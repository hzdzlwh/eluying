/**
 * Created by lingchenxuan on 2017/1/3.
 */
import Vuex from 'vuex';
import Vue from 'vue';
import http from '../../common/http';
import types from './types';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        shopList: [],
        enterList: [],
        orderDetail: {},
        roomBusinessInfo: {},
        centerList: []
    },

    mutations: {
        [types.SET_CENTER_LIST](state, { centerList }) {
            state.centerList = centerList;
        },
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
        [types.LOAD_CENTER_LIST]({ commit }) {
            return new Promise((resolve, reject) => {
                http.get('/stat/getCollection', {})
                    .then(res => {
                        if (res.code === 1) {
                            commit(types.SET_CENTER_LIST, { centerList: res.data.list });
                            resolve(res);
                        } else {
                            reject(res);
                        }
                    });
            });
        },
        [types.LOAD_SHOP_LIST]({ commit }) {
            return new Promise((resolve, reject) => {
                http.get('/shop/list', {})
                    .then(res => {
                        if (res.code === 1) {
                            const shopList = [];
                            res.data.list.forEach((d) => {
                                shopList.push(d);
                            });
                            commit(types.SET_SHOP_LIST, { shopList });
                            resolve(res);
                        } else {
                            reject(res);
                        }
                    });
            });
        },
        [types.LOAD_ENTER_LIST]({ commit }) {
            return new Promise((resolve, reject) => {
                http.get('/entertainment/getCategoryListPC', {})
                    .then(res => {
                        if (res.code === 1) {
                            const enterList = [];
                            res.data.list.map(el => {
                                if (el.categoryList && el.categoryList.length > 0) {
                                    el.categoryList.map(item => {
                                        item.id = item.categoryId;
                                        item.nodeId = item.enterId;
                                        item.type = 2;
                                    });
                                    enterList.push(el);
                                }
                            });
                            commit(types.SET_ENTER_LIST, { enterList });
                            resolve(res);
                        } else {
                            reject(res);
                        }
                    });
            });
        },
        [types.LOAD_ORDER_DETAIL]({ commit }, { orderId }) {
            return new Promise((resolve, reject) => {
                http.get('/order/getOrderDetail', { orderId })
                    .then((res) => {
                        if (res.code === 1) {
                            commit(types.SET_ORDER_DETAIL, { orderDetail: res.data });
                            resolve(res);
                        } else {
                            reject(res);
                        }
                    });
            });
        },
        [types.LOAD_ROOM_BUSINESS_INFO]({ state, commit }, { businessType }) {
            return new Promise((resolve, reject) => {
                http.get('/order/getRoomBusinessInfo', { orderId: state.orderDetail.orderId, businessType })
                    .then((res) => {
                        if (res.code === 1) {
                            res.data.businessType = businessType;
                            commit(types.SET_ROOM_BUSINESS_INFO, { roomBusinessInfo: res.data });
                            resolve(res);
                        } else {
                            reject(res);
                        }
                    });
            });
        }
    }
});

export default store;
