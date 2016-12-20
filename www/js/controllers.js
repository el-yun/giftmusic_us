angular.module('starter.controllers', ['ionic', 'ionic-audio'])

.controller('usCtrl', ['$scope', 'TrackList', function($scope, TrackList) {
	TrackList.init(); // 초기화
	TrackList.getMyPlaylist(); // 플레이리스트 가져오기
}])

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
