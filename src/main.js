let isNumber = require("lodash.isNumber");
let deepUnset = require("lodash.unset");
let deepSet = require("lodash.set");
let deepGet = require("lodash.get");

function raiseMathOpError(opType, original) {
  throw Error(`Invalid operation ${opType}; cannot apply to non-number ${original}.`);
}

function raiseArrayOpError(opType, original) {
  throw Error(`Invalid operation ${opType}; cannot apply to non-array ${original}.`);
}

let arrayOp = (original, target, operation, operand) => {
    if(!Array.isArray(original)) {
      raiseArrayOpError(operation, original);
    }
    original[operation](operand);
};

function add(original, target, path, operand) {
    if (!isNumber(original)) {
      raiseMathOpError('+', original);
    }
    deepSet(target, path, original + operand);
}

function subtract(original, target, path, operand) {
  if (!isNumber(original)) {
    raiseMathOpError('-', original);
  }
  deepSet(target, path, original - operand);
}

function multiply(original, target, path, operand) {
  if (!isNumber(original)) {
    raiseMathOpError('*', original);
  }
  deepSet(target, path, original * operand);
}

function divide(original, target, path, operand) {
  if (!isNumber(original)) {
    raiseMathOpError('/', original);
  }
  deepSet(target, path, original / operand);
}

function mod(original, target, path, operand) {
  if (!isNumber(original)) {
    raiseMathOpError('%', original);
  }
  deepSet(target, path, original % operand);
}

function pow(original, target, path, operand) {
  if (!isNumber(original)) {
    raiseMathOpError('**', original);
  }
  deepSet(target, path, original ** operand);
}

function increment(original, target, path) {
  if (!isNumber(original)) {
    raiseMathOpError('++', original);
  }
  deepSet(target, path, original + 1);
}

function decrement(original, target, path) {
  if (!isNumber(original)) {
    raiseMathOpError('--', original);
  }
  deepSet(target, path, original -1);
}

let operations = {
  delete(original, target, path, operand) {deepUnset(original, target, path);},
  set(original, target, path, operand) {deepSet(target, path, operand);},
  add,
  subtract,
  multiply,
  divide,
  mod,
  pow,
  increment,
  decrement,
  '+': add,
  '-': subtract,
  '*': multiply,
  '/': divide,
  '%': mod,
  '**': pow,
  '++': increment,
  '--': decrement,
  push(original, target, path, operand) {arrayOp(original, target, 'push', operand)},
  pop(original, target, path, operand) {arrayOp(original, target, 'pop', operand)},
  shift(original, target, path, operand) {arrayOp(original, target, 'shift', operand)},
  unshift(original, target, path, operand) {arrayOp(original, target, 'unshift', operand)},
  splice(original, target, path, operand) {
    if(!Array.isArray(original)) {
      raiseArrayOpError('splice', original);
    }
    original.splice(...operand);
  },
  insert(original, target, path, operand) {
    if (!Array.isArray(original)) {
      raiseArrayOpError('insert', original);
    }
    original.splice(operand.index, 0, operand.value);
  },
  removeAt(original, target, path, operand) {
    if (!Array.isArray(original)) {
      raiseArrayOpError('removeAt', original);
    }
    original.splice(operand.index, 1);
  },
  extend(original, target, path, operand) {
    if (!Array.isArray(original)) {
      raiseArrayOpError('extend', original);
    }
    original.splice(original.length, 0, ...operand);
  },
  fn(original, target, path, operand) {
    deepSet(target, path, operand(original));
  }
};

export default function (target, {path, operation, operand}) {
  let original = deepGet(target, path);
  if(operations[operation]) {
    operations[operation](original, target, path, operand)
  }
  else {
    throw Error(`Unrecognized operation ${operation}`);
  }
  return original;
};