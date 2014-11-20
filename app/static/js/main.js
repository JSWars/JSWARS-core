"use strict";
/**/
// contents of main.js:
require.config({
    'baseUrl': './',
    'paths': {
        'domReady': 'components/domReady/domReady',
        'angular': 'components/angular/angular',
        'angular-material': 'components/angular-material/angular-material',
        'angular-animate': 'components/angular-animate/angular-animate',
        'angular-aria': 'components/angular-aria/angular-aria',
        'hammer': 'components/hammerjs/hammer',
        'angular-ui-router': 'components/angular-ui-router/release/angular-ui-router'
    },
    'shim': {
        'angular': {
            'exports': 'angular'
        },
        'angular-animate': {
            'deps': ['angular']
        },
        'angular-aria': {
            'deps': ['angular']
        },
        'angular-ui-router': {
            'deps': ['angular']
        },
        'hammer': {
            'exports': 'Hammer'
        },
        'angular-material': {
            'deps': ['angular', 'angular-aria', 'angular-animate']
        }
    }
});

require([
    'domReady',
    'hammer',
    'angular-material',
], function (domReady) {

    var tfgApp = angular.module('tfg', ['ngMaterial']);
    tfgApp.controller('LoginController', function ($scope) {
    });

    domReady(function () {
        angular.bootstrap(document.documentElement, ['tfg']);
    });


});