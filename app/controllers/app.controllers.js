(function () {
    "use strict";
    angular.module("app.controllers", [])
        .controller("AppCtrl", ["$scope", "$rootScope", "datacontext", "common",
            function ($scope, $rootScope, datacontext, common) {
                var $window;

                activate();


                function activate() {

                    common.activateController([loadLookups()], "AppCtrl")
                        .then(function () {

                        });
                }

                function loadLookups() {
                    datacontext.prime().then(function (data) {
                        var user = datacontext.getCurrentUser();
                        var customer = datacontext.getCurrentCustomer();

                        var main = {
                            userId : 0,
                            brand: "PayAnyBiz",
                            name: "",
                            userName: "",
                            lockPassword: '',
                            imageProfile: '',
                            debugMode: false,
                            customer: {},
                            address: '',
                            city: '',
                            zipCode: '',
                            state:''
                        };

                        
                        main.userId = user.currentUserId;
                        main.name = user.userName;
                        main.userName = user.userName;
                        main.imageProfile = "/images/users/" + user.currentUserId + ".jpg";

                        main.customer = customer;
                        main.address = customer.address;
                        main.city = customer.city.name;
                        main.state = customer.state.name;
                        main.zipCode = customer.zipPostal;


                        //if (main.name == "admin") {
                        //    main.imageProfile = "/images/g1.jpg";                           
                         

                        //} else if (main.name == "payor11") {
                        //    main.imageProfile = "/images/payor11.jpg";                          
                        //}
                        
                      


                        return $window = $(window),
                $scope.main = main,
                            $scope.pageLoaded = true,
                $scope.admin = {
                    layout: "wide",
                    menu: "horizontal",
                    fixedHeader: !1,
                    fixedSidebar: !1
                },
                $scope.$watch("admin",
                function (newVal, oldVal) {
                    return "horizontal" === newVal.menu && "vertical" === oldVal.menu ?
                        void $rootScope.$broadcast("nav:reset") : newVal.fixedHeader === !1 &&
                        newVal.fixedSidebar === !0 ?
                        (oldVal.fixedHeader === !1 &&
                        oldVal.fixedSidebar === !1 &&
                        ($scope.admin.fixedHeader = !0, $scope.admin.fixedSidebar = !0),
                        void (oldVal.fixedHeader === !0 &&
                        oldVal.fixedSidebar === !0 && ($scope.admin.fixedHeader = !1,
                        $scope.admin.fixedSidebar = !1))) : (newVal.fixedSidebar === !0 && ($scope.admin.fixedHeader = !0),
                        void (newVal.fixedHeader === !1 && ($scope.admin.fixedSidebar = !1)))
                }, !0),
                $scope.color = {
                    primary: "#1BB7A0",
                    success: "#94B758",
                    info: "#56BDF1",
                    infoAlt: "#7F6EC7",
                    warning: "#F3C536",
                    danger: "#FA7B58"
                }

                    });
                }


            }])
        .controller("HeaderCtrl", ["$scope", function ($scope) {
            return $scope.introOptions = {
                steps: [{
                    element: "#step1", intro: "<strong>Heads up!</strong> You can change the layout here", position: "bottom"
                }, {
                    element: "#step2", intro: "Select a different language", position: "right"
                }, {
                    element: "#step3", intro: "Runnable task App", position: "left"
                }, {
                    element: "#step4", intro: "Collapsed nav for both horizontal nav and vertical nav", position: "right"
                }]
            }
        }])
        .controller("NavContainerCtrl", ["$scope", function () { }])
        .controller('SignalRAngularCtrl', ['$scope', 'signalRSvc', '$rootScope', function ($scope, signalRSvc) {
            $scope.text = "";

            $scope.greetAll = function () {
                signalRSvc.sendRequest();
            }

            var updateGreetingMessage = function (text) {
                $scope.text = text;
            }

            // signalRSvc.initialize(updateGreetingMessage, null);


        }])
        .controller("NavCtrl", ["$scope", "tasksService", "filterFilter", "common","datacontext", function ($scope, tasksService, filterFilter, common, datacontext) {
            var tasks;

            activate();

            function activate() {

                common.activateController([loadLookups()], "AppCtrl")
                    .then(function () {

                    });
            }

            function loadLookups() {
                datacontext.prime().then(function (data) {
                    var user = datacontext.getCurrentUser();
                    var customer = datacontext.getCurrentCustomer();

                    return tasks = tasksService.getTasks().then(function (data) {
                        $scope.tasks = data;
                        $scope.taskRemainingCount = filterFilter(tasks, { completed: !1 }).length;
                    }),
             $scope.$on("taskRemaining:changed",
             function (event, count) {
                 return $scope.taskRemainingCount = count
             })
                });
            }

         
        }])

})();