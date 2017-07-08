//Declaring angular to our "myApp" with the following modules
var app = angular.module("myApp", [
  'ngRoute',
  'ngResource',
  'ngTouch'

]);

//Routes to all our views and controllers
app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider){

	$routeProvider.when("/",{
		templateUrl: "views/home.html",
		controller: ""
	})
	$routeProvider.when("/1",{
		templateUrl: "views/upload.html",
		controller: ""
	})
	// .when("/2",{
	// 	templateUrl: "views/",
	// 	controller: ""
	// })
	// .when("/resetpassword",{
	// 	templateUrl: "views/resetpassword.html",
	// 	controller: "resetCtrl"
	// })
	// .when("/dashboard/:id?",{
	// 	templateUrl: "views/dashboard.html",
	// 	controller: "dashboardCtrl"
	// })
	// .when("/todo	",{
	// 	templateUrl: "views/surveytemplate.html",
	// 	controller: "surveytemplateCtrl"
	// })
	// .when("/survey",{
	// 	templateUrl: "views/survey.html",
	// 	controller: "surveyCtrl"
	// })
	// .when("/reset/:token?",{
	// 	templateUrl: "views/newpassword.html",
	// 	controller: "newPassCtrl"
	// })

	.otherwise({
		redirectTo: "/"
	});
	//Setting our app to run html5Mode
	$locationProvider.html5Mode(true);
}]);