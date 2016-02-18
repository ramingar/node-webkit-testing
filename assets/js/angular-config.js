angularApp.config([
  '$routeProvider',
  function ($routeProvider) {

    /*
    $routeProvider

      .when(
        '/main', {
          templateUrl   : 'main.html',
          reloadOnSearch: false,
          resolve       : {
            'mySession': [
              'GetCurrentSession', function (GetCurrentSession) {
                return GetCurrentSession.getSession();
              }
            ]
          }
        }
      )
      .otherwise({
        redirectTo: '/profile'
      });
      */
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