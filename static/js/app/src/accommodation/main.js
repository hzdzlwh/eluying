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
auth.checkAuth(auth.ACCOMMODATION_ID, auth.NO_AUTH_FOR_A_URL);

const app = new Vue({
    ...App
});

document.addEventListener('DOMContentLoaded', () => {
    header.showHeader();
    //高亮"前台录入"
    $(".ordersManageEntry").removeClass("selected");
    $(".settingsEntry").removeClass("selected");
    $(".manageVipEntry").removeClass("selected");
    $(".accomodationEntry").addClass("selected");
    topMenu.showTopMenu();
    modal.modalInit();
    modal.centerModals();

    app.$mount('#app');
});