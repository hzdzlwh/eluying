/**
 * Created by lingchenxuan on 16/1/10.
 */
import http from 'http';
var util = require('util');
var modal = require('modal');
var ETCategoryList = require('./ETCategoryList');

var editETBasic = {
    // 编辑基本信息
    editETCategory: function(that) {
        var item = {
            id: $('.mainActive .id').val(),
            name: $('#editETName').val(),
            shortName: $('#editETShortName').val(),
            unit: $('#editETUnit').val(),
            fitNum: $('#editETFitNum').val(),
            inventory: $('#editETInventory').val(),
            price: $('#editETPrice').val(),
            description: $('#editETDescription').val(),
            type: 2
        };
        http.post('addOrEditExtraCategoryUrl', item)
            .then(res => {
                modal.clearModal(that);
                $.each(ETCategoryList.list, function(index, element) {
                    if (element.id == item.id) {
                        var state = ETCategoryList.list[index].state;
                        ETCategoryList.list[index] = item;
                        ETCategoryList.list[index].state = state;
                        return false; // 等于break
                    }
                });
                ETCategoryList.render();
            });
    },
    events: {
        'click #editETOk': function() {
            if (!$('#editET form').valid()) {
                return;
            }
            var that = this;
            editETBasic.editETCategory(that);
        },
        'click #editETButton': function() {
            $('#editETName').val($('.mainActive td:eq(0)').html());
            $('#editETShortName').val($('.mainActive td:eq(1)').html());
            $('#editETUnit').val($('.mainActive td:eq(2)').html());
            $('#editETFitNum').val($('.mainActive td:eq(3)').html());
            $('#editETInventory').val($('.mainActive td:eq(4)').html());
            $('#editETPrice').val($('.mainActive td:eq(5)').html());
            $('#editETDescription').val($('.mainActive td:eq(6)').html());
        }
    }
};

module.exports = editETBasic;
