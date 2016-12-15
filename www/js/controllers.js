angular.module('starter.controllers', ['ionic', 'ionic-audio'])
.controller('usCtrl', function($scope, $http) {
	$http({
	method: 'GET', //방식
	url: 'http://masterplayer.net/music/main/album', /* 통신할 URL */
	data: {seqno : 2} /* 파라메터로 보낼 데이터 */
	})
	.success(
		function(res){
			playlist = res.album;
			console.log(playlist);
		}
	);
})
.controller('searchCtrl', function($scope) {

})
.controller('topCtrl', function($scope) {

})
.controller('playerCtrl', ['$scope', 'MediaManager', 'TrackList', function($scope, MediaManager, TrackList) {

	var NextIndex = 0;
	$scope.dynamicTrack = {};

	$scope.tracks = TrackList.all();

	$scope.stopPlayback = function() {
		MediaManager.stop();
	};

	$scope.playTrack = function(index) {
		$scope.dynamicTrack = $scope.tracks[index];  // 재생
		$scope.togglePlayback = !$scope.togglePlayback;
	};
}]);
