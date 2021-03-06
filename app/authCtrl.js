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
				sessionStorage.billingid = 'All';
				sessionStorage.statusid = 'All';
				sessionStorage.facilityid = 'All';
				sessionStorage.tovstatusid = 'All';
				sessionStorage.durationid = 'All';
				sessionStorage.inputValue = '';
				sessionStorage.inputTypeVal = 1;
				$state.go('dashboard');
			}else{
				toaster.pop('success', "", results.msg);
				sessionStorage.authenticated = false;
				sessionStorage.clear();
			}
        });
    };
});

app.filter('strLimit', ['$filter', function($filter) {
   return function(input, limit) {
      if (! input) return;
      if (input.length <= limit) {
          return input;
      }
      return $filter('limitTo')(input, limit).trim()+'...';
   };
}]);




