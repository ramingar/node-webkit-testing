/**
 * Created by rafael on 19/02/16.
 */

angularApp.controller('MainCtrl', ['$scope', 'TokenFactory',
  function ($scope, TokenFactory) {
    $scope.tokenFactory = TokenFactory;

    $scope.getOAUTH2 = function () {
      var ref = window.open(
        'https://github.com/login/oauth/authorize?client_id=' + dataConfig.clientId + '&redirect_uri=http://localhost:2000',
        '_self',
        'location=no'
      );

    };
  }
]);