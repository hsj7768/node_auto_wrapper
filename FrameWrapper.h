#ifndef __FRAME_WRAPPER_H__
#define __FRAME_WRAPPER_H__


#include <Frame.h>
#include <node.h>

using namespace node;
using namespace v8;

class FrameWrapper : public ObjectWrap 
{
public:
    static void Init(Handle<Object> exports);
    static Handle<Value> NewInstance(int argc, Handle<Value> argv[]);


private:
    explicit FrameWrapper();
    ~FrameWrapper();
    static Handle<Value> New(const Arguments& args);

    static Persistent<Function> constructor;
    Frame* frame;
};

#endif /* __FRAME_WRAPPER_H__ */
