import sagaHelper from '../main';
import expect from 'expect.js';

// This is the generator / saga you wish to test
function* myGenerator() {
    yield 42;
    yield 43;
    yield 44;
}

describe('When testing a very simple generator (not even a Saga)', () => {
    // You start by overidding the "it" function of your test framework, in this scope.
    // That way, all the tests after that will look like regular tests but will actually be
    // running the generator forward at each step.
    // All you have to do is to pass your generator and call it.
    const it = sagaHelper(myGenerator());

    // This looks very much like a normal "it", with one difference: the function is passed
    // a "result", which is what has been yield by the generator.
    // This is what you are going to test, using your usual testing framework syntax.
    // Here we are using "expect" because we are using expect.js,
    // but really it could be any other assertion library.
    it('should return 42', result => {
        expect(result).to.be(42);
    });

    // On the next "it", we move the generator forward one step, and test again.
    it('and then 43', result => {
        expect(result).to.be(43);
    });

    // Same here
    it('and then 44', result => {
        expect(result).to.be(44);
    });

    // Now the generator doesn't yield anything, so we can test we arrived at the end
    it('and then nothing', result => {
        expect(result).to.be(undefined);
    });
});