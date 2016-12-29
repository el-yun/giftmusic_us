var groupseq = 1;
var cart = [];
const user = "test";
angular.module('starter.controllers', ['ionic'])
  .controller('usCtrl', ['$scope', '$state','TrackList', function ($scope, $state, TrackList) {
    $scope.trackSearch = function(){
      $state.go('search', { 'keyword': $scope.search });
    };    // 목록 담기

  }])
  .controller('editCtrl', ['$scope','$stateParams', '$state', 'TrackList', function ($scope, $stateParams, $state, TrackList) {
    $scope.selection = [];
    TrackList.getMyPlaylist(groupseq, user).then(function(d){
      var edit = [];
      angular.forEach(d.data.album, function (t) {
        var track = {seq: t.SEQ, url: t.TRACK_STREAM, artist: t.ARTIST, title: t.TITLE, thumb: t.ALBUM_THUMB, number: t.TRACK_NUMBER};
        edit.push(track);
      });
      $scope.searchTracks = edit;
    });

    $scope.doTheBack = function() {
      window.history.back();
    };

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
      cart = $scope.selection;
    };

    $scope.setChangePost = function(){
      $state.go('send', null);
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
  .controller('topCtrl', ['$scope', 'TrackList', '$state', function ($scope, TrackList, $state) {
    TrackList.init(); // 초기화
    var albums = [{'PLAYGROUP' : groupseq, 'POST_TITLE' : '내가 담은 음악', 'POST_TOKEN' : null}];
    TrackList.getAlbum(user).then(function(d){
      angular.forEach(d.data[0], function(a){
        albums.push(a);
      });
      $scope.albums = albums;
    });

    $scope.goAlbum = function(group){
      if(typeof token == 'undefined'){
        $state.go('player', { 'group': null });
      } else {
        $state.go('player', { 'group': group });
      }
    };    // 목록 담기
  }])

  // Myalbum
  .controller('myalbumCtrl', ['$scope', 'TrackList', '$state', function ($scope, TrackList, $state) {
    TrackList.init(); // 초기화
    var albums = [];
    TrackList.getAlbum(user).then(function(d){
      angular.forEach(d.data[0], function(a){
        albums.push(a);
      });
      $scope.albums = albums;
    });

    $scope.goAlbum = function(group){
      if(typeof token == 'undefined'){
        $state.go('player', { 'group': null });
      } else {
        $state.go('player', { 'group': group });
      }
    };    // 목록 담기
  }])
  // Send
  .controller('sendCtrl', ['$scope', 'TrackList', function ($scope, TrackList) {
	  var token = "test";
	  $scope.imageChange = function(){
			console.log($scope.send);
	  };
    $scope.albumcnt = cart.length;
	  $scope.sender = function(){
      console.log($scope.send);
      TrackList.sendPost(groupseq, $scope.selection, null , "POST");
		  window.open('http://masterplayer.net/main/message?token=' + token, '_system');
	  };
  }])
  // Player
  .controller('playerCtrl', ['$scope', 'TrackList', '$timeout', '$interval', 'PlayerService', '$stateParams', function ($scope, TrackList, $timeout, $interval, PlayerService, $stateParams) {
	var current = -1;
	$scope.title = "No Track";
	$scope.artist = "No Artist";
	$scope.thumb = ""
  $scope.seek = 0;
  $scope.progress = function(t){
    var duration = PlayerService.duration();
    var seek = Math.floor(duration*(t/100));
    PlayerService.toSeek(seek);
  };
	$scope.playerPrev = function(){
		PlayerService.previous();
    $scope.seek = 0;
	};
	$scope.playerNext = function(){
		PlayerService.next();
    $scope.seek = 0;
	};
	$scope.playerStop = function(){
		PlayerService.pause();
	};
    $scope.playerToPlay = function (i) {
      PlayerService.currentIndex = i;
      PlayerService.play();
    };
    $scope.formatDate = function (date) {
      var dateOut = new Date(date);
      return dateOut;
    };
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
      $scope.indexer = index;
			current = index;
		}
    var duration = PlayerService.duration();
    var time = PlayerService.time();
    $scope.seek = Math.floor(100*(time/duration));
    $scope.playtime = Math.floor(time*1000);
    $scope.endtime = Math.floor(duration*1000);
	}, 500);
    // init
    if(typeof $stateParams.group == 'undefined') $stateParams.group = groupseq;
    else groupseq = $stateParams.group;
    TrackList.getMyPlaylist($stateParams.group, user);
    setPlayer();
  }]);
