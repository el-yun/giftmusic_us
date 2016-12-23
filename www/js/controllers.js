angular.module('starter.controllers', ['ionic', 'ionic-audio'])

  .controller('usCtrl', ['$scope', '$state','TrackList', function ($scope, $state, TrackList) {
    TrackList.init(); // 초기화
    TrackList.getMyPlaylist(); // 플레이리스트 가져오기
    TrackList.getRecommendAlbum();

    $scope.trackSearch = function(){
      $state.go('us.search', { 'keyword': $scope.search });
    };
  }])
  .controller('searchCtrl', ['$scope','$stateParams', 'TrackList', function ($scope, $stateParams, TrackList) {
      var search = [];
      // Get Data
      var printList = function (d){
        TrackList.getSearchTrack(d).then(function(d){
        angular.forEach(d.data.album, function (t) {
          var track = {seq: t.SEQ, url: t.TRACK_STREAM, artist: t.ARTIST, title: t.TITLE, thumb: t.ALBUM_THUMB};
          search.push(track);
        });
        $scope.searchTracks = search;
        });
      }
      // Request Search
      $scope.trackSearch = function(){
        printList($scope.search);
      };
      if(typeof $stateParams.keyword != 'undefined') printList($stateParams.keyword);
  }])

  // Index Page
  .controller('topCtrl', ['$scope', 'TrackList', function ($scope, TrackList) {
    TrackList.init(); // 초기화
  }])
  // Myalbum
  .controller('myalbumCtrl', ['$scope', 'TrackList', function ($scope, TrackList) {

  }])
  // Send
  .controller('sendCtrl', ['$scope', 'TrackList', function ($scope, TrackList) {

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
