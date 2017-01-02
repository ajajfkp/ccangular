"use strict";
app.controller('authCtrl', function ($scope, $location, $rootScope, Data, toaster,md5) {
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
				localStorage.userData = {
					userid:results.data.id,
					offset:'0',
					limit:'10',
					username:results.data.user_id,
					first_name:results.data.first_name,
					last_name:results.data.last_name,
					userMainType:results.data.userMainType
				}

				$rootScope.authenticated = true;
				localStorage.authenticated = $rootScope.authenticated;
				localStorage.uid = results.data.id;
				$location.path('dashboard');
			}else{
				toaster.pop('success', "", results.msg);
				$rootScope.authenticated = false;
				localStorage.authenticated = $rootScope.authenticated;
				localStorage.userData={};
				localStorage.uid='';
			}
        });
    };
});




