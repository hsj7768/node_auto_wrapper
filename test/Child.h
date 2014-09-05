#ifndef __CHILD_H__
#define __CHILD_H__

#include "Parent.h"

using namespace std;

class Child : public Parent 
{
public:
    explicit Child(int num=100);
    int getNum();
    void setNum(int num);

private:
    int num;
};

#endif /* __CHILD_H__ */
