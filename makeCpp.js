var fs = require('fs');
var frameCppfile = "./FrameWrapper.cpp";


exports.make = function(target) {
    fs.readFile(frameCppfile, function (err, data) {
        if (err) throw err;

        fs.readFile(target, function(err, wdata) {
            var origin = wdata.toString();
            var className = origin.match(/class [aA-zZ]+/gm).toString();
            className = className.replace("class ", "");
            var wrapFile = "./"+ className  +"Wrapper.h";


            // extract string data
            var wrap = data.toString();
            wrap = wrap.replace(new RegExp("\\Frame","g"), className);
            wrap = wrap.replace(new RegExp("\\FRAME", "g"), className.toUpperCase());
            wrap = wrap.replace(new RegExp("\\Frame", "g"), className.toLowerCase());


            // extract public functions && make v8 function
            var wrapPublicFunc = "";
            var publicFunc = origin.match(/public:\n([aA-zZ\s()=\d;<>,]+)private:/)[1].split("\n");
            publicFunc.forEach(function(func, i) {
                if (func && func.indexOf("explicit") < 0) {
                    func = func.trim();
                    func = func.replace(/[aA-zZ]+\s/, "static Handle<Value> ");
                    func = func.replace(/[(][aA-zZ\s=\d]*[)]/, "(const Arguments& args)");
                    wrapPublicFunc += "    ";
                    wrapPublicFunc += func;
                    wrapPublicFunc += "\n";
                }
            });


            wrap = wrap.replace(/private:/, "private\n" + wrapPublicFunc);

            fs.writeFile(wrapFile, wrap, function (err) {
                if (err) throw err;
                console.log('It\'s saved!');
            });
        });
    });
}
