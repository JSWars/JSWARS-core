/**
 * Created by marcx on 17/11/2014.
 */
"use strict";

module.exports = function (grunt) {

    grunt.initConfig({
        exec: {
            "mongo-start": 'mongod --dbpath=c:/mdbdata --port 27017',
            "mongo-stop": 'mongod --shutdown'
        }

    });

    grunt.loadNpmTasks('grunt-exec');
    grunt.registerTask('mongo-start', ['exec:mongo-start']);
    grunt.registerTask('mongo-stop', ['exec:mongo-stop']);

};

