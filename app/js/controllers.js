'use strict';

/* Controllers */

function TagListCtrl($scope, Galery) {
  $scope.tags = Galery.tag.query();
  $scope.orderProp = 'name';
}

function PictureDetailCtrl($scope, $routeParams, Galery) {
  $scope.picture = Galery.picture.get({pictureId: $routeParams.pictureId}, function(picture) {
    $scope.picturePath = pictures_path + "/" + picture.path;
  });

  $scope.tags = Galery.tag.query();
  $scope.orderProp = 'name';

  $scope.setImage = function(imageUrl) {
    $scope.mainImageUrl = imageUrl;
  }
}

//PhoneListCtrl.$inject = ['$scope', 'Phone'];



function TagDetailCtrl($scope, $routeParams, Galery) {

  if($routeParams.pageId == undefined)
  {
      $scope.current_page = 0;
  }
  else
  {
      $scope.current_page = $routeParams.pageId;
  }
  $scope.current_page = 0;
  $scope.items_per_page = 32;
  $scope.pages = [];
  $scope.page = [];
  $scope.nextPage = function(){
      if( $scope.pages[$scope.current_page+1] != undefined)
      {
       $scope.current_page = $scope.current_page + 1;
      $scope.page = $scope.pages[$scope.current_page];
      console.log("next page");
      console.log($scope.page);
    
      }
       }

  $scope.previousPage = function(){
      if( $scope.pages[$scope.current_page-1] != undefined)
      {
      $scope.current_page = $scope.current_page - 1;
      $scope.page = $scope.pages[$scope.current_page];
      console.log("previous page");
      }
  }

  $scope.tags = Galery.tag.query();
  $scope.orderProp = 'name';



  $scope.tag = Galery.tag.get({tagId: $routeParams.tagId}, function(tag) {
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

//PhoneDetailCtrl.$inject = ['$scope', '$routeParams', 'Phone'];
