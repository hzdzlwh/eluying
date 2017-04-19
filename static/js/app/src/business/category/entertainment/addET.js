/**
 * Created by lingchenxuan on 16/1/10.
 */
import http from 'http';
var util = require('util');
var modal = require('modal');
var ETCategoryList = require('./ETCategoryList');
var addET = {
    // 添加
    addETCategory: function(that) {
        var item = {
            name: $('#createETName').val(),
            shortName: $('#createETShortName').val(),
            unit: $('#createETUnit').val(),
            fitNum: $('#createETFitNum').val(),
            inventory: $('#createETInventory').val(),
            price: $('#createETPrice').val(),
            description: $('#createETDescription').val(),
            type: 2
        };
        http.post('addOrEditExtraCategoryUrl', item)
            .then(result => {
                modal.clearModal(that);
                item.id = result.data.id;
                item.state = 0;
                ETCategoryList.list.push(item);
                ETCategoryList.render();
            });
    },
    events: {
        'click #createETOk': function() {
            if (!$('#createEnt form').valid()) {
                return;
            }
            var that = this;
            addET.addETCategory(that);
        }
    }
};

module.exports = addET;
