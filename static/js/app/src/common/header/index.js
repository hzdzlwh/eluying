var logout = require('logout');
var util = require('util');
import http from 'http';
var networkAction = require('networkAction');
var modal = require('modal');
var headerHtml = require('./header.html');
var dot = require('dot');
var auth = require('../auth');
var header = {
    render: function() {
        var that = this;
        var data = {
            campName: localStorage.getItem('campName'),
            avatar: localStorage.getItem('avatar')
        };
        var temp = dot.template(headerHtml);
        $('body').prepend(temp(data));
        // 根据path激活active
        $('.userName').find('span').html(localStorage.getItem('userName'));
        var pathArray = window.location.pathname.split('/');
        var entry = pathArray[2];
        $('[data-entry=' + entry + ']').addClass('selected');
        util.bindDomAction(this.events);
        http.get('/user/getPersonalInfoInNetwork', {})
            .then( function(data) {
                localStorage.setItem('camps', JSON.stringify(data.data.camps));
                var campId = localStorage.getItem('campId');
                if (data.code === 1) {
                    var result = data.data.camps;
                    var key = '';
                    var flag = false;
                    var object = {
                        created: '',
                        joined: ''
                    };
                    for (var i = 0; i < result.length; i ++) {
                        var item = result[i];
                        if (item.userType === 1) {
                            key = 'created';
                        } else {
                            key = 'joined';
                        }
                        if (item.campId === campId) {
                            flag = true;
                        } else {
                            flag = false;
                        }
                        object[key] += that.getItemHtml(item, flag);
                    }
                    if (object.created) {
                        object.created = '<dt>我创建的</dt>' + object.created + '<hr>';
                    }
                    if (object.joined) {
                        object.joined = '<dt>我加入的</dt>' + object.joined + '<hr>';
                    }
                }
                $('#headerSwitchCamp .network-list').html(object.created + object.joined);
                $('#headerSwitchCamp .networkButton').click(function() {
                    var campId = $(this).attr('data-campId');
                    var campName = $(this).attr('data-campName');
                    http.get('/homepage/changeCamp', { campId: campId })
                        .then(function(data) {
                            localStorage.setItem('campId', campId);
                            localStorage.setItem('campName', campName);
                            auth.saveUserInfo(data.data);
                            window.location.href = '/view/accommodation/calender/calender.html';
                        });
                });
            });
    },
    events: {
        'click #logout': function(e) {
            e.stopPropagation();
            logout.logout();
        },
        'click .userName': function(e) {
            e.stopPropagation();
            $(this).addClass('userName-active');
            $('.logout').toggle();
        },
        'click body': function() {
            var headerSwitchCamp = $('#headerSwitchCamp');
            var logout = $('.logout');
            $('.userName').removeClass('userName-active');
            if (headerSwitchCamp.css('display') === 'block') {
                headerSwitchCamp.slideUp('normal', function() {
                    $('.headerSwitch').removeClass('switchCampActive');
                });
            }
            if (logout.css('display') === 'block') {
                logout.hide();
            }
        },
        'click #headerJoinNewNetwork': function() {
            networkAction.init('joinStep1', {}).modal('show');
        },
        'click #headerCreateNetwork': function() {
            networkAction.init('create', {}).modal('show');
        },
        // 网络信息显示事件
        'click .avatorContainer': function(e) {
            e.stopPropagation();
            if ($('#headerSwitchCamp').css('display') === 'none') {
                $('#headerSwitchCamp').slideDown();
                $('.headerSwitch').addClass('switchCampActive');
            } else if ($('#headerSwitchCamp').css('display') === 'block') {
                $('#headerSwitchCamp').slideUp('normal', function() {
                    $('.headerSwitch').removeClass('switchCampActive');
                });
            }
        }
    },
    getItemHtml: function(item, flag) {
        var className = 'networkButton';
        if (flag) {
            className += ' on';
        } else {
            className += '';
        }
        return '<dd class=\'' + className + '\' data-campId=\'' + item.campId + '\' data-campName=\'' + item.campName + '\'>' + item.campName + '</dd>';
    }
};

module.exports = header;
