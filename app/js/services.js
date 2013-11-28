'use strict';

function ResourceCachingProxy(resource, methods_to_cache){
  this._cache = {};
  this._resource = resource;

  var methods = "get,query".split(",");
  for( var i in methods ){
    this[methods[i]] = this._makeProxy(this, methods[i]);
  }
}

ResourceCachingProxy.prototype._makeProxy = function(self, method){
  var meth = method;
  this._cache[method] = {};
  var self = self;
  return function(args, callback){
    var args_stringified = JSON.stringify(args);
    if(!(args_stringified in self._cache[meth])){
      var result = self._resource[meth].apply(self._resource, arguments);
      self._cache[meth][args_stringified] = result;
    }
    else {
      var result = self._cache[meth][args_stringified];
      if(arguments.length == 0){
        true;
      }
      else if(typeof(arguments[0]) == 'function'){
        arguments[0](result);
      }
      else{
        arguments[1](result);
      }
    }

    return result;
  };
}



/* Services */
var myModule = angular.module('galleryServices', ['ngResource']);
myModule.factory('Gallery', function($resource){
        var Gallery = {
            tag: new ResourceCachingProxy($resource('data/tags/:tagId.json', {}, {
                query: {method:'GET', 'params':{tagId:'all-tags', _cache: data_refresh}, isArray:true}
            }), "get,query"),
            picture: new ResourceCachingProxy($resource('data/pictures/:pictureId.json', {}, {
                query: {method:'GET', 'params':{_cache: data_refresh}, isArray:false}
            }), "get,query"),
            'event': new ResourceCachingProxy($resource('data/events/:eventId.json', {}, {
                query: {method:'GET', 'params':{eventId: 'all-events', _cache: data_refresh}, isArray:true}
            }), "get,query")
        };

        return Gallery;
});
