define(['jquery', 'map2d', 'mapConfig'], function($, NPMAP, mapConfig) {	
	var map;
	var clMap = function(mapContainer = 'mapId') {
		var temp = mapContainer;
		return new Promise(function(resolve, reject) {
			var mapContainer = document.getElementById(temp);
			var tool = new MapPlatForm.Base.MapConfig();
			var resultJson = tool.createMap(mapContainer, mapConfig);
			map = resultJson.map;
			map.addControl(new NPMapLib.Controls.NavigationControl());
			map.addControl(new NPMapLib.Controls.ScaleControl());
			var vector = true;
			resultJson.sattilateLayer.length > 0 ? $(".mapTypeCard").click(function(r) {
				if (vector) {
					tool.showSattilateLayer();
					vector = false;
					$(".mapTypeCard").removeClass('map-vector').addClass('map-image');
				} else {
					tool.showVectorLayer();
					vector = true;
					$(".mapTypeCard").removeClass('map-image').addClass('map-vector');
				}
			}) : $(".map-convert").hide()

			resolve && resolve(resultJson);
		});

	};
	var mapTool = function(mapTools) {
		registerDemoInstructions({
			title: "扩展组件工具类",
			height: "150",
			width: "250",
			position: [0, 0], //["right",60],
			modal: false,
			buttons: {
				"量距": function() {
					mapTools.measureDistance();
				},
				"量面": function() {
					mapTools.measureArea();
				},
				"清除量算": function() {
					mapTools.cancelMeasure();
				},
				"画线": function() {
					mapTools.drawLine(function(res, geometry) {
						map.addOverlay(geometry);
					}, style);
				},
				"画多边形": function() {
					mapTools.drawPolygon(function(res, geometry) {
						map.addOverlay(geometry);
					}, style);
				},
				"画矩形": function() {
					mapTools.drawRectangle(function(res, geometry) {
						map.addOverlay(geometry);
					}, style);
				},
				"画圆": function() {
					mapTools.drawCircle(function(res, geometry) {
						map.addOverlay(geometry);
					}, style);
				},
				"直径画圆": function() {
					mapTools.drawCircleByDiameter(function(res, geometry) {
						map.addOverlay(geometry);
					}, style);
				},
				"写意多边形": function() {
					mapTools.drawFreehand(function(res, geometry) {
						map.addOverlay(geometry);
					}, style);
				},
				"取消绘制": function() {
					mapTools.cancelDraw();
				},
				"圆搜索": function() {
					var center = map.getCenter();
					mapTools.addCircleSearchControl(center, function(geometry) {
						console.log(geometry);
					});
				},
				"取消圆搜索": function() {
					mapTools.removeCircleSearchControl();
				}
			}
		});

		//$("#ui-dialog");
	}
	return {
		createMap: clMap,
		mapTool: mapTool
	}
});