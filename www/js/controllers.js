const groupseq = 1;
angular.module('starter.controllers', ['ionic'])

  .controller('usCtrl', ['$scope', '$state','TrackList', function ($scope, $state, TrackList) {
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
  }])
  // Myalbum
  .controller('myalbumCtrl', ['$scope', 'TrackList', function ($scope, TrackList) {

  }])
  // Send
  .controller('sendCtrl', ['$scope', 'TrackList', function ($scope, TrackList) {
	  var token = "test";
	  $scope.send = function(){
		  window.open('http://masterplayer.net/music/main/message?token=' + token, '_system');
	  };
  }])
  // Player
  .controller('playerCtrl', ['$scope', 'TrackList', '$timeout', '$interval', 'PlayerService', function ($scope, TrackList, $timeout, $interval, PlayerService) {
	var current = -1;
	$scope.title = "No Track";
	$scope.artist = "No Artist";
	$scope.thumb = "";

	$scope.playerPrev = function(){
		PlayerService.previous();
	};
	$scope.playerNext = function(){
		PlayerService.next();
	};
	$scope.playerStop = function(){
		PlayerService.pause();
	};
	$scope.playerToPlay = function(i){
		PlayerService.currentIndex = i;
		PlayerService.play();
	}
	var setPlayer = function () {
	  // Async
	  $timeout(function () {
		if (TrackList.all().length > 0) {
		  $scope.dynamicTrack = {};
		  $scope.tracks = [];
		  $scope.tracks = TrackList.all();
		  angular.forEach($scope.tracks, function (t) {
			PlayerService.trackList.push(t);
		  });
		  PlayerService.play();
		} else {
		  setPlayer();
		}
	  });
	}
	$interval(function() {
		var index = PlayerService.currentIndex;
		if(current != index)
		{
			$scope.title = PlayerService.trackList[index].title;
			$scope.artist = PlayerService.trackList[index].artist;
			$scope.thumb = PlayerService.trackList[index].thumb;
			current = index;
		}
		var seek = PlayerService.time();
		var duration = PlayerService.duration();
		console.log(Math.floor(seek) + "/" + Math.floor(duration)) ;
	}, 1000);
	// init
	setPlayer();
	TrackList.init(); // 초기화
  }]);
