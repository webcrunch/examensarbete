app.directive("footerSticky", function(){
    return {
     
	    templateUrl: "directives/footerSticky.html",
	    controller: ["$scope", "$location", "$http", "$window", function($scope, $location, $http, $window){
		    	$scope.author  = "Jarl Lindquist";
		    	$scope.date = "2017-05-15";
    }]}
});


