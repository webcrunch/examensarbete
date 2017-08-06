// menybar directive
app.directive('dis', [function(){
  //Returning our html template for the menybar.
  return {
    templateUrl: 'directives/resetPass.html',
    controller: ["$scope", "$location", "$http", "$window", function($scope, $location, $http, $window){
  		
    	 $scope.sendNewRequestToAnNewPassword = function() {

  			$http({
        url: '/resetpass',
        method: "POST",
        data: { email : $scope.email }
    })
    .then(function successCallback(response) {
    	$scope.send = "We have sent an email with an link you need to click on to be able to change your password";
            // success
    // this callback will be called asynchronously
    // when the response is available
  }, function errorCallback(response) {
  	    // failed
            
            $scope.error = "something went wrong";
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
























    	 }



 

  }]}

}]);
 