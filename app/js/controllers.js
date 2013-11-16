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

    if( 'exif' in picture )
    {
        $scope.exif = picture.exif;
        if( 'GPS GPSLongitude' in $scope.exif )
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

/*  get tag callback */
function get_tag_callback(tag, $scope)
{

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

    $scope.pagination.next = $scope.np;
    $scope.pagination.previous = $scope.pp;
    $scope.pagination.last = $scope.lp;

    /*  should always be an odd number */
    var pagination_window_length = 5;
    var wing_length = Math.floor(pagination_window_length / 2);

    var left_wing = 0;
    if( $scope.current_page - wing_length > 0 )
    {
        left_wing = $scope.current_page - wing_length;
    }

    var right_wing = $scope.current_page + wing_length;
    if( right_wing > $scope.pages.length )
    {
        right_wing = $scope.pages.length - 1;
    }

    for( var i = left_wing; i <= right_wing; i++ )
    {
        $scope.pagination.windows.push(i);
    }
}

function get_tag(tagId, callback, Gallery, $scope)
{
  if( tags_hash[tagId] == undefined )
  {
      $scope.tag = Gallery.tag.get({tagId:tagId}, function(tag) {
        tags_hash[tagId] = tag;
        callback(tag, $scope);
      });
  }
  else
  {
        callback(tags_hash[tagId], $scope);
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

  $scope.pagination = {
    'first': 0,
    'previous': 0,
    'windows': [],
    'next': 0,
    'last': 0
  };

  if(parseInt($routeParams.pageId) >= 0)
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
    get_tag($routeParams.tagId, get_tag_callback, Gallery, $scope);
}
