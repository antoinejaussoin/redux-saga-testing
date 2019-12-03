"use strict";
/// <reference path="./global.d.ts" />
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
function sagaTestingHelper(generator, testFunction) {
    var input = undefined;
    var testFn = testFunction;
    if (!testFn) {
        testFn = it;
    }
    return function (title, fn) {
        testFn(title, function () {
            if (input instanceof Error) {
                var result = generator.throw(input);
                input = fn.apply(void 0, __spreadArrays([result.value], arguments));
            }
            else {
                var result = generator.next(input);
                input = fn.apply(void 0, __spreadArrays([result.value], arguments));
            }
        });
    };
}
exports.default = sagaTestingHelper;
//# sourceMappingURL=helper.js.map