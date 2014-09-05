var fs = require('fs');
var frameCppfile = "./FrameWrapper.cc";


exports.make = function(target) {
    fs.readFile(frameCppfile, function (err, data) {
        if (err) throw err;

        fs.readFile(target, function(err, wdata) {
            var origin = wdata.toString();
            var className = origin.match(/class [aA-zZ]+/gm).toString();
            className = className.replace("class ", "");
            var wrapClass = className + "Wrapper";

console.log("className : " + className);
            var wrapFile = "./" + wrapClass + ".h";


            // extract string data
            var wrap = data.toString();
            wrap = wrap.replace(new RegExp("\\Frame","g"), className);
            wrap = wrap.replace(new RegExp("\\FRAME", "g"), className.toUpperCase());
            wrap = wrap.replace(new RegExp("\\Frame", "g"), className.toLowerCase());

console.log("--------------------");

            // extract public functions && make v8 function
            var wrapPublicFunc = "";
            var publicFunc = origin.match(/public:\n([aA-zZ\s()=\d;<>,]+)private:/)[1].split("\n");
            publicFunc.forEach(function(func, i) {
                if (func && func.indexOf("explicit") < 0) {
                    func = func.trim();
                    func = func.replace(/[aA-zZ]+\s/, "Handle<Value> " + wrapClass  + "::");
                    func = func.replace(/[(][aA-zZ\s=\d]*[)]/, "(const Arguments& args)");
                    wrapPublicFunc += "    ";
                    wrapPublicFunc += func;
                    wrapPublicFunc += "\n";
                    wrapPublicFunc += "{\n";
                    wrapPublicFunc += "    HandleScope scope;\n";
                    wrapPublicFunc += "    " + wrapClass + "* obj = " + wrapClass + "::Unwrap<";
                    wrapPublicFunc += wrapClass;
                    wrapPublicFunc += ">(args.This());";
                    wrapPublicFunc += 
                }";
console.log(i + " : " + func);
                }
            });

console.log("--------------------");

/*
            wrap = wrap.replace(/private:/, "private\n" + wrapPublicFunc);
*/
//	    console.log(wrap);
/*
            fs.writeFile(wrapFile, wrap, function (err) {
                if (err) throw err;
                console.log('It\'s saved!');
            });
*/
        });
    });
}
