var AJAXService = require("AJAXService");
var accommodationPriceList = {
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
                accommodationPriceList.render(result);
            }
        })
    },
    render: function(result){

    }
};
module.exports = accommodationPriceList;