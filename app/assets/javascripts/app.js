

angular.module('codechallengeServices', []).factory('awsService', ['$window','$rootScope', function($window, $scope) {
  $scope.bucket = new AWS.S3({params: {Bucket: 'codechallengetrial'}});

  return {
    listFiles: function(successCallback) {
        $scope.bucket.listObjects({Prefix: "brianneking86"}, function(err, data) {
        
        
        if (err) {
          console.log(err)
        }

        if (data) {
          successCallback(data);
        }
    });
    },
   downloadFile: function(awsObject) {
      var params = {Bucket: 'codechallengetrial', Key: awsObject.Key};

      $scope.bucket.getSignedUrl('getObject', params, function (err, url) {
          $window.location = url;
      });
    },
    addFile: function(file, successCallback){
      $scope.bucket.putObject({
        Key: "brianneking86/" + file.name, // this is basically the filename -- replace YOURNAME with your first and last name, lowercase, no spaces
        ACL: "public-read", // must include this exactly as is, this is what allows you to get the uploaded file from your browser
        Body: file // this is the content of the file
        }, 
        function(err, data) { // optional -- this is the callback that is executed when the operation is complete; 
                                 // highly recommended -- it will be nice to know when it has worked and when it has failed;
                                 // the user will probably want to know, too 
          if (err) {
            console.log(err);
          }
          if (data) {
            successCallback();            
            console.log(data);
          }
        }
      )
    },
    deleteFile: function(file) {

    },
    renameFile: function(file, newFile) {
      // $scope.bucket.copyObject

    }
  }
}]);

angular.module('codechallengeControllers', []).controller('MainCtrl', ['$scope', '$window', 'awsService', function($scope, $window, $awsService){
  $scope.greeting = "Add and view your files here";
  $scope.files = Array();

   var updateFiles = function(data) {
          angular.forEach(data.Contents, function(awsObject) {
            if(awsObject.Key != "brianneking86/"){
              $scope.files.push(awsObject);
            }
          });
          $scope.$apply();
        };
   

   $awsService.listFiles(updateFiles);
    //method for adding a file to the bucket
    $scope.addFile = function() {
      var fileChooser = document.getElementById('file-chooser');
      var file = fileChooser.files[0];
      if(file) {
        $awsService.addFile(file, function() {
          $awsService.listFiles(updateFiles);
        });
      }
    }

    $scope.deleteFile = function(){
      var fileName = document.getElementById('file-name').name;
      if(fileName) {
        $awsService.deleteFile(fileName);
      }
    };
    $scope.download = function(file) {
      $awsService.downloadFile(file);
    }
  }
]);

angular.module('codechallengeApp', ['codechallengeControllers','codechallengeServices']);