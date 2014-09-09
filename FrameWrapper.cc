// FIXED
#include "FrameWrapper.h"


// FIXED
using namespace v8;

// FIXED
Persistent<Function> FrameWrapper::constructor;


// FIXED
FrameWrapper::FrameWrapper(int num)
{
    this->frame = new Frame(num);
}



// FIXED
FrameWrapper::~FrameWrapper()
{
    delete this->frame;
}



// FIXED
void FrameWrapper::Init(Handle<Object> exports)
{
    // FIXED
    Local<FunctionTemplate> tpl = FunctionTemplate::New(New);
    tpl->SetClassName(String::NewSymbol("FrameWrapper"));

    // DYNAMIC
    tpl->InstanceTemplate()->SetInternalFieldCount(2);
    tpl->PrototypeTemplate()->Set(v8::String::NewSymbol("add"), 
            v8::FunctionTemplate::New(add)->GetFunction());
    tpl->PrototypeTemplate()->Set(v8::String::NewSymbol("toInt"), 
            v8::FunctionTemplate::New(toInt)->GetFunction());

    // FIXED
    constructor = Persistent<Function>::New(tpl->GetFunction());
    exports->Set(String::NewSymbol("FrameWrapper"), constructor);
}



// FIXED
Handle<Value> FrameWrapper::New(const Arguments& args)
{
    HandleScope scope;

    if(args.IsConstructCall()) {
        int argvalue = (int)args[0]->ToInteger()->Value();
        FrameWrapper* obj = new FrameWrapper(argvalue);
        obj->Wrap(args.This());

        return args.This();

    } else {
        const int argc = 1;
        Local<Value> argv[argc] = args[0];

        return scope.Close(constructor->NewInstance(argc, argv));
    }
}



// DYNAMIC
Handle<Value> FrameWrapper::add(const Arguments& args)
{
    HandleScope scope;

    int num = (int)Local<Integer>::Cast(args[0])->Value();

    FrameWrapper* obj = ObjectWrap::Unwrap<FrameWrapper>(args.This());
    int frameNum = obj->frame->getNum();
    obj->frame->setNum(frameNum+num);


    return scope.Close(Number::New(num + frameNum));
}



// DYNAMIC
Handle<Value> FrameWrapper::toInt(const Arguments& args)
{
    HandleScope scope;

    FrameWrapper* obj = ObjectWrap::Unwrap<FrameWrapper>(args.This());
    int frameNum = obj->frame->getNum();

    return scope.Close(Number::New(frameNum));
}



// FIXED
Handle<Value> FrameWrapper::NewInstance(int argc, Handle<Value> argv[])
{
    HandleScope scope;

    Local<Object> instance = constructor->NewInstance(argc, argv);

    return scope.Close(instance);
}
