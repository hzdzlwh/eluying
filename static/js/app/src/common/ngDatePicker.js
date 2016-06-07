/**
 * Created by lingchenxuan on 16/6/6.
 */
var util = require('./util');
angular.module('ng-datepicker', [])
    .directive('datepicker', datePickerDirective);
function datePickerDirective() {
    return {
        template:
            '<div class="ng-datepicker">' +
            '<input id="ng-datepicker-input" class="ng-datepicker-input" ng-model="formatSelectedDate" ng-focus="openCalendar()" placeholder="{{placeholder}}">' +
            '<div id="ng-datepicker-calendar" class="ng-datepicker-calendar" ng-if="isCalendarOpen">' +
                '<div class="ng-datepicker-selectRow">' +
                    '<div class="ng-datepicker-select select1">' +
                        '<span ng-click="setScrollHeight(currentDate.getFullYear())">{{currentDate.getFullYear() + \'年\'}}</span>' +
                        '<div id="ng-datepicker-yearOptions" class="select1_options ng-datepicker-yearOptions">' +
                            '<div class="oitem" ng-class="{\'ng-datepicker-selectedYearMonth\': year === currentDate.getFullYear()}"' +
                                'ng-click="setYear(year);$event.stopPropagation();"' +
                                'ng-repeat="year in yearList">{{year + \'年\'}}' +
                            '</div>' +
                        '</div>'+
                    '</div>' +
                    '<div class="select1 ng-datepicker-select ng-datepicker-monthSelect">' +
                        '<span>{{currentDate.getMonth() + 1 + \'月\'}}</span>' +
                        '<div class="select1_options">' +
                            '<div class="oitem" ng-class="{\'ng-datepicker-selectedYearMonth\': month === currentDate.getMonth() + 1}"' +
                                'ng-click="setMonth(month);$event.stopPropagation();"' +
                                'ng-repeat="month in monthList">{{month + \'月\'}}' +
                            '</div>' +
                        '</div>'+
                    '</div>' +
                '</div>' +
                '<div>' +
                    '<div class="ng-datepicker-week">一</div>' +
                    '<div class="ng-datepicker-week">二</div>' +
                    '<div class="ng-datepicker-week">三</div>' +
                    '<div class="ng-datepicker-week">四</div>' +
                    '<div class="ng-datepicker-week">五</div>' +
                    '<div class="ng-datepicker-week">六</div>' +
                    '<div class="ng-datepicker-week">日</div>' +
                '</div>' +
                '<div class="ng-datepicker-date-row" ng-repeat="row in dateArray">' +
                    '<div class="ng-datepicker-day"' +
                        'ng-class="{\'ng-datepicker-otherday\': day.getMonth() !== currentDate.getMonth(), \'ng-datepicker-selected\': isSelected(day)}"' +
                        'ng-repeat="day in row"' +
                        'ng-click="selectDate(day);$event.stopPropagation();">' +
                        '{{day.getDate()}}' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '</div>',
        replace: true,
        scope: {
            selectedDate: '=',
            placeholder: '@',
            formatSelectedDate: '='
        },
        restrict: "E",
        link: function (scope, element, attrs) {
            $( document ).on( "mousedown", checkExternalClick );
            var calendarId = 'ng-datepicker-calendar';
            var inputId = 'ng-datepicker-input';
            function checkExternalClick(event) {
                if ( !scope.isCalendarOpen ) {
                    return;
                }
                var $target = $( event.target );
                if ($target[ 0 ].id !== calendarId &&
                    $target.parents( "#" + calendarId ).length === 0 &&
                    $target[ 0 ].id !== inputId) {
                    scope.isCalendarOpen = false;
                }
                scope.$apply();
            }
            scope.setScrollHeight = function(year) {
                console.log(year);
                console.log($('#ng-datepicker-yearOptions'));
                $('#ng-datepicker-yearOptions').scrollTop((year - 1900) * 17);
                console.log($('#ng-datepicker-yearOptions').scrollTop());
            };
            scope.currentDate = new Date();
            scope.yearList = getYearList();
            scope.monthList = getMonthList();
            scope.dateArray = getDateArray(scope.currentDate);
            scope.openCalendar = function() {
                scope.isCalendarOpen = true;
            };
            scope.setYear = function(year) {
                scope.currentDate.setFullYear(year);
                scope.dateArray = getDateArray(scope.currentDate);
                $(".select1_options").hide();
            };
            scope.setMonth = function(month) {
                scope.currentDate.setMonth(month - 1);
                scope.dateArray = getDateArray(scope.currentDate);
                $(".select1_options").hide();
            };
            scope.isSelected = function(day) {
                if (!scope.selectedDate) {
                    return false;
                }
                return util.isSameDay(day, scope.selectedDate);
            };
            scope.selectDate = function(date) {
                scope.selectedDate = date;
                scope.formatSelectedDate = util.dateFormat(date);
                scope.isCalendarOpen = false;
            };
            scope.formatDate = function(date) {
                return util.dateFormat(date);
            };
            scope.$watch('formatSelectedDate', function (a, b) {
                if (a !== b && /^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01])$/.test(a)) {
                    scope.currentDate = util.stringToDate(a);
                    scope.selectedDate = util.stringToDate(a);
                    scope.dateArray = getDateArray(scope.currentDate);
                }
            });
            function getYearList() {
                var i;
                var yearList = [];
                for(i = 0; i <= (new Date().getFullYear() - 1900); i ++ ) {
                    yearList.push(1900 + i);
                }
                return yearList;
            }
            function getMonthList() {
                var i;
                var monthList = [];
                for(i = 0; i < 12; i ++ ) {
                    monthList.push(i + 1);
                }
                return monthList;
            }
            function getDateArray(date) {
                var days = util.buildCalendar(date);
                var dateArray = [];
                var temp = [];
                angular.forEach(days, function(day, i) {
                    if (i % 7 === 0) {
                        temp = [];
                    }
                    temp.push(day);
                    if ((i + 1) % 7 ===0 ) {
                        dateArray.push(temp);
                    }
                });
                return dateArray;
            }
        }
    }
}