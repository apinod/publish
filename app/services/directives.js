(function () {
    'use strict';
    var app = angular.module('app');
    //------------------------------------------------------------------------------------------------------
    //Angular Directive             : ngEnter 
    //Usage                         : Angular Keyboard Event handler to capture ENTER key over DOM element 
    //HTML Markup Element attribute : ng-enter 
    //------------------------------------------------------------------------------------------------------
    app.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });

    //------------------------------------------------------------------------------------------------------
    //Angular Directive             : ngEsc 
    //Usage                         : Angular Keyboard Event handler to capture ESC key over DOM element 
    //HTML Markup Element attribute : ng-esc
    //------------------------------------------------------------------------------------------------------
    app.directive('ngEsc', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 27) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEsc);
                    });
                    event.preventDefault();
                }
            });
        };
    });

    //JRB 12-29-2013
    //------------------------------------------------------------------------------------------------------
    //Angular Directive             : pabCurrencyInput 
    //Usage                         : INPUT fields Currency formatter
    //HTML Markup Element attribute : pab-currency-input
    //Requiered Service             : Angular $filter service
    //------------------------------------------------------------------------------------------------------
    app.directive('pabCurrencyInput', function ($filter) {
        var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;
        var CURRENCY_REGEXP = /,/g;
        function isUndefined(value) {
            return typeof value == 'undefined';
        }
        function isEmpty(value) {
            return isUndefined(value) || value === '' || value === null || value !== value;
        }

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, el, attr, ctrl) {

                function round(num) {
                    return Math.round(num * 100) / 100;
                }

                function formatValueAsCurrency(value, replaceblankvalue) {
                    var currencyzerovalue = replaceblankvalue ? '$0.00' : '';
                    var retval = isEmpty(value) ? currencyzerovalue : '$' + round(value).toFixed(2).toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(",");
                    return retval;
                }

                var min = parseFloat(attr.min) || 0;

                // Returning NaN so that the formatter won't render invalid chars
                ctrl.$parsers.push(function (value) {
                    // Handle leading decimal point, like ".5"
                    if (value === '.') {
                        ctrl.$setValidity('number', true);
                        return 0;
                    }

                    // Allow "-" inputs only when min < 0
                    if (value === '-') {
                        ctrl.$setValidity('number', false);
                        return (min < 0) ? -0 : NaN;
                    }
                    var empty = isEmpty(value);
                    if (empty || NUMBER_REGEXP.test(value)) {
                        ctrl.$setValidity('number', true);
                        return value === '' ? null : (empty ? value : parseFloat(value));
                    } else {
                        ctrl.$setValidity('number', false);
                        return NaN;
                    }
                });
                ctrl.$formatters.push(function (value) {
                    return isEmpty(value) ? '' : '' + value;
                });

                var minValidator = function (value) {
                    if (!isEmpty(value) && value < min) {
                        ctrl.$setValidity('min', false);
                        return undefined;
                    } else {
                        ctrl.$setValidity('min', true);
                        return value;
                    }
                };

                ctrl.$parsers.push(minValidator);
                ctrl.$formatters.push(minValidator);

                if (attr.max) {
                    var max = parseFloat(attr.max);
                    var maxValidator = function (value) {
                        if (!isEmpty(value) && value > max) {
                            ctrl.$setValidity('max', false);
                            return undefined;
                        } else {
                            ctrl.$setValidity('max', true);
                            return value;
                        }
                    };

                    ctrl.$parsers.push(maxValidator);
                    ctrl.$formatters.push(maxValidator);
                }

                // Round off to 2 decimal places
                ctrl.$parsers.push(function (value) {
                    return value ? round(value) : value;
                });
                //JRB 04/12/2014: (Dropbox doc: Issues reviewed on Meeting from 04-09-2014.docx)
                //PAYOR ISSUES Section
                //1.When you try to change the dollar amount in the Transaction Edition screen. 
                //The dollar amount does not come in properly.
                ctrl.$formatters.push(function (value) {
                    if (value) {
                        return formatValueAsCurrency(value, true)
                    }
                    else
                    {
                        return value;
                    }
                });
                el.bind('blur', function () {
                    ctrl.$viewValue = formatValueAsCurrency(ctrl.$modelValue, true);
                    ctrl.$render();
                });
            }
        };
    });

    //------------------------------------------------------------------------------------------------------
    //Angular Directive             : aNgClick
    //Usage                         : CHECK BOX fields Click event handler 
    //HTML Markup Element attribute : a-ng-click
    //Requiered Service             : Angular $parse service
    //------------------------------------------------------------------------------------------------------
    app.directive("aNgClick", function ($parse) {
        return {
            restrict: 'A',
            compile: function ($element, attr) {
                var fn;
                fn = $parse(attr['aNgClick']);
                return function (scope, element, attr) {
                    return element.on('click', function (event) {
                        return scope.$apply(function () {
                            return fn(scope, {
                                $event: event
                            });
                        });
                    });
                };
            }
        };
    });

    //YCR 04/23/2014
    app.directive('ngRightClick', function ($parse) {
        return function (scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function (event) {
                scope.$apply(function () {
                    event.preventDefault();
                    fn(scope, { $event: event });
                });
            });
        };
    });

    //JRB 04/12/2014
    app.directive('ngFocused', function ($timeout, $parse) {
        return {
            link: function (scope, element, attrs) {
                var model = $parse(attrs.ngFocused);
                scope.$watch(model, function (value) {
                    if (value === true) {
                        $timeout(function () {
                            element[0].focus();
                        });
                    }
                });
            }
        };
    });

    //JRB 04/26/2014
    app.directive('payRepeat', function ($compile) {
        return {
            //High priority means it will execute first
            priority: 5000,
            //Terminal prevents compilation of any other directive on first pass
            terminal: true,
            compile: function (element, attrs) {
                //Add ng-repeat to the dom
                attrs.$set('ngRepeat', attrs.payRepeat);
                //but skip directives with priority 5000 or above to avoid infinite 
                //recursion (we don't want to compile ourselves again)
                var compiled = $compile(element, null, 5000);
                return function (scope) {
                    //When linking just delegate to the link function returned by the new 
                    //compile
                    compiled(scope);
                }
            }
        }
    });

    //YCR 04/30/2014
    app.directive('cellHighlight', function () {
        return {
            restrict: 'C',
            link: function postLink(scope, iElement, iAttrs) {
                iElement.find('td')
                  .mouseover(function () {
                      $(this).parent('tr').css('opacity', '0.7');
                  }).mouseout(function () {
                      $(this).parent('tr').css('opacity', '1.0');
                  });
            }
        };
    });

    //Menu Right-click
    app.directive('context', [function () {
        return {
          
            scope: '@&',
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    post: function postLink(scope, iElement, iAttrs, controller) {
                        var ul = $('#' + iAttrs.context),
                            last = null;

                        ul.css({ 'display': 'none' });

                        $(iElement).bind('contextmenu', function (event) {
                            event.preventDefault();
                            ul.css({
                                position: "fixed",
                                display: "block",
                                left: event.clientX + 'px',
                                top: event.clientY + 'px'
                            });
                            last = event.timeStamp;
                        });

                        $(document).click(function (event) {
                            var target = $(event.target);
                            if (!target.is(".popover") && !target.parents().is(".popover")) {
                                if (last === event.timeStamp)
                                    return;
                                ul.css({
                                    'display': 'none'
                                });
                            }
                        });

                        $(document).bind('contextmenu', function (event) {
                            var target = $(event.target);
                            if (!target.is(".popover") && !target.parents().is(".popover")) {
                                if (last === event.timeStamp)
                                    return;
                                ul.css({
                                    'display': 'none'
                                });
                            }
                        });
                    }
                };
            }
        };
    }]);

    app.directive("taskFocus",
        ["$timeout",
            function ($timeout) {
                return {
                    link: function (scope, ele, attrs) {
                        return scope.$watch(attrs.taskFocus, function (newVal) {
                            return newVal ? $timeout(function () {
                                return ele[0].focus()
                            }, 0, !1) : void 0
                        })
                    }
                }
            }])
})();