/**
 * Created by marcx on 17/11/2014.
 */
"use strict";

module.exports = function (grunt) {


	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-clean');


	grunt.initConfig({
		exec: {
			'mongo-start-linux': 'mongod --dbpath=/mdbdata/ --port 27017',
			'mongo-stop-linux': 'mongod --shutdown',
			'mongo-start': 'mongod --dbpath=c:/mdbdata --port 27017',
			'mongo-stop': 'mongod --shutdown',
			'test': 'mocha'
		},
		copy: {
			pro: {
				files: [
					{expand: true, cwd: 'app/', src: ['**'], dest: 'build/pro/'}
				]
			},
			"config-pro": {
				files: [
					{expand: true, cwd: 'env/pro/', src: ['**'], dest: 'build/pro/'}
				]
			}
		},
		clean: {
			build: ["build/"]
		},
		compress: {
			pro: {
				options: {
					archive: 'jswars_pro.zip'
				},
				expand: true,
				cwd: 'build/pro/',
				src: ['**/*']
			}
		}
	});

	grunt.registerTask('build-pro', ['clean', 'copy:pro', 'copy:config-pro', 'compress:pro']);

	grunt.registerTask('test-map', ['exec:test-map']);
	grunt.registerTask('mongo-start-linux', ['exec:mongo-start-linux']);
	grunt.registerTask('mongo-stop-linux', ['exec:mongo-stop-linux']);
	grunt.registerTask('mongo-start', ['exec:mongo-start']);
	grunt.registerTask('mongo-stop', ['exec:mongo-stop']);
	grunt.registerTask('install', ['exec:moncha-install']);
	grunt.registerTask('test', 'exec:test');

};

