var md5 = require("md5");
var util = {
    mainContainer: function() {
        var width = document.body.clientWidth - 220;
        if (width < 980) {
            width = 980;
        }
        $(".mainContainer").css("width", width);
    },

    bindDomAction: function(events) {
        var eventDef, eventsInfoArray;
        for (eventDef in events) {
            if (events.hasOwnProperty(eventDef)) {
                if (events[eventDef]) {
                    eventsInfoArray = eventDef.split(" ");
                    if (eventsInfoArray.length == 3) {
                        $(eventsInfoArray[1]).on(eventsInfoArray[0], eventsInfoArray[2], events[eventDef]);
                    } else if (eventsInfoArray.length == 2) {
                        $(eventsInfoArray[1]).on(eventsInfoArray[0], events[eventDef]);
                        if (eventsInfoArray[1] == "window") {
                            $(window).on(eventsInfoArray[0], events[eventDef]);
                        }
                    } else {
                        console.warn("事件绑定格式错误");
                    }
                }
            }
        }
    },

    errorHandler: function(result, msg) {
        var modal = require("modal");
        if (result.code != 1) {
            modal.warn(result.msg);
            return false;
        } else {
            if (msg) {
                modal.warn(msg)
            } else {
                modal.success("操作成功");
            }
            return true;
        }
    },

    dateFormat: function(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
    },
    dateFormatLong: function(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? '0' + h : h;
        let M = date.getMinutes();
        M = M < 10 ? '0' + M : M;
        let s = date.getSeconds();
        s = s < 10 ? '0' + s : s;
        return y + '-' + m + '-' + d + ' ' + h + ':' + M + ':' + s;
    },
    getHAndMs(val) {
        const h = parseInt(val);
        const m = val - h;
        if (m) {
            return `${h}小时${parseInt(m * 60)}分钟`;
        }
        return `${h}小时`;
    },
    timeFormat: function(dateArg) {
        let date = new Date(dateArg);
        let m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? '0' + h : h;
        let M = date.getMinutes();
        M = M < 10 ? '0' + M : M;
        return m + '-' + d + ' ' + h + ':' + M;
    },

    tomorrow: function(date) {
        var d = date.getDate();
        return new Date(date.setDate(d + 1));
    },

    prevWeek: function() {
        var currentDate = $("#datePicker").datepicker("getDate");
        $("#datePicker").datepicker("setDate", new Date(currentDate.setDate(currentDate.getDate() - 7)));
        $("#datePicker").trigger("dateChange");
    },

    nextWeek: function() {
        var currentDate = $("#datePicker").datepicker("getDate");
        $("#datePicker").datepicker("setDate", new Date(currentDate.setDate(currentDate.getDate() + 7)));
        $("#datePicker").trigger("dateChange");
    },

    getWeek: function(d) {
        var week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        return week[d.getDay()];
    },

    getFirstDay: function(date) {
        return new Date(date.setDate(1));
    },

    getLastDay: function(firstDate) {
        var endDate = new Date(firstDate);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);
        return endDate;
    },

    //“yyyy-MM-dd” 转换成日期型
    stringToDate: function(string) {
        var array = string.split("-");
        var date = new Date();
        date.setUTCFullYear(array[0], array[1] - 1, array[2]);
        date.setUTCHours(0, 0, 0, 0);
        return date;
    },

    // 将日期增加diff天
    diffDate: function(date, diff) {
        return new Date(date.valueOf() + diff * 24 * 60 * 60 * 1000);
    },

    // 计算日期相差天数
    DateDiff: function(date1, date2) {
        const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
        const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
        return Math.ceil((d2.valueOf() - d1.valueOf()) / 24 / 60 / 60 / 1000);
    },

    compareDates: function(date1, date2) {
        if (typeof date1 === 'string') {
            date1 = this.stringToDate(date1);
        }
        if (typeof date2 === 'string') {
            date2 = this.stringToDate(date2);
        }
        //return date1.getFullYear() > date2.getFullYear() || (date1.getFullYear() == date2.getFullYear()
        //    && date1.getMonth() > date2.getMonth()) || (date1.getFullYear() == date2.getFullYear()
        //    && date1.getMonth() == date2.getMonth() && date1.getDate() >= date2.getDate())
        return date1 > date2;
    },

    isSameDay: function(date1, date2) {
        return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate();
    },

    dateFormatWithoutYear: function(date) {
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return m + '-' + d;
    },

    dateFormatWithoutYearCn: function(dateStr) {
        var m = parseInt(dateStr.split('-')[0]);
        var d = parseInt(dateStr.split('-')[1]);
        return m + '月' + d + '日';
    },

    buildCalendar: function(date) {
        var selectedMonth = null;
        var calenderDays = [];
        var firstDay = new Date(date);
        firstDay.setDate(1);
        var firstDay_Month = firstDay.getMonth();
        var firstDay_weekday = firstDay.getDay();
        if (selectedMonth && firstDay_Month !== selectedMonth) {
            firstDay.setMonth(selectedMonth);
        }
        if (firstDay_weekday === 0) {
            for (var i = 6; i > 0; i--) {
                calenderDays.push(util.diffDate(firstDay, -i));
            }
        } else {
            for (var i = firstDay_weekday - 1; i > 0; i--) {
                calenderDays.push(util.diffDate(firstDay, -i));
            }
        }
        calenderDays.push(firstDay);
        var temp = util.diffDate(firstDay, 1);
        while (temp.getMonth() === firstDay_Month || calenderDays.length % 7 !== 0) {
            calenderDays.push(temp);
            temp = util.diffDate(temp, 1);
        }
        return calenderDays;
    },

    centroidDiv: function(dom, pdom) {
        var cw = $(dom).width();
        var pw = $(pdom).width();
        $(dom).css({
            position: "relative",
            left: (pw - cw) / 2
        });
    },

    checkExplorer: function() {
        var flag = true;
        if (navigator.userAgent.indexOf("MSIE") > 0) {
            if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                flag = true;
            }
            if (navigator.userAgent.indexOf("MSIE 7.0") > 0) {
                flag = true;
            }
            if (navigator.userAgent.indexOf("MSIE 8.0") > 0) {
                flag = true;
            }
            if (navigator.userAgent.indexOf("MSIE 9.0") > 0) {
                flag = false;
            }
        } else {
            flag = false;
        }
        if (flag) {
            window.location.href = "/view/tips/tips.html";
        }
    },

    checkModuleAuth: function(id) {
        var bottom = localStorage.getItem("bottom");
        bottom = JSON.parse(bottom);
        var flag = true;
        for (var i = 0; i < bottom.length; i++) {
            if (bottom[i].type === id) {
                flag = false;
            }
            if (bottom[i].type === id && bottom[i].status === 0) {
                window.location.href = '/view/tips/noauth.html';
            }
        }
        if (flag) {
            window.location.href = '/view/tips/noauth.html';
        }
    },
    getSign: function() {
        var data = {};
        data.timestamp = (new Date()).valueOf();
        // data.version = (new Date()).valueOf();
        data.campId = localStorage.getItem("campId");
        data.uid = localStorage.getItem("uid");
        //data.campId = 56;
        //data.uid = 85;
        // data.kick = true;
        data.terminal = 1;
        data.version = data.version || 10;
        // data.token = localStorage.getItem("token");
        var array = [];
        for (var key in data) {
            array.push(data[key]);
        }
        array.push(localStorage.getItem("token"));
        array.sort();
        var str = array.join("");
        return md5(str);
    },

    objLen: function(obj) {
        var num = 0;
        for (var key in obj) {
            num++;
        }
        return num;
    },

    leftHeaderAdjustLineHeight: function() {
        var cHeight = $(".calendor-container").height();
        var cScrollTop = $(".calendor-container").scrollTop();
        var cScrollHeight = cScrollTop + cHeight;
        $(".category-item").each(function(i, d) {
            var height = $(d).height();
            var top = $(d).position().top;
            var scrollHeight = height + top;
            if (top > cScrollHeight || cScrollTop > scrollHeight) {
                $(d).find('.category-name span').css({
                    'top': '50%'
                });
            } else {
                var result;
                if (top >= cScrollTop && top < cScrollHeight) {
                    if ((height - (scrollHeight - cScrollHeight)) < 40) {
                        result = 50;
                    } else {
                        result = (height - (scrollHeight - cScrollHeight)) / height * 100 / 2;
                    }
                }
                if (cScrollTop > top && scrollHeight >= cScrollHeight) {
                    result = (2 * (cScrollTop - top) + cHeight) / height * 100 / 2;
                }
                if (top >= cScrollTop && scrollHeight < cScrollHeight) {
                    result = 50;
                }
                if (top < cScrollTop && scrollHeight < cScrollHeight) {
                    result = (2 * height - (scrollHeight - cScrollTop)) / height * 100 / 2;
                }
                $(d).find('.category-name span').css({
                    'top': result + '%'
                });
            }
        });
    },

    countTags: function(node) {
        var node = node ? node : window.document;
        var nums = 0;
        if (node.nodeType == 1) {
            nums++;
        }
        for (var i = 0, l = node.childNodes.length; i < l; i++) {
            nums += this.countTags(node.childNodes[i]);
        }
        return nums;
    },
    copyText: function(ele) {
        function otherEle(element) {
            if (document.selection) {
                var range = document.body.createTextRange();
                range.moveToElementText(element);
                range.select();
            } else {
                window.getSelection().removeAllRanges();
                var range = document.createRange();
                range.selectNode(element);
                window.getSelection().addRange(range);
            }
        }
        if (ele.select) {
            ele.select();
        } else {
            otherEle(ele);
        }
        document.execCommand('Copy');
        window.getSelection().removeAllRanges();
    },
    getDateBetween(startDate, endDate) {
        const days = this.DateDiff(startDate, endDate) + 1;
        const dates = [];
        for (let i = 0; i < days; i++) {
            dates.push(this.diffDate(startDate, i));
        }
        return dates;
    },
    /*
* 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
* @param fn {function}  要调用的函数
* @param delay   {number}    空闲时间
* @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
* @return {function}实际调用函数
*/
    debounce(fn, delay, immediate, debounce = true) {
        let curr = +new Date(), //当前时间
            last_call = 0,
            last_exec = 0,
            timer = null,
            diff, //时间差
            context, //上下文
            args,
            exec = function() {
                last_exec = curr;
                fn.apply(context, args);
            };
        return function() {
            curr = +new Date();
            context = this,
                args = arguments,
                diff = curr - (debounce ? last_call : last_exec) - delay;
            clearTimeout(timer);
            if (debounce) {
                if (immediate) {
                    timer = setTimeout(exec, delay);
                } else if (diff >= 0) {
                    exec();
                }
            } else {
                if (diff >= 0) {
                    exec();
                } else if (immediate) {
                    timer = setTimeout(exec, -diff);
                }
            }
            last_call = curr;
        }
    } //默认为debounce模式，传false时为throttle模式
};
module.exports = util;
