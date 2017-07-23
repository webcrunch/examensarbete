// Controller for the dashboard template
app.controller('dashboardCtrl', ["$scope", "$location", "$http", "$route", "$routeParams", function($scope, $location, $http, $routeParams){
	//Out commented lines should remain since the costumer wants to be able to switch in the future.
	// $scope.surveysBool = true;
	// $scope.profileBool = false;


		$scope.name = "thinker";

	// $scope.showSurveys = function(){
	// 	if(!$scope.surveysBool){
	// 		$scope.surveysBool = true;
	// 		$scope.profileBool = false;
	// 		//$scope.VoucherBool = false;
	// 	}
	// };

	// $scope.showProfile = function(){
	// 	if(!$scope.profileBool){
	// 		$scope.profileBool = true;
	// 		$scope.surveysBool = false;
	// 		//$scope.VoucherBool = false;
	// 	}
	// };
}]);