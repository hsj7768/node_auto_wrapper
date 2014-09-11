var fs = require('fs');
var frameHeaderfile = "./FrameWrapper.h";
var util = require('./util.js');



exports.make = function(target, output) {
    fs.readFile(frameHeaderfile, function (err, data) {
        if (err) throw err;

        fs.readFile(target, function(err, wdata) {
            console.log("target : " + target);

            var origin = wdata.toString();
            var className = origin.match(/class [aA-zZ]+/gm).toString().replace("class ", "");
            var wrapFile = className  +"Wrapper.h";


            // extract string data
            var wrap = data.toString();
            util.replaceClassName(wrap, className);


            // extract public functions 
            var wrapPublicFunc = "";
            var publicFunc = util.makePublicFunctionList(origin);


            // make v8 function
            publicFunc.forEach(function(func, i) {
                if (func && func.indexOf(className + "(") <= 0) {
                    func = func.trim();
                    func = func.replace(/[aA-zZ]+\s/, "static Handle<Value> ");
                    func = func.replace(/[(][aA-zZ\s=\d]*[)]/, "(const Arguments& args)");
                    wrapPublicFunc += "    ";
                    wrapPublicFunc += func;
                    wrapPublicFunc += "\n";
                }
            });
            wrap = wrap.replace(/private:/, "private\n" + wrapPublicFunc);


            fs.writeFile("./" + output + "/" + wrapFile, wrap, function (err) {
                if (err) throw err;
                console.log('create ' + wrapFile);
            });
        });
    });
}
