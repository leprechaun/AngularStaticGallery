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
angular.module('phonecatServices', ['ngResource']).
    factory('Tag', function($resource){
        return $resource('data/tags/:tagId.json', {}, {
            query: {method:'GET', params:{tagId:'all-tags'}, isArray:true},
        }
  );
});
    
angular.module('anotherServices', ['ngResource']).
    factory('Picture', function($ressource){
        return $resource('data/pictures/:pictureId.json', {}, {
            query: {method:'GET', params:{pictureId: 'all-pictures'}, isArray:true},
        }
  );
});
