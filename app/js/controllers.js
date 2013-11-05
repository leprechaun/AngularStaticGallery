'use strict';

/* Controllers */

function TagListCtrl($scope, Tag) {
  $scope.tags = Tag.query();
  $scope.orderProp = 'name';
}

function PictureDetailCtrl($scope, Picture) {
  console.log(Picture);
  $scope.picture = Picture.get({pictureId: $routeParams.pictureId}, function(picture) {
    $scope.mainImageUrl = picture.thumbnail;
  });

  $scope.setImage = function(imageUrl) {
    $scope.mainImageUrl = imageUrl;
  }

}

//PhoneListCtrl.$inject = ['$scope', 'Phone'];



function TagDetailCtrl($scope, $routeParams, Tag) {
  $scope.tag = Tag.get({tagId: $routeParams.tagId}, function(tag) {
    $scope.mainImageUrl = tag.thumbnail;
  });

  $scope.setImage = function(imageUrl) {
    $scope.mainImageUrl = imageUrl;
  }
}

//PhoneDetailCtrl.$inject = ['$scope', '$routeParams', 'Phone'];
