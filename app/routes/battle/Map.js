var FS;
//fs.writeFile("/tmp/test", "Hey there!", function(err) {
//    if(err) {
//        console.log(err);
//    } else {
//        console.log("The file was saved!");
//    }
//});


FS = require('fs');

function Map(req, res) {


	FS.read('', function (fileContents) {

		res.json(JSON.parse(fileContents));
	});



}
module.exports = Map;
