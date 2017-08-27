// controller for the resetpassword section that is not yet in use
app.controller('newPassCtrl', ['$scope', '$location', '$http', '$sce', '$routeParams', function ($scope, $location, $http, $sce, $routeParams){

  

  $scope.updateNewPassword = function(){
    if($scope.password != null && $scope.password != ''){
      var data = {
        'token': $routeParams.token,
        'password': $scope.password
      }   
      $scope.sendNewPassword(data);
    } else {
      $scope.error = 'Please fill in the form';
    }
  }
	$scope.sendNewPassword = function(data){
		

    $http({
      url: '/updatePassword',
      method: "POST",
      data: {'data': data}
    }).then(function success(res) {
      console.log(res.data);
     $scope.send = res.data.message;
     $scope.password = "";
            
    },function error(res) { 
      console.log("err");
    });
	

  }
}]);