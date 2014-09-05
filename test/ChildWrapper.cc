// FIXED
#include "ChildWrapper.h"


// FIXED
using namespace v8;

// FIXED
Persistent<Function> ChildWrapper::constructor;


// FIXED
ChildWrapper::ChildWrapper(int num)
{
    this->child = new Child(num);
}



// FIXED
ChildWrapper::~ChildWrapper()
{
    delete this->child;
}



// FIXED
void ChildWrapper::Init(Handle<Object> exports)
{
    // FIXED
    Local<FunctionTemplate> tpl = FunctionTemplate::New(New);
    tpl->SetClassName(String::NewSymbol("ChildWrapper"));

    // DYNAMIC
    tpl->InstanceTemplate()->SetInternalFieldCount(2);
    tpl->PrototypeTemplate()->Set(v8::String::NewSymbol("add"), 
            v8::FunctionTemplate::New(add)->GetFunction());
    tpl->PrototypeTemplate()->Set(v8::String::NewSymbol("toInt"), 
            v8::FunctionTemplate::New(toInt)->GetFunction());

    // FIXED
    constructor = Persistent<Function>::New(tpl->GetFunction());
    exports->Set(String::NewSymbol("ChildWrapper"), constructor);
}



// FIXED
Handle<Value> ChildWrapper::New(const Arguments& args)
{
    HandleScope scope;

    if(args.IsConstructCall()) {
        int argvalue = (int)args[0]->ToInteger()->Value();
        ChildWrapper* obj = new ChildWrapper(argvalue);
        obj->Wrap(args.This());

        return args.This();

    } else {
        const int argc = 1;
        Local<Value> argv[argc] = args[0];

        return scope.Close(constructor->NewInstance(argc, argv));
    }
}



// DYNAMIC
Handle<Value> ChildWrapper::add(const Arguments& args)
{
    HandleScope scope;

    int num = (int)Local<Integer>::Cast(args[0])->Value();

    ChildWrapper* obj = ObjectWrap::Unwrap<ChildWrapper>(args.This());
    int childNum = obj->child->getNum();
    obj->child->setNum(childNum+num);


    return scope.Close(Number::New(num + childNum));
}



// DYNAMIC
Handle<Value> ChildWrapper::toInt(const Arguments& args)
{
    HandleScope scope;

    ChildWrapper* obj = ObjectWrap::Unwrap<ChildWrapper>(args.This());
    int childNum = obj->child->getNum();

    return scope.Close(Number::New(childNum));
}



// FIXED
Handle<Value> ChildWrapper::NewInstance(int argc, Handle<Value> argv[])
{
    HandleScope scope;

    Local<Object> instance = constructor->NewInstance(argc, argv);

    return scope.Close(instance);
}
