var leftMenuHtml = require('./leftMenu.html');
var dot = require('dot');
var leftMenu = {
    showLeftMenu: function() {
        var pathArray = window.location.pathname.split("/");
        var menuParent = pathArray[2];
        var menu = pathArray[4].split(".")[0];
        var templ = dot.template(leftMenuHtml);
        var data = {
            arrayParent:[{menuName: 'business', pathUrl: '/view/business/category/room.html', name: '业务设置'},
                         {menuName: 'salesite', pathUrl: '/view/salesite/operation/operation.html', name: '直销网站设置'},
                         {menuName: 'codesite', pathUrl: '/view/codesite/operation/codeOperation.html', name: '一码通网站设置'},
                         {menuName: 'setting', pathUrl: '/view/setting/method/method.html', name: '收款设置'},
                         {menuName: 'guest', pathUrl: '/view/guest/source/source.html', name: '客源设置'},
                          {menuName: 'linesite', pathUrl: '/view/linesite/operation/lineOperation.html', name: '排队网站设置'}
                        ],
            arraySub:[{subMenuName: 'business', subArray: [{menuName: 'room', pathUrl: '/view/business/category/room.html', name: '住宿'},
                                                           {menuName: 'restaurant', pathUrl: '/view/business/restaurant/restaurant.html', name: '餐饮'},
                                                           {menuName: 'entertainment', pathUrl: '/view/business/category/entertainment.html', name: '娱乐'},
                                                           {menuName: 'shop', pathUrl: '/view/business/category/shop.html', name: '商超'}
                                                          ]
                      },

                      {subMenuName: 'salesite', subArray: [{menuName: 'operation', pathUrl: '/view/salesite/operation/operation.html', name: '网站运营'},
                                                           {menuName: 'info', pathUrl: '/view/salesite/info/info.html', name: '基本信息'}
                                                          ]
                      },

                      {subMenuName: 'codesite', subArray: [{menuName: 'codeOperation', pathUrl: '/view/codesite/operation/codeOperation.html', name: '网站运营'}]
                      },

                      {subMenuName: 'setting', subArray: [{menuName: 'method', pathUrl: '/view/setting/method/method.html', name: '收款方式'}]
                      },

                      {subMenuName: 'guest', subArray: [{menuName: 'source', pathUrl: '/view/guest/source/source.html', name: '客源列表'}]
                      },

                       {subMenuName: 'linesite', subArray: [{menuName: 'lineOperation', pathUrl: '/view/linesite/operation/lineOperation.html', name: '网站运营'}]
                       }
                     ]
        };
        $('.header').after(templ(data));
        $('#'+ menu +'Menu').addClass('active');
        $('#'+ menuParent +'ParentMenu').addClass('active');
        $('#'+ menuParent +'Menu').css('display','block').siblings().css('display','none');
    }
};
module.exports = leftMenu;