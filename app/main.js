require.config({　
	　
	paths: {　　　　　　
		"jquery": "https://cdn.bootcss.com/jquery/3.3.1/jquery.min",
		"map2d": "../map/map2d/js/Init",
		"mapConfig":'../map/map2d/js/mapConfig.json',
		 
	},
	shim:{
		"dialog":{
			deps: ['jquery'],
			exports: 'dialog'
		}
	}
});