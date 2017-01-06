/**
 * Created by lingchenxuan on 2016/12/12.
 */
import Vue from 'vue';
import App from './App';
import 'bootstrap';
import header from 'header';
import topMenu from "../common/topMenu";
import modal from 'modal';
import auth from '../common/auth';
import util from '../common/util';
auth.checkAuth(auth.ACCOMMODATION_ID, auth.NO_AUTH_FOR_A_URL);

const app = new Vue({
    ...App
});

document.addEventListener('DOMContentLoaded', () => {
    header.showHeader();
    modal.modalInit();

    const events = {
        // hover高亮时间和房间
        "mouseover body .calendar-status": function(){
            const date = $(this).attr("date");
            const room = $(this).attr("room");
            $(".calendar-category-room[room='" + room + "']").addClass("hover");
            $(".calendar-header-date[date='" + date + "']").addClass("hover");
        },
        "mouseleave body .calendar-status": function(){
            $(".calendar-category-room").removeClass("hover");
            $(".calendar-header-date").removeClass("hover");
        },
        // 控制订单信息浮窗
        "mouseover body .calendar-glyph": function(ev){
            const clientY = ev.clientY;
            const detail = $(this).find(".calendar-glyph-detail");
            const height = detail.height();
            if (height + 200 > clientY) {
                detail.removeClass("up");
                detail.addClass("down");
            } else {
                detail.removeClass("down");
                detail.addClass("up");
            }

            detail.show();
        },
        "mouseleave body .calendar-glyph": function(ev){
            $(this).find(".calendar-glyph-detail").hide();
        },
        // 开关房按钮
        "contextmenu body .calendar-status": function(ev){
            $(".calendar-status-action").hide();
            $(this).find(".calendar-status-action").show();
            return false;
        },
        "contextmenu body .calendar-status-close": function(ev){
            $(".calendar-status-action").hide();
            $(this).siblings(".calendar-status-action").show();
            return false;
        },
        "mousedown body .calendar-status-action": function(ev){
            ev.stopPropagation();
        },
        //
        "click body": function(ev){
            $(".calendar-status-action").hide();
        },
    };
    util.bindDomAction(events);

    app.$mount('#app');

    modal.centerModals();
});