var AJAXService = require("AJAXService");
var vD = require("virtualDOM");
var accommodationPriceList = {
    getAccommodationPriceList: function(){
        $.ajax({
            url: AJAXService.getUrl("getAccommodationPriceList"),
            data: {
                campId: localStorage.getItem("campId"),
                startDate: "2015-12-23",
                endDate: "2015-12-29"
            },
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                accommodationPriceList.createEl(result);
            }
        })
    },
    createEl: function(result){
        var table = vD.El("table", {}, [
            vD.El("thead", {}, [
                vD.El("tr", {}, [
                    vD.El("td", {}, ["房型"]),
                    vD.El("td", {}, ["价格类型"])
                ])
            ])
        ]);
        for (var i = 0;  i < 7; i++) {
            table.children[0].children[0].push(vD.El("td", {}, [
                vD.El("p", {}, [startDate.substring(5)]),
                vD.El("p", {}, [])
            ]));
        }
        var tbody = vD.El('tbody', {}, []);
        for (var name in result.data) {
            var tr = vD.El("tr", {}, [
                vD.El("td", {} , [result.data[name][0].name]),
                vD.El("td", {} , ["零售价"])
            ]);
            $.each(result.data[name], function(index, element){
                tr.children.push(vD.El("td", {}, [
                    element.salePrice / 100,
                    vD.El("input", {type: "hidden", class: "date"}, [element.date]),
                    vD.El("input", {type: "hidden", class: "id"}, [element.id])
                ]));
            });
            tbody.children.push(tr);
        }
        this.renderEl(tbody);
    },
    renderEl: function(el){
        var dom = el.render();
        $("table").append(dom);
    }
};
module.exports = accommodationPriceList;