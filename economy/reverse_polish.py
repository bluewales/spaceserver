#include <stdlib.h>
#include <cstdarg>
#include <time.h>
#include <math.h>
#include "fastRandom.h"
#include "rvpParser.h"

## the formula must be given in reverse polish, with no spaces
## variables are give in the form P1, P2, P3 etc
## the string must be terminated by a =

import math
import random

def rvp_parse(formula, params={}):
  stack = []


  for param in params:
    formula = formula.replace(param, str(params[param]))

  while len(formula) > 0:

    op = formula[0]
    if op == "(":
      if formula[1] == "R":
        stack.append(random.randrange(0, 1000000))
        formula = formula[2:]
      else:
        ix = formula.find(")")
        p = float(formula[1:ix])
        stack.append(p)
        formula = formula[ix:]

    elif op == "=": ## this is the end, return the number
      if len(stack) != 1 :
        print("RVP ERROR\n")
      return stack.pop()
    elif op == "?": ## terciary operators
      c = stack.pop()
      b = stack.pop()
      a = stack.pop()
      stack.append(evaluate_three_param(op, a, b, c))
    elif op == "s": ## unary operators
      a = stack.pop()
      stack.append(evaluate_one_param(op, a))
    else: ## binary operators
      b = stack.pop()
      a = stack.pop()
      stack.append(evaluate(op, a,b))
    formula = formula[1:]
  print("\n*********************************RVParser exited in error\n")
  exit(0)

def evaluate(op, a, b):
  if op == "!":
    pass
  elif op == "%":
    if b < 1:
      return 0
    else:
      return int(a) % int(b)
  elif op == "&":
    if a != 0 and b != 0:
      return 1
    else:
      return 0
  elif op == "*":
    return a * b
  elif op == "+":
    return a + b
  elif op == "-":
    return a - b
  elif op == "/":
    return a / b
  elif op == ":":
    if a == b:
      return 1
    else:
      return 0
  elif op == "^":
    pass
  elif op == "|":
    if a != 0 or b != 0:
      return 1
    else:
      return 0
  elif op == "<":
    if a < b:
      return 1
    else:
      return 0    
  elif op == "n":
    if a > b:
      return b
    else:
      return a
  elif op == "x":
    if a > b:
      return a
    else:
      return b
  elif op == ">":
    if a > b:
      return 1
    else:
      return 0
  return 0

def evaluate_three_param(op, a, b, c):
  if op == "?":
    if c != 0:
      return a
    else:
      return b
  return 0

def evaluate_one_param(op, a):
  if op == "s":
    return math.sqrt(a)
  return 0


if __name__ == '__main__':

  params = {
    "age": 31,
    "alread_possessed": 32
  }

  
  test_string = "(P2)(P2)(10)*(P3)?="
  test_string = "(100)(0)(R)(1000)%(1):?="
  test_string = "(P4)(3)*(P2)(7)*(10)/+(P3)(1)+/(100)(P6)-(P2)+*(200)/="
  test_string = "(R)(100)%(R)(100)%+(2)/="
  test_string = "(age)(10)*(0)(age)(alread_possessed)>?="
  print(rvp_parse(test_string, params))
