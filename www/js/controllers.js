angular.module('starter.controllers', ['ionic', 'ionic-audio'])
.controller('usCtrl', function($scope) {

})
.controller('searchCtrl', function($scope) {

})
.controller('topCtrl', function($scope) {

})
.controller('playerCtrl', ['$scope', 'MediaManager', 'TrackList', function($scope, MediaManager, TrackList) {

	var NextIndex = 0;
	$scope.dynamicTrack = {};

	$scope.tracks = TrackList.all();
	$scope.checkTrack = [];

	$scope.stopPlayback = function() {
		if(NextIndex == 0) MediaManager.stop();
		else {
			$scope.playTrack(NextIndex);
			NextIndex++;
		}
	};

	$scope.playTrack = function(index) {
		NextIndex = 0; // 재생 인덱스 초기화

		$scope.dynamicTrack = $scope.tracks[index];  // 재생
		$scope.togglePlayback = !$scope.togglePlayback;
	};

	$scope.playTracks = function(){
		NextIndex = 0; // 재생 인덱스 초기화

		$scope.playTrack(NextIndex); // 재생
		if(($scope.checkTrack.length -1) > NextIndex) NextIndex++;
		else NextIndex = 0;
	};

	$scope.toggleSelection = function toggleSelection(seq){
		var idx = $scope.checkTrack.indexOf(seq);
		if(idx > -1) $scope.checkTrack.splice(idx, 1);
		else $scope.checkTrack.push(seq);
	}
}]);
