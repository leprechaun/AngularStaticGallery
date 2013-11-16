'use strict';

/* Services */
var myModule = angular.module('galleryServices', ['ngResource']);
myModule.factory('Gallery', function($resource){
        return {
            tag: $resource('data/tags/:tagId.json', {}, {
                query: {method:'GET', 'params':{tagId:'all-tags'}, isArray:true}
            }),
            picture: $resource('data/pictures/:pictureId.json', {}, {
                query: {method:'GET', 'params':{}, isArray:false}
            })
        };
});
