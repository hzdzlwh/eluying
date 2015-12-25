var AJAXService = require("AJAXService");
var accommodationPriceList = {
    getAccommodationBasicInfo: function(){
        $.ajax({
            url: AJAXService.getUrl("getAccommodationBasicInfo"),
            data: {campId: localStorage.getItem("campId")},
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                this.roomsList = result.data.list;
                accommodationPriceList.getAccommodationPriceList();
            }
        });
    },
    ss: "nihao",
    getAccommodationPriceList: function(){
        $.ajax({
            url: AJAXService.getUrl("getAccommodationPriceList"),
            data: {
                campId: localStorage.getItem("campId"),
                startDate: "2015-12-07",
                endDate: "2015-12-13"
            },
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){

            }
        })
    }
};
module.exports = accommodationPriceList;