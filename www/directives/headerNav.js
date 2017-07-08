// menybar directive
app.directive('headerNav', [function(){
	//Returning our html template for the menybar.
  return {
    templateUrl: 'directives/headerNav.html',
    controller: ["$scope", "$location", "$http", "$window", function($scope, $location, $http, $window){


 $scope.register = function() { 

  $http({
        url: '/register',
        method: "POST",
        data: { userName : $scope.registername , firstName : $scope.firstname , lastName : $scope.lastname , pass : $scope.pass , email : $scope.email  }
    })
    .then(function(response) {
    	$scope.respond = response;

    		console.log(response);
            // success
    }, 
    function(response) { // optional
            // failed
            console.log("failed" , response);
    });



}



$scope.login = function() { 
  


  $http({
        url: '/login',
        method: "POST",
        data: {  pass : $scope.pass , email : $scope.email }
    })
    .then(function(response) {
    	console.log(response);
            // success
    }, 
    function(response) { // optional
            // failed
            console.log(response , "err");
    });



}

  }]}

}]);
 