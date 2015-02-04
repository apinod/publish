(function () {
        "use strict";

    angular.module("app.chart.ctrls", [])
      .controller("chartCtrl", ["$scope",
          function ($scope) {
              return $scope.easypiechart = {
                  percent: 65,
                  options: {
                      animate: { duration: 1e3, enabled: !0 },
                      barColor: $scope.color.primary,
                      lineCap: "round",
                      size: 180,
                      lineWidth: 5
                  }
              },
                  $scope.easypiechart2 = {
                      percent: 35,
                      options: {
                          animate: {
                              duration: 1e3,
                              enabled: !0
                          },
                          barColor: $scope.color.success,
                          lineCap: "round",
                          size: 180,
                          lineWidth: 10
                      }
                  },
                  $scope.easypiechart3 = {
                      percent: 68,
                      options: {
                          animate: {
                              duration: 1e3
                              , enabled: !0
                          },
                          barColor: $scope.color.info,
                          lineCap: "square",
                          size: 180,
                          lineWidth: 20,
                          scaleLength: 0
                      }
                  },
                  $scope.gaugeChart1 = {
                      data: {
                          maxValue: 3e3,
                          animationSpeed: 40,
                          val: 1375
                      },
                      options: {
                          lines: 12,
                          angle: 0,
                          lineWidth: .47,
                          pointer: {
                              length: .6,
                              strokeWidth: .03,
                              color: "#000000"
                          },
                          limitMax: "false",
                          strokeColor: "#E0E0E0",
                          generateGradient: !0,
                          percentColors: [[0, $scope.color.success], [1, $scope.color.success]]
                      }
                  },
                  $scope.gaugeChart2 = {
                      data: {
                          maxValue: 3e3,
                          animationSpeed: 45,
                          val: 1200
                      },
                      options: {
                          lines: 12,
                          angle: 0,
                          lineWidth: .47,
                          pointer: {
                              length: .6,
                              strokeWidth: .03,
                              color: "#464646"
                          },
                          limitMax: "true",
                          colorStart: "#7ACBEE",
                          colorStop: "#7ACBEE",
                          strokeColor: "#F1F1F1",
                          generateGradient: !0,
                          percentColors: [[0, $scope.color.info], [1, $scope.color.info]]
                      }
                  },
                  $scope.gaugeChart3 = {
                      data: {
                          maxValue: 3e3,
                          animationSpeed: 50,
                          val: 1100
                      },
                      options: {
                          lines: 12,
                          angle: 0,
                          lineWidth: .47,
                          pointer: {
                              length: .6,
                              strokeWidth: .03,
                              color: "#464646"
                          },
                          limitMax: "true",
                          colorStart: "#FF7857",
                          colorStop: "#FF7857",
                          strokeColor: "#F1F1F1",
                          generateGradient: !0,
                          percentColors: [[0, $scope.color.danger], [1, $scope.color.danger]]
                      }
                  }
          }])
      .controller("morrisChartCtrl",
            ["$scope",
                function ($scope) {
                    var barColor,
                        barData,
                        comboColor,
                        comboData,
                        donutColor,
                        donutData,
                        mainColor,
                        mainData,
                        simpleColor,
                        simpleData;
                    return mainData = [{
                        month: "2013-01",
                        xbox: 294e3,
                        will: 136e3,
                        playstation: 244e3
                    },
                    {
                        month: "2013-02",
                        xbox: 228e3,
                        will: 335e3,
                        playstation: 127e3
                    },
                    {
                        month: "2013-03",
                        xbox: 199e3,
                        will: 159e3,
                        playstation: 13e4
                    },
                    {
                        month: "2013-04",
                        xbox: 174e3,
                        will: 16e4,
                        playstation: 82e3
                    },
                    {
                        month: "2013-05",
                        xbox: 255e3,
                        will: 318e3,
                        playstation: 82e3
                    },
                    {
                        month: "2013-06",
                        xbox: 298400,
                        will: 401800,
                        playstation: 98600
                    },
                    {
                        month: "2013-07",
                        xbox: 37e4,
                        will: 225e3,
                        playstation: 159e3
                    },
                    {
                        month: "2013-08",
                        xbox: 376700,
                        will: 303600,
                        playstation: 13e4
                    },
                    {
                        month: "2013-09",
                        xbox: 527800,
                        will: 301e3,
                        playstation: 119400
                    }],
                        mainColor = [
                            $scope.color.infoAlt,
                            $scope.color.danger,
                            $scope.color.success],
                        $scope.main = {
                            data: mainData,
                            type: "area",
                            options: {
                                xkey: "month",
                                ykeys: ["xbox", "will", "playstation"],
                                labels: ["xbox", "will", "playstation"],
                                lineColors: mainColor,
                                lineWidth: 0,
                                behaveLikeLine: !0,
                                pointSize: 0
                            }
                        },
                        simpleData = [{
                            year: "2008",
                            value: 20
                        },
                        {
                            year: "2009",
                            value: 10
                        },
                        {
                            year: "2010",
                            value: 5
                        },
                        {
                            year: "2011",
                            value: 5
                        },
                        {
                            year: "2012",
                            value: 20
                        },
                        {
                            year: "2013",
                            value: 19
                        }],
                        simpleColor = [$scope.color.primary],
                        $scope.simple1 = {
                            data: simpleData,
                            type: "line",
                            options: {
                                xkey: "year",
                                ykeys: ["value"],
                                labels: ["Value"],
                                lineWidth: "2",
                                lineColors: simpleColor
                            }
                        },
                        $scope.simple2 = {
                            data: simpleData,
                            type: "area",
                            options: {
                                xkey: "year",
                                ykeys: ["value"],
                                labels: ["Value"],
                                lineWidth: "2",
                                lineColors: simpleColor
                            }
                        },
                        comboData = [
                            { month: "1", a: 20, b: 30 },
                            { month: "2", a: 30, b: 20 },
                            { month: "3", a: 20, b: 10 },
                            { month: "4", a: 10, b: 20 },
                            { month: "5", a: 20, b: 30 },
                            { month: "6", a: 30, b: 20 },
                            { month: "7", a: 20, b: 10 },
                            { month: "8", a: 10, b: 20 },
                            { month: "9", a: 20, b: 30 },
                            { month: "10", a: 30, b: 20 },
                            { month: "11", a: 20, b: 10 },
                            { month: "12", a: 10, b: 20 }],
                        comboColor = [
                            $scope.color.success,
                            $scope.color.danger,
                            $scope.color.infoAlt],
                        $scope.combo1 = {
                            data: comboData,
                            type: "line",
                            options: {
                                xkey: "month",
                                ykeys: ["a", "b"],
                                labels: ["Value A", "Value B"],
                                lineWidth: "2",
                                lineColors: comboColor
                            }
                        },
                        $scope.combo2 = {
                            data: comboData,
                            type: "area",
                            options: {
                                xkey: "month",
                                ykeys: ["a", "b"],
                                labels: ["Value A", "Value B"],
                                lineWidth: "2",
                                lineColors: comboColor
                            }
                        },
                        barData = [
                            { year: "2008", a: 20, b: 16, c: 12 },
                            { year: "2009", a: 10, b: 22, c: 30 },
                            { year: "2010", a: 5, b: 14, c: 20 },
                            { year: "2011", a: 5, b: 12, c: 19 },
                            { year: "2012", a: 20, b: 19, c: 13 },
                            { year: "2013", a: 28, b: 22, c: 20 }],
                        barColor = [$scope.color.infoAlt,
                            $scope.color.success,
                            $scope.color.warning],
                        $scope.bar1 = {
                            data: barData,
                            type: "bar",
                            options: {
                                xkey: "year",
                                ykeys: ["a", "b", "c"],
                                labels: ["Value A", "Value B", "Value C"],
                                barColors: barColor
                            }
                        },
                        $scope.bar2 = {
                            data: barData,
                            type: "bar",
                            options: {
                                xkey: "year",
                                ykeys: ["a", "b", "c"],
                                labels: ["Value A", "Value B", "Value C"],
                                barColors: barColor,
                                stacked: !0
                            }
                        },
                        donutColor = [
                            $scope.color.success,
                            $scope.color.info,
                            $scope.color.warning,
                            $scope.color.danger],
                        donutData = [
                            { label: "Download Sales", value: 12 },
                            { label: "In-Store Sales", value: 30 },
                            { label: "Mail-Order Sales", value: 20 },
                            { label: "Online Sales", value: 19 }],
                        $scope.donut1 = {
                            data: donutData,
                            type: "donut",
                            options: { xkey: "year" }
                        },
                        $scope.donut2 = {
                            data: donutData,
                            type: "donut",
                            options: {
                                xkey: "year",
                                colors: donutColor
                            }
                        },
                        $scope.donut3 = {
                            data: donutData,
                            type: "donut",
                            options: {
                                xkey: "year",
                                formatter: "return '$' + y;"
                            }
                        }
                }])
            .controller("flotChartCtrl",
            ["$scope",
                function ($scope) {
                    var areaChart,
                        barChart,
                        lineChart1;
                    return lineChart1 = {},
                        lineChart1.data1 = [[1, 15], [2, 20], [3, 14], [4, 10], [5, 10], [6, 20], [7, 28], [8, 26], [9, 22]],
                        $scope.line1 = {},
                        $scope.line1.data = [{ data: lineChart1.data1, label: "Trend" }],
                        $scope.line1.options = {
                            series: {
                                lines: {
                                    show: !0,
                                    fill: !0,
                                    fillColor: { colors: [{ opacity: 0 }, { opacity: .3 }] }
                                },
                                points: {
                                    show: !0, lineWidth: 2, fill: !0, fillColor: "#ffffff", symbol: "circle", radius: 5
                                }
                            },
                            colors: [$scope.color.primary, $scope.color.infoAlt],
                            tooltip: !0,
                            tooltipOpts: { defaultTheme: !1 },
                            grid: { hoverable: !0, clickable: !0, tickColor: "#f9f9f9", borderWidth: 1, borderColor: "#eeeeee" },
                            xaxis: { ticks: [[1, "Jan."], [2, "Feb."], [3, "Mar."], [4, "Apr."], [5, "May"], [6, "June"], [7, "July"], [8, "Aug."], [9, "Sept."], [10, "Oct."], [11, "Nov."], [12, "Dec."]] }
                        },
                        areaChart = {},
                        areaChart.data1 = [
                            [2007, 15],
                            [2008, 20],
                            [2009, 10],
                            [2010, 5],
                            [2011, 5],
                            [2012, 20],
                            [2013, 28]],
                        areaChart.data2 = [
                            [2007, 15],
                            [2008, 16],
                            [2009, 22],
                            [2010, 14],
                            [2011, 12],
                            [2012, 19],
                            [2013, 22]],
                        $scope.area = {},
                        $scope.area.data = [{
                            data: areaChart.data1,
                            label: "Value A",
                            lines: { fill: !0 }
                        },
                        {
                            data: areaChart.data2,
                            label: "Value B",
                            points: { show: !0 },
                            yaxis: 2
                        }],
                        $scope.area.options = {
                            series: {
                                lines: { show: !0, fill: !1 },
                                points: { show: !0, lineWidth: 2, fill: !0, fillColor: "#ffffff", symbol: "circle", radius: 5 },
                                shadowSize: 0
                            },
                            grid: {
                                hoverable: !0,
                                clickable: !0,
                                tickColor: "#f9f9f9",
                                borderWidth: 1,
                                borderColor: "#eeeeee"
                            },
                            colors: [
                                $scope.color.success,
                                $scope.color.infoAlt],
                            tooltip: !0,
                            tooltipOpts: { defaultTheme: !1 },
                            xaxis: { mode: "time" }, yaxes: [{}, { position: "right" }]
                        },
                        barChart = {},
                        barChart.data1 = [
                            [2008, 20],
                            [2009, 10],
                            [2010, 5],
                            [2011, 5],
                            [2012, 20],
                            [2013, 28]],
                        barChart.data2 = [
                            [2008, 16],
                            [2009, 22],
                            [2010, 14],
                            [2011, 12],
                            [2012, 19],
                            [2013, 22]],
                        barChart.data3 = [
                            [2008, 12],
                            [2009, 30],
                            [2010, 20],
                            [2011, 19],
                            [2012, 13],
                            [2013, 20]],
                        $scope.barChart = {},
                        $scope.barChart.data = [
                            { label: "Value A", data: barChart.data1 },
                            { label: "Value B", data: barChart.data2 },
                            { label: "Value C", data: barChart.data3 }],
                        $scope.barChart.options = {
                            series: {
                                stack: !0,
                                bars: {
                                    show: !0,
                                    fill: 1,
                                    barWidth: .3,
                                    align: "center",
                                    horizontal: !1,
                                    order: 1
                                }
                            },
                            grid: {
                                hoverable: !0,
                                borderWidth: 1,
                                borderColor: "#eeeeee"
                            },
                            tooltip: !0,
                            tooltipOpts: { defaultTheme: !1 },
                            colors: [
                                $scope.color.success,
                                $scope.color.info,
                                $scope.color.warning,
                                $scope.color.danger]
                        },
                        $scope.pieChart = {},
                        $scope.pieChart.data = [
                            { label: "Download Sales", data: 12 },
                            { label: "In-Store Sales", data: 30 },
                            { label: "Mail-Order Sales", data: 20 },
                            { label: "Online Sales", data: 19 }],
                        $scope.pieChart.options = {
                            series: { pie: { show: !0 } },
                            legend: { show: !0 },
                            grid: {
                                hoverable: !0,
                                clickable: !0
                            },
                            colors: [
                                $scope.color.success,
                                $scope.color.info,
                                $scope.color.warning,
                                $scope.color.danger],
                            tooltip: !0,
                            tooltipOpts: { content: "%p.0%, %s", defaultTheme: !1 }
                        },
                        $scope.donutChart = {},
                        $scope.donutChart.data = [
                            { label: "Download Sales", data: 12 },
                            { label: "In-Store Sales", data: 30 },
                            { label: "Mail-Order Sales", data: 20 },
                            { label: "Online Sales", data: 19 }],
                        $scope.donutChart.options = {
                            series: { pie: { show: !0, innerRadius: .5 } },
                            legend: { show: !0 },
                            grid: { hoverable: !0, clickable: !0 },
                            colors: [
                                $scope.color.success,
                                $scope.color.info,
                                $scope.color.warning,
                                $scope.color.danger],
                            tooltip: !0,
                            tooltipOpts: { content: "%p.0%, %s", defaultTheme: !1 }
                        },
                        $scope.donutChart2 = {},
                        $scope.donutChart2.data = [
                            { label: "Download Sales", data: 12 },
                            { label: "In-Store Sales", data: 30 },
                            { label: "Mail-Order Sales", data: 20 },
                            { label: "Online Sales", data: 19 },
                            { label: "Direct Sales", data: 15 }],
                        $scope.donutChart2.options = {
                            series: {
                                pie: { show: !0, innerRadius: .45 }
                            },
                            legend: { show: !1 },
                            grid: { hoverable: !0, clickable: !0 },
                            colors: ["#1BB7A0", "#39B5B9", "#52A3BB", "#619CC4", "#6D90C5"],
                            tooltip: !0,
                            tooltipOpts: { content: "%p.0%, %s", defaultTheme: !0 }
                        }
                }])
            .controller("sparklineCtrl",
            ["$scope", function ($scope) {
                return $scope.demoData1 = {
                    data: [3, 1, 2, 2, 4, 6, 4, 5, 2, 4, 5, 3, 4, 6, 4, 7],
                    options: {
                        type: "line",
                        lineColor: "#fff",
                        highlightLineColor: "#fff",
                        fillColor: $scope.color.success,
                        spotColor: !1,
                        minSpotColor: !1,
                        maxSpotColor: !1,
                        width: "100%",
                        height: "150px"
                    }
                },
                    $scope.simpleChart1 = {
                        data: [3, 1, 2, 3, 5, 3, 4, 2],
                        options: {
                            type: "line",
                            lineColor: $scope.color.primary,
                            fillColor: "#fafafa",
                            spotColor: !1,
                            minSpotColor: !1,
                            maxSpotColor: !1
                        }
                    },
                    $scope.simpleChart2 = {
                        data: [3, 1, 2, 3, 5, 3, 4, 2],
                        options: {
                            type: "bar",
                            barColor: $scope.color.primary
                        }
                    },
                    $scope.simpleChart3 = {
                        data: [3, 1, 2, 3, 5, 3, 4, 2],
                        options: {
                            type: "pie",
                            sliceColors: [
                                $scope.color.primary,
                                $scope.color.success,
                                $scope.color.info,
                                $scope.color.infoAlt,
                                $scope.color.warning,
                                $scope.color.danger]
                        }
                    },
                    $scope.tristateChart1 = {
                        data: [1, 2, -3, -5, 3, 1, -4, 2],
                        options: {
                            type: "tristate",
                            posBarColor: $scope.color.success,
                            negBarColor: $scope.color.danger
                        }
                    },
                    $scope.largeChart1 = {
                        data: [3, 1, 2, 3, 5, 3, 4, 2],
                        options: {
                            type: "line",
                            lineColor: $scope.color.info,
                            highlightLineColor: "#fff",
                            fillColor: $scope.color.info,
                            spotColor: !1,
                            minSpotColor: !1,
                            maxSpotColor: !1,
                            width: "100%",
                            height: "150px"
                        }
                    },
                    $scope.largeChart2 = {
                        data: [3, 1, 2, 3, 5, 3, 4, 2],
                        options: {
                            type: "bar",
                            barColor: $scope.color.success,
                            barWidth: 10,
                            width: "100%",
                            height: "150px"
                        }
                    },
                    $scope.largeChart3 = {
                        data: [3, 1, 2, 3, 5],
                        options: {
                            type: "pie",
                            sliceColors: [
                                $scope.color.primary,
                                $scope.color.success,
                                $scope.color.info,
                                $scope.color.infoAlt,
                                $scope.color.warning,
                                $scope.color.danger],
                            width: "150px",
                            height: "150px"
                        }
                    }
            }])
    }).call(this),
