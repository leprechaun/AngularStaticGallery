'use strict';

function get_group_callback(group, $scope){
    group.sort(function(g1, g2){
        var g1n = g1.name.toLowerCase();
        var g2n = g2.name.toLowerCase();
        if( g1.name.toLowerCase() > g2.name.toLowerCase() ){
            return 1 * $scope.ordering;
        }
        else {
            return -1 * $scope.ordering;
        }
    });
    for( var i = 0; i < group.length; i++ )
    {
      var pi = Math.floor(i / $scope.items_per_page);
      if($scope.pages[pi] == undefined)
      {
        $scope.pages[pi] = [];
      }
      $scope.pages[pi].push(group[i]);
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

// here
}


/* EventList */
function EventListCtrl($scope, $routeParams, Gallery)
{
    $scope.pagination = {
      'first': 0,
      'previous': 0,
      'windows': [],
      'next': 0,
      'last': 0
    };


    $scope.ordering = -1;
    $scope.items_per_page = 32;
    $scope.pages = [];
    $scope.group_type = "event";
    if( $routeParams.pageId == undefined ){
        $scope.current_page = 0;
    }
    else{
        $scope.current_page = parseInt($routeParams.pageId);
    }
    $scope.events = Gallery.event.query(function(events){get_group_callback(events, $scope)});

    $scope.orderProp = "name";
    $scope.eventOrderProp = "-name";
    $scope.thumbs_base_path = thumbs_base_path;
    if( tags == null )
    {
        $scope.tags = Gallery.tag.query();
        tags = $scope.tags;
    }
    else
    {
        $scope.tags = tags;
    }
}

/* TagList */
function TagListCtrl($scope, $routeParams, Gallery){
    $scope.ordering = 1;
  $scope.tags = Gallery.tag.query(function(tags){get_group_callback(tags, $scope)});

  $scope.orderProp = 'name';
  $scope.thumbs_base_path = thumbs_base_path;

    $scope.pagination = {
      'first': 0,
      'previous': 0,
      'windows': [],
      'next': 0,
      'last': 0
    };


    $scope.items_per_page = 32;
    $scope.pages = [];
    $scope.group_type = "tag";
    if( $routeParams.pageId == undefined ){
        $scope.current_page = 0;
    }
    else{
        $scope.current_page = parseInt($routeParams.pageId);
    }

    $scope.orderProp = "name";
    $scope.eventOrderProp = "-name";
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
            var longitude = [];
            var latitude = [];
            for( var i = 0; i < 3; i++ )
            {
                longitude[i] = $scope.exif['GPS GPSLongitude'][i][0] / $scope.exif['GPS GPSLongitude'][i][1];
                latitude[i] = $scope.exif['GPS GPSLatitude'][i][0] / $scope.exif['GPS GPSLatitude'][i][1];
            }

            var dec_long = longitude[0] + (longitude[1]/60.) + (longitude[2]/3600.);
            var dec_lat = latitude[0] + (latitude[1]/60.) + (latitude[2]/3600.);

            if( $scope.exif['GPS GPSLongitudeRef'] == "W" )
            {
                dec_long= - dec_long;
            }

            if( $scope.exif['GPS GPSLatitudeREf'] == "S")
            {
                dec_lat= - dec_lat;
            }

            $scope.center = {longitude: dec_long, latitude: dec_lat};
            $scope.markers = [$scope.center];
        }
    }
  });

    var parent_controller = "picture";
    if( "eventId" in $routeParams )
    {
        parent_controller = "event";
        var parent_id = $routeParams.eventId;
    }
    else if( "tagId" in $routeParams )
    {
        parent_controller = "tag";
        var parent_id = $routeParams.tagId;
    }

    /* GET PICTURE SOURCE */
    $scope.picture_source = parent_controller;
    if( parent_controller == "event" )
    {
        $scope.source = Gallery.event.get({eventId: parent_id},
            function(event){
                get_picture_source_callback(event, $routeParams.pictureId, $scope)
            }
        );
    }
    else if( parent_controller == "tag" )
    {
        $scope.source = Gallery.tag.get({tagId: parent_id},
            function(tag){
                get_picture_source_callback(tag, $routeParams.pictureId, $scope);
            }
        );
    }

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
function get_picture_source_callback(source, $scope)
{
    $scope.source = source;

    for( var i = 0; i < source.pictures.length; i++ )
    {
      var pi = Math.floor(i / $scope.items_per_page);
      if($scope.pages[pi] == undefined)
      {
        $scope.pages[pi] = [];
      }
      $scope.pages[pi].push(source.pictures[i]);
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


function get_event(eventId, callback, Gallery, $scope)
{
  if( tags_hash[eventId] == undefined )
  {
      $scope.source = Gallery.event.get({eventId:eventId}, function(event) {
        callback(event, $scope);
      });
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
  $scope.picture_source = "tag";

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
    get_tag($routeParams.tagId, get_picture_source_callback, Gallery, $scope);
}


/* EventDetail */
function EventDetailCtrl($scope, $routeParams, Gallery) {
  /* SET SOME DEFAULTS */
  $scope.thumbs_base_path = thumbs_base_path;
  $scope.items_per_page = 32;
  $scope.pages = [];
  $scope.page = [];
  $scope.orderProp = 'name';
  $scope.current_page = 0;
  $scope.picture_source = "event";

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
    get_event($routeParams.eventId, get_picture_source_callback, Gallery, $scope);
}
