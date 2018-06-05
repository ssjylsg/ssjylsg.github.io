define(['jquery'], function($) {    
    var headItems = [{
        url: 'home.html',
        name: '首页'
    }, {
        url: 'guide.html',
        name: '入门指导'
    }, {
        url: '/document/index.html',
        name: '类参考',
        target: '_blank'
    }];
    return {
        init: function() {
            $.each(headItems, function(i, item) {
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.href = item.url;
                a.url = item.url;
                if (item.target) {
                    a.target = item.target;
                }

                $(a).html(item.name).addClass(window.location.pathname.toLocaleLowerCase().indexOf(item.url.toLocaleLowerCase()) != -1 ? "nav-item-hover" : 'nav-item');
                $(li).append(a).appendTo($('.top-nav'));
            })
        }
    }
})