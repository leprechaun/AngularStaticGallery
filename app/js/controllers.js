'use strict';

/* TagList */
function TagListCtrl($scope, Gallery){

    if( tags == null )
    {
        $scope.tags = Gallery.tag.query();
        tags = $scope.tags;
    }
    else
    {
        $scope.tags = tags;
    }

  $scope.orderProp = 'name';
  $scope.thumbs_base_path = thumbs_base_path;
}

/* PictureDetail */
function PictureDetailCtrl($scope, $routeParams, Gallery) {
  /* SET SOME DEFAULTS */
  $scope.center = {longitude: 0, latitude: 0};
  $scope.orderProp = 'name';
  $scope.pictures_base_path = pictures_base_path;
  $scope.thumbs_base_path = thumbs_base_path;
  $scope.zoom = 8;

  /* GET PICTURE + CALLBACK */
  $scope.picture = Gallery.picture.get({pictureId: $routeParams.pictureId}, function(picture){
    $scope.picturePath = picture.path;
    $scope.exif = picture.exif;

    if( $scope.exif['GPS GPSLongitude'] )
    {
        var longitude = $scope.exif['GPS GPSLongitude'][0][0]/$scope.exif['GPS GPSLongitude'][0][1];
        var latitude = $scope.exif['GPS GPSLatitude'][0][0]/$scope.exif['GPS GPSLatitude'][0][1];

        if( $scope.exif['GPS GPSLongitudeRef'] == "W" )
        {
            longitude = -longitude;
        }

        if( $scope.exif['GPS GPSLatitudeREf'] == "S")
        {
            latitude = -latitude;
        }

        $scope.center = {longitude: longitude, latitude: latitude};
        $scope.markers = [{longitude: longitude, latitude: latitude}];
    }
  });


  /* GET TAG */
  $scope.tag = Gallery.tag.get({tagId: $routeParams.tagId}, function(tag){
    var index = 0;
    for( var i = 0; i < tag.pictures.length; i++ )
    {
      if( parseInt(tag.pictures[i].id) == parseInt($routeParams.pictureId))
      {
        index = i;
      }
    }

    if( index == 0)
    {
      $scope.pp = tag.pictures[0].id;
      $scope.np = tag.pictures[index+1].id
    }
    else if( index == i-1 )
    {
      $scope.np = tag.pictures[i-1].id;
      $scope.pp = tag.pictures[index-1].id
    }
    else
    {
      $scope.pp = tag.pictures[index-1].id
      $scope.np = tag.pictures[index+1].id
    }


    $scope.picture_slice = [];
    for( var i = index - 2; i < index + 3; i++ )
    {
      $scope.picture_slice.push(tag.pictures[i]);
    }
  });

  /* GET ALL TAGS */
  if(tags == null){
    $scope.tags = Gallery.tag.query();
  }
  else{
    $scope.tags = tags;
    tags = $scope.tags;
  }
}

/* TagDetail */
function TagDetailCtrl($scope, $routeParams, Gallery) {
  /* SET SOME DEFAULTS */
  $scope.thumbs_base_path = thumbs_base_path;
  $scope.items_per_page = 32;
  $scope.pages = [];
  $scope.page = [];
  $scope.orderProp = 'name';
  $scope.current_page = 0;

  if($routeParams.pageId != undefined)
  {
    $scope.current_page = parseInt($routeParams.pageId);
  }

  /* GET ALL TAGS */
  if(tags != undefined){
    $scope.tags = tags;
  }
  else{
    $scope.tags = Gallery.tag.query();
    tags = $scope.tags;
  }

  /* GET TAG + CALLBACK */
  $scope.tag = Gallery.tag.get({tagId: $routeParams.tagId}, function(tag) {
    $scope.tag = tag;

    for( var i = 0; i < tag.pictures.length; i++ )
    {
      var pi = Math.floor(i / $scope.items_per_page);
      if($scope.pages[pi] == undefined)
      {
        $scope.pages[pi] = [];
      }
      $scope.pages[pi].push(tag.pictures[i]);
    }

    $scope.page = $scope.pages[$scope.current_page];

    $scope.pp = $scope.current_page - 1;
    if($scope.current_page == 0)
    {
        $scope.pp = 0;
    }

    $scope.np = $scope.current_page + 1;
    $scope.lp = $scope.pages.length - 1;
    $scope.fp = 0;
    if($scope.current_page == $scope.pages.length - 1)
    {
        $scope.np = $scope.pages.length - 1;
    }
  });
  /* GET TAG + CALLBACK */
}
