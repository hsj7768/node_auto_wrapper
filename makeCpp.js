var fs = require('fs');
var frameCppfile = "./FrameWrapper.cc";


exports.make = function(target) {
    fs.readFile(frameCppfile, function (err, data) {
        if (err) throw err;

        fs.readFile("./" + target, function(err, wdata) {
            var origin = wdata.toString();
            var className = origin.match(/class [aA-zZ]+/gm).toString();
            className = className.replace("class ", "");
            var wrapClass = className + "Wrapper";

            var wrapFile = "./" + wrapClass + ".cc";


            // extract string data
            var wrap = data.toString();
            wrap = wrap.replace(new RegExp("\\Frame","g"), className);
            wrap = wrap.replace(new RegExp("\\FRAME", "g"), className.toUpperCase());
            wrap = wrap.replace(new RegExp("frame", "g"), className.toLowerCase());


            // extract public functions
            var declareFunction = "tpl->InstanceTemplate()->SetInternalFieldCount(1);\n";
            var publicFunc = origin.match(/public:\n([aA-zZ\s()=\d;<>,]+)private:/)[1].split("\n");


            // declare public functions
            publicFunc.forEach(function(func, i) {
                if (func && func.indexOf("explicit") < 0) {
                    // get Function Name
                    func = func.trim();
                    func = func.replace(/[aA-zZ]+\s/, "");
                    func = func.replace(/\([aA-zZ\s]*\);/, "");
                    var functionName = func.trim();

                    declareFunction += "    tpl->PrototypeTemplate()->Set(v8::String::NewSymbol(\"";
                    declareFunction += functionName;
                    declareFunction += "\"),\n"; 
                    declareFunction += "        v8::FunctionTemplate::New(";
                    declareFunction += functionName;
                    declareFunction += ")->GetFunction());\";\n";
                }
            });

            wrap = wrap.replace(new RegExp("tpl->InstanceTemplate[(][)]->SetInternalFieldCount[(]\\d[)];", "g"), declareFunction);


            
            var functionBody = "";
            // write function
            publicFunc.forEach(function(func, i) {
                if (func && func.indexOf("explicit") < 0) {
                    func = func.trim();
                    var type = func.split(" ")[0];
                    // get Function Name
                    var removedType = func.replace(/[aA-zZ]+\s/, "");
                    var functionName = removedType.replace(/\([aA-zZ\s]*\);/, "");

                    functionBody += "Handle<Value> ";
                    functionBody += wrapClass;
                    functionBody += "::";
                    functionBody += func;
                    functionBody += "(const Arguments& args)\n";
                    functionBody += "{\n";
                    functionBody += "    HandleScope scope;\n";
                    functionBody += "    ";
                    functionBody += wrapClass + "* obj = ObjectWrap::Unwrap<" + wrapClass + ">(args.This());\n";
                    functionBody += "    return scope.Close(";
                    if (type == "int") {
                        functionBody += "Number::New(";
                        functionBody += "obj->";
                        functionBody += className.toUpperCase();
                        functionBody += "->";
                        functionBody += removedType;
                        functionBody += "\n";
                        functionBody += "}\n";

                    } else if (type == "void") {
                    } else if (type == "double") {
                    } else if (type == "QString") {
                    } else {
                    }

                }
            });

            wrap += functionBody;


//*
            fs.writeFile(wrapFile, wrap, function (err) {
                if (err) throw err;
                console.log('Cpp File saved!');
            });
//*/
        });
    });
}
