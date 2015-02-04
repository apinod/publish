(function () {
    "use strict";
    angular.module("app.invoiceCtrl", [])
    .controller("invoiceCtrl", ["$scope", "$window",
            function ($scope) {
             
                return $scope.printInvoice = function () {
                    var originalContents,
                        popupWin,
                        brand,
                        printContents;

                    return
                    printContents = document.getElementById("invoice").innerHTML,
                        originalContents = document.body.innerHTML,
                        popupWin = window.open(),
                        brand = 'Test',
                        popupWin.document.open(),
                        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="styles/main.css" /></head><body onload="window.print()">' + printContents + "</html>"),
                        popupWin.document.close()
                }
            }])
})();