function () {
    "use strict";
    angular.module("app.ui.form.ctrls", [])
        .controller("TagsDemoCtrl", ["$scope",
            function ($scope) {
                return $scope.tags = ["foo", "bar"]
            }])
        .controller("DatepickerDemoCtrl",
        ["$scope",
            function ($scope) {
                return $scope.today = function () {
                    return $scope.dt = new Date
                },
                    $scope.today(),
                    $scope.showWeeks = !0,
                    $scope.toggleWeeks = function () {
                        return $scope.showWeeks = !$scope.showWeeks
                    },
                    $scope.clear = function () {
                        return $scope.dt = null
                    },
                    $scope.disabled = function (date, mode) {
                        return "day" === mode && (0 === date.getDay() || 6 === date.getDay())
                    },
                    $scope.toggleMin = function () {
                        var _ref;
                        return $scope.minDate = null != (_ref = $scope.minDate) ? _ref : { "null": new Date }
                    },
                    $scope.toggleMin(),
                    $scope.open = function ($event) {
                        return $event.preventDefault(),
                            $event.stopPropagation(),
                            $scope.opened = !0
                    },
                    $scope.dateOptions = {
                        "year-format": "'yy'",
                        "starting-day": 1
                    },
                    $scope.formats = [
                        "dd-MMMM-yyyy",
                        "yyyy/MM/dd",
                        "shortDate"],
                    $scope.format = $scope.formats[0]
            }])
        .controller("TimepickerDemoCtrl",
        ["$scope",
            function ($scope) {
                return $scope.mytime = new Date,
                    $scope.hstep = 1,
                    $scope.mstep = 15,
                    $scope.options = {
                        hstep: [1, 2, 3],
                        mstep: [1, 5, 10, 15, 25, 30]
                    },
                    $scope.ismeridian = !0,
                    $scope.toggleMode = function () {
                        return $scope.ismeridian = !$scope.ismeridian
                    },
                    $scope.update = function () {
                        var d; return d = new Date,
                            d.setHours(14),
                            d.setMinutes(0),
                            $scope.mytime = d
                    },
                    $scope.changed = function () {
                        return void 0
                    },
                    $scope.clear = function () {
                        return $scope.mytime = null
                    }
            }])
        .controller("TypeaheadCtrl",
        ["$scope",
            function ($scope) {
                return $scope.selected = void 0,
                    $scope.states = [
                        "Alabama",
                        "Alaska",
                        "Arizona",
                        "Arkansas",
                        "California",
                        "Colorado",
                        "Connecticut",
                        "Delaware",
                        "Florida",
                        "Georgia",
                        "Hawaii",
                        "Idaho",
                        "Illinois",
                        "Indiana",
                        "Iowa",
                        "Kansas",
                        "Kentucky",
                        "Louisiana",
                        "Maine",
                        "Maryland",
                        "Massachusetts",
                        "Michigan",
                        "Minnesota",
                        "Mississippi",
                        "Missouri",
                        "Montana",
                        "Nebraska",
                        "Nevada",
                        "New Hampshire",
                        "New Jersey",
                        "New Mexico",
                        "New York",
                        "North Dakota",
                        "North Carolina",
                        "Ohio",
                        "Oklahoma",
                        "Oregon",
                        "Pennsylvania",
                        "Rhode Island",
                        "South Carolina",
                        "South Dakota",
                        "Tennessee",
                        "Texas",
                        "Utah",
                        "Vermont",
                        "Virginia",
                        "Washington",
                        "West Virginia",
                        "Wisconsin",
                        "Wyoming"]
            }])
        .controller("RatingDemoCtrl",
        ["$scope",
            function ($scope) {
                return $scope.rate = 7,
                    $scope.max = 10,
                    $scope.isReadonly = !1,
                    $scope.hoveringOver = function (value) {
                        return $scope.overStar = value,
                            $scope.percent = 100 * (value / $scope.max)
                    },
                    $scope.ratingStates = [{
                        stateOn: "glyphicon-ok-sign",
                        stateOff: "glyphicon-ok-circle"
                    },
                    {
                        stateOn: "glyphicon-star", stateOff: "glyphicon-star-empty"
                    },
                    {
                        stateOn: "glyphicon-heart", stateOff: "glyphicon-ban-circle"
                    },
                    {
                        stateOn: "glyphicon-heart"
                    },
                    {
                        stateOff: "glyphicon-off"
                    }]
            }])
}.call(this),
function () {
    "use strict";
    angular.module("app.tables", [])
        .controller("tableCtrl",
        ["$scope", "$filter",
            function ($scope, $filter) {
                var init;
                return $scope.stores = [
                    { name: "Nijiya Market", price: "$$", sales: 292, rating: 4 },
                    { name: "Eat On Monday Truck", price: "$", sales: 119, rating: 4.3 },
                    { name: "Tea Era", price: "$", sales: 874, rating: 4 },
                    { name: "Rogers Deli", price: "$", sales: 347, rating: 4.2 },
                    { name: "MoBowl", price: "$$$", sales: 24, rating: 4.6 },
                    { name: "The Milk Pail Market", price: "$", sales: 543, rating: 4.5 },
                    { name: "Nob Hill Foods", price: "$$", sales: 874, rating: 4 },
                    { name: "Scratch", price: "$$$", sales: 643, rating: 3.6 },
                    { name: "Gochi Japanese Fusion Tapas", price: "$$$", sales: 56, rating: 4.1 },
                    { name: "Cost Plus World Market", price: "$$", sales: 79, rating: 4 },
                    { name: "Bumble Bee Health Foods", price: "$$", sales: 43, rating: 4.3 },
                    { name: "Costco", price: "$$", sales: 219, rating: 3.6 },
                    { name: "Red Rock Coffee Co", price: "$", sales: 765, rating: 4.1 },
                    { name: "99 Ranch Market", price: "$", sales: 181, rating: 3.4 },
                    { name: "Mi Pueblo Food Center", price: "$", sales: 78, rating: 4 },
                    { name: "Cucina Venti", price: "$$", sales: 163, rating: 3.3 },
                    { name: "Sufi Coffee Shop", price: "$", sales: 113, rating: 3.3 },
                    { name: "Dana Street Roasting", price: "$", sales: 316, rating: 4.1 },
                    { name: "Pearl Cafe", price: "$", sales: 173, rating: 3.4 },
                    { name: "Posh Bagel", price: "$", sales: 140, rating: 4 },
                    { name: "Artisan Wine Depot", price: "$$", sales: 26, rating: 4.1 },
                    { name: "Hong Kong Chinese Bakery", price: "$", sales: 182, rating: 3.4 },
                    { name: "Starbucks", price: "$$", sales: 97, rating: 3.7 },
                    { name: "Tapioca Express", price: "$", sales: 301, rating: 3 },
                    { name: "House of Bagels", price: "$", sales: 82, rating: 4.4 }],
                    $scope.searchKeywords = "",
                    $scope.filteredStores = [],
                    $scope.row = "",
                    $scope.select = function (page) {
                        var end, start;
                        return start = (page - 1) * $scope.numPerPage,
                            end = start + $scope.numPerPage,
                            $scope.currentPageStores = $scope.filteredStores.slice(start, end)
                    },
                    $scope.onFilterChange = function () {
                        return $scope.select(1),
                            $scope.currentPage = 1, $scope.row = ""
                    },
                    $scope.onNumPerPageChange = function () {
                        return $scope.select(1),
                            $scope.currentPage = 1
                    },
                    $scope.onOrderChange = function () {
                        return $scope.select(1),
                            $scope.currentPage = 1
                    },
                    $scope.search = function () {
                        return $scope.filteredStores = $filter("filter")($scope.stores, $scope.searchKeywords),
                            $scope.onFilterChange()
                    },
                    $scope.order = function (rowName) {
                        return $scope.row !== rowName ? ($scope.row = rowName, $scope.filteredStores = $filter("orderBy")($scope.stores, rowName), $scope.onOrderChange()) : void 0
                    },
                    $scope.numPerPageOpt = [3, 5, 10, 20],
                    $scope.numPerPage = $scope.numPerPageOpt[2],
                    $scope.currentPage = 1,
                    $scope.currentPageStores = [],
                    (init = function () {
                        return $scope.search(),
                            $scope.select($scope.currentPage)
                    })()
            }])
}.call(this),
//function () {
//    "use strict";
//    angular.module("app.task", [])
//        .factory("taskStorage", function () {
//            var DEMO_TASKS, STORAGE_ID;
//            return STORAGE_ID = "tasks",
//                DEMO_TASKS = '[ {"title": "Finish homework", "completed": true}, {"title": "Make a call", "completed": true}, {"title": "Build a snowman :)", "completed": false}, {"title": "Apply for monster university!", "completed": false}, {"title": "Play games with friends", "completed": true}, {"title": "Shopping", "completed": false} ]',
//                {
//                    get: function () {
//                        return JSON.parse(localStorage.getItem(STORAGE_ID) || DEMO_TASKS)
//                    },
//                    put: function (tasks) {
//                        return localStorage.setItem(STORAGE_ID, JSON.stringify(tasks))
//                    }
//                }
//        })
       
//        .controller("taskCtrl",
//        ["$scope", "taskStorage", "filterFilter", "$rootScope", "logger",
//            function ($scope, taskStorage, filterFilter, $rootScope, logger) {
//                var tasks;
//                return tasks = $scope.tasks = taskStorage.get(),
//                    $scope.newTask = "",
//                    $scope.remainingCount = filterFilter(tasks, { completed: !1 }).length,
//                    $scope.editedTask = null,
//                    $scope.statusFilter = { completed: !1 },
//                    $scope.filter = function (filter) {
//                        switch (filter) {
//                            case "all":
//                                return $scope.statusFilter = "";
//                            case "active":
//                                return $scope.statusFilter = { completed: !1 };
//                            case "completed":
//                                return $scope.statusFilter = { completed: !0 }
//                        }
//                    },
//                    $scope.add = function () {
//                        var newTask;
//                        return newTask = $scope.newTask.trim(),
//                            0 !== newTask.length ? (tasks.push({ title: newTask, completed: !1 }),
//                            logger.logSuccess('New task: "' + newTask + '" added'),
//                            taskStorage.put(tasks),
//                            $scope.newTask = "",
//                            $scope.remainingCount++) : void 0
//                    },
//                    $scope.edit = function (task) {
//                        return $scope.editedTask = task
//                    },
//                    $scope.doneEditing = function (task) {
//                        return $scope.editedTask = null,
//                            task.title = task.title.trim(),
//                            task.title ? logger.log("Task updated") : $scope.remove(task),
//                            taskStorage.put(tasks)
//                    },
//                    $scope.remove = function (task) {
//                        var index;
//                        return $scope.remainingCount -= task.completed ? 0 : 1,
//                            index = $scope.tasks.indexOf(task),
//                            $scope.tasks.splice(index, 1),
//                            taskStorage.put(tasks),
//                            logger.logError("Task removed")
//                    },
//                    $scope.completed = function (task) {
//                        return $scope.remainingCount += task.completed ? -1 : 1,
//                            taskStorage.put(tasks),
//                            task.completed ? $scope.remainingCount > 0 ?
//                            logger.log(1 === $scope.remainingCount ? "Almost there! Only " + $scope.remainingCount + " task left" : "Good job! Only " + $scope.remainingCount + " tasks left") :
//                            logger.logSuccess("Congrats! All done :)") : void 0
//                    },
//                    $scope.clearCompleted = function () {
//                        return $scope.tasks = tasks = tasks.filter(function (val) {
//                            return !val.completed
//                        }),
//                            taskStorage.put(tasks)
//                    },
//                    $scope.markAll = function (completed) {
//                        return tasks.forEach(function (task) { return task.completed = completed }), $scope.remainingCount = completed ? 0 : tasks.length, taskStorage.put(tasks), completed ? logger.logSuccess("Congrats! All done :)") : void 0
//                    },
//                    $scope.$watch("remainingCount == 0", function (val) {
//                        return $scope.allChecked = val
//                    }),
//                    $scope.$watch("remainingCount", function (newVal) {
//                        return $rootScope.$broadcast("taskRemaining:changed", newVal)
//                    })
//            }])
//}.call(this),
function () {
    "use strict";
    angular.module("app.ui.map", [])
        .directive("uiJqvmap",
        [function () {
            return {
                restrict: "A",
                scope: { options: "=" },
                link: function (scope, ele) {
                    var options;
                    return options = scope.options,
                        ele.vectorMap(options)
                }
            }
        }])
        .controller("jqvmapCtrl",
        ["$scope",
            function ($scope) {
                var sample_data;
                return sample_data = {
                    af: "16.63",
                    al: "11.58",
                    dz: "158.97",
                    ao: "85.81",
                    ag: "1.1",
                    ar: "351.02",
                    am: "8.83",
                    au: "1219.72",
                    at: "366.26",
                    az: "52.17",
                    bs: "7.54",
                    bh: "21.73",
                    bd: "105.4",
                    bb: "3.96",
                    by: "52.89",
                    be: "461.33",
                    bz: "1.43",
                    bj: "6.49", bt: "1.4", bo: "19.18", ba: "16.2", bw: "12.5", br: "2023.53", bn: "11.96", bg: "44.84", bf: "8.67", bi: "1.47", kh: "11.36", cm: "21.88", ca: "1563.66", cv: "1.57", cf: "2.11", td: "7.59", cl: "199.18", cn: "5745.13", co: "283.11", km: "0.56", cd: "12.6", cg: "11.88", cr: "35.02", ci: "22.38", hr: "59.92", cy: "22.75", cz: "195.23", dk: "304.56", dj: "1.14", dm: "0.38", "do": "50.87", ec: "61.49", eg: "216.83", sv: "21.8", gq: "14.55", er: "2.25", ee: "19.22", et: "30.94", fj: "3.15", fi: "231.98", fr: "2555.44", ga: "12.56", gm: "1.04", ge: "11.23", de: "3305.9", gh: "18.06", gr: "305.01", gd: "0.65", gt: "40.77", gn: "4.34", gw: "0.83", gy: "2.2", ht: "6.5", hn: "15.34", hk: "226.49", hu: "132.28", is: "12.77", "in": "1430.02", id: "695.06", ir: "337.9", iq: "84.14", ie: "204.14", il: "201.25", it: "2036.69", jm: "13.74", jp: "5390.9", jo: "27.13", kz: "129.76", ke: "32.42", ki: "0.15", kr: "986.26", undefined: "5.73", kw: "117.32", kg: "4.44", la: "6.34", lv: "23.39", lb: "39.15", ls: "1.8", lr: "0.98", ly: "77.91", lt: "35.73", lu: "52.43", mk: "9.58", mg: "8.33", mw: "5.04", my: "218.95", mv: "1.43", ml: "9.08", mt: "7.8", mr: "3.49", mu: "9.43", mx: "1004.04", md: "5.36", mn: "5.81", me: "3.88", ma: "91.7", mz: "10.21", mm: "35.65", na: "11.45", np: "15.11", nl: "770.31", nz: "138", ni: "6.38", ne: "5.6", ng: "206.66", no: "413.51", om: "53.78", pk: "174.79", pa: "27.2", pg: "8.81", py: "17.17", pe: "153.55", ph: "189.06", pl: "438.88", pt: "223.7", qa: "126.52", ro: "158.39", ru: "1476.91", rw: "5.69", ws: "0.55", st: "0.19", sa: "434.44", sn: "12.66", rs: "38.92", sc: "0.92", sl: "1.9", sg: "217.38", sk: "86.26", si: "46.44", sb: "0.67", za: "354.41", es: "1374.78", lk: "48.24", kn: "0.56", lc: "1", vc: "0.58", sd: "65.93", sr: "3.3", sz: "3.17", se: "444.59", ch: "522.44", sy: "59.63", tw: "426.98", tj: "5.58", tz: "22.43", th: "312.61", tl: "0.62", tg: "3.07", to: "0.3", tt: "21.2", tn: "43.86", tr: "729.05", tm: 0, ug: "17.12", ua: "136.56", ae: "239.65", gb: "2258.57", us: "14624.18", uy: "40.71", uz: "37.72", vu: "0.72", ve: "285.21", vn: "101.99", ye: "30.02", zm: "15.69", zw: "5.57"
                },
                    $scope.worldMap = {
                        map: "world_en",
                        backgroundColor: null,
                        color: "#ffffff",
                        hoverOpacity: .7,
                        selectedColor: "#666666",
                        enableZoom: !0,
                        showTooltip: !0,
                        values: sample_data,
                        scaleColors: ["#C8EEFF", "#006491"],
                        normalizeFunction: "polynomial"
                    },
                    $scope.USAMap = {
                        map: "usa_en",
                        backgroundColor: null,
                        color: "#ffffff",
                        hoverColor: "#999999",
                        selectedColor: "#666666",
                        enableZoom: !0,
                        showTooltip: !0,
                        selectedRegion: "MO"
                    },
                    $scope.europeMap = {
                        map: "europe_en",
                        backgroundColor: null,
                        color: "#ffffff",
                        hoverOpacity: .7,
                        hoverColor: "#999999",
                        enableZoom: !1,
                        showTooltip: !1,
                        values: sample_data,
                        scaleColors: ["#C8EEFF", "#006491"],
                        normalizeFunction: "polynomial"
                    }
            }])
}.call(this),






