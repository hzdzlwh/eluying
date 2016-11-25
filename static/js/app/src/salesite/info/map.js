/**
 * Created by Administrator on 2016/11/23.
 */
export function mapInit(eleStr, pointObj, scale) {
    var map = new BMap.Map(eleStr);
    var address;
    map.enableScrollWheelZoom(true);
    map.enableDoubleClickZoom(true);
    var point = new BMap.Point(pointObj.lgn, pointObj.lat);
    map.centerAndZoom(point,scale);                   // 初始化地图,设置城市和地图级别。

    var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    var mk = new BMap.Marker(r.point);
                    map.addOverlay(mk);
                    map.panTo(r.point);
                    var circle = new BMap.Circle(r.point,500,{
                fillColor:"blue",
                fillOpacity:0.2,
                strokeColor:"blue",
                strokeOpacity:0.5,
                strokeWeight:1
            });
            map.addOverlay(circle);
        }
        else {
            alert('failed'+this.getStatus());
        }
    },{enableHighAccuracy: true});

    var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
        {"input" : "suggestId"
            ,"location" : map
        });

    ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        document.querySelector("#searchResultPanel").innerHTML = str;
    });

    var myValue;
    ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        document.querySelector("#searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
        setPlace();
    });

    function setPlace(){
        //map.clearOverlays();    //清除地图上所有覆盖物
        function myFun(){
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            map.centerAndZoom(pp, 16);
            map.addOverlay(new BMap.Marker(pp));    //添加标注
            var circle = new BMap.Circle(pp,500,{
                fillColor:"blue",
                fillOpacity:0.2,
                strokeColor:"blue",
                strokeOpacity:0.5,
                strokeWeight:1
            });
            map.addOverlay(circle);
            var geoc = new BMap.Geocoder();
            geoc.getLocation(pp, function(rs){
                var addComp = rs.addressComponents;
                address = addComp.province + addComp.city  + addComp.district + addComp.street + addComp.streetNumber;
                var map = new BMap.Map("smallMap");
                map.centerAndZoom(pp,16);
                map.addOverlay(new BMap.Marker(pp));
                var circle = new BMap.Circle(pp,500,{
                    fillColor:"blue",
                    fillOpacity:0.2,
                    strokeColor:"blue",
                    strokeOpacity:0.5,
                    strokeWeight:1
                });
                map.addOverlay(circle);
            });
        }
        var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
        });
        local.search(myValue);
    }
    return address;
}