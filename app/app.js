"use strict";
var $jql = $.noConflict();
var app = angular.module('noteMpdule',['ui.router','infinite-scroll','toaster','angular-md5']);
	app.constant('baseSetting', {
		Url: 'http://localhost/connect_Health/ccAndroidApi/ccAndroid/'
		//Url: 'https://ccsa.medgre.com/medgre/ccAndroidApi/ccAndroid/'
	});
	app.config(['$stateProvider','$urlRouterProvider', function ($stateProvider,$urlRouterProvider) {
		$urlRouterProvider.otherwise('/login');
		$stateProvider.state('Login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'authCtrl',
            controllerAs: 'auth'
        })
		.state('dashboard', {
			url: '/dashboard',
			templateUrl: 'partials/dashboard.html',
			controller: 'dashboardCtrl',
			controllerAs: 'dash'
		})
		/*.state('Dashboard.view', {
			title: 'Edit Note',
			templateUrl: 'partials/addeditnote.html',
			controller: 'addeditCtrl',
			resolve: {
			  usernote: function(Data, $route){
				var noteId = $route.current.params.noteId;
				return Data.get('getnote',{
					params:{
						noteid:noteId
					}
				}).then(function (results) {
					return results;
				});
			  }
			}
		})*/
	}])
	.run(function ($rootScope, $location, Data) {
		$rootScope.$on('$stateChangeStart', function (event, next, current) {
			if(sessionStorage.authenticated && sessionStorage.authenticated == "true"){
				$rootScope.authenticated = sessionStorage.authenticated;
				$rootScope.userData = JSON.parse(sessionStorage.getItem('userData'));
			}else{
				localStorage.authenticated = false;
				var nextUrl = next.$$route.originalPath;
				if (nextUrl == '/login') {

				} else {
					$location.path("/login");
				}
			}
	  
		});
	});
  
	app.controller('dashboardCtrl', function ($scope, $rootScope, Data) {
		Data.post('getListOfPatient ',{
			providerid: $rootScope.userData.id,
			billingid: 'All',
			statusid: 'All',
			facilityid: 'All',
			tovstatusid: 'All',
			durationid: 'All',
			inputValue: '',
			inputTypeVal: '',
			offset: '0',
			limit: '10'
		}).then(function (results) {
			$scope.patientlist = results.patientData;
			console.log(results);
		});
	});
	
	app.factory("Data", ['$http','baseSetting', function ($http,baseSetting) {
		// This service connects to our REST API
		var serviceBaseUrl = baseSetting.Url;
		var obj = {};
		obj.post = function (q,object) {
			return $http.post(
					serviceBaseUrl+q,
					object,
					{
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
							}
					}
				).then(function (results) {
				return results.data;
			});
		};
		obj.get = function (q,parms) {
			return $http.get(serviceBaseUrl + q, parms).then(function (results) {
				return results.data;
			});
		};
		obj.delete = function (q,parmss) {
            return $http.delete(serviceBaseUrl + q,parmss).then(function (results) {
                return results.data;
            });
        };
		return obj;
	}]);
	
	