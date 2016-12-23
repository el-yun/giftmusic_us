angular.module('starter.services', [])

.factory('TrackList', function($http, $timeout) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var recommend = [];
  var tracks = [];
  var search = [];
  var getList = function(seqno){
	    if(typeof seqno == 'undefined') seqno = 2; // Default Value
      return $http({
        method: 'GET', //방식
        url: 'http://masterplayer.net/music/main/playlist',
        data: {seqno : seqno}
        })
        .success(function(res){
          tracks = new Array();
           // Push Tracks
          angular.forEach(res.album, function(t){
            var track = {seq: t.SEQ, url: t.TRACK_STREAM, artist: t.ARTIST, title: t.TITLE, thumb: t.ALBUM_THUMB};
            tracks.push(track);
          });
        }
      );
  };
  var getRecommend= function(){
    return $http({
      method: 'GET', //방식
      url: 'http://masterplayer.net/music/main/recAlbum',
      })
      .success(function(res){
        recommend = res.album;
        console.log("Status : Recommend List Loaded");
      }
    );
  };

  return {
    init: function(){
      getRecommend();
    },
    all: function() {
      return tracks;
    },
    getMyPlaylist: function(seqno){
      return getList(seqno);
    },
    getRecommendAlbum: function(){
      return getRecommend();
    },
    getSearchTrack : function(text){
      return $http({
        method: 'get', //방식
        url: 'http://masterplayer.net/music/main/search?keyword=' + text,
        data: {keyword: text}
      });
    }
  };
});
