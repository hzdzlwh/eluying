/**
 * Created by Administrator on 2016/11/21.
 */
var AJAXService = require("AJAXService");
var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
require("fileupload");
var auth = require('../../common/auth');
auth.checkAuth(auth.BUSINESS_ID);
import Vue from 'vue';
import WangEditor from 'wangeditor';


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
    
    const detailContent = new Vue({
        el: '.detail-content',
        data: {
            content: '',
            editor: undefined,
            imgNum: 0
        },
        mounted() {
            this.createEditor();
            this.initFileUpload();
        },
        methods: {
            createEditor() {
                const self = this;
                this.editor = new WangEditor('editor');
                const editor = this.editor;
                editor.config.menus = [];
                editor.config.uploadImgUrl = AJAXService.getUrl2('uploadImageUrl');
                editor.onchange = function() {
                    self.imgNum = document.querySelectorAll('#editor img').length;
                    self.content = this.$txt.html();
                };
                editor.create();
            },
            initFileUpload() {
                const self = this;
                $('#upload').fileupload({
                    url: AJAXService.getUrl2("uploadImageUrl"),
                    done: (e, data) => {
                        var result = data.result[0].body ? data.result[0].body.innerHTML : data.result;
                        result = JSON.parse(result);
                        self.insertImg(result.data.url);
                    }
                });
            },
            uploadImg() {
                if (this.imgNum > 10) {
                    return;
                }

                $('#upload').click();
            },
            insertImg(url) {
                this.editor.command(null, 'insertHtml', '<img src="' + url + '" style="max-width:100%;"/>');
            }
        }

    });


});
