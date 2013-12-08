'use strict';

var tags = null;
var tags_hash = {};

/* App Module */
angular.module('gallery', ['galleryFilters', 'galleryServices', 'google-maps', 'ngRoute']).
    config(['$routeProvider', function($routeProvider){
        $routeProvider.

        when('/tag', {templateUrl: 'partials/group-list.html',   controller: TagListCtrl}).
        when('/tag/page/:pageId', {templateUrl: 'partials/group-list.html',   controller: TagListCtrl}).
        when('/tag/:tagId', {templateUrl: 'partials/picture-list.html', controller: TagDetailCtrl}).
        when('/tag/:tagId/map', {templateUrl: 'partials/map-view.html', controller: MapViewCtrl}).
        when('/tag/:tagId/:pageId', {templateUrl: 'partials/picture-list.html', controller: TagDetailCtrl}).
        when('/tag/:tagId/picture/:pictureId', {templateUrl: 'partials/picture-detail.html', controller: PictureDetailCtrl}).

        when('/event/', {templateUrl: 'partials/group-list.html', controller: EventListCtrl}).
        when('/event/page/:pageId', {templateUrl: 'partials/group-list.html', controller: EventListCtrl}).
        when('/event/:eventId', {templateUrl: 'partials/picture-list.html', controller: EventDetailCtrl}).
        when('/event/:eventId/map', {templateUrl: 'partials/map-view.html', controller: MapViewCtrl}).
        when('/event/:eventId/:pageId', {templateUrl: 'partials/picture-list.html', controller: EventDetailCtrl}).
        when('/event/:eventId/picture/:pictureId', {templateUrl: 'partials/picture-detail.html', controller: PictureDetailCtrl}).

        when('/picture/:pictureId', {templateUrl: 'partials/picture-detail.html', controller: PictureDetailCtrl}).

        otherwise({redirectTo: '/event/'});
    }]);
