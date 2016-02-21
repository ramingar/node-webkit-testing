angularApp.config([
  '$routeProvider',
  function ($routeProvider) {

    $routeProvider

      .when(
        '/login', {
          templateUrl   : 'templates/angular-views/login.html',
          reloadOnSearch: false
        }
      )
      .otherwise({
        redirectTo: '/login'
      });

  }
]);

angularApp.config(['$interpolateProvider', '$httpProvider',
  function ($interpolateProvider, $httpProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');

    $httpProvider.interceptors.push([
      function () {
        return {
          'request'      : function (request) {
            return request;
          },
          'response'     : function (response) {
            return response;
          },
          'responseError': function (response) {
            return response;
          }
        };
      }
    ]);
  }
]);