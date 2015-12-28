var AJAXService = require("AJAXService");
var vD = require("virtualDOM");
var util = require("util");
var el = require("element");
var diff = require("diff");
var patch = require("patch");
var accommodationPriceList = {
    getAccommodationPriceList: function(startDate){
        $.ajax({
            url: AJAXService.getUrl("getAccommodationPriceList"),
            data: {
                campId: localStorage.getItem("campId"),
                startDate: util.dateFormat(startDate),
                endDate: util.dateFormat(new Date(startDate.setDate(startDate.getDate() + 6)))
            },
            dataFilter: function (result) {
                return AJAXService.sessionValidate(result);
            },
            success: function(result){
                accommodationPriceList.createEl(result);
            }
        })
    },

    tableInit: function(){
        this.table = el("table", {}, []);
        this.tableDOM = this.table.render();
        $(".priceGrid").html(this.tableDOM);
    },

    createEl: function(result){
        var newTable = el("table", {}, [
            el("thead", {}, [
                el("tr", {}, [
                    el("th", {}, ["房型"]),
                    el("th", {}, ["价格类型"])
                ])
            ])
        ]);
        //得到七天日期对象
        var dateArray = [];
        for (var x in result.data) {
            if (result.data.hasOwnProperty(x)) {
                if(result.data[x]) {
                    $.each(result.data[x], function(index, element){
                        dateArray.push(new Date(element.date));
                    })
                }
            }
        }

        //把表头写好
        for (var i = 0;  i < 7; i++) {
            newTable.children[0].children[0].children.push(el("th", {}, [
                el("p", {}, [dateArray[i].toLocaleDateString().substring(5).replace("/", "-")]),
                el("p", {}, [new Date().toDateString() ==  dateArray[i].toDateString() ? "今天" : util.getWeek(dateArray[i])])
            ]));
        }

        //开始写下面的表格
        var tbody = el('tbody', {}, []);
        var id = 1;
        for (var name in result.data) {
            if (result.data.hasOwnProperty(name)) {
                if(result.data[name]) {
                    var tr = el("tr", {}, [
                        el("td", {} , [result.data[name][0].name]),
                        el("td", {} , ["零售价"])
                    ]);
                    $.each(result.data[name], function(index, element){
                        tr.children.push(el("td", {class: "price", id: id++, roomId: element.id}, [
                            element.salePrice
                        ]));
                    });
                    tbody.children.push(tr);
                }
            }
        }
        newTable.children.push(tbody);

        //更新
        var patches = diff(this.table, newTable);
        console.log(this.table);
        console.log(newTable);
        patch(this.tableDOM, patches);
        this.table = newTable;
    },


    renderEl: function(el){
        var dom = el.render();
        $(".priceGrid").html(dom);
        events= {
            "click .priceGrid .price": function(event){
                $(".price").removeClass("selected");
                $(event.target).toggleClass("selected");
                $.each(accommodationPriceList.table.children[1].children, function(index, element){
                    $.each(element.children, function(index, element){
                        if (element.props.class) {
                            element.props.class.replace(" selected", "");
                        }
                        if ($(event.target).attr("id") == element.props.id) {
                            element.props.class += " selected";
                        }
                    });
                });
                $(".first .operateItem").removeClass("hide");
                $(".second").removeClass("hide");
            }
        };
        util.bindDomAction(events);
    }
};
module.exports = accommodationPriceList;