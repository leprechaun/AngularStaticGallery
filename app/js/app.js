'use strict';

var tags = null;
var tags_hash = {};

/* App Module */
angular.module('gallery', ['galleryFilters', 'galleryServices', 'google-maps']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/tag', {templateUrl: 'partials/tag-bar.html',   controller: TagListCtrl}).
      when('/tag/:tagId/picture/:pictureId', {templateUrl: 'partials/picture-detail.html', controller: PictureDetailCtrl}).
      when('/tag/:tagId/:pageId', {templateUrl: 'partials/tag-detail.html', controller: TagDetailCtrl}).
      when('/tag/:tagId', {templateUrl: 'partials/tag-detail.html', controller: TagDetailCtrl}).
      when('/picture/:pictureId', {templateUrl: 'partials/picture-detail.html', controller: PictureDetailCtrl}).
      otherwise({redirectTo: '/tag'});
}]);
