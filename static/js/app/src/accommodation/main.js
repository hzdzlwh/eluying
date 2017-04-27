/**
 * Created by lingchenxuan on 2016/12/12.
 */
import Vue from 'vue';
import App from './App.vue';
import 'bootstrap';
import auth from '../common/auth';
import util from '../common/util';
import store from '../ordersManage/store';
import init from '../common/init';
import { router } from './routes';
import Router from 'vue-router';

Vue.use(Router);
document.addEventListener('DOMContentLoaded', () => {
    init({
        leftMenu: false,
        id: auth.ACCOMMODATION_ID,
        noAuthUrl: auth.NO_AUTH_FOR_A_URL
    });

    const app = new Vue({
        store,
        router,
        ...App
    });

    const events = {
        // hover高亮时间和房间
        'mouseover body .calendar-status': function() {
            const date = $(this).attr('date');
            const room = $(this).attr('room');
            $(".calendar-category-room[room='" + room + "']").addClass('hover');
            $(".calendar-header-date[date='" + date + "']").addClass('hover');
        },
        'mouseleave body .calendar-status': function() {
            $('.calendar-category-room').removeClass('hover');
            $('.calendar-header-date').removeClass('hover');
        },
        // 控制订单信息浮窗
        'mouseover body .calendar-glyph': function(ev) {
            const clientY = ev.clientY;
            const detail = $(this).find('.calendar-glyph-detail');
            const height = detail.height();
            if (height + 200 > clientY) {
                detail.removeClass('up');
                detail.addClass('down');
            } else {
                detail.removeClass('down');
                detail.addClass('up');
            }

            detail.show();
        },
        'mouseleave body .calendar-glyph': function(ev) {
            $(this).find('.calendar-glyph-detail').hide();
        }
    };
    util.bindDomAction(events);

    app.$mount('#app');
});