function () {
    "use strict";
    angular.module("app.ui.ctrls", [])
        .controller("NotifyCtrl", ["$scope", "logger",
            function ($scope, logger) {
                return $scope.notify = function (type) {
                    switch (type) {
                        case "info": return logger.log("Heads up! This alert needs your attention, but it's not super important.");
                        case "success": return logger.logSuccess("Well done! You successfully read this important alert message.");
                        case "warning": return logger.logWarning("Warning! Best check yo self, you're not looking too good.");
                        case "error": return logger.logError("Oh snap! Change a few things up and try submitting again.")
                    }
                }
            }])
        .controller("AlertDemoCtrl",
        ["$scope",
            function ($scope) {
                return $scope.alerts = [{
                    type: "success",
                    msg: "Well done! You successfully read this important alert message."
                },
                {
                    type: "info",
                    msg: "Heads up! This alert needs your attention, but it is not super important."
                },
                {
                    type: "warning",
                    msg: "Warning! Best check yo self, you're not looking too good."
                },
                {
                    type: "danger",
                    msg: "Oh snap! Change a few things up and try submitting again."
                }],
                    $scope.addAlert = function () {
                        var num,
                            type;
                        switch (num = Math.ceil(4 * Math.random()), type = void 0, num) {
                            case 0: type = "info";
                                break;
                            case 1:
                                type = "success";
                                break;
                            case 2:
                                type = "info";
                                break;
                            case 3:
                                type = "warning";
                                break;
                            case 4:
                                type = "danger"
                        }
                        return
                        $scope.alerts.push({ type: type, msg: "Another alert!" })
                    },
                    $scope.closeAlert = function (index) {
                        return $scope.alerts.splice(index, 1)
                    }
            }])
        .controller("ProgressDemoCtrl",
        ["$scope",
            function ($scope) {
                return $scope.max = 200,
                    $scope.random = function () {
                        var type, value;
                        value = Math.floor(100 * Math.random() + 10),
                        type = void 0,
                        type = 25 > value ? "success" : 50 > value ? "info" : 75 > value ? "warning" : "danger",
                        $scope.showWarning = "danger" === type || "warning" === type,
                        $scope.dynamic = value, $scope.type = type
                    },
                    $scope.random()
            }])
    .controller("AccordionDemoCtrl",
      ["$scope",
        function ($scope) {
            $scope.oneAtATime = !0,
            $scope.groups = [{ title: "Dynamic Group Header - 1", content: "Dynamic Group Body - 1" },
                { title: "Dynamic Group Header - 2", content: "Dynamic Group Body - 2" },
                { title: "Dynamic Group Header - 3", content: "Dynamic Group Body - 3" }],
            $scope.items = ["Item 1", "Item 2", "Item 3"],
            $scope.status = { isFirstOpen: !0, isFirstOpen1: !0, isFirstOpen2: !0, isFirstOpen3: !0, isFirstOpen4: !0, isFirstOpen5: !0, isFirstOpen6: !0 },
            $scope.addItem = function () {
                var newItemNo;
                newItemNo = $scope.items.length + 1, $scope.items.push("Item " + newItemNo)
            }
        }])
        .controller("CollapseDemoCtrl",
        ["$scope",
            function ($scope) {
                return $scope.isCollapsed = !1
            }])
        .controller("ModalDemoCtrl",
        ["$scope", "$modal", "$log",
            function ($scope, $modal, $log) {
                $scope.items = ["item1", "item2", "item3"],
                $scope.open = function () {
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "myModalContent.html",
                        controller: "ModalInstanceCtrl",
                        resolve: { items: function () { return $scope.items } }
                    }),
                    modalInstance.result.then(function (selectedItem) {
                        $scope.selected = selectedItem
                    },
                    function () {
                        $log.info("Modal dismissed at: " + new Date)
                    })
                }
            }])
        .controller("ModalInstanceCtrl",
        ["$scope", "$modalInstance", "items",
            function ($scope, $modalInstance, items) {
                $scope.items = items, $scope.selected = { item: $scope.items[0] },
                $scope.ok = function () {
                    $modalInstance.close($scope.selected.item)
                },
                $scope.cancel = function () {
                    $modalInstance.dismiss("cancel")
                }
            }])
        .controller("PaginationDemoCtrl",
        ["$scope",
            function ($scope) {
                return $scope.totalItems = 64,
                    $scope.currentPage = 4,
                    $scope.setPage = function (pageNo) {
                        return $scope.currentPage = pageNo
                    },
                    $scope.maxSize = 5,
                    $scope.bigTotalItems = 175,
                    $scope.bigCurrentPage = 1
            }])
        .controller("TabsDemoCtrl",
        ["$scope",
            function ($scope) {
                return $scope.tabs = [{
                    title: "Dynamic Title 1",
                    content: "Dynamic content 1.  Consectetur adipisicing elit. Nihil, quidem, officiis, et ex laudantium sed cupiditate voluptatum libero nobis sit illum voluptates beatae ab. Ad, repellendus non sequi et at."
                },
                {
                    title: "Disabled",
                    content: "Dynamic content 2.  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil, quidem, officiis, et ex laudantium sed cupiditate voluptatum libero nobis sit illum voluptates beatae ab. Ad, repellendus non sequi et at.", disabled: !0
                }],
                    $scope.navType = "pills"
            }])
        .controller("TreeDemoCtrl",
        ["$scope",
            function ($scope) {
                return $scope.list = [
                    { id: 1, title: "Item 1", items: [] },
                    {
                        id: 2, title: "Item 2", items: [
                          { id: 21, title: "Item 2.1",  items: [{ id: 211, title: "Item 2.1.1", items: [] },
                          { id: 212, title: "Item 2.1.2", items: []}] },
                          { id: 22, title: "Item 2.2", items: [{ id: 221, title: "Item 2.2.1", items: [] }, { id: 222, title: "Item 2.2.2", items: [] }] }]
                    },
                    { id: 3, title: "Item 3", items: [] },
                    { id: 4, title: "Item 4", items: [{ id: 41, title: "Item 4.1", items: [] }] },
                    { id: 5, title: "Item 5", items: [] }, { id: 6, title: "Item 6", items: [] },
                    { id: 7, title: "Item 7", items: [] }],
                    $scope.selectedItem = {},
                    $scope.options = {},
                    $scope.remove = function (scope) {
                        scope.remove()
                    },
                    $scope.toggle = function (scope) {
                        scope.toggle()
                    },
                    $scope.newSubItem = function (scope) {
                        var nodeData;
                        nodeData = scope.$modelValue,
                        nodeData.items.push({ id: 10 * nodeData.id + nodeData.items.length, title: nodeData.title + "." + (nodeData.items.length + 1), items: [] })
                    }
            }])
        .controller("MapDemoCtrl",
        ["$scope", "$http", "$interval",
            function ($scope, $http, $interval) {
                var i,
                    markers;
                for (markers = [], i = 0; 8 > i;)
                    markers[i] = new google.maps.Marker({ title: "Marker: " + i }),
                        i++;

                $scope.GenerateMapMarkers = function () {
                    var d, lat, lng, loc, numMarkers;
                    for (d = new Date, $scope.date = d.toLocaleString(), numMarkers = Math.floor(4 * Math.random()) + 4, i = 0; numMarkers > i;)
                        lat = 43.66 + Math.random() / 100,
                            lng = -79.4103 + Math.random() / 100,
                            loc = new google.maps.LatLng(lat, lng),
                            markers[i].setPosition(loc),
                            markers[i].setMap($scope.map),
                            i++
                },
                $interval($scope.GenerateMapMarkers, 2e3)
            }])
}
(this);

