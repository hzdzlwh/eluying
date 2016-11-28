var AJAXService = require("AJAXService");
var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
require("fileupload");
var dsy = require("dsy");
var auth = require('../../common/auth');
auth.checkAuth(auth.BUSINESS_ID);
import { DdSelect, DdOption } from 'dd-vue-component';
import Vue from 'vue';
import { mapInit } from './map';

require("bootstrap");
require("validation");

$(function() {
    //检测IE
    util.checkExplorer();
    //初始化界面
    header.showHeader();
    leftMenu.showLeftMenu();
    util.mainContainer();
    modal.modalInit();

    var events = {

        "resize window": util.mainContainer,
        "show.bs.modal .modal": modal.centerModals,
    };

    util.bindDomAction(events);

    var mainContainer = new Vue({
    el: '.mainContainer',
    data: {
        campName: '',
        optionShopType: [
            {
                id: 0,
                name: '营地'
            },
            {
                id: 1,
                name: '景区'
            },
            {
                id: 2,
                name: '农庄'
            },
            {
                id: 3,
                name: '游乐园'
            },
            {
                id: 4,
                name: '度假村'
            },
            {
                id: 5,
                name: '客栈'
            },
            {
                id: 6,
                name: '青旅'
            },
        ],
        shopType: -1,
        shopPhone: '',
        imgUrls: [],
        infoWords: ''
    },
    created: function() {
        this.getShopList();
    },
    methods: {
      getShopList () {
        AJAXService.ajaxWithToken('get', '/directNet/getBasicInfo', {}, result => {
            if (result.code === 1 && result.data) {
                this.campName = result.data.campName;
                this.shopType = result.data.campType;
                this.shopPhone = result.data.recePhone;
                this.imgUrls = result.data.imgs;
            } else if (result.code !== 1) {
                modal.somethingAlert(result.msg);
            }
        })
      },
      fileUpload(callback) {
          var a = $('#detail').fileupload({
              url: AJAXService.getUrl2("uploadImageUrl"),
              done:  (e, data) => {
                  var result = data.result[0].body ? data.result[0].body.innerHTML : data.result;
                  result = JSON.parse(result);
                  callback(result.data.url)
              }
          });
      },
        uploadNewImg() {
            this.fileUpload(url => {
                this.imgUrls.push(url);
            });
            $('#detail').click();
        },
      saveMessage: function() {
          AJAXService.ajaxWithToken('post', '', {}, result => {
            if (result.code === 1) {
                this.getShopList();
            } else if (result.code !== 1) {
                modal.somethingAlert(result.msg);
            }
          })
      },
      remove: function(index) {
          this.imgUrls.splice(index, 1);
      },
      replace: function(index) {
          this.fileUpload(url => {
              this.imgUrls.splice(index, 1, url);
          });
          $('#detail').click();
      },
    },
    components: {
        DdSelect,
        DdOption
    }
    });
});



