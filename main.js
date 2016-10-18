"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (generator, testFunction) {
    var input = undefined;
    var testFn = testFunction;
    if (!testFn) {
        testFn = it;
    }
    return function (title, fn) {
        testFn(title, function () {
            if (input instanceof Error) {
                var result = generator.throw(input);
                input = fn.apply(undefined, [result.value].concat(Array.prototype.slice.call(arguments)));
            } else {
                var _result = generator.next(input);
                input = fn.apply(undefined, [_result.value].concat(Array.prototype.slice.call(arguments)));
            }
        });
    };
};