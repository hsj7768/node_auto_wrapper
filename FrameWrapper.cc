#include "FrameWrapper.h"


using namespace v8;

Persistent<Function> FrameWrapper::constructor;


FrameWrapper::FrameWrapper()
{
    this->frame = new Frame();
}



FrameWrapper::~FrameWrapper()
{
    delete this->frame;
}



void FrameWrapper::Init(Handle<Object> exports)
{
    Local<FunctionTemplate> tpl = FunctionTemplate::New(New);
    tpl->SetClassName(String::NewSymbol("FrameWrapper"));

    tpl->InstanceTemplate()->SetInternalFieldCount(2);

    constructor = Persistent<Function>::New(tpl->GetFunction());
    exports->Set(String::NewSymbol("FrameWrapper"), constructor);
}



Handle<Value> FrameWrapper::New(const Arguments& args)
{
    HandleScope scope;

    if(args.IsConstructCall()) {
        FrameWrapper* obj = new FrameWrapper();
        obj->Wrap(args.This());

        return args.This();

    } else {
        const int argc = 1;
        Local<Value> argv[argc] = args[0];

        return scope.Close(constructor->NewInstance(argc, argv));
    }
}



Handle<Value> FrameWrapper::NewInstance(int argc, Handle<Value> argv[])
{
    HandleScope scope;

    Local<Object> instance = constructor->NewInstance(argc, argv);

    return scope.Close(instance);
}
