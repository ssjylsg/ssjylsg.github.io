define(['jquery','ztree'], function($) {
    var zNodes1 = [
        [{
            id: 10,
            pId: 0,
            name: "\u5730\u56fe\u57fa\u672c\u529f\u80fd",
            open: true
        }, {
            id: 1001,
            pId: 10,
            name: "● \u5730\u56fe\u914d\u7f6e\u7c7b",
            file: "demos/bigData/mapConfig.html"
        }, {
            id: 1002,
            pId: 10,
            name: "● \u5730\u56fe\u5de5\u5177\u7c7b",
            file: "demos/bigData/mapTool.html"
        }, {
            id: 1001,
            pId: 10,
            name: "● \u51e0\u4f55\u5bf9\u8c61\u64cd\u4f5c\u7c7b",
            file: "demos/bigData/mapGeometry.html"
        }, {
            id: 1001,
            pId: 10,
            name: "● \u5730\u56fe\u6807\u6ce8\u7c7b",
            file: "demos/bigData/mapTag.html"
        }, {
            id: 1001,
            pId: 10,
            name: "● \u56fe\u7247\u5730\u56fe",
            file: "demos/other/ImageLayer.html"
        }, {
            id: 1001,
            pId: 10,
            name: "\u25cf\u0020\u70ed\u529b\u56fe",
            file: "demos/other/HeatMapLayer.html"
        }],
        [{
            id: 17,
            pId: 0,
            name: "\u5927\u6570\u636e\u7efc\u5408\u5c55\u793a",
            open: false
        }, {
            id: 1706,
            pId: 17,
            name: "\u25cf\u0020\u9014\u7ecf\u70b9\u62d6\u62fd",
            file: "demos/bigData/routePlanControl.html"
        }, {
            id: 1707,
            pId: 17,
            name: "\u25cf\u0020\u6c14\u6ce1",
            file: "demos/bigData/Bubble.html"
        }, {
            id: 1707,
            pId: 17,
            name: "\u25cf\u0020\u52a8\u6001\u6570\u636e",
            file: "demos/bigData/mapGeometryAnim.html"
        }, {
            id: 1708,
            pId: 17,
            name: "\u25cf\u0020\u52a8\u6001\u66f2\u7ebf\u6570\u636e",
            file: "demos/bigData/mapGeometryAnimcurve.html"
        }, {
            id: 1710,
            pId: 17,
            name: "\u25cf\u0020\u516c\u4ea4\u52a8\u6001\u6570\u636e",
            file: "demos/bigData/mapGeometryAnim_busLine.html"
        }, {
            id: 1711,
            pId: 17,
            name: "\u25cf\u0020\u95ea\u70c1\u70b9\u6570\u636e",
            file: "demos/bigData/mapStars.html"
        }, {
            id: 1715,
            pId: 17,
            name: "\u25cf\u0020\u6d77\u91cf\u6807\u6ce8",
            file: "demos/bigData/MapMultiMarkers.html"
        }, {
            id: 1712,
            pId: 17,
            name: "\u25cf\u0020\u5927\u6570\u636e\u6d41\u5411\u5c55\u793a",
            file: "demos/bigData/mapLineAnim.html"
        }, {
            id: 1713,
            pId: 17,
            name: "\u25cf\u0020\u4eba\u6d41\u004f\u0044\u5206\u6790",
            file: "demos/bigData/jiaotong.html"
        }, {
            id: 1714,
            pId: 17,
            name: "\u25cf\u0020\u8f66\u6d41\u004f\u0044\u5206\u6790",
            file: "demos/bigData/jiaotong2.html"
        }, {
            id: 1713,
            pId: 17,
            name: "\u25cf\u0020\u591a\u70b9\u6cbf\u7ebf\u8fd0\u52a8",
            file: "demos/bigData/MorePointsRunLine.html"
        }, {
            id: 1714,
            pId: 17,
            name: "\u25cf\u0020\u5355\u70b9\u6cbf\u7ebf\u8fd0\u52a8",
            file: "demos/bigData/SiglePointRunLine.html"
        }, {
            id: 1714,
            pId: 17,
            name: "\u25cf\u0020\u70b9\u4f4d\u805a\u5408",
            file: "demos/bigData/ClusterPoints.html"
        }],
        [{
            id: 18,
            pId: 0,
            name: "\u98ce\u683c\u5316\u5730\u56fe"
        }, {
            id: 1800,
            pId: 18,
            name: "\u25cf\u0020\u7ea2\u8272\u8b66\u6212",
            file: "demos/mapStyles/index.html?style=redalert"
        }, {
            id: 1800,
            pId: 18,
            name: "\u25cf\u0020\u9ed1\u8272\u98ce\u683c",
            file: "demos/mapStyles/index.html?style=dark"
        }, {
            id: 1800,
            pId: 18,
            name: "\u25cf\u0020\u5348\u591c\u84dd",
            file: "demos/mapStyles/index.html?style=midnight"
        }]
    ];

    var setting = {
        view: {
            dblClickExpand: false,
            showIcon: false,
            selectedMulti: false,
            nameIsHTML: true,
            expandSpeed: "",
            open: false
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: ""
            }
        },
        callback: {
            beforeClick: function(treeId, treeNode) {
                $(".ztree a").css("color", "#000000");
                $(".ztree a").css("opacity", "1");
                $(".ztree a").css("font-weight", "normal");
                var zTree = $.fn.zTree.getZTreeObj(treeId);
                if (treeNode.isParent) {
                    zTree.expandNode(treeNode);
                    var id = treeId + "_1_a";
                    $("#" + id).css("color", "#f6795b");
                    $("#" + id).css("font-weight", "bold");
                    return false;
                } else {
                    $("#demoIframe").attr("src", treeNode.file);
                    var parentId = treeNode.parentTId + "_a";
                    $("#" + parentId).css("color", "#f6795b");
                    $("#" + parentId).css("font-weight", "bold");
                    var id = treeNode.tId + "_a";
                    $("#" + id).css("color", "#f6795b");
                    window.location.hash = treeNode.file;
                    return true;
                }
            }
        }
    };

    return {
        init: function() {
            $("#demoTree").html('');
            for (var i = 0; i < zNodes1.length; i++) {
                var tree = window.document.createElement('ul');
                tree.id = "ztree" + i;
                $(tree).addClass('ztree');
                $("#demoTree").append($(tree));
                $.fn.zTree.init($(tree), setting, zNodes1[i]);
            }
            if (window.location.href.split('#').length == 2) {
                var url = window.location.href.split('#')[1];
                for (var i = 0; i < zNodes1.length; i++) {
                    var treeObj = $.fn.zTree.getZTreeObj("ztree" + i);

                    var firstLef = treeObj.getNodeByParam("file", url);
                    if (firstLef) {
                        treeObj.selectNode(firstLef);
                        $("#demoIframe").attr("src", firstLef.file);
                        break;
                    } else {
                        treeObj.expandAll(false);
                    }

                }
            } else {
                var treeObj = $.fn.zTree.getZTreeObj("ztree0");
                var firstLef = treeObj.getNodes()[0].children[0];
                if (firstLef) {
                    treeObj.selectNode(firstLef);
                    $("#demoIframe").attr("src", firstLef.file);
                }
            }
        }
    }
})