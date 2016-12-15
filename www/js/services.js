angular.module('starter.services', [])

.factory('TrackList', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var playlist = [];
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
  return {
    all: function() {
      return tracks;
    },
	setTrack: function(t){
		playlist = t;
	}
  };
});
