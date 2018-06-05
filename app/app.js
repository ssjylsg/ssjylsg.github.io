define(['jquery', 'map2d', 'mapConfig', 'bootstrap', 'bootstrap-dialog','noModel',
	'jquery.mCustomScrollbar',
	'jquery.mousewheel.min'


	], function($, NPMAP, mapConfig,
	bootstrap, BootstrapDialog,noModel,mCustomScrollbar,mousewheel) {
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
		$.noModel({
            id: "12345",
            title: "测试noModel弹层",
            content: "<h1>noModel的内容</h1>",
            width: 600,
            height: 500,
            isHideBut: false,
            singleButtons: [{
                name: "关闭哈哈",
                order: 2,
                halign: "right",
                isDisabled: true,
                params: "",
                callback: function(btnObj) {
                    return true;
                }
            }, {
                name: "提交",
                order: 1,
                halign: "right",
                isDisabled: false,
                params: "你好",
                callback: function(btnObj) {
                    alert(btnObj);
                    return false;
                }
            }]
        });
        return;
		var opts = {
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
		}		
		var targetOpts = {
			type: BootstrapDialog.TYPE_INFO,
			size: BootstrapDialog.SIZE_NORMAL,
			title: '扩展组件工具类 ',
			draggable:true,
			message: '',
			modal: false,
			size: BootstrapDialog.SIZE_NORMAL, //size为小，默认的对话框比较宽
			buttons: []
		};

		for (var k in opts.buttons) {
			targetOpts.buttons.push({
				label: k,
				action: opts.buttons[k]
			})
		}

		BootstrapDialog.show(targetOpts);
	}
	return {
		createMap: clMap,
		mapTool: mapTool
	}
});