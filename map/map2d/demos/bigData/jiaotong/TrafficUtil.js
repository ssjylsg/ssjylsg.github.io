(function(window, undefined) {
	'use strict';

	var trafficUtil = function TrafficUtil(map) {
		this._npMap = map;
		this._olMap = map._mapAdapter.map;
	};

	// wgs84 转墨卡托投影坐标
	trafficUtil.prototype.wgs84ToMercator = function(coordinates) {
		return NPMap.T.setPoint(this._npMap, new NPMapLib.Geometry.Point(coordinates[0], coordinates[1]));
	};

	// 墨卡托投影坐标转像素坐标
	trafficUtil.prototype.mercatorToPixel = function(coordinates, ctx) {
		var level = this._olMap.getZoom(),
			res = this._olMap.getResolutionForZoom(level),
			centerMercator = this._olMap.getCenter(),
			centerPixel = new NPMapLib.Geometry.Pixel(centerMercator.lon - ctx.canvas.width / 2 * res, centerMercator.lat + ctx.canvas.height / 2 * res),//左上角墨卡托坐标
			pixelX = (coordinates[0] - centerPixel.x) / res,
			pixelY = (centerPixel.y - coordinates[1]) / res;

		return {
			'x': pixelX,
			'y': pixelY
		};
	};

	// 数组合并
	trafficUtil.prototype.arrayMerge = function() {
		return Array.prototype.concat.apply([], arguments)
	};

	// Point 转 像素坐标
	trafficUtil.prototype.wgs84ToPixel = function(pointItem) {
		var point = new NPMapLib.Geometry.Point(pointItem[0], pointItem[1]),
			lonLat = NPMapLib.T.setPoint(this._npMap, point),
			pixel = this._olMap.getPixelFromLonLat(lonLat);

		return pixel;
	};

	window.MapPlatForm.Base.TrafficUtil = trafficUtil;

})(window);