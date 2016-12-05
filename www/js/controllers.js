angular.module('starter.controllers', ['ionic', 'ionic-audio'])
.controller('usCtrl', function($scope) {

})
.controller('searchCtrl', function($scope) {

})
.controller('topCtrl', function($scope) {

})
.controller('playerCtrl', ['$scope', 'MediaManager', function($scope, MediaManager) {

  $scope.dynamicTrack = {};   // we use this scope variable to dynamically assign a track

  $scope.tracks = [
    {
      url: 'http://nepid.kr/Mamamoo.mp3',  // audio file from the cloud
      artist: '마마무',
      title: '데칼코마니'
    }
  ];

  $scope.stopPlayback = function() {
    MediaManager.stop();  // will stop any audio currently playing
  };

  $scope.playTrack = function(index) {
    $scope.dynamicTrack = $scope.tracks[index];   // assign one track

    $scope.togglePlayback = !$scope.togglePlayback; // start playback when track changes
  };
}]);
