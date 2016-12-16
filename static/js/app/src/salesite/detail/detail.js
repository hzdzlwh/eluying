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
            imgNum: 0,
            textNum: 0
        },
        mounted() {
            this.getData();
            this.initFileUpload();
        },
        methods: {
            getData()  {
                AJAXService.ajaxWithToken('get', '/directNet/getRemark4DirectNet', {}, result => {
                    if (result.code === 1 && result.data) {
                        this.content = result.data.remark;
                        this.createEditor();
                    } else if (result.code !== 1) {
                        modal.somethingAlert(result.msg);
                    }
                })
            },
            createEditor() {
                const self = this;
                this.editor = new WangEditor('editor');
                const editor = this.editor;
                editor.config.menus = [];
                editor.config.uploadImgUrl = AJAXService.getUrl2('uploadImageUrl');
                editor.onchange = function() {
                    self.imgNum = this.$txt.find('img').length;
                    self.textNum = this.$txt.text().length;
                    self.content = this.$txt.html();
                };
                editor.create();
                editor.$txt.html(this.content);
                if (this.content) {
                    document.querySelector('.editor-placeholder').style.display = 'none';
                    document.querySelector('.wangEditor-container').style.opacity = '1';
                }
                $('#editor').focus(() => {
                    document.querySelector('.editor-placeholder').style.display = 'none';
                    document.querySelector('.wangEditor-container').style.opacity = '1';
                });
                $('#editor').blur(() => {
                    const num = editor.$txt.text().length + editor.$txt.find('img').length;
                    if (num <= 0) {
                        document.querySelector('.wangEditor-container').style.opacity = '0';
                        document.querySelector('.editor-placeholder').style.display = 'block';
                    }
                });
                this.imgNum = editor.$txt.find('img').length;
                this.textNum = editor.$txt.text().length;
                $('#editor').blur();
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
                if (this.imgNum >= 10) {
                    modal.somethingAlert('上传图片数量已达上限!');
                    return false;
                }

                $('#upload').click();
            },
            insertImg(url) {
                this.editor.command(null, 'insertHtml', '<img src="' + url + '" style="max-width:100%;"/>');
            },
            saveData() {
                AJAXService.ajaxWithToken('get', '/directNet/editRemark4DirectNet', {
                    remark: this.content
                }, result => {
                    if (result.code === 1) {
                        modal.somethingAlert('保存成功');
                    } else if (result.code !== 1) {
                        modal.somethingAlert(result.msg);
                    }
                })
            },
            cancel() {
                AJAXService.ajaxWithToken('get', '/directNet/getRemark4DirectNet', {}, result => {
                    if (result.code === 1 && result.data) {
                        this.content = result.data.remark;
                        this.editor.$txt.html(this.content);
                    } else if (result.code !== 1) {
                        modal.somethingAlert(result.msg);
                    }
                })
            }
        }

    });


});
