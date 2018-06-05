var
    pi = 3.14159265358979324,
    ee = 0.00669342162296594323,
    x_pi = 3.14159265358979324 * 3000.0 / 180.0,
    pole = 20037508.34,
    a = 6378245.0;
var CoordinateHelper = {
    // 经纬度-> 墨卡托投影转换
    degreeToWebMoctor: function(lon, lat) {
        var c = {
                lon: 0,
                lat: 0
            },
            tmp;

        lon = parseFloat(lon);
        lat = parseFloat(lat);
        c.lon = (lon / 180.0) * 20037508.34;
        if (lat > 85.05112) {
            lat = 85.05112;
        }
        if (lat < -85.05112) {
            lat = -85.05112;
        }
        lat = (Math.PI / 180.0) * lat;
        tmp = Math.PI / 4.0 + lat / 2.0;
        c.lat = 20037508.34 * Math.log(Math.tan(tmp)) / Math.PI;
        return c;
    },

    // 墨卡托投影转换-》经纬度
    webMoctorToDegree: function(lon, lat) {
        lon = 180 * lon / pole;
        lat = 180 / Math.PI * (2 * Math.atan(Math.exp((lat / pole) * Math.PI)) - Math.PI / 2);
        return {
            lon: lon,
            lat: lat
        };
    },
    // 火星->84
    gcjTowgs84: function(lon, lat) {
        var p = {
                lon: 0,
                lat: 0
            },
            lontitude = lon - (CoordinateHelper.wgs84ToGcj(lon, lat).lon - lon),
            latitude = lat - (CoordinateHelper.wgs84ToGcj(lon, lat).lat - lat);

        p.lon = lontitude;
        p.lat = latitude;
        return p;
    },

    // 火星坐标转百度坐标
    encryptToBd: function(gg_lon, gg_lat) {
        var x = gg_lon,
            y = gg_lat,
            z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi),
            theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi),
            bd_lon = z * Math.cos(theta) + 0.0065,
            bd_lat = z * Math.sin(theta) + 0.006;

        return {
            lon: bd_lon,
            lat: bd_lat
        };
    },

    // 百度坐标转火星坐标
    bdTodecrypt: function(bd_lon, bd_lat) {
        var x = bd_lon - 0.0065,
            y = bd_lat - 0.006,
            z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi),
            theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi),
            gg_lon = z * Math.cos(theta),
            gg_lat = z * Math.sin(theta);

        return {
            lon: gg_lon,
            lat: gg_lat
        };
    },

    // 84->火星
    wgs84ToGcj: function(lon, lat) {
        var localHashMap = {},
            dLat,
            dLon,
            radLat,
            magic,
            sqrtMagic,
            mgLat,
            mgLon;

        lon = parseFloat(lon);
        lat = parseFloat(lat);
        if (this.outofChina(lat, lon)) {
            localHashMap.lon = lon;
            localHashMap.lat = lat;
            return localHashMap;
        }
        dLat = CoordinateHelper.transformLat(lon - 105.0, lat - 35.0);
        dLon = CoordinateHelper.transformLon(lon - 105.0, lat - 35.0);
        radLat = lat / 180.0 * pi;
        magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
        mgLat = lat + dLat;
        mgLon = lon + dLon;
        localHashMap.lon = mgLon;
        localHashMap.lat = mgLat;

        return localHashMap;
    },

    outofChina: function(lat, lon) {
        if (lon < 72.004 || lon > 137.8347)
            return true;
        if (lat < 0.8293 || lat > 55.8271)
            return true;
        return false;
    },

    transformLat: function(x, y) {
        var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
        return ret;
    },

    transformLon: function(x, y) {
        var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
        return ret;
    }
};