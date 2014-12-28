AWS.config.update({
    accessKeyId:     'AKIAIORSY2OG7W3FHNHQ', 
    secretAccessKey: 'ObXBtFwAiaGwB210evsH5KEyi/OHYsCMeR71TwJ2', // replace these credentials with the keys provided to you
    region: 'us-west-2'
  });

angular.module('codechallenge', []).controller('MainCtrl', ['$scope', function($scope){
    $scope.greeting = "Hi, add and view your files here";
    $scope.addFile = function(bucket){
      var bucket = new AWS.S3({params: {Bucket: 'codechallengetrial'}});
      var fileChooser = document.getElementById('file-chooser');
      var file = fileChooser.files[0];
      
      bucket.putObject({
        Key: "brianneking86/trialfile.txt", // this is basically the filename -- replace YOURNAME with your first and last name, lowercase, no spaces
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
            console.log(data);
          }
        }
      )
    };
    
  //   $scope.listFiles = function(){
  //     bucket.listObjects({
  //       Prefix: "brianneking" // again replace with your first and last name, lower case, no spaces; must include this key
  //     }, function(err, data) {
  //       if (err) {
  //         console.log(err)
  //       }
  //       if (data) {
  //         console.log(data) // you'll want to do something more interesting than console.log with the data
  //                           // data will be a javascript object that looks something like this:
  //                           // {
  //                           //   CommonPrefixes: [],
  //                           //   Contents: [
  //                           //    {ETag: "number", Key: "first_filename", LastModified: aDate, Size: 200, StorageClass: "STANDARD"},
  //                           //    {ETag: "anotherNumber", Key: "second_filename", LastModified: anotherDate, Size: 500, StorageClass: "STANDARD"},
  //                           //   ],
  //                           //   IsTruncated: false,
  //                           //   Marker: "",
  //                           //   MaxKeys: 1000, 
  //                           //   Name: "yh.interview",
  //                           //   Prefix: "YOURNAME"
  //                           // }
  //                           // you're probably only going to be interested in Contents, and then the Key attribute from the objects in that array
  //                           // data.Contents[0].Key will get you "first_filename", the name of the first file in your bucket
  //       }
  //   });
  // };
  }
]);