"use strict";
define([], function () {
        return function (dependencies) {
            return ['$q', function ($q) {
                if (dependencies instanceof Array) {
                    var deferred = $q.defer();
                    require(dependencies, function () {
                        deferred.resolve();
                    });
                    return deferred.promise;
                } else {
                    return undefined;
                }
            }];
        };
    }
)
;