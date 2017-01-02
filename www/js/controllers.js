var groupseq = 1;
var cart = [];
var toastView = function(scope, timeout, message){
  scope.toast_message = message;
  scope.toast = true;
  timeout(function(){
    scope.toast = false;
  }, 3000);
}
const user = "test";
angular.module('starter.controllers', ['ionic'])
  .controller('usCtrl', ['$scope', '$state','TrackList', function ($scope, $state, TrackList) {
    $scope.trackSearch = function(){
      console.log("go");
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

    $scope.goAlbum = function(){
      TrackList.pushPlayGroup(groupseq, $scope.selection, "PLAYLIST");
      $state.go('player', { 'group': null });
    };

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
      $state.go('send', { 'cnt' : cart });
      $scope.apply();
    };
  }])

  .controller('searchCtrl', ['$scope','$stateParams', 'TrackList', '$state', '$timeout', function ($scope, $stateParams, TrackList, $state, $timeout) {
      var search = [];
      $scope.selection = [];
      $scope.tab = true;
      $scope.keyword = "";

      $scope.viewMenu = function(seqno){
        $scope.menu = true;
        $scope.selectAlbum = seqno;
      };

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
      if(typeof $stateParams.keyword != 'undefined'){
        console.log($stateParams.keyword);
        printList($stateParams.keyword);
      }

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
          $scope.viewMenu();
          $scope.selection.push(index);
        }
      };

      $scope.goAlbum = function(){
        TrackList.pushPlayGroup(groupseq, $scope.selection, "PLAYLIST");
        $state.go('player', { 'group': null });
      };

      $scope.pushList = function(){
        TrackList.pushPlayGroup(groupseq, $scope.selection, "PLAYLIST");
        toastView($scope, $timeout, "앨범의 노래를 플레이리스트에 담았습니다.");
      };

      $scope.gift = function(){
        TrackList.pushPlayGroup(groupseq, $scope.selection, "PLAYLIST");
        $state.go('send', { 'cnt' : cart });
      }
  }])

  // Index Page
  .controller('topCtrl', ['$scope', 'TrackList', '$state', '$timeout',function ($scope, TrackList, $state, $timeout) {
    TrackList.init(); // 초기화
    var albums = [{'PLAYGROUP' : groupseq, 'POST_TITLE' : '내가 담은 음악', 'POST_TOKEN' : null}];
    TrackList.getAlbum(user).then(function(d){
      angular.forEach(d.data[0], function(a){
        albums.push(a);
      });
      $scope.albums = albums;
    });

    $scope.viewMenu = function(seqno){
      $scope.menu = true;
      $scope.selectAlbum = seqno;
    };

    $scope.pushAlbum = function(seqno){
      TrackList.getTracks(seqno, user).then(function(d){
        var result = TrackList.setPlayGroup(d.data);
        toastView($scope, $timeout, "앨범의 노래를 플레이리스트에 담았습니다.");
      });
    };

    $scope.gift = function(seqno){
      TrackList.getTracks(seqno, user).then(function(d){
        angular.forEach(d.data.album, function (t) {
          cart.push(t.TRACK_NUMBER);
        });
        $state.go('send', { 'cnt' : cart });
      });
    };

    $scope.goAlbum = function(group){
      if(typeof token == 'undefined'){
        $state.go('player', { 'group': null });
      } else {
        $state.go('player', { 'group': group });
      }
    };    // 목록 담기
  }])

  // Myalbum
  .controller('myalbumCtrl', ['$scope', 'TrackList', '$state', '$timeout', function ($scope, TrackList, $state, $timeout) {
    TrackList.init(); // 초기화
    var albums = [];
    TrackList.getAlbum(user).then(function(d){
      angular.forEach(d.data[0], function(a){
        albums.push(a);
      });
      console.log(albums);
      $scope.albums = albums;
    });

    $scope.pushAlbum = function(seqno){
      console.log(seqno);
      TrackList.getTracks(seqno, user).then(function(d){
        var result = TrackList.setPlayGroup(d.data);
        toastView($scope, $timeout, "앨범의 노래를 플레이리스트에 담았습니다.");
      });
    };

    $scope.viewMenu = function(seqno){
      $scope.menu = true;
      $scope.selectAlbum = seqno;
    };

    $scope.gift = function(seqno){
      TrackList.getTracks(seqno, user).then(function(d){
        angular.forEach(d.data.album, function (t) {
          cart.push(t);
        });
        $state.go('send', { 'cnt' : cart });
      });
    };

    $scope.goAlbum = function(group){
      if(typeof token == 'undefined'){
        $state.go('player', { 'group': null });
      } else {
        $state.go('player', { 'group': group });
      }
    };    // 목록 담기
  }])
  // Send
  .controller('sendCtrl', ['$rootScope' ,'$scope', 'TrackList', '$stateParams', '$httpParamSerializerJQLike', function ($rootScope, $scope, TrackList, $stateParams, $httpParamSerializerJQLike) {
	  var token = "test";
    $scope.albumcnt = 0;
    $scope.tracks = [];
    $scope.sendfrm = [];

    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams){
        // do something
        $scope.albumcnt = cart.length;
      });
    /*
    $scope.uploadFile = function(event){
      var files = event.target.files;
      if (files && files[0]) {
        var reader = new FileReader();
        reader.onload = function(event) {
          $scope.sendfrm.image = event.target.result;
          $scope.sendfrm.preview = event.target.result;
          $scope.$apply();
        }
        reader.readAsDataURL(files[0]);
        //reader.readAsBinaryString(files[0]);
      }
	  };
	  */

	  $scope.sender = function(){
      var formData = $scope.sendfrm;
      //var formfile = formData.file;
      formData.group = groupseq;
      formData.type = "POST";
      formData.sender = user;
      TrackList.sendPost(formData, cart).then(function(d){
        var p = d.data.data.token;
        window.open('http://masterplayer.net/main/message?token=' + encodeURI(p) + '&message=' + encodeURIComponent(formData.description), '_system', 'location=yes');
      });
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
    if(PlayerService.trackList.length > 0) {
      if (current != index) {
        $scope.title = PlayerService.trackList[index].title;
        $scope.artist = PlayerService.trackList[index].artist;
        $scope.thumb = PlayerService.trackList[index].thumb;
        $scope.indexer = index;
        current = index;
      }
      var duration = PlayerService.duration();
      var time = PlayerService.time();
      $scope.seek = Math.floor(100 * (time / duration));
      $scope.playtime = Math.floor(time * 1000);
      $scope.endtime = Math.floor(duration * 1000);
    }
	}, 500);
    // init
    if(typeof $stateParams.group == 'undefined') $stateParams.group = groupseq;
    else groupseq = $stateParams.group;
    TrackList.getMyPlaylist($stateParams.group, user);
    setPlayer();
  }])
.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
})
.directive('file', function () {
  return {
    scope: {
      file: '='
    },
    link: function (scope, el, attrs) {
      el.bind('change', function (event) {
        var file = event.target.files[0];
        scope.file = file ? file : undefined;

        var reader = new FileReader();
        reader.onload = function(event) {
          //scope.file = event.target.result;
          console.log(scope);
        }
        scope.$apply();
        //reader.readAsDataURL(file);
        reader.readAsBinaryString(file);
      });
    }
  };
})
