'use strict';

var tags = null;
var tags_hash = {};

/* App Module */
angular.module('gallery', ['galleryFilters', 'galleryServices', 'google-maps']).
    config(['$routeProvider', function($routeProvider){
        $routeProvider.

        when('/tag', {templateUrl: 'partials/tag-bar.html',   controller: TagListCtrl}).
        when('/tag/:tagId', {templateUrl: 'partials/tag-detail.html', controller: TagDetailCtrl}).
        when('/tag/:tagId/:pageId', {templateUrl: 'partials/picture-list.html', controller: TagDetailCtrl}).
        when('/tag/:tagId/picture/:pictureId', {templateUrl: 'partials/picture-detail.html', controller: PictureDetailCtrl}).

        when('/event/', {templateUrl: 'partials/event-list.html', controller: EventListCtrl}).
        when('/event/:eventId', {templateUrl: 'partials/picture-list.html', controller: EventDetailCtrl}).
        when('/event/:eventId/:pageId', {templateUrl: 'partials/picture-list.html', controller: EventDetailCtrl}).
        when('/event/:eventId/picture/:pictureId', {templateUrl: 'partials/picture-detail.html', controller: PictureDetailCtrl}).

        when('/picture/:pictureId', {templateUrl: 'partials/picture-detail.html', controller: PictureDetailCtrl}).

        otherwise({redirectTo: '/event'});
    }]);
