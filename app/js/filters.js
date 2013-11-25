'use strict';

/* Filters */

angular.module('galleryFilters', []).filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});

angular.module('galleryFilters', []).filter('startFrom', function() {
  return function(input, start) {
    if(input == undefined){
      return input;
    }
    start = +start; //parse to int
    return input.slice(start);
  }
});
