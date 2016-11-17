import sagaHelper from '../main';
import avaTest from 'ava';

// This is the generator / saga you wish to test
function* myGenerator() {
    yield 42;
    yield 43;
    yield 44;
}
// You start by overidding the "test" function of the AVA framework, in this scope.
// That way, all the tests after that will look like regular tests but will actually be
// running the generator forward at each step.
// All you have to do is to pass your generator and call it.
// The second argument is the AVA test function, that we are using under the hood.
// That second argument is only used for AVA, not for Mocha or Jest.
const test = sagaHelper(myGenerator(), avaTest);

// This looks very much like a normal "test", with one difference: the function is passed
// a "result", which is what has been yield by the generator.
// This is what you are going to test, using your usual testing framework syntax.
test('should return 42', (result, t) => {
    t.is(result, 42);
});

// On the next "test", we move the generator forward one step, and test again.
test('and then 43', (result, t) => {
    t.is(result, 43);
});

// Same here
test('and then 44', (result, t) => {
    t.is(result, 44);
});

// Now the generator doesn't yield anything, so we can test we arrived at the end
test('and then nothing', (result, t) => {
    t.is(result, undefined);
});