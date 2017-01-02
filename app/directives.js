app.directive('header', function () {
    return {
        restrict: 'A',
        scope: {},
        templateUrl: "partials/header.html",
        controller: ['$scope', '$filter', function ($scope, $filter) {
           /*  $scope.showHihecpl = function(){
				$jql('#User-dp').slideToggle('slow');
			} */
			
			
        }],
		 link:function($scope, element, attrs){
			 $scope.modalShown = false;
			$scope.toggleModal = function() {
				$scope.modalShown = !$scope.modalShown;
				};
		 }
    }
});

app.directive('footer', function () {
    return {
        restrict: 'A',
        templateUrl: "partials/footer.html",
        controller: ['$scope', '$filter', function ($scope, $filter) {
            // Your behaviour goes here :)
        }]
    }
});

app.directive('changelogoutlist', function () {
    return {
        restrict: 'E',
		replace: true,
        templateUrl: "partials/showchangepasswordlist.html",
		scope:{
			shows:'='
		},
        link:function($scope, element, attrs){
			console.log($scope);
			//$scope.showpopup=false;
		}
    }
});


app.directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '@'
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
  };
});

app.controller('MyCtrl', ['$scope', function($scope) {
$scope.modalShown = false;
$scope.toggleModal = function() {
	$scope.modalShown = !$scope.modalShown;
};
}]);
