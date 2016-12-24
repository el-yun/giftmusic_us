const groupseq = 1;
angular.module('starter.controllers', ['ionic', 'ionic-audio'])

  .controller('usCtrl', ['$scope', '$state','TrackList', function ($scope, $state, TrackList) {
    TrackList.init(); // 초기화
    TrackList.getMyPlaylist(); // 플레이리스트 가져오기
    TrackList.getRecommendAlbum();

    $scope.trackSearch = function(){
      $state.go('search', { 'keyword': $scope.search });
    };    // 목록 담기

  }])

  .controller('editCtrl', ['$scope','$stateParams', 'TrackList', function ($scope, $stateParams, TrackList) {
    $scope.selection = [];
    TrackList.getMyPlaylist(groupseq).then(function(d){
      var edit = [];
      angular.forEach(d.data.album, function (t) {
        var track = {seq: t.SEQ, url: t.TRACK_STREAM, artist: t.ARTIST, title: t.TITLE, thumb: t.ALBUM_THUMB, number: t.TRACK_NUMBER};
        edit.push(track);
      });
      $scope.searchTracks = edit;
    });

    // 토클된 트랙
    $scope.checkedItem = function(i){
      var idx = $scope.selection.indexOf(i);
      // is currently selected
      if (idx > -1) {
        return true;
      } else return false;
    };

    // 토글 처리
    $scope.toggleSelection = function(index) {
      var idx = $scope.selection.indexOf(index);
      // is currently selected
      if (idx > -1) {
        $scope.selection.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.selection.push(index);
      }
    };
    
    $scope.setChangePost = function(){
      TrackList.updatePlayGroup(groupseq, $scope.selection, "POST");
    };
  }])

  .controller('searchCtrl', ['$scope','$stateParams', 'TrackList', function ($scope, $stateParams, TrackList) {
      var search = [];
      $scope.selection = [];
      $scope.tab = true;
      $scope.keyword = "이문세";


      // 검색 내용 출력
      var printList = function (d){
        TrackList.getSearchTrack(d).then(function(d){
          search = [];
          angular.forEach(d.data.album, function (t) {
            var track = {seq: t.SEQ, url: t.TRACK_STREAM, artist: t.ARTIST, title: t.TITLE, thumb: t.ALBUM_THUMB, number: t.TRACK_NUMBER};
            search.push(track);
          });
          $scope.searchTracks = search;
        });
      };

      // 음악 검색
      $scope.trackSearch = function(t){
        printList(t.keyword);
      };
      if(typeof $stateParams.keyword != 'undefined') printList($stateParams.keyword);

      // 토클된 트랙
      $scope.checkedItem = function(i){
        var idx = $scope.selection.indexOf(i);
        // is currently selected
        if (idx > -1) {
          return true;
        } else return false;
      };

      // 토글 처리
      $scope.toggleSelection = function(index) {
        var idx = $scope.selection.indexOf(index);
          // is currently selected
        if (idx > -1) {
          $scope.selection.splice(idx, 1);
        }
          // is newly selected
        else {
          $scope.selection.push(index);
        }
      };

      $scope.pushList = function(){
        TrackList.pushPlayGroup(groupseq, $scope.selection, "PLAYLIST");
      };
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
    TrackList.getMyPlaylist(groupseq);
    setPlayer();
  }]);
