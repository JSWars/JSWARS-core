var Jasmine = require('jasmine');
var jasmine = new Jasmine();

jasmine.loadConfigFile('test/jasmine.json');
jasmine.configureDefaultReporter({
	showColors: true
});
jasmine.execute();
