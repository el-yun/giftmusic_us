// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      console.log(Media);
    }
  });

  // Disable BACK button on home
  $ionicPlatform.registerBackButtonAction(function(event) {
    if (true) { // your check here
      $ionicPopup.confirm({
        title: 'System warning',
        template: 'are you sure you want to exit?'
      }).then(function(res) {
        if (res) {
          ionic.Platform.exitApp();
        }
      })
    }
  }, 100);

})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  // Each tab has its own nav history stack:
    .state('us', {
      url: '/us',
      abstract: true,
      templateUrl: 'templates/header.html',
      controller: 'usCtrl'
    })
    .state('us.top', {
      url: '/top',
      templateUrl: 'templates/top.html',
      controller: 'topCtrl'
    })
    .state('search', {
      url: '/search/:keyword',
      templateUrl: 'templates/search.html',
      cache: false,
      controller: 'searchCtrl'
    })
    .state('editlist', {
      url: '/editlist',
      templateUrl: 'templates/editlist.html',
      controller: 'editCtrl'
    })
    .state('player', {
	  cache: false,
      url: '/player',
      templateUrl: 'templates/player.html',
      controller: 'playerCtrl'
    })
    .state('myalbum', {
      url: '/myalbum',
      templateUrl: 'templates/myalbum.html',
      controller: 'myalbumCtrl'
    })
    .state('send', {
      url: '/send',
      templateUrl: 'templates/send.html',
      controller: 'sendCtrl'
    })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/us/top');
  $httpProvider.useApplyAsync(true);

});
