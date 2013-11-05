'use strict';

/* App Module */

angular.module('phonecat', ['phonecatFilters', 'phonecatServices', 'anotherServices']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/tag', {templateUrl: 'partials/tag-bar.html',   controller: TagListCtrl}).
      when('/tag/:tagId', {templateUrl: 'partials/tag-detail.html', controller: TagDetailCtrl}).
      when('/picture/:pictureId', {templateUrl: 'partials/picture-detail.html', controller: PictureDetailCtrl}).
      otherwise({redirectTo: '/tag'});
}]);
