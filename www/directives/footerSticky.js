app.directive("footerSticky", function(){
    return {
     
	    templateUrl: "directives/footerSticky.html",
	    controller: ["$scope", "$location", "$http", "$window", function($scope, $location, $http, $window){
		    	$scope.author  = "Jarl Lindquist";
			$("#createSurveyHome").click(function(e){
		       //To start the modal(wizard)
		      $('#myModal1').modal();
		    })
    }]}
});


