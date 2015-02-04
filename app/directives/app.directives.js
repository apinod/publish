(function () {
    "use strict";
    angular.module("app.directives", [])
        .directive("imgHolder", [function () {
            return {
                restrict: "A",
                link: function (scope, ele) {
                    return Holder.run({ images: ele[0] })
                }
            }
        }])
        .directive("customPage", function () {
            return {
                restrict: "A",
                controller: ["$scope", "$element", "$location",
                    function ($scope, $element, $location) {
                        var addBg, path;
                        return path = function () {
                            return $location.path()
                        },
                            addBg = function (path) {
                                switch ($element.removeClass("body-wide body-lock"), path) { case "/404": case "/pages/404": case "/pages/500": case "/pages/signin": case "/pages/signup": case "/pages/forgot-password": return $element.addClass("body-wide"); case "/pages/lock-screen": return $element.addClass("body-wide body-lock") }
                            },
                            addBg($location.path()),
                            $scope.$watch(path, function (newVal, oldVal) {
                                return newVal !== oldVal ? addBg($location.path()) : void 0
                            })
                    }]
            }
        })
        .directive("uiColorSwitch", [function () {
            return {
                restrict: "A",
                link: function (scope, ele) {
                    return ele.find(".color-option").on("click", function (event) {
                        var $this, hrefUrl, style;
                        if ($this = $(this),
                            hrefUrl = void 0,
                            style = $this.data("style"),
                            "loulou" === style)
                            hrefUrl = "styles/main.css",
                                $('link[href^="styles/main"]').attr("href", hrefUrl);
                        else {
                            if (!style)
                                return !1;
                            style = "-" + style, hrefUrl = "styles/main" + style + ".css", $('link[href^="styles/main"]').attr("href", hrefUrl)
                        }
                        return event.preventDefault()
                    })
                }
            }
        }])
        .directive("goBack", [function () {
            return {
                restrict: "A",
                controller: ["$scope", "$element", "$window", function ($scope, $element, $window) {
                    return $element.on("click", function () {
                        return $window.history.back()
                    })
                }]
            }
        }])
        .directive('ngEnter', function () {
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
        })
        .directive('ngEsc', function () {
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
        })
        .directive('pabCurrencyInput', function ($filter) {
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
                        else {
                            return value;
                        }
                    });
                    el.bind('blur', function () {
                        ctrl.$viewValue = formatValueAsCurrency(ctrl.$modelValue, true);
                        ctrl.$render();
                    });
                }
            };
        })
        .directive("aNgClick", function ($parse) {
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
        })
        .directive('ngRightClick', function ($parse) {
            return function (scope, element, attrs) {
                var fn = $parse(attrs.ngRightClick);
                element.bind('contextmenu', function (event) {
                    scope.$apply(function () {
                        event.preventDefault();
                        fn(scope, { $event: event });
                    });
                });
            };
        })
        .directive('ngFocused', function ($timeout, $parse) {
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
        })
        .directive('payRepeat', function ($compile) {
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
        })
        .directive('cellHighlight', function () {
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
        })
        .directive('context', [function () {
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
        }])
})();