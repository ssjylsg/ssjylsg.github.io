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
	trafficLayer.prototype.show = function(data, center) {
		if (data) {
			this._animatePointFlag = !0;

			this._initCanvas();

			this._center = center;

			this._data = this._dataConversion(data);

			this._drawLinesAni(this._data);
		}
	};

	trafficLayer.prototype.remove = function() {
		this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
		this._anictx.clearRect(0, 0, this._anictx.canvas.width, this._anictx.canvas.height);
		this._aniblurctx.clearRect(0, 0, this._aniblurctx.canvas.width, this._aniblurctx.canvas.height);
		this._aniblurctxTmp.clearRect(0, 0, this._aniblurctxTmp.canvas.width, this._aniblurctxTmp.canvas.height);
		
		window.cancelAnimationFrame(this._animatePointHandler1);
		window.cancelAnimationFrame(this._animatePointHandler2);
		this._animatePointHandler1 = null;
		this._animatePointHandler2 = null;

		this._animatePointFlag = !1;

		for (var i = 0, ci = this._animationList.length; i < ci; i++) {
			this._animationList[i].dispose();
		}
		this._animationList = [];

		this._data = null;
		this._baseMask.removeFromMap();
		this._animateMask.removeFromMap();
		this._animateBlurMask.removeFromMap();
		this._cacheMask.removeFromMap();
	};

	// 经纬度转墨卡托投影后的坐标
	// 数据格式：[[1,[lon,lat],[lon,lat],[lon,lat]],[2,[lon,lat],[lon,lat],[lon,lat]]]
	trafficLayer.prototype._dataConversion = function(data) {
		var newData = new Array(data.length);

		for (var i = 0, ci = data.length; i < ci; i++) {
			var arr = new Array(2);

			var count = data[i][0];
			var coordinates = data[i][1];

			var cj = coordinates.length;
			var subArr = new Array(cj);

			for (var j = 0; j < cj; j++) {
				var pixels = new Array(2);

				var mercatorPoint = this._trafficUtil.wgs84ToMercator(coordinates[j]);

				pixels[0] = mercatorPoint.lon;
				pixels[1] = mercatorPoint.lat;

				subArr[j] = pixels;
			}

			arr[0] = count;
			arr[1] = subArr;

			newData[i] = arr;
		}

		return newData;
	};

	// 初始化
	trafficLayer.prototype._init = function(map) {
		this._npMap = map;
		this._olMap = map._mapAdapter.map;

		this._trafficUtil = new MapPlatForm.Base.TrafficUtil(map);

		this._animatePointHandler1 = 0;
		this._animatePointHandler2 = 0;

		this._circleSize = 10;

		// 中心地啊你
		this._center;

		// 数据
		this._data;

		// 样式
		this._style = {};

		this._animationList = [];

		//this._initCanvas();

		// 是否有点效果
		this._animatePointFlag = !0;

		var that = this;
		this._animatePointHandler1 = requestAnimationFrame(function() {
			that._animatePoint();
		});

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

		this._animateBlurMask = new MapPlatForm.Base.MapMask(this._npMap);
		this._aniblurctx = this._animateBlurMask.getContext();
		this._aniblurctx.globalAlpha = .85;

		this._cacheMask = new MapPlatForm.Base.MapMask(this._npMap);
		this._aniblurctxTmp = this._cacheMask.getContext();
		this._aniblurctxTmp.globalCompositeOperation = 'copy';
	};

	// 画带效果的线
	trafficLayer.prototype._drawLinesAni = function(data) {
		function createAnimation() {

			that._animationList.push(new MapPlatForm.Base.Animation({
				from: 0,
				to: data[0][1].length - 1,
				action: function(i) {
					that._ctx.clearRect(0, 0, that._ctx.canvas.width, that._ctx.canvas.height);
					that._drawLines(data, void 0, 0, r);
					that._drawLines(data, i, r, c);
				},
				callback: function() {
					r += h,
						c += h,
						r < data.length ? createAnimation() : that._workToHome();
				}
			}))
		};

		var that = this;

		if (data && this._animatePointFlag) {

			// 处理数据
			for (var i = 0, count = data.length; i < count; i++) {
				//var temp = ~~(Math.random() * data[i][1].length);
				data[i][2] = ~~(Math.random() * data[i][1].length);
				data[i][3] = 1;
			}

			var h = 1500;

			var r = 0,
				c = h;
			createAnimation();
		}
	};

	trafficLayer.prototype._workToHome = function() {
		var i = 0,
			count = this._data.length;

		for (i; i < count; i++) {
			this._data[i][3] = 0;
		}

		this._workToHomeByKey();
	};

	trafficLayer.prototype._workToHomeByKey = function() {
		function createAnimation() {
			that._animationList.push(new MapPlatForm.Base.Animation({
				from: that._data[0][1].length - 1,
				to: 0,
				action: function(i) {
					var s = [.07, .09, .1, .12, .15];
					that._ctx.clearRect(0, 0, that._ctx.canvas.width, that._ctx.canvas.height);
					that._drawLines(that._data, void 0, o, that._data.length);
					that._drawLines(that._data, i, n, o);
				},
				callback: function() {
					n += s,
						o += s,
						n < that._data.length ? createAnimation() : that._drawLinesAni(that._data)
				}
			}))
		}

		var that = this;

		if (this._data) {
			var s = 1500;
			var n = 0,
				o = s;
			createAnimation();
		}
	};

	// 画线
	trafficLayer.prototype._drawLines = function(data, a, e, s) {
		var ctx = this._ctx;
		if (data) {
			ctx.beginPath();
			ctx.save();

			ctx.strokeStyle = this._style && this._style.lineColor || 'rgba(255,0,0,0.9)';
			ctx.lineWidth = this._style && this._style.lineWidth || 0.1;

			e = e || 0;
			s = s || 0;
			s > data.length && (s = data.length);

			var coordinates, pixel;

			for (var l = e; s > l; l++) {

				// 坐标信息数组
				coordinates = data[l][1];

				// 第一点
				pixel = this._trafficUtil.mercatorToPixel(coordinates[0], ctx);

				ctx.moveTo(pixel.x, pixel.y);

				if (void 0 !== a) {
					for (var m = 1; a > m; m++) {
						pixel = this._trafficUtil.mercatorToPixel(coordinates[m], ctx);
						ctx.lineTo(pixel.x, pixel.y);
					}
				} else {
					for (var m = 1; m < coordinates.length; m++) {
						pixel = this._trafficUtil.mercatorToPixel(coordinates[m], ctx);
						ctx.lineTo(pixel.x, pixel.y);
					}
				}
			}
			ctx.stroke();
			ctx.restore();
		}
	};

	// 点效果部分
	trafficLayer.prototype._animatePoint = function() {
		var that = this;
		if (this._aniblurctxTmp.drawImage(this._aniblurctx.canvas, 0, 0, this._aniblurctx.canvas.width, this._aniblurctx.canvas.height), this._anictx.clearRect(0, 0, this._anictx.canvas.width, this._anictx.canvas.height), this._aniblurctx.clearRect(0, 0, this._aniblurctx.canvas.width, this._aniblurctx.canvas.height), this._animatePointFlag) {

			this._drawAnimateFlowPath();
			this._aniblurctx.fill();
			this._drawAnimateCenterMarker();

		};

		this._aniblurctx.drawImage(this._aniblurctxTmp.canvas, 0, 0, this._aniblurctxTmp.canvas.width, this._aniblurctxTmp.canvas.height);

		setTimeout(function() {
				that._animatePointHandler2 = requestAnimationFrame(function() {
					that._animatePoint();
				});
			},
			55); // 默认 55, 点部分
	};



	// 中心点效果
	trafficLayer.prototype._drawAnimateCenterMarker = function() {
		if (void 0 === this._center) {
			return;
		}

		var center = this._center,
			mercatorPoint = this._trafficUtil.wgs84ToMercator(center),
			pixel = this._trafficUtil.mercatorToPixel([mercatorPoint.lon, mercatorPoint.lat], this._aniblurctx);

		this._aniblurctx.save(),
			this._aniblurctx.beginPath(),
			this._aniblurctx.strokeStyle = this._style && this._style.centerPointColor || 'rgba(255,255,255,0.9)',
			this._circleSize += 1,
			this._aniblurctx.arc(pixel.x, pixel.y, this._circleSize, 0, 2 * Math.PI),
			this._aniblurctx.stroke(),
			this._aniblurctx.restore(),
			this._circleSize > 35 && (this._circleSize = 0);
	};

	// 沿线流动的点
	trafficLayer.prototype._drawAnimateFlowPath = function() {
		if (this._data) {

			this._anictx.beginPath();
			this._aniblurctx.beginPath();

			// 流动点颜色
			this._aniblurctx.fillStyle = this._style && this._style.flowPointColor || 'rgba(255,255,255,0.9)';
			this._anictx.fillStyle = this._style && this._style.flowPointColor || 'rgba(255,255,255,0.9)';

			var item, pixel;

			for (var length = this._data.length, i = 0; length > i; i++) {

				if (void 0 !== this._data[i][1][2]) {

					item = this._data[i][1][this._data[i][2]];

					item === this._data[i][3] ? (this._data[i][2]++, this._data[i][2] > this._data[i][1].length && (this._data[i][2] = 0)) : (this._data[i][2]--, this._data[i][2] < 0 && (this._data[i][2] = this._data[i][1].length));

					if (void 0 !== item) {
						pixel = this._trafficUtil.mercatorToPixel(item, this._aniblurctx);

						// 当数据量大于等于 25 时，流动的点为 2*2 的矩形，小于 25 时流动的点是半径为 4 的圆
						25 > i ? (this._aniblurctx.moveTo(pixel.x, pixel.y), this._aniblurctx.arc(pixel.x, pixel.y, 4, 0, 2 * Math.PI)) : this._anictx.fillRect(pixel.x, pixel.y, 2, 2);
					}
				}
			}
		}
	};

	// 地图事件，控制点效果部分，地图 movestart 触发时不显示点效果，地图 moveend 触发时显示点效果 
	trafficLayer.prototype._bind = function() {
		var that = this;
		this._npMap.addEventListener('movestart',
			function() {
				that._animatePointFlag = !1
			});
		this._npMap.addEventListener('moveend',
			function() {
				that._animatePointFlag = !0
			});
		/*this._npMap.addEventListener('zoomstart',
			function() {
				that._animatePointFlag = !1
			});
		this._npMap.addEventListener('zoomend',
			function() {
				that._animatePointFlag = !0
			});*/
	};

	window.MapPlatForm.Base.TrafficLayer = trafficLayer;

})(window);