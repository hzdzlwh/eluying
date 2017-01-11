/**
 * Created by lingchenxuan on 2017/1/10.
 */
import Vuex from 'vuex';
import types from './types';
import Vue from 'vue';

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        date: {
            startDate: undefined,
            endDate: undefined
        }
    },
    mutations: {
        [types.SET_DATE](state, { startDate, endDate }) {
            state.date = {
                startDate,
                endDate
            }
        }
    }
});
