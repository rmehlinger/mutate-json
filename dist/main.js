(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("bobtail-deep-cell", ["exports", "lodash.isNumber", "lodash.unset", "lodash.set", "lodash.get"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("lodash.isNumber"), require("lodash.unset"), require("lodash.set"), require("lodash.get"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.lodashIsNumber, global.lodashUnset, global.lodashSet, global.lodashGet);
    global.bobtailDeepCell = mod.exports;
  }
})(this, function (exports, isNumber, deepUnset, deepSet, deepGet) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (target, _ref) {
    var path = _ref.path,
        operation = _ref.operation,
        operand = _ref.operand;

    var original = deepGet(target, path);
    if (operations[operation]) {
      operations[operation](original, target, path, operand);
    } else {
      throw Error("Unrecognized operation " + operation);
    }
    return original;
  };

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  function raiseMathOpError(opType, original) {
    throw Error("Invalid operation " + opType + "; cannot apply to non-number " + original + ".");
  }

  function raiseArrayOpError(opType, original) {
    throw Error("Invalid operation " + opType + "; cannot apply to non-array " + original + ".");
  }

  var arrayOp = function arrayOp(original, target, operation, operand) {
    if (!Array.isArray(original)) {
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
    deepSet(target, path, original - 1);
  }

  var operations = {
    delete: function _delete(original, target, path, operand) {
      deepUnset(original, target, path);
    },
    set: function set(original, target, path, operand) {
      deepSet(target, path, operand);
    },

    add: add,
    subtract: subtract,
    multiply: multiply,
    divide: divide,
    mod: mod,
    pow: pow,
    increment: increment,
    decrement: decrement,
    '+': add,
    '-': subtract,
    '*': multiply,
    '/': divide,
    '%': mod,
    '**': pow,
    '++': increment,
    '--': decrement,
    push: function push(original, target, path, operand) {
      arrayOp(original, target, 'push', operand);
    },
    pop: function pop(original, target, path, operand) {
      arrayOp(original, target, 'pop', operand);
    },
    shift: function shift(original, target, path, operand) {
      arrayOp(original, target, 'shift', operand);
    },
    unshift: function unshift(original, target, path, operand) {
      arrayOp(original, target, 'unshift', operand);
    },
    splice: function splice(original, target, path, operand) {
      if (!Array.isArray(original)) {
        raiseArrayOpError('splice', original);
      }
      original.splice.apply(original, _toConsumableArray(operand));
    },
    insert: function insert(original, target, path, operand) {
      if (!Array.isArray(original)) {
        raiseArrayOpError('insert', original);
      }
      original.splice(operand.index, 0, operand.value);
    },
    removeAt: function removeAt(original, target, path, operand) {
      if (!Array.isArray(original)) {
        raiseArrayOpError('removeAt', original);
      }
      original.splice(operand.index, 1);
    },
    extend: function extend(original, target, path, operand) {
      if (!Array.isArray(original)) {
        raiseArrayOpError('extend', original);
      }
      original.splice.apply(original, [original.length, 0].concat(_toConsumableArray(operand)));
    },
    fn: function fn(original, target, path, operand) {
      deepSet(target, path, operand(original));
    }
  };

  ;
});

//# sourceMappingURL=main.js.map