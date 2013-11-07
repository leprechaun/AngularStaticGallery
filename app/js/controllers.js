'use strict';

/* TagList */
function TagListCtrl($scope, Gallery) {
  $scope.tags = Gallery.tag.query();
  $scope.orderProp = 'name';
  $scope.thumbs_base_path = thumbs_base_path;
}

/* PictureDetail */
function PictureDetailCtrl($scope, $routeParams, Gallery) {
  $scope.picture = Gallery.picture.get({pictureId: $routeParams.pictureId}, function(picture) {
    $scope.picturePath = picture.path;
  });

  $scope.tags = Gallery.tag.query();
  $scope.orderProp = 'name';
  $scope.pictures_base_path = pictures_base_path;
}

/* TagDetail */
function TagDetailCtrl($scope, $routeParams, Gallery) {

  if($routeParams.pageId == undefined)
  {
      $scope.current_page = 0;
  }
  else
  {
      $scope.current_page = $routeParams.pageId;
  }

  $scope.thumbs_base_path = thumbs_base_path;
  $scope.current_page = 0;
  $scope.items_per_page = 32;
  $scope.pages = [];
  $scope.page = [];
  $scope.nextPage = function(){
    if( $scope.pages[$scope.current_page+1] != undefined)
    {
      $scope.current_page = $scope.current_page + 1;
      $scope.page = $scope.pages[$scope.current_page];
    }
  }

  $scope.previousPage = function(){
    if( $scope.pages[$scope.current_page-1] != undefined)
    {
      $scope.current_page = $scope.current_page - 1;
      $scope.page = $scope.pages[$scope.current_page];
    }
  }

  $scope.tags = Gallery.tag.query();
  $scope.orderProp = 'name';

  $scope.tag = Gallery.tag.get({tagId: $routeParams.tagId}, function(tag) {
    $scope.mainImageUrl = tag.thumbnail;
    $scope.tag = tag;

    for( var i = 0; i < tag.pictures.length; i++ )
    {
      var pi = Math.floor(i / $scope.items_per_page);
      if( $scope.pages[pi] == undefined)
      {
        $scope.pages[pi] = [];
      }
      $scope.pages[pi].push(tag.pictures[i]);
    }

    $scope.page = $scope.pages[$scope.current_page];
  });
}
