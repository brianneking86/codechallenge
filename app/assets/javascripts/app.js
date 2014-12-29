$(document).ready(function(){
  $('.update-file').hide();
  $('.cancel').hide();
  $('.wrapper').on('click', '.rename-file', function(){
    $(this).hide();
    $(this).siblings().show();
  });
  $('.wrapper').on('click', '.cancel', function(){
    $(this).hide();
    $(this).siblings('div').hide();
    $(this).siblings('span').show();
  });
});

AWS.config.update({
    accessKeyId:     '<insert key here>', 
    secretAccessKey: '<insert secret here>'
  });

angular.module('codechallengeServices', []).factory('awsService', ['$window','$rootScope', function($window, $scope) {
  $scope.bucket = new AWS.S3({params: {Bucket: 'yh.interview'}});

  return {
    listFiles: function(successCallback) {
      $scope.bucket.listObjects({Prefix: "brianneking"}, function(err, data) {
        if (err) {
          console.log(err)
        }
        if (data) {
          successCallback(data);
        }
      });
    },
   downloadFile: function(awsObject) {
      var params = {Bucket: 'yh.interview', Key: awsObject.Key};

      $scope.bucket.getSignedUrl('getObject', params, function (err, url) {
          $window.location = url;
      });
    },
    addFile: function(file, successCallback){
      $scope.bucket.putObject({
        Key: "brianneking/" + file.name,
        ACL: "public-read",
        Body: file
        }, 
        function(err, data) { 
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
    deleteFile: function(file, successCallback) {
      $scope.bucket.deleteObject({
        Key: file.Key
      },
      function(err, data) { 
          if (err) {
            console.log(err, err.stack);
          }
          if (data) {
            successCallback();            
            console.log(data);
          }
        }
      )
    },
    renameFile: function(file, newFile, successCallback) {
      var params = {
        CopySource: 'https://s3.amazonaws.com/yh.interview/' + file.Key,
        Key: 'brianneking/' + newFile
      }
      $scope.bucket.copyObject(params,
        function(err, data) { 
          if (err) {
            console.log(err, err.stack);
          }
          if (data) {
            successCallback();            
            console.log(data);
          }
        }
      );
    }
  }
}]);

angular.module('codechallengeControllers', []).controller('MainCtrl', ['$scope', '$window', 'awsService', function($scope, $window, $awsService){
  $scope.greeting = "Manage your files here";

   var updateFiles = function(data) {
    $scope.files = Array();
          angular.forEach(data.Contents, function(awsObject) {
            if(awsObject.Key != "brianneking/"){
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
      document.getElementById('file-chooser').value = "";
    }

    $scope.deleteFile = function(file){
      if(file) {
        $awsService.deleteFile(file, function() {
          $awsService.listFiles(updateFiles);
        });
      }
    };
    $scope.download = function(file) {
      $awsService.downloadFile(file);
    }
    $scope.renameFile = function(file) {
      var newName = document.getElementById('newFile').value;
      if (newName){
        $awsService.renameFile(file, newName, function() {
            $scope.deleteFile(file);
            $awsService.listFiles(updateFiles);
          });
      }
    }
  }
]);

angular.module('codechallengeApp', ['codechallengeControllers','codechallengeServices']);
