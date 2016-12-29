angular.module('starter.services', [])
  .factory('TrackList', function($http, $timeout) {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var recommend = [];
    var tracks = [];
    var search = [];
    var getList = function(seqno, user){
      return $http({
        method: 'GET', //방식
        url: "http://masterplayer.net/main/playlist?seqno=" + seqno + "&user=" + user
      })
        .success(function(res){
            tracks = new Array();
            // Push Tracks
            angular.forEach(res.album, function(t){
              var track = {seq: t.SEQ, url: t.TRACK_STREAM, artist: t.ARTIST, title: t.TITLE, thumb: t.ALBUM_THUMB, send: t.TYPE};
              tracks.push(track);
            });
          }
        );
    };
    var getRecommend= function(){
      return $http({
        method: 'GET', //방식
        url: 'http://masterplayer.net/main/recAlbum',
      })
        .success(function(res){
            recommend = res.album;
            console.log("Status : Recommend List Loaded");
          }
        );
    };

    return {
      init: function(){
        tracks = [];
        getRecommend();
        getList(groupseq, "PLAYLIST").then(function(d){
          receive = [];
          angular.forEach(d.data.album, function (t) {
            var track = {seq: t.SEQ, url: t.TRACK_STREAM, artist: t.ARTIST, title: t.TITLE, thumb: t.ALBUM_THUMB, number: t.TRACK_NUMBER};
            receive.push(track);
          });
          tracks = receive;
        });
      },
      all: function() {
        return tracks;
      },
      getMyPlaylist: function(seqno, user){
        return getList(seqno, user);
      },
      getEditlist: function(seqno){
        return getList(seqno, "POST");
      },
      getRecommendAlbum: function(){
        return getRecommend();
      },
      getAlbum : function(user){
        return $http({
          method: 'get', //방식
          url: 'http://masterplayer.net/main/AlbumList?user=' + user
        });
      },
      getSearchTrack : function(text){
        return $http({
          method: 'get', //방식
          url: 'http://masterplayer.net/main/search?keyword=' + text,
          data: {keyword: text}
        });
      },
      pushPlayGroup : function(group, tracks, type){
        return $http({
          method: 'post', //방식
          url: 'http://masterplayer.net/main/push',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
          },
          data : {group: group, tracks: tracks, type: type}
        }).success(function(d){
          console.log(d);
        });
      },
      sendPost : function(group, tracks, type, d){
        console.log(d);
        return $http({
          method: 'post', //방식
          url: 'http://masterplayer.net/main/updatepost',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
          },
          data : {group: group, tracks: tracks, type: type}
        }).success(function(d){
          console.log(d);
        });
      }
    };
  })
  .service('PlayerService', function(AudioFactory) {
    var myPlayer = {

      isPaused: true,
      // Sample tracks, to be replaced by the audio files you actually want to use
      trackList: [],
      currentIndex: 0,
      currentTime: 0,
      play: function () {
        myPlayer.isPaused = false;
        AudioFactory.src = myPlayer.trackList[myPlayer.currentIndex].url;
        AudioFactory.play();
        myPlayer.currentTime = 0;
      },
      pause: function () {
        myPlayer.isPaused = !myPlayer.isPaused;
        if (myPlayer.isPaused) {
          AudioFactory.pause();
          myPlayer.currentTime = AudioFactory.currentTime;
        } else {
          AudioFactory.currentTime = myPlayer.currentTime;
          AudioFactory.play();
        }
      },
      previous: function () {
        if (myPlayer.currentIndex > 0) {
          myPlayer.currentIndex--;
          myPlayer.play();
        }
      },

      next: function () {
        if (myPlayer.currentIndex < myPlayer.trackList.length) {
          myPlayer.currentIndex++;
          myPlayer.play();
        }
      },
      duration : function(){
        return AudioFactory.duration;
      },
      time : function(){
        myPlayer.currentTime = AudioFactory.currentTime;
        return AudioFactory.currentTime;
      },
      toSeek : function(t){
        AudioFactory.currentTime = t;
      }
    };

    return myPlayer;
  })

.factory('AudioFactory', function($document) {
  var audio = $document[0].createElement('audio');
  return audio;
});
