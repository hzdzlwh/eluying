/**
 * Created by lingchenxuan on 2017/1/3.
 */
import Vuex from 'vuex';
import Vue from 'vue';
import http from '../../common/http';
import types from './types';
import { ORDER_TYPE } from '../constant';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        shopList: [],
        enterList: [],
        orderDetail: {},
        roomBusinessInfo: {},
        detailVisible: false
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
        },
        [types.GET_CATER_ORDER_DETAIL]({ commit }, { orderId }) {
            return new Promise((resolve, reject) => {
                http.get('/catering/getCaterOrderDetail', { caterOrderId: orderId })
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
        [types.GET_ENTER_ORDER_DETAIL]({ commit }, { orderId }) {
            return new Promise((resolve, reject) => {
                http.get('/order/getEnterOrderDetail', { enterOrderId: orderId })
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
        [types.GET_GOODS_ORDER_DETAIL]({ commit }, { orderId }) {
            return new Promise((resolve, reject) => {
                http.get('/order/getGoodsOrderDetail', { goodsOrderId: orderId })
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
        [types.GET_ROOM_ORDER_DETAIL]({ commit }, { orderId }) {
            return new Promise((resolve, reject) => {
                http.get('/order/getRoomOrderDetail', { serviceId: orderId })
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
        [types.GET_ORDER_DETAIL]({ dispatch }, { orderId, orderType }) {
            switch (orderType) {
                case ORDER_TYPE.COMBINATION:
                    return dispatch(types.LOAD_ORDER_DETAIL, { orderId });
                case ORDER_TYPE.ACCOMMODATION:
                    return dispatch(types.GET_ROOM_ORDER_DETAIL, { orderId });
                case ORDER_TYPE.ENTERTAINMENT:
                    return dispatch(types.GET_ENTER_ORDER_DETAIL, { orderId });
                case ORDER_TYPE.CATERING:
                    return dispatch(types.GET_CATER_ORDER_DETAIL, { orderId });
                case ORDER_TYPE.RETAIL:
                    return dispatch(types.GET_GOODS_ORDER_DETAIL, { orderId });
            }
        }
    }
});

export default store;
