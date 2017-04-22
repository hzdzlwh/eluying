/**
 * Created by lingchenxuan on 16/1/10.
 */
import http from 'http';
var util = require('util');
var modal = require('modal');
var floatInfo = require('floatInfo');

var ETCategoryList = {
    render: function() {
        var str = '';
        $.each(ETCategoryList.list, function(index, element) {
            var state = element.state ? '已上架' : '未上架';
            str += "<tr class='mainClass'>" +
                "<td class='gridMore'>" + element.name + '</td>' +
                '<td>' + element.shortName + '</td>' +
                '<td>' + element.unit + '</td>' +
                '<td>' + element.fitNum + '</td>' +
                '<td>' + element.inventory + '</td>' +
                '<td>' + element.price + '</td>' +
                "<td class='gridMore'>" + element.description + '</td>' +
                '<td>' + state + '</td>' +
                "<input type='hidden' class='state' value=" + element.state + ' />' +
                "<input type='hidden' class='id' value=" + element.id + ' /></tr>';
        });
        $('.categoryGrid tbody').html(str);
        $('.mainOperate .operateItem').addClass('hide');
        $('.mainOperate .second').addClass('hide');
    },

    // 读取餐饮品类列表
    loadETCategoryList: function() {
        http.get('pullOtherCategoryListUrl', { type: 2 })
            .then(result => {
                ETCategoryList.list = result.data.list;
                ETCategoryList.render();
            });
    },

    // 上架或者下架
    modifyState: function(item) {
        http.post('/category/modifyStatePC', item)
            .then(res => {
                $.each(ETCategoryList.list, function(index, element) {
                    if (element.id == item.id) {
                        ETCategoryList.list[index].state = item.state;
                        return false; // 等于break
                    }
                });
                ETCategoryList.render();
            });
    },

    // 删除
    deleteETCategory: function() {
        var id = $('.mainActive .id').val();
        http.post('deleteOtherCategoryUrl', { id: id })
            .then(res => {
                $.each(ETCategoryList.list, function(index, element) {
                    if (element.id == id) {
                        ETCategoryList.list.splice(index, 1);
                        return false; // 等于break
                    }
                });
                ETCategoryList.render();
            });
    },
    events: {
        'click .categoryGrid .mainClass': function() {
            $('.mainClass').removeClass('mainActive');
            $('.subclass').removeClass('subActive');
            $(this).addClass('mainActive');
            $('.mainOperate .operateItem').removeClass('hide');
            $('.mainOperate .second').removeClass('hide');
            if ($(this).find('.state').val() == 0) {
                $('.xiajia').addClass('hide');
            } else {
                $('.shangjia').addClass('hide');
            }
        },
        'mouseenter .categoryGrid .gridMore': function() {
            floatInfo.showMoreInfo(event, this);
        },
        'mouseleave .categoryGrid .gridMore': function() {
            floatInfo.hideMoreInfo(event, this);
        },
        'click #modifyStateButton': function() {
            var item = {
                id: $('.mainActive .id').val(),
                state: 1 - $('.mainActive .state').val()
            };
            ETCategoryList.modifyState(item);
        },
        'click #deleteETButton': function() {
            var confirmCallback = ETCategoryList.deleteETCategory;
            var dialogConfig = { title: '提示', message: '您确定要删除吗？' };
            modal.confirm(dialogConfig, confirmCallback);
        },
// 上架或下架
        'click .modifyStateButton': function() {
            var item = {
                id: $('.mainActive .id').val(),
                state: 1 - $('.mainActive .state').val(),
                channelId: 5
            };
            ETCategoryList.modifyState(item);
        }
    }
};

module.exports = ETCategoryList;
