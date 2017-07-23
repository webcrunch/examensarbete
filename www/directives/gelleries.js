// menybar directive
app.directive('display', [function(){
	//Returning our html template for the menybar.
  return {
    templateUrl: 'directives/gelleries.html',
    controller: ["$scope", "$location", "$http", "$window", function($scope, $location, $http, $window){
  

       // $scope.test = function() { 


      $http({method: 'GET', url: '/imgGet'}).then(function(res, err){
      $scope.images = res.data;


    });

       // }

  }]}

}]);
 