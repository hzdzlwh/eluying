/**
 * Created by Administrator on 2016/11/21.
 */
import http from 'http';
var header = require("header");
var leftMenu = require("leftMenu");
var util = require("util");
var modal = require("modal");
require("fileupload");
var auth = require('../../common/auth');
import init from '../../common/init';
init({
    id: auth.BUSINESS_ID,
});
import Vue from 'vue';
import WangEditor from 'wangeditor';


require("bootstrap");
require("validation");

$(function() {
    
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
                http.get('/directNet/getRemark4DirectNet', {})
                    .then(result => {
                        this.content = result.data.remark;
                        this.createEditor();
                    })
            },
            createEditor() {
                const self = this;
                this.editor = new WangEditor('editor');
                const editor = this.editor;
                editor.config.menus = [];
                editor.config.uploadImgUrl = http.getUrl('uploadImageUrl');
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
                    url: http.getUrl("uploadImageUrl"),
                    done: (e, data) => {
                        var result = data.result[0].body ? data.result[0].body.innerHTML : data.result;
                        result = JSON.parse(result);
                        self.insertImg(result.data.url);
                    }
                });
            },
            uploadImg() {
                if (this.imgNum >= 10) {
                    modal.warn('上传图片数量已达上限!');
                    return false;
                }

                $('#upload').click();
            },
            insertImg(url) {
                this.editor.command(null, 'insertHtml', '<img src="' + url + '" style="max-width:100%;"/>');
            },
            saveData() {
                http.get('/directNet/editRemark4DirectNet', {
                    remark: this.content
                })
                    .then(result => {
                        modal.warn('保存成功');
                    });
            },
            cancel() {
                http.get('/directNet/getRemark4DirectNet', {})
                    .then(result => {
                        this.content = result.data.remark;
                        this.editor.$txt.html(this.content);
                    });
            }
        }

    });


});
