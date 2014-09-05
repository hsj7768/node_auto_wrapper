#include "Child.h"

Child::Child(int num)
{
    this->num = num;
    this->age = num;
}



int Child::getNum()
{
    return num;
}



void Child::setNum(int num)
{
    this->num = num;
}
