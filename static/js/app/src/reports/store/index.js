/**
 * Created by lingchenxuan on 2017/1/10.
 */
import Vuex from 'vuex';
import types from './types';
import Vue from 'vue';
import util from '../../common/util';

Vue.use(Vuex);
const today = new Date();

export default new Vuex.Store({
    state: {
        date: {
            startDate: util.dateFormat(util.diffDate(today, -7)),
            endDate: util.dateFormat(util.diffDate(today, -1))
        }
    },
    mutations: {
        [types.SET_DATE](state, { startDate, endDate }) {
            state.date = {
                startDate,
                endDate
            };
        }
    }
});
