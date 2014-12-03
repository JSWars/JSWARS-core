"use strict";
define([
    'angular-material',
    'angular-ui-router',
], function () {
    var app;

    app = angular.module('tfg', [
        'ngMaterial',
        'ui.router'
    ]);

    return app;
});