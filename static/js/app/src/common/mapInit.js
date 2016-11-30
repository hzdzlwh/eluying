/**
 * Created by zhaoyongsheng on 16/11/25.
 */
/**
 * 初始化地图
 * @param mapContainer 渲染地图的Dom容器,官方给定为Dom容器id字符串(不带'#')
 * @param centerPointer 地图初始化的中心点
 * @param zoom 地图缩放级别
 */
export function mapInit(mapContainer, addressObj, zoom, callback) {
    var pointLat,pointLon;
    const map = new BMap.Map(mapContainer);
    var localSearch = new BMap.LocalSearch(map);

    if (!addressObj.addressStr) {
        pointLat = addressObj.pointLat || 39.915;
        pointLon = addressObj.pointLon || 116.404;
    } else if(addressObj.pointLat) {
        pointLat = addressObj.pointLat;
        pointLon = addressObj.pointLon;
    } else {
        localSearch.search(addressObj.addressStr);
    }

    var point = new BMap.Point(pointLon, pointLat);
    map.centerAndZoom(point, zoom);
    map.addControl(new BMap.NavigationControl);
    map.addControl(new BMap.ScaleControl);
    map.addControl(new BMap.OverviewMapControl);
    map.addControl(new BMap.MapTypeControl);
    map.enableScrollWheelZoom();
    map.enableContinuousZoom();

    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
    $(marker).attr({
        style: "z-index=19999"
    });
    marker.enableDragging();

    map.addEventListener("click", function(n) {
        var a = n.point;
        pointLat = a.lat;
        pointLon = a.lng;
        // TODO
        callback({ pointLat, pointLon });
        mapInit(mapContainer, { pointLat: pointLat, pointLon: pointLon }, zoom, callback);
    });

    marker.addEventListener("dragend", function(n) {
        pointLat = n.point.lat;
        pointLon = n.point.lng;
        this.closeInfoWindow();
        map.panTo(n.point);

        callback({ pointLat, pointLon });
    });

    localSearch.setSearchCompleteCallback(function(n) {
        try {
            var a = n.getPoi(0);
            pointLat = a.point.lat;
            pointLon = a.point.lng;
            callback({pointLat,pointLon});
            mapInit(mapContainer, { pointLat: pointLat, pointLon: pointLon }, zoom, callback);
            // TODO
        } catch (i) {
            // TODO
        }
    });
}


