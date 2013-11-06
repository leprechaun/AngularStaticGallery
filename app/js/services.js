'use strict';

/* Services */

/*
angular.module('phonecatServices', ['ngResource']).
    factory('Tag', function($resource){
        return $resource('data/tags/:tagId.json', {}, {
            query: {method:'GET', params:{tagId:'all-tags'}, isArray:true},
        }
  );
});
    */
var myModule = angular.module('phonecatServices', ['ngResource']);
myModule.factory('Galery', function($resource){
        return {
            tag: $resource('data/tags/:tagId.json', {}, {
                query: {method:'GET', 'params':{tagId:'all-tags'}, isArray:true}
            }),
            picture: $resource('data/pictures/:pictureId.json', {}, {
                query: {method:'GET', 'params':{}, isArray:false}
            })
        };
});
