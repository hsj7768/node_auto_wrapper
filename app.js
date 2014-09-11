var fs = require('fs');
var header = require('./makeHeader.js');
var cpp = require('./makeCpp.js');

if (process.argv.length < 4 || process.argv.length > 4) {
    return console.log("argument count is not proper \n\
ex) node [node.js] [file|dir] [output dir]");
}

var path = process.argv[2];
var output = process.argv[3];

if (!fs.lstatSync(output).isDirectory()) {
    return console.log("output is not directory \n\
ex) node [node.js] [file|dir] [output dir]");
}

if (fs.lstatSync(path).isDirectory()) {
    fs.readdir(path, function(err, files) {
        if(err) throw err;
        
        files.forEach(function(file) {
            var filePath = path + "/" + file;
            var type = file.split(".")[1];

            if (type == "h") {
                header.make(filePath, output);
                cpp.make(filePath, output);
            }
        });
    });

} else if (fs.lstatSync(path).isFile()) {
    var file = path;
    var type = file.split(".")[1];

    if (type == "h") {
        header.make(file, output);
        cpp.make(file, output);
    }
}
