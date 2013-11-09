'use strict';

var pictures_base_path = "http://localhost/pictures/";
var thumbs_base_path = "data/thumbnails/";

/* App Module */
angular.module('phonecat', ['phonecatFilters', 'phonecatServices']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/tag', {templateUrl: 'partials/tag-bar.html',   controller: TagListCtrl}).
      when('/tag/:tagId/picture/:pictureId', {templateUrl: 'partials/picture-detail.html', controller: PictureDetailCtrl}).
      when('/tag/:tagId/:pageId', {templateUrl: 'partials/tag-detail.html', controller: TagDetailCtrl}).
      when('/tag/:tagId', {templateUrl: 'partials/tag-detail.html', controller: TagDetailCtrl}).
      when('/picture/:pictureId', {templateUrl: 'partials/picture-detail.html', controller: PictureDetailCtrl}).
      otherwise({redirectTo: '/tag'});
}]);
