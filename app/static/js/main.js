"use strict";
// contents of main.js:
require.config({
    'baseUrl': './',
    'paths': {
        'app': 'js/app',
        'domReady': 'components/domReady/domReady',
        'ocLazyload': 'components/oclazyload/dist/ocLazyLoad',
        'angular': 'components/angular/angular',
        'angular-material': 'components/angular-material/angular-material',
        'angular-animate': 'components/angular-animate/angular-animate',
        'angular-aria': 'components/angular-aria/angular-aria',
        'hammer': 'js/wrappers/hammer',
        'angular-ui-router': 'components/angular-ui-router/release/angular-ui-router',
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
        'ocLazyLoad': {
            'deps': ['angular']
        },
        'angular-material': {
            'deps': ['angular', 'hammer', 'angular-aria', 'angular-animate']
        }
    }
});

require([
    'app',
    'domReady',
    'ocLazyLoad'
], function (app, domReady) {

    app.run(
        ['$rootScope', '$state', '$stateParams',
            function ($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ]
    );

    app.config(
        ['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {

                /////////////////////////////
                // Redirects and Otherwise //
                /////////////////////////////

                // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
                $urlRouterProvider

                    // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
                    // Here we are just setting up some convenience urls.
                    .when('/c?id', '/contacts/:id')
                    .when('/user/:id', '/contacts/:id')

                    // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
                    .otherwise('/');


                //////////////////////////
                // State Configurations //
                //////////////////////////

                // Use $stateProvider to configure your states.
                $stateProvider

                    //////////
                    // Home //
                    //////////

                    .state("login", {
                        url: "/login",
                        templateUrl: './views/LoginView.html',
                        controller: "LoginController as LoginCrtl",
                        resolve: {
                            controller: function ($ocLazyLoad) {
                                return $ocLazyLoad.load(
                                    {
                                        name: "LoginCrtl",
                                        files: ["/js/controllers/LoginCrtl.js"]
                                    }
                                );
                            }
                        }
                    })

                    ///////////
                    // About //
                    ///////////

                    .state('about', {
                        url: '/about'
                    });
            }
        ]
    )
    ;

    domReady(function () {
        angular.bootstrap(document.documentElement, [app.name]);
    });


})
;