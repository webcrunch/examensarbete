app.directive('starRating', function() {
  return {
    templateUrl:  'directives/starRating.html'
  };
});
// Set model for files..
app.directive('fileModel', ['$parse', function ($parse) {
  return {
     restrict: 'A',
     link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;
          
        element.bind('change', function(){
           scope.$apply(function(){
              modelSetter(scope, element[0].files[0]);
           });
        });
     }
  };
}]);

// app.controller('', ['$scope', '$http', 'fileUpload','$window', function($scope, $http, fileUpload, $window) {
//    var item = $window.localStorage.getItem('loggedin');
//         if(!item){
//           $window.location.href = '/';
//         }

//    $scope.uploadFile = function(){
//     if($scope.myFile){
      
//       var data = $scope.myFile;
//       var uploadUrl = "/multer";

//       // SEND FILES TO SERVER!
//       fileUpload.uploadFileToUrl($scope.myFile, $window.localStorage,  "/multer", function(svar){
//         // When file is sent, server responds with the path where file is saved
//         // we store that in localStorage for later previewing
//         console.log(svar);
//         $('#file-input').val('');

      

//       });
//     } else {
//       console.log("err");
//       $scope.imgError = "Please add an image.";
//     }
//   };
// }]);