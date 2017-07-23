app.directive('fileUpload', function() {
  return {
    templateUrl:  'directives/fileupload.html'
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
// Service that handles the file-uploading
app.service('fileUpload', ['$http', function ($http) {

  

  this.uploadFileToUrl = function(file, data, uploadUrl, cb){
    var fd = new FormData();
    fd.append('file', file,);
    let dataExpand =  fd.get('file');
    let dataUpload = {
      'user': data.user_id,
      'name' : dataExpand.name,
    }
    
    fd.append('data' , JSON.stringify(dataUpload));
    
    $http.post(uploadUrl, fd, {     //  $http.post(url, data, config)
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    }).then(function(res, err){
      cb(res.data);
    });
  };
}]);
app.controller('fileController', ['$scope', '$http', 'fileUpload','$window', function($scope, $http, fileUpload, $window) {
   var item = $window.localStorage.getItem('loggedin');
        if(!item){
          $window.location.href = '/';
        }

   $scope.uploadFile = function(){
    if($scope.myFile){
      
      var data = $scope.myFile;
      var uploadUrl = "/multer";

      // SEND FILES TO SERVER!
      fileUpload.uploadFileToUrl($scope.myFile, $window.localStorage,  "/multer", function(svar){
        // When file is sent, server responds with the path where file is saved
        // we store that in localStorage for later previewing
        console.log(svar);
        $('#file-input').val('');

      

      });
    } else {
      console.log("err");
      $scope.imgError = "Please add an image.";
    }
  };
}]);