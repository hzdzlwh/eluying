/**
 * Created by Administrator on 2016/1/26.
 */
import http from 'http';
var util = require("util");
var modal = require("modal");
var shopList = require('./shopList');
var shopCategory = require('./shopCategory');

var editShop = {

    //获取商品类型数据
    init: function() {
        $('#editName').val($('.categoryGrid .mainActive').find('td:eq(0)').html());
        $('#editShortName').val($('.categoryGrid .mainActive').find('td:eq(1)').html());
        $('#editUnit').val($('.categoryGrid .mainActive').find('td:eq(3)').html());
        $('#editPrice').val($('.categoryGrid .mainActive').find('td:eq(4)').html());
        $('#editBrand').val($('.categoryGrid .mainActive').find('td:eq(5)').html());
        $('#editDescription').val($('.categoryGrid .mainActive').find('td:eq(6)').html());
        /*$.ajax({
            url: http.getUrl('getShopCategory'),
            dataFilter: function (result) {
                return http.sessionValidate(result);
            },
            success: function (result) {
                var category = result.data.list;
                var str = '';
                $.each(category, function(index, el) {
                    str += '<option value="' + el.goodstypeId + '">' + el.goodstypeName + '</option>'
                });

                $('#editCategory').html(str);
                $('#editCategory').val($('.categoryGrid .mainActive').attr('data-categoryId'));
            }
        });*/
        http.get('/category/getGoodTypeInfo',{})
            .then(function (result) {
                var category = result.data.list;
                var str = '';
                $.each(category, function(index, el) {
                    str += '<option value="' + el.goodstypeId + '">' + el.goodstypeName + '</option>'
                });

                $('#editCategory').html(str);
                $('#editCategory').val($('.categoryGrid .mainActive').attr('data-categoryId'));
            });
    },

    buildData: function(that) {
        var data = {
            name: $('#editName').val(),
            shortName: $('#editShortName').val(),
            goodstypeId: $('#editCategory').val(),
            unit: $('#editUnit').val(),
            price: $('#editPrice').val(),
            brand: $('#editBrand').val(),
            description: $('#editDescription').val(),
            id: $('.categoryGrid .mainActive').attr('data-id')
        };
        this.edit(data, that)
    },

    edit: function(data, that) {
        /*$.ajax({
            url: http.getUrl('editGood'),
            type: 'POST',
            data: data,
            dataFilter: function (result) {
                return http.sessionValidate(result);
            },
            success: function (result) {
                if (util.errorHandler(result)) {
                    modal.clearModal(that);
                } else {
                    return;
                }
                shopList.loadShopCategory();
                shopList.loadShopList();
            }
        });*/
        http.post('editGood',data)
            .then(function (result) {
                modal.clearModal(that);
                shopList.loadShopCategory();
                shopList.loadShopList();
            });
    },

    events: {
        'click .editShopButton': function() {
            editShop.init();
        },

        'click #editBasicInfo .btn-ok': function() {
            if (!$("#editBasicInfo form").valid()) {
                return;
            }
            var that = this;
            editShop.buildData(that);
        }
    }
};

module.exports = editShop;