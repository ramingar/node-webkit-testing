angularApp.config([
  '$routeProvider',
  function ($routeProvider) {

    $routeProvider

      .when(
        '/login', {
          templateUrl   : 'templates/angular-views/login.html',
          reloadOnSearch: false,
          resolve : {
            'mySession': ['TokenFactory', '$location', function (TokenFactory, $location) {
              var urlSplitted = $location.absUrl().split('?access_token=');
              if (1 < urlSplitted.length) {
                TokenFactory.token = $location.absUrl().split('?access_token=')[1].split('&scope=')[0];
              }
            }]
          }
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