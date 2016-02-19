/**
 * Created by rafael on 19/02/16.
 */
angularApp.controller('TestCtrl', ['$scope',
  function ($scope) {

    $scope.getGists = function () {
      var parameters = $scope.init('users', 'ramingar', 'gists');
      $scope.get(parameters);
    };

}]);
