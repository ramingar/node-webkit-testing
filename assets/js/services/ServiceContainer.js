angularApp.factory('ServiceContainer', ['$resource', function($resource) {
    return {
        getResource: function (customParams, mergeParamsWanted) {
            var defaultParams = {
                "page": 0,
                "size": 10
            };

            return $resource(
                dataConfig.host + '/:resource_name/:id/:resource_detail_name/:id_resource_detail_name/:resource_fifth_param',
                mergeParamsWanted ? angular.extend(defaultParams, customParams) : customParams,
                {
                    get: {
                        method: 'GET',
                        cache: true,
                        isArray: true,
                        headers: {'Content-Type': 'application/hal+json; charset=UTF-8'}
                    },
                    save: {
                        method: 'POST',
                        cache: true,
                        headers: {'Content-Type': 'application/hal+json; charset=UTF-8'}
                    },
                    update: {
                        method: 'PUT',
                        cache: true,
                        headers: {'Content-Type': 'application/hal+json; charset=UTF-8'}
                    },
                    delete: {
                        method: 'DELETE',
                        cache: true,
                        headers: {'Content-Type': 'application/hal+json; charset=UTF-8'}
                    }
                },
                {
                    'stripTrailingSlashes': 'true'
                }
            );
        },

        getResourceForFiles: function (customParams, file) {
            var defaultParams = {
                "page": 0,
                "size": 10
            };

            return $resource(
                dataConfig.host + '/:resource_name/:id/:resource_detail_name/:id_resource_detail_name/:resource_fifth_param',
                angular.extend(defaultParams, customParams),
                {
                    save: {
                        method: 'POST',
                        cache: true,
                        headers: {'Content-Type': undefined},
                        transformRequest: angular.identity
                    },
                    update: {
                        method: 'PUT',
                        cache: true,
                        headers: {'Content-Type': undefined},
                        transformRequest: angular.identity
                    },
                    delete: {
                        method: 'DELETE',
                        cache: true,
                        headers: {'Content-Type': undefined},
                        transformRequest: angular.identity
                    }
                },
                {
                    'stripTrailingSlashes': 'true'
                }
            );
        }
    };
}]);