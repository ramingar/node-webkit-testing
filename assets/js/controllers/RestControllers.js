/********************************************************************************************* */
/* **** ************ FORM CONTROLLER *************************************************** **** */
/******************************************************************************************* */

angularApp.controller('FormCtrl', ['$scope', 'ServiceContainer', '$location', '$q',
  function ($scope, ServiceContainer, $location, $q) {

    $scope.error = {};
    $scope.model = {};

    $scope.init = function (resourceName, id, resourceDetailName, idResourceDetailName, resourceFifthParam) {
      $scope.parameters = {};

      $scope.parameters = {
        'resource_name': resourceName
      };

      if ('undefined' != typeof id ) {
        $scope.parameters.id = id;
      }

      if ('undefined' != typeof resourceDetailName) {
        $scope.parameters.resource_detail_name = resourceDetailName;
      }

      if ('undefined' != typeof idResourceDetailName) {
        $scope.parameters.id_resource_detail_name = idResourceDetailName;
      }

      if ('undefined' != typeof resourceFifthParam) {
        $scope.parameters.resource_fifth_param = resourceFifthParam;
      }

      return $scope.parameters;
    };

    $scope.delete = function (idRow, options, parameters, host) {
      $scope.parameters    = 'undefined' == typeof parameters ? $scope.parameters : parameters;
      $scope.model.id      = 'undefined' == typeof idRow      ? "" : idRow;
      $scope.parameters.id = $scope.model.id;

      ServiceContainer.getResource($scope.parameters, null, host).remove(
        $scope.model,
        function (data, responseHeaders) {
          if (typeof data.code == 'undefined') {
            $scope.callbackManagement(data, responseHeaders, null, options);
          } else {
            $scope.failure(data, null, options);
          }
        },
        function (response) {
          $scope.failure(response, null, options);
        }
      );
    };

    $scope.save = function (idRow, options, parameters, model, file, host) {
      $scope.parameters = 'undefined' == typeof parameters || null == parameters ? $scope.parameters : parameters;
      $scope.model      = 'undefined' == typeof model      || null == model      ? $scope.model      : model;

      var deferred = $q.defer();

      if (typeof idRow != 'undefined' && idRow != null) {
        /* **** UPDATE **** */
        $scope.parameters.id = idRow;
        ServiceContainer.getResource($scope.parameters, null, host).update(
          $scope.model,
          function (data, responseHeaders) {
            if ($scope.callbackManagement(data, responseHeaders, false, options)) {
              deferred.resolve({'data': data, 'headers': responseHeaders});
            } else {
              deferred.reject({'data': data, 'headers': responseHeaders});
            }
          },
          function (response) {
            $scope.failure(response, false, options);
            deferred.reject(response);
          }
        );
      } else {
        /* **** SAVE **** */
        if ('undefined' == typeof file || null == file) {
          ServiceContainer.getResource($scope.parameters, null, host).save(
            $scope.model,
            function (data, responseHeaders) {
              if ($scope.callbackManagement(data, responseHeaders, true, options)) {
                deferred.resolve({'data': data, 'headers': responseHeaders});
              } else {
                deferred.reject({'data': data, 'headers': responseHeaders});
              }
            },
            function (response) {
              $scope.failure(response, true, options);
              deferred.reject(response);
            }
          );
        } else {
          /* **** SAVE WITH FILES (multipart/for-data) **** */
          ServiceContainer.getResourceForFiles($scope.parameters, file, host).save(
            file,
            function (data, responseHeaders) {
              if ($scope.callbackManagement(data, responseHeaders, true, options)) {
                deferred.resolve({'data': data, 'headers': responseHeaders});
              } else {
                deferred.reject({'data': data, 'headers': responseHeaders});
              }
            },
            function (response) {
              $scope.failure(response, true, options);
              deferred.reject(response);
            }
          );
        }
      }

      return deferred.promise;
    };

    $scope.callbackManagement = function (data, responseHeaders, isInsert, options, deferred) {
      if ('undefined' == typeof data.error) {                                    // HTTP STATUS CODE >= 500
        if ('undefined' != typeof data.code) {
          if (data.code >= 400) {
            return $scope.failure(data, isInsert, options);                      // HTTP STATUS CODE >= 400
          } else {
            return $scope.success(data, responseHeaders, isInsert, options);     // Success!!
          }
        } else {
          return $scope.success(data, responseHeaders, isInsert, options);       // Success!!
        }
      } else {
        return $scope.failure(data, isInsert, options);
      }
    };

    $scope.success = function (data, header, isInsert, options) {

      if (isInsert) {
        $scope.model = data;
      }

      if (typeof options == 'undefined') {
        // TODO: do cool stuff if 'undefined'
      } else if (options == 'refresh') {
        $scope.get();
      } else if (options == 'refresh-parent') {
        $scope.$parent.get();
      } else if (options == 'reload') {
        location.reload(true);
      }

      $scope.error = {};
      $scope.model = {};
      $scope.feedback.message = '¡Operación realizada con éxito!';
      $scope.feedback.showMessage();

      return true;
    };

    $scope.errorIterator = function (objectToIterate, scope, parentError) {
      angular.forEach(objectToIterate, function (v, k) {
        var error = {};
        if ('undefined' != typeof v.errors) {
          if ('undefined' == typeof parentError) {
            error = this.error;
          } else {
            error = parentError;
          }
          error[k] = {};
          error[k].status = 'has-error';
          error[k].desc = 'ERROR: ' + v.errors[0];
        } else if ('undefined' != typeof v.children) {
          /* For the case when some error was split in various children error descriptions like:
           * error.password.first
           */
          this.error[k] = {};
          $scope.errorIterator(v.children, scope, this.error[k]);
        }
      }, scope);
    };

    $scope.failure = function (response, isInsert, options) {
      $scope.error = {};
      var responseToIterate = {};

      /* Error message on each field */
      if ('undefined' != typeof response.errors) {
        responseToIterate = response.errors.children;
      } else if ('undefined' != typeof response.data && 'undefined' != typeof response.data.errors) {
        responseToIterate = response.data.errors.children;
      }
      $scope.errorIterator(responseToIterate, $scope);

      return false;
    };

    $scope.goTo = function (url) {
      $location.path(url);
    }
  }
]);


/********************************************************************************************* */
/* **** ************ LIST CONTROLLER *************************************************** **** */
/******************************************************************************************* */

angularApp.controller('ListCtrl', ['$scope', '$q', 'ServiceContainer',
  function ($scope, $q, ServiceContainer) {
    $scope.parameters = {};

    /* PAGINATION INITIALIZATION */
    $scope.pagination = {
      "currentPage": 1,
      "itemsPerPage": 20,
      "maxSize": 5,
      "rotation": false,
      "boundaryLinks": true,
      "nextText": "Siguiente",
      "previousText": "Anterior",
      "firstText": "Primero",
      "lastText": "Último"
    };
    var page = { "size": 1, "total_elements": 1, "total_pages": 1, "number": 0 };

    $scope.init = function(resourceName, id, resourceDetailName, idResourceDetailName, resourceFifthParam) {
      $scope.results = {};
      $scope.parameters = {};

      $scope.parameters.size = $scope.pagination.itemsPerPage;
      $scope.parameters.page = $scope.pagination.currentPage-1;
      $scope.parameters.resource_name = resourceName;

      if('undefined' != typeof id) {
        $scope.parameters.id = id;
      }
      if('undefined' != typeof resourceDetailName) {
        $scope.parameters.resource_detail_name = resourceDetailName;
      }
      if ('undefined' != typeof idResourceDetailName) {
        $scope.parameters.id_resource_detail_name = idResourceDetailName;
      }
      if ('undefined' != typeof resourceFifthParam) {
        $scope.parameters.resource_fifth_param = resourceFifthParam;
      }

      return $scope.parameters;
    };

    $scope.changePage = function () {
      $scope.parameters.page = $scope.pagination.currentPage - 1;
      $scope.get($scope.parameters);
    };

    $scope.get = function(parameters, mergeParams, host) {
      $scope.parameters = 'undefined' == typeof parameters ? $scope.parameters : parameters;

      var deferred = $q.defer();
      var result = ServiceContainer.getResource($scope.parameters, mergeParams, host).get(
        function (data, responseHeaders) {
          $scope.results = data;
          $scope.pagination.totalItems = 'undefined' == typeof $scope.results.page
              ? page.total_elements
              : $scope.results.page.total_elements;
          deferred.resolve({'data': data, 'headers': responseHeaders});
        },
        function (response) {
          // TODO: cool stuff if get fails...

          deferred.resolve({'data': response});
        }
      );
      return deferred.promise;
    };

  }
]);