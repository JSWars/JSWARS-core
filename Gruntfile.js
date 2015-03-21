/**
 * Created by marcx on 17/11/2014.
 */
"use strict";

module.exports = function (grunt) {

	grunt.initConfig({
		exec: {
			'mongo-start': 'mongod --dbpath=c:/mdbdata --port 27017',
			'mongo-stop': 'mongod --shutdown',
			'moncha-install': 'npm install -g mocha',
			'test': 'mocha',
			'test-map': 'node app/testGridMap.js > app/resources/chunk.json'
		}

	});


	grunt.loadNpmTasks('grunt-exec');

	grunt.registerTask('test-map', ['exec:test-map'])
	grunt.registerTask('mongo-start', ['exec:mongo-start']);
	grunt.registerTask('mongo-stop', ['exec:mongo-stop']);
	grunt.registerTask('install', ['exec:moncha-install']);
	grunt.registerTask('test', 'exec:test');

};

