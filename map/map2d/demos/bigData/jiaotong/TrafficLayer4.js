(function(window, undefined) {
	'use strict';

	var trafficLayer = function TrafficLayer(map) {
		this._init(map);
	};

	// 设置样式
	trafficLayer.prototype.setStyle = function(options) {
		this._style = options;
	};

	// 显示
	trafficLayer.prototype.show = function(data) {

		if (data) {

			this._animatePointFlag = !0;

			this._initCanvas();

			this._data = this._dataConversion(data);

			this._drawLines();

			this._animatePoint();
		}
	};

	// 清除
	trafficLayer.prototype.remove = function() {
		this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
		this._anictx.clearRect(0, 0, this._anictx.canvas.width, this._anictx.canvas.height);
		this._offscreenctx.clearRect(0, 0, this._offscreenctx.canvas.width, this._offscreenctx.canvas.height);

		window.cancelAnimationFrame(this._animatePointHandler);
		this._animatePointHandler = null;
		this._animatePointFlag = !1;
		this._data = null;

		this._enableMove = !1;
		this._refCoordinates = void 0;
		this._refPixel = void 0;

		this._baseMask.removeFromMap();
		this._animateMask.removeFromMap();
	};

	// 数据格式：[[[lon,lat],[lon,lat],[lon,lat]],[[lon,lat],[lon,lat],[lon,lat]]]
	trafficLayer.prototype._dataConversion = function(data) {
		var i = 0,
			dataCount = data.length,
			coordinates, newCoordinates;

		var newData = new Array();

		var j, cj, pixels, mercatorPoint;

		for (i; i < dataCount; i++) {

			coordinates = data[i];

			cj = coordinates.length;

			newCoordinates = new Array();

			for (j = 0; j < cj; j++) {

				pixels = new Array(2);

				mercatorPoint = this._trafficUtil.wgs84ToMercator(coordinates[j]);

				pixels[0] = mercatorPoint.lon;
				pixels[1] = mercatorPoint.lat;

				newCoordinates.push(pixels);
			}

			newData[i] = newCoordinates;


			this._aniIndex.push(0);
		}

		return newData;
	};

	// 画线
	trafficLayer.prototype._drawLines = function() {
		//this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
		//this._anictx.clearRect(0, 0, this._anictx.canvas.width, this._anictx.canvas.height);

		this._ctx.beginPath();

		this._setLineStyle();

		for (var i = 0, ci = this._data.length; i < ci; i++) {

			var coordinatesArr = this._data[i];

			if (coordinatesArr.length < 2) {
				continue;
			}

			// 第一个点
			var coordinates = coordinatesArr[0],
				pixel = this._trafficUtil.mercatorToPixel(coordinates, this._ctx);

			// 记录第一个点
			this._refCoordinates = coordinates;
			this._refPixel = pixel;


			this._ctx.moveTo(pixel.x, pixel.y);

			for (var j = 1, cj = coordinatesArr.length; j < cj; j++) {
				coordinates = coordinatesArr[j];

				pixel = this._trafficUtil.mercatorToPixel(coordinates, this._ctx);
				this._ctx.lineTo(pixel.x, pixel.y);
			}
		}

		this._ctx.stroke();

		this._offscreenctx.drawImage(this._baseMask.getCanvas(), 0, 0);
	};

	// 线样式
	trafficLayer.prototype._setLineStyle = function() {
		this._ctx.strokeStyle = this._style && this._style.lineColor || 'rgba(230,230,14,1)';
		this._ctx.fillStyle = this._style && this._style.lineFillColor || 'rgba(255,255,255,1)';
		this._ctx.lineWidth = this._style && this._style.lineWidth || 0.5;
	};

	// 点效果
	trafficLayer.prototype._animatePoint = function() {
		if (!this._animatePointFlag) {
			return;
		}

		this._anictx.clearRect(0, 0, this._anictx.canvas.width, this._anictx.canvas.height);

		this._anictx.fillStyle = this._style && this._style.pointColor || 'rgba(255, 255, 255, 1)';

		for (var i = 0, cj = this._data.length; i < cj; i++) {

			var coordinatesArr = this._data[i];

			if (coordinatesArr.length < 2) {
				continue;
			}

			var index = this._aniIndex[i];

			var coordinates = coordinatesArr[index];

			var pixel = this._trafficUtil.mercatorToPixel(coordinates, this._ctx);

			this._anictx.fillRect(pixel.x - 1, pixel.y - 1, 2, 2);

			this._aniIndex[i]++;

			if (this._aniIndex[i] >= coordinatesArr.length) {
				this._aniIndex[i] = 0;
			}
		}

		this._cycleAnimatePoint();
	};

	trafficLayer.prototype._cycleAnimatePoint = function() {
		var that = this;
		setTimeout(function() {
			that._animatePointHandler = requestAnimationFrame(function() {
				that._animatePoint();
			});
		}, 200);
	};


	// 初始化
	trafficLayer.prototype._init = function(map) {
		this._npMap = map;
		this._olMap = map._mapAdapter.map;

		this._trafficUtil = new MapPlatForm.Base.TrafficUtil(map);

		this._animatePointHandler = 0;

		this._animatePointHandler2 = 0;

		// 数据
		this._data;

		this._aniIndex = [];

		// 样式
		this._style = {};

		//this._initCanvas();

		this._animatePointFlag = !0;

		//
		this._enableMove = !1;
		this._refCoordinates = void 0;
		this._refPixel = void 0;
		//

		this._bind();
	};

	// 初始化 canvas
	trafficLayer.prototype._initCanvas = function() {

		// 线
		this._baseMask = new MapPlatForm.Base.MapMask(this._npMap);
		this._ctx = this._baseMask.getContext();

		// 点
		this._animateMask = new MapPlatForm.Base.MapMask(this._npMap);
		this._anictx = this._animateMask.getContext();

		// 线离屏缓存
		this._initOffscreenCanvas();
	};

	// 离屏canvas，线离屏缓存
	trafficLayer.prototype._initOffscreenCanvas = function() {
		this._offscreenMask = document.createElement('canvas');
		this._offscreenMask.width = this._baseMask.getCanvas().width;
		this._offscreenMask.height = this._baseMask.getCanvas().height;
		this._offscreenctx = this._offscreenMask.getContext('2d');
	};

	// 地图事件，控制线效果部分
	trafficLayer.prototype._bind = function() {
		var that = this;

		this._npMap.getContainer().addEventListener('mousedown', function(e) {
			that._enableMove = !0;
		});

		this._npMap.getContainer().addEventListener('mouseup', function(e) {
			that._enableMove = !1;

		});

		this._npMap.getContainer().addEventListener('mousemove', function(e) {
			if (that._enableMove) {
				var pixel = that._trafficUtil.mercatorToPixel(that._refCoordinates, that._ctx),
					driftX = pixel.x - that._refPixel.x,
					driftY = pixel.y - that._refPixel.y;

				that._ctx.clearRect(0, 0, that._ctx.canvas.width, that._ctx.canvas.height);
				that._ctx.drawImage(that._offscreenMask, driftX, driftY);
			}
		});

		this._npMap.addEventListener('movestart',
			function(e) {
				that._ctx.clearRect(0, 0, that._ctx.canvas.width, that._ctx.canvas.height);
			});
		this._npMap.addEventListener('zoomstart',
			function() {
				that._offscreenctx.clearRect(0, 0, that._offscreenctx.canvas.width, that._offscreenctx.canvas.height);
				that._ctx.clearRect(0, 0, that._ctx.canvas.width, that._ctx.canvas.height);
			});
		this._npMap.addEventListener('zoomend',
			function() {
				that._drawLines();
			});
	};

	window.MapPlatForm.Base.TrafficLayer4 = trafficLayer;

})(window);