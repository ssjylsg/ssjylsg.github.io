define([], function() {
	return {
		"mapOpts": {
			"minZoom": 5,
			"defaultZoom": 10,
			"maxZoom": 22,
			"projection": "EPSG:900913",
			"displayProjection": "EPSG:4326"
		},
		"vectorLayer": [{
			"layerName": "shanghaiBaseMap1",
			"layerType": "NPMapLib.Layers.GaoDeLayer",
			"layerOpt": {
				"url": ["https://webrd01.is.autonavi.com/appmaptile??lang=zh_cn&size=1&scale=1&style=7", "https://webrd02.is.autonavi.com/appmaptile??lang=zh_cn&size=1&scale=1&style=7", "https://webrd03.is.autonavi.com/appmaptile??lang=zh_cn&size=1&scale=1&style=7", "https://webrd04.is.autonavi.com/appmaptile??lang=zh_cn&size=1&scale=1&style=7"],
				"centerPoint": [121.49767733771598, 31.185658170907182],
				"isBaseLayer": true,
				"isVectorLayer": true
			}
		}],
		"sattilateLayer": []
	};
})