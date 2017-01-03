"use strict";
app.controller('authCtrl', function ($scope, $location, $rootScope, Data, toaster,md5,$state) {
    //initially set those objects to null to avoid undefined error
    $scope.version = '1.0';
    $scope.year = '2016';
    $scope.login = {};
    $scope.doLogin = function (customer) {
        Data.post('cclogin', {
			userName:customer.username,
			password:md5.createHash(customer.password || '')
		}).then(function (results) {
			if (results.status == "200" && results.type=="success") {
				sessionStorage.setItem('userData',JSON.stringify(results.data))
				sessionStorage.authenticated = true;
				$state.go('dashboard');
			}else{
				toaster.pop('success', "", results.msg);
				sessionStorage.authenticated = false;
				sessionStorage.clear();
			}
        });
    };
});




