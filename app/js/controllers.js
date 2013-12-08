'use strict';

function realign_image(image){
  var cls = image.getAttribute('class');
  if( ["orientation-6", "orientation-8"].indexOf(cls) >= 0 ){
    var w = image.width;
    var h = image.height;

    var margin = (w - h) / 2;
    image.setAttribute('style', "margin: " + margin + "px " + (-margin) + "px;")
  }

}

function range(start, end, current){

  var s = Math.max(0, current - 7);
  var e = Math.min(end, current + 7);

  var range = [];
  for( var i = s; i <= e; i++ ){
    range.push(i);
  }

  return range;
}

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

    var pp = 32;
    var last = Math.floor(group.length / pp);

    $scope.groups = group;

    $scope.pagination = {};
    $scope.pagination.per_page = 32;
    $scope.pagination.first = 0;
    $scope.pagination.previous = Math.max(0, $scope.current_page-1);
    $scope.pagination.next = Math.min(last, $scope.current_page+1);
    $scope.pagination.last = last;

    $scope.range = range;
}

function get_listing_callback(listing, $scope){
    $scope.source = listing;
    $scope.first_page = 0;
    $scope.last_page = Math.floor(listing.pictures.length / $scope.items_per_page);
    $scope.next_page = Math.min($scope.last_page, $scope.current_page+1);
    $scope.previous_page = Math.max(0, $scope.current_page-1);

    var pp = 32;
    var last = Math.floor(listing.pictures.length / pp);

    $scope.pagination = {};
    $scope.pagination.per_page = 32;
    $scope.pagination.first = 0;
    $scope.pagination.previous = Math.max(0, $scope.current_page-1);
    $scope.pagination.next = Math.min(last, $scope.current_page+1);
    $scope.pagination.last = last;

    $scope.range = range;
}

/* EventList */
function EventListCtrl($scope, $routeParams, Gallery)
{
    $scope.ordering = -1;
    $scope.items_per_page = 32;
    $scope.group_type = "event";
    if( $routeParams.pageId == undefined ){
        $scope.current_page = 0;
    }
    else{
        $scope.current_page = parseInt($routeParams.pageId);
    }

    Gallery.event.query(function(group){get_group_callback(group, $scope);});
    $scope.tags = Gallery.tag.query(function(){});


    $scope.pagenum = $scope.current_page;
    $scope.orderProp = "name";
    $scope.eventOrderProp = "-name";
    $scope.thumbs_base_path = thumbs_base_path;
}

/* TagList */
function TagListCtrl($scope, $routeParams, Gallery){
  $scope.ordering = 1;
  $scope.orderProp = 'name';
  $scope.thumbs_base_path = thumbs_base_path;
  $scope.items_per_page = 32;
  $scope.group_type = "tag";
  if( $routeParams.pageId == undefined ){
    $scope.current_page = 0;
  }
  else{
    $scope.current_page = parseInt($routeParams.pageId);
  }


  $scope.tags = Gallery.tag.query(function(group){get_group_callback(group, $scope);});
  $scope.groups = $scope.tags;

  $scope.pagenum = $scope.current_page;
  $scope.orderProp = "name";
  $scope.eventOrderProp = "-name";
  $scope.thumbs_base_path = thumbs_base_path;
}

function extractCoordinates(exif){
  var longitude = [];
  var latitude = [];
  for( var i = 0; i < 3; i++ )
  {
    longitude[i] = exif['GPS GPSLongitude'][i][0] / exif['GPS GPSLongitude'][i][1];
    latitude[i] = exif['GPS GPSLatitude'][i][0] / exif['GPS GPSLatitude'][i][1];
  }

  var dec_long = longitude[0] + (longitude[1]/60.) + (longitude[2]/3600.);
  var dec_lat = latitude[0] + (latitude[1]/60.) + (latitude[2]/3600.);

  if( exif['GPS GPSLongitudeRef'] == "W" )
  {
    dec_long= - dec_long;
  }

  if( exif['GPS GPSLatitudeRef'] == "S")
  {
    dec_lat= - dec_lat;
  }

  return {longitude: dec_long, latitude: dec_lat};
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

  $scope.orientation = "";
  if( 'exif' in picture )
  {
    if('Image Orientation' in picture.exif){
      $scope.orientation = "orientation-" + picture.exif['Image Orientation'];
      if(picture.exif['Image Orientation'] == 6 || picture.exif['Image Orientation'] == 8){
        var diff = picture.size.width - picture.size.height;
      }
    }

    $scope.exif = picture.exif;
    if( 'GPS GPSLongitude' in $scope.exif )
    {
      var coord = extractCoordinates($scope.exif);
      $scope.center = {longitude: coord.longitude, latitude: coord.latitude};
      $scope.markers = [{longitude: coord.longitude, latitude: coord.latitude}];
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

    var args = {};
    args[parent_controller + "Id"] = parent_id;

    $scope.picture_source = parent_controller;
    $scope.source = Gallery[parent_controller].get(args, function(source){prep_picture_pagination(source, $routeParams.pictureId, $scope)});

  /* GET ALL TAGS */
  $scope.tags = Gallery.tag.query();
}

function prep_picture_pagination(source, current_id, $scope){
  var index = null;
  for( var i in source.pictures){
    if(source.pictures[i].id == current_id){
      index = parseInt(i);
    }
  }

  $scope.start_previewing_at_index = Math.max(index, 0);

  try{
    $scope.pp = source.pictures[index - 1].id;
  }
  catch(error){}

  try{
    $scope.np = source.pictures[index + 1].id;
  }
  catch(error){}
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

  if(parseInt($routeParams.pageId) >= 0)
  {
    $scope.current_page = parseInt($routeParams.pageId);
  }

  $scope.tags = Gallery.tag.query();
  $scope.group = Gallery.tag.get({tagId: $routeParams.tagId}, function(tag){get_listing_callback(tag, $scope);});

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

  if(parseInt($routeParams.pageId) >= 0)
  {
    $scope.current_page = parseInt($routeParams.pageId);
  }

  $scope.tags = Gallery.tag.query();

  /* GET TAG + CALLBACK */
  Gallery.event.get({eventId: $routeParams.eventId}, function(event){get_listing_callback(event, $scope)});
}

/* MapView */
function MapViewCtrl($scope, $routeParams, Gallery){
  var parent_controller = "picture";
  if( "eventId" in $routeParams )
  {
    parent_controller = "event";
    var parent_id = $routeParams.eventId;
    var args = {eventId: parent_id};
  }
  else if( "tagId" in $routeParams )
  {
    parent_controller = "tag";
    var parent_id = $routeParams.tagId;
    var args = {tagId: parent_id};
  }

  $scope.markers = [];

  $scope.tags = Gallery.tag.query();
  $scope.source = Gallery[parent_controller].get(args, function(listing){ map_view_callback(listing, Gallery, $scope);});
}

function map_view_callback(listing, Gallery, $scope){
  for(var pid in listing.pictures){
    var p = Gallery.picture.get({pictureId: listing.pictures[pid].id}, function(pic){
      if( 'exif' in pic ){
        if( 'GPS GPSLongitude' in pic.exif){
          var coords = extractCoordinates(pic.exif);
          $scope.markers.push(coords);
        }
      }
    });
  }
}
