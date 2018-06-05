(function(window, undefined) {
	'use strict';

	var mapMask = function MapMask(map) {
		this._npMap = map;
		this._olMap = map._mapAdapter.map;
		this._canvas;
		this._addToMap();
	};

	//mapMask.prototype = new NPMapLib.Overlay();

	mapMask.prototype._addToMap = function() {
		this._canvas = this._createMapMask();
		this._olMap.viewPortDiv.appendChild(this._canvas);
	};

	mapMask.prototype._createMapMask = function() {
		var canvas = document.createElement('canvas');

		var size = this._npMap.getSize();

		canvas.width = size.width;
		canvas.height = size.height;
		//canvas.style.cssText = "position:absolute;" + "left:0;" + "top:0;" + "width:" + size.width + "px;" + "height:" + size.height + "px;;z-index:999;";
		canvas.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;z-index:999;';
		canvas.style.pointerEvents = 'none';

		return canvas;
	};

	mapMask.prototype.getCanvas = function() {
		return this._canvas;
	};

	mapMask.prototype.getContext = function() {
		if (!this._canvas.getContext) {
			console.log('浏览器不支持 canvas!');
			return;
		}
		return this._canvas.getContext('2d');
	};

	mapMask.prototype.removeFromMap = function() {
		this._olMap.viewPortDiv.removeChild(this._canvas);
	};

	window.MapPlatForm.Base.MapMask = mapMask;

})(window);