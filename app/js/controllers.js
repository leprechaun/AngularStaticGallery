'use strict';

var caches = {"event":{}, "tag": {}, "picture": {}, "all-tag": null, "all-event": null};

/* Group is all-tags or all-events */
function get_group(Gallery, type, callback){
  var key = type + "-all";
  if( caches[key] == null ){
    console.log("get:", type);
    caches[key] = Gallery[type].query(callback);
  }
  else {
    console.log("cached:", type);
    callback(caches[key]);
  }
  return caches[key];
}

/* Listing is a specific event or tags, tag/Self.json */
function get_listing(Gallery, type, name, callback){
  if(!(type in caches)){
    caches[type] = {};
  }

  if(type == "event"){
    var args = {eventId: name};
  }
  else if( type == "tag" ){
    var args = {tagId: name};
  }

  if(!(name in caches[type])){
    console.log("get:", type, name);
    caches[type][name] = Gallery[type].get(args, callback);
  }
  else {
    console.log("cached:", type, name);
    callback(caches[type][name]);
  }

  return caches[type][name];
}

function get_picture(Gallery, id, callback){
  if(!(id in caches.picture)){
    console.log("get:", "picture", id);
    caches.picture[id] = Gallery.picture.get({pictureId:id}, callback);
  } else {
    console.log("cached:", "picture", id);
    callback(caches.picture[id]);
  }
  return caches.picture[id];
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

    $scope.groups = group;
    $scope.last_page = Math.floor(group.length / $scope.items_per_page);
    $scope.next_page = Math.min($scope.last_page, $scope.current_page+1);
    $scope.previous_page = Math.max(0, $scope.current_page-1);
}

function get_listing_callback(listing, $scope){
    $scope.source = listing;
    $scope.last_page = Math.floor(listing.length / $scope.items_per_page);
    $scope.next_page = Math.min($scope.last_page, $scope.current_page+1);
    $scope.previous_page = Math.max(0, $scope.current_page-1);
    console.log(listing);
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

    get_group(Gallery, "event", function(group){get_group_callback(group, $scope)});
    $scope.tags = get_group(Gallery, "tag", function(){});


    $scope.pagenum = $scope.current_page;
    $scope.orderProp = "name";
    $scope.eventOrderProp = "-name";
    $scope.thumbs_base_path = thumbs_base_path;
}

/* TagList */
function TagListCtrl($scope, $routeParams, Gallery){
    $scope.ordering = 1;
  $scope.tags = get_group(Gallery, "tag", function(group){get_group_callback(group, $scope)});

  $scope.orderProp = 'name';
  $scope.thumbs_base_path = thumbs_base_path;

    $scope.items_per_page = 32;
    $scope.pages = [];
    $scope.group_type = "tag";
    if( $routeParams.pageId == undefined ){
        $scope.current_page = 0;
    }
    else{
        $scope.current_page = parseInt($routeParams.pageId);
    }

    $scope.pagenum = $scope.current_page;
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

    $scope.picture_source = parent_controller;
    $scope.source = get_listing(
      Gallery,
      parent_controller,
      parent_id,
      function(source){ prep_picture_pagination(source, $routeParams.pictureId, $scope); }
    );


  /* GET ALL TAGS */
  $scope.tags = get_group(Gallery, "tag", function(){});
}

function prep_picture_pagination(source, current_id, $scope){
  var index = null;
  for( var i in source.pictures){
    if(source.pictures[i].id == current_id){
      index = parseInt(i);
    }
  }

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

  $scope.tags = get_group(Gallery, "tag", function(){});

  get_listing(Gallery, "tag", $routeParams.tagId, function(tag){get_listing_callback(tag, $scope);});
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

  $scope.tags = get_group(Gallery, "tag", function(){});

  /* GET TAG + CALLBACK */
  get_listing(Gallery, "event", $routeParams.eventId, function(event){get_listing_callback(event, $scope);});
}
