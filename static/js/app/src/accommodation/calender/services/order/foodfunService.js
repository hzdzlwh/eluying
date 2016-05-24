var AJAXService = require("AJAXService");
var util = require("util");
require("angular");

var foodfunService = function(app){
    app.service("foodfunService",["$rootScope", "itemCalendarService", function(rootScope, itemCalendarService){
        var self = this;
        this.addItem = function(itemStore, items){
            var self = this;
            var item = itemStore[0];
            AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                date: util.dateFormat(new Date()),
                id: item.itemId
            }, function(result){
                var temp = {
                    type: item.type,
                    id: item.itemId,
                    name: item.name,
                    price: item.price,
                    num: (result.data.inventory < 1) ? 0 : 1,
                    date: new Date(),
                    dateStr: util.dateFormat(new Date()),
                    dateStr2: util.dateFormatWithoutYear(new Date()),
                    inventory: result.data.inventory,
                };
                temp.days = itemCalendarService.createCalendar(temp);
                items.push(temp);
                rootScope.$apply();
            });
        };
        this.changeItem = function(item, itemInstance, items){
            var self = this;
            var index = (items.indexOf(item));
            AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                date: util.dateFormat(new Date()),
                id: itemInstance.itemId
            }, function(result){
                items[index] = {
                    type: 1,
                    id: itemInstance.itemId,
                    name: itemInstance.name,
                    price: itemInstance.price,
                    num: (result.data.inventory < 1) ? 0 : 1,
                    date: new Date(),
                    dateStr: util.dateFormat(new Date()),
                    dateStr2: util.dateFormatWithoutYear(new Date()),
                    inventory: result.data.inventory
                };
                items[index].days = self.createCalendar(items[index]);
                rootScope.$apply();
            });
            $(".select1_options").hide();
        };
        this.changeItemNum = function(item, num){
            if(num < 0){
                num = 0;
            }else if(num > item.inventory){
                num = item.inventory;
            }
            item.num = num;
            rootScope.$apply();
        };
        this.changeItemTime = function(item, date){
            var today = new Date();
            today.setDate(today.getDate() - 1);
            if(date < today){
                return false;
            }
            AJAXService.ajaxWithToken('GET', 'getInventoryUrl', {
                date: util.dateFormat(date),
                id: item.id
            }, function(result){
                item.date = date;
                item.dateStr = util.dateFormat(date);
                item.dateStr2 = util.dateFormatWithoutYear(date);
                item.inventory = result.data.inventory;
                item.num = (result.data.inventory < 1) ? 0 : 1;
                itemCalendarService.createCalendar(item);
                scope.$apply();
            });
        };
        this.deleteItem = function(items, index){
            items.splice(index, 1);
            rootScope.apply();
        }
    }]);
};

module.exports = foodfunService;