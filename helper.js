"use strict";
/// <reference path="./global.d.ts" />
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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
                input = fn.apply(void 0, __spreadArray([result.value], arguments, false));
            }
            else {
                var result = generator.next(input);
                input = fn.apply(void 0, __spreadArray([result.value], arguments, false));
            }
        });
    };
}
exports.default = sagaTestingHelper;
//# sourceMappingURL=helper.js.map