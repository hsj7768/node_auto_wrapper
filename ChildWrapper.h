#ifndef __CHILD_WRAPPER_H__
#define __CHILD_WRAPPER_H__


#include <Child.h>
#include <node.h>

using namespace node;
using namespace v8;

class ChildWrapper : public ObjectWrap 
{
public:
    static void Init(Handle<Object> exports);
    static Handle<Value> NewInstance(int argc, Handle<Value> argv[]);


private
    static Handle<Value> getNum(const Arguments& args);
    static Handle<Value> setNum(const Arguments& args);

    explicit ChildWrapper();
    ~ChildWrapper();
    static Handle<Value> New(const Arguments& args);

    static Persistent<Function> constructor;
    Child* child;
};

#endif /* __CHILD_WRAPPER_H__ */
