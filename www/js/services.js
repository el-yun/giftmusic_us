angular.module('starter.services', [])

.factory('TrackList', function($http) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var recommend = [];
  var tracks = [
    {
	  seq: 0,
      url: 'http://masterplayer.net/track/100000.mp3',  // audio file from the cloud
      artist: '이문세',
      title: '광화문연가'
    },
    {
	  seq: 1,
      url: 'http://masterplayer.net/track/100001.mp3',  // audio file from the cloud
      artist: '이문세',
      title: '그녀의 웃음소리뿐'
    },
    {
	  seq: 2,
      url: 'http://masterplayer.net/track/100002.mp3',  // audio file from the cloud
      artist: '이문세',
      title: '난 아직 모르잖아요'
    }
  ];
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
				var track = {seq: t.SEQ, url: t.TRACK_STREAM, artist: t.ARTIST, title: t.TITLE};
				tracks.push(track);
			});
			console.log("Status : Music PlayList Loaded");
		}
	);
  }
	
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
  }

  return {
	init: function(){
		getRecommend();
	},
    all: function() {
      return tracks;
    },
	setTrack: function(t){
		playlist = t;
	},
	getMyPlaylist: function(seqno){
		return getList(seqno);
	},
	getRecommandAlbum: function(){
		return recommand;
	}
  };
});
