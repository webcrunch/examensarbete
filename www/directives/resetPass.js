// menybar directive
app.directive('dis', [function(){
  //Returning our html template for the menybar.
  return {
    templateUrl: 'directives/resetPass.html',
    controller: ["$scope", "$location", "$http", "$window", function($scope, $location, $http, $window){
  
    	 $scope.submit = function() {

			$http({
        url: '/resetpass',
        method: "POST",
        data: { email : $scope.email }
    })
    .then(function(response) {
    	$scope.respond = response;

    		console.log(response.data);
            // success
    }, 
    function(response) { // optional
            // failed
            console.log("failed" , response);
    });



    	 }



 

  }]}

}]);
 