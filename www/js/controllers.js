angular.module('starter.controllers', ['ionic', 'ionic-audio'])

  .controller('usCtrl', ['$scope', 'TrackList', function ($scope, TrackList) {
    TrackList.init(); // 초기화
    TrackList.getMyPlaylist(); // 플레이리스트 가져오기
    TrackList.getRecommendAlbum();
  }])

  .controller('searchCtrl', function ($scope) {

  })

  // Index Page
  .controller('topCtrl', ['$scope', 'TrackList', function ($scope, TrackList) {
    TrackList.init(); // 초기화
  }])

  // Player
  .controller('playerCtrl', ['$scope', 'MediaManager', 'TrackList', '$timeout', function ($scope, MediaManager, TrackList, $timeout) {
    var setPlayer = function () {
      // Async
      $timeout(function () {
        if (TrackList.all().length > 0) {
          $scope.dynamicTrack = {};
          $scope.tracks = TrackList.all();
          $scope.dynamicTrack = $scope.tracks[0];
          console.log($scope.dynamicTrack);
          /*
          $scope.stopPlayback = function () {
            MediaManager.stop();
          };
          $scope.playTrack = function (index) {
            $scope.dynamicTrack = $scope.tracks[index];  // 재생
            $scope.togglePlayback = !$scope.togglePlayback;
          };
          */
        } else {
          setPlayer();
        }
      });
    }
    // init
    TrackList.getMyPlaylist(2);
    setPlayer();
  }]);
