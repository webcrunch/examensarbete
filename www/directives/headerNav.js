// menybar directive
app.directive('headerNav', [function(){
	//Returning our html template for the menybar.
  return {
    templateUrl: 'directives/headerNav.html',
    controller: ["$scope", "$location", "$http", "$window", function($scope, $location, $http, $window){

        //value placeholders for the navbar to show correct links
        $scope.showLogin = true;
        $scope.showLogout = false;
        $scope.upload = false;
        $scope.dasWiev = false;
        $scope.register = true;
        $scope.showDash = false;
        
        //checks if the window have been reloaded with help from HTML5's api, we then load the correct navbar accordingly.
        var item = $window.localStorage.getItem('loggedin');
        if(item){
        $scope.showDash = true;
        $scope.showLogin = false;
        $scope.showLogout = true;
        $scope.dashWiev = true;
        $scope.upload = true;
        }

         



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

 $scope.deleteSession = function(){
        $http({
          method: 'delete',
          url: '/login/deletesession'
        }).then(function SuccessCallback(res){
          $scope.showLogin = true;
          $scope.showDash = false;
          $scope.upload = false;
          $scope.showLogout = false;
          $window.localStorage.removeItem('loggedin');
          $window.localStorage.removeItem('user_id');
          $window.localStorage.removeItem('user_email');
          $location.path('/');
        }, function errorCallback(res){
          console.log("err");
        });

      };


$scope.login = function() { 
  


  $http({
        url: '/login',
        method: "POST",
        data: {  pass : $scope.pass , email : $scope.email }
    })
    .then(function(response) {
 
    	    var username = response.data.username;
 
              $window.localStorage.setItem('loggedin', 'true');
              $window.localStorage.setItem('user_id', response.data.user_id);
              $window.localStorage.setItem('user_email', response.data.email);
              $window.localStorage.setItem('username', response.data.username);
              $window.location.reload();
               
    }, 
    function(response) { // optional
            // failed
            console.log(response , "err");
    });



}

  }]}

}]);
 