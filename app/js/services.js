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
      console.log("cache miss", meth, args);
      var result = self._resource[meth](args, function(result){if(typeof(callback)=="function"){callback(result);}});
      //var result = self._resource[meth](args, callback);
      self._cache[meth][args_stringified] = result;
    }
    else {
      var result = self._cache[meth][args_stringified];
      console.log("cache hit", meth, args);
      if( typeof(callback) == "function"){
        callback(result);
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
                query: {method:'GET', 'params':{tagId:'all-tags'}, isArray:true}
            }), "get,query"),
            picture: new ResourceCachingProxy($resource('data/pictures/:pictureId.json', {}, {
                query: {method:'GET', 'params':{}, isArray:false}
            }), "get,query"),
            'event': new ResourceCachingProxy($resource('data/events/:eventId.json', {}, {
                query: {method:'GET', 'params':{eventId: 'all-events'}, isArray:true}
            }), "get,query")
        };

        return Gallery;
});
