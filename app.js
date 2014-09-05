var fs = require('fs');
var header = require('./makeHeader.js');
var cpp = require('./makeCpp.js');

if (process.argv.length < 3 || process.argv.length > 3) {
    return console.log("argument count is not proper \
            ex) node [node.js] [target.h|target.cpp]");
}

var file = process.argv[2];
var type = file.split(".")[1];



if (type == "h") {
    //header.make(file);
    cpp.make(file);
} else if (type == "cpp") {
} else {
    console.log("todo : " + type);
}
