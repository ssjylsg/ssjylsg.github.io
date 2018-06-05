require.config({　　
	paths: {
		"jquery": "https://cdn.bootcss.com/jquery/3.3.1/jquery.min",
		'bootstrap': 'https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min',
		"map2d": "../map/map2d/js/Init",
		"mapConfig": '../map/map2d/js/mapConfig.json',
		"mapbox": 'https://cdn.bootcss.com/mapbox-gl/0.45.0/mapbox-gl',
		"webpack-cesium": 'https://cdn.bootcss.com/webpack-cesium/1.37.0/webpack.cesium',
		'layerui': 'layui/layui.all',
		'ztree': 'https://cdn.bootcss.com/zTree.v3/3.5.33/js/jquery.ztree.core.min',
		'head': 'head',
		'demotree': 'demotree',
		'bootstrap-dialog': 'https://cdn.bootcss.com/bootstrap3-dialog/1.35.4/js/bootstrap-dialog.min',
		'noModel': 'noModel',
		'jquery.mCustomScrollbar': 'lib/jquery.mCustomScrollbar',
		'jquery.mousewheel.min': 'lib/jquery.mousewheel.min',
		'jquery-ui': 'https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min',

	},
	shim: {
		"ztree": {
			deps: ['jquery']
		},
		'bootstrap-dialog': {
			deps: ['bootstrap']
		},
		'bootstrap': {
			deps: ['jquery','css!https://cdn.bootcss.com/bootstrap3-dialog/1.35.4/css/bootstrap-dialog.min.css'
			]
		},
		'jquery-ui': {
			deps: ['jquery']
		},
		'noModel': {
			deps: ['jquery', 'jquery-ui','jquery.mCustomScrollbar', 'jquery.mousewheel.min','css!lib/jquery.mCustomScrollbar.min.css']
		},
		'jquery.mCustomScrollbar': {
			deps: ['jquery']
		},
		'jquery.mousewheel.min': {
			deps: ['jquery']
		}
	}
});