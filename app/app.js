"use strict";
var $jql = $.noConflict();
var app = angular.module('noteMpdule',['ui.router','infinite-scroll','toaster','angular-md5']);
	app.constant('baseSetting', {
		Url: 'http://192.168.1.106/connect_Health/ccAndroidApi/ccAndroid/'
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
			views: {
                '': { templateUrl: 'partials/dashboard.html',controller: 'dashboardCtrl' },
                'columnOne@dashboard': { 
					templateUrl: 'partials/header.html'
				},
                'columnTwo@dashboard': { 
                    templateUrl: 'partials/footer.html'
                }
            }
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
		$rootScope.$on('$stateChangeStart', function (event, next, current,$state) {
			if(sessionStorage.authenticated && sessionStorage.authenticated == "true"){
				$rootScope.authenticated = sessionStorage.authenticated;
				$rootScope.userData = JSON.parse(sessionStorage.getItem('userData'));
			}else{
				sessionStorage.authenticated = false;
				var nextUrl = next.$$route.originalPath;
				if (nextUrl == '/login') {

				} else {
					$state.go('login');
				}
			}
		});
	});
	
	app.controller('dashboardCtrl', function ($scope, $rootScope, Data) {
		
		$scope.getAllData = function(){
			Data.post('getListOfPatient ',{
				providerid: $rootScope.userData.id,
				billingid: sessionStorage.billingid,
				statusid: sessionStorage.statusid,
				facilityid: sessionStorage.facilityid,
				tovstatusid: sessionStorage.tovstatusid,
				durationid: sessionStorage.durationid,
				inputValue: sessionStorage.inputValue,
				inputTypeVal: sessionStorage.inputTypeVal,
				offset: '0',
				limit: '100'
			}).then(function (results) {
				$scope.patientlist = results.data.patientData;
				console.log(results.data.patientData);
			});
		}
		
		$scope.getAllData();
		if(sessionStorage.inputTypeVal =="1"){
			$jql('#searchkey').attr('placeholder','Search by patient');
			console.log(sessionStorage.inputTypeVal);
			$jql("#searchkey").datepicker("destroy");
		}else if(sessionStorage.inputTypeVal =="2"){
			$jql('#searchkey').attr('placeholder','Search by discharged date');
			$jql("#searchkey").datepicker();
		}else if(sessionStorage.inputTypeVal =="3"){
			$jql('#searchkey').attr('placeholder','Search by admission date');
			$jql("#searchkey").datepicker();
		}else if(sessionStorage.inputTypeVal =="4"){
			$jql('#searchkey').attr('placeholder','Search by Discharged date');
			$jql("#searchkey").datepicker("destroy");
		}

		$scope.showmainsearch = function (){
			$jql('#mainsearch').animate({
					left:0
				},
				500,
				function(){
					$jql('#mask').show();
				}
			);
		}
		
		$scope.closeSearch = function (){
			$jql('#mainsearch').animate({
					left:-275
				},
				500,
				function(){
					$jql('#mask').hide();
				}
			);
		}
		
		$scope.searchBypatient = function(num=''){
			if(num){
				$jql('#mainsearch').animate({
					left:-275
					},
					500,
					function(){
						$jql('#mask').hide();
					}
				);
				if(num=='1'){
					$jql('#searchkey').attr('placeholder','Search by patient');
					$jql("#searchkey").datepicker("destroy");
				}else if(num=='2'){
					$jql('#searchkey').attr('placeholder','Search by discharged date');
					$jql("#searchkey").datepicker();
				}else if(num=='3'){
					$jql('#searchkey').attr('placeholder','Search by admission date');
					$jql("#searchkey").datepicker();
				}else if(num=='4'){
					$jql('#searchkey').attr('placeholder','Search by MRN');
					$jql("#searchkey").datepicker("destroy");
				}
				
				sessionStorage.inputTypeVal=num;
				$scope.getAllData();
				
			}else{
				alert('ERROR!!!');
			}
		}
		
		$scope.searchdo = function(){
			sessionStorage.inputValue = $scope.searchText ? $scope.searchText:'';
			$scope.getAllData();
		}
		
		
		
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
	
	