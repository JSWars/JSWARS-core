"use strict";
define([
    'angular-material',
    'angular-ui-router',
    'ocLazyload'
], function () {
    var app;

    app = angular.module('tfg', [
        'ngMaterial',
        'ui.router',
        "oc.lazyLoad"
    ]);

    return app;
});