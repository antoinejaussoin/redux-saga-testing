# redux-saga-testing
A no-brainer way of testing your Sagas™®

> Sagas are hard, testing them is even harder
> (Napoleon)

Testing Sagas is difficult, and the aim of this little utility is to make testing them as close as possible to testing regular code.

It should work with your favourite testing framework, although here the examples are using Jest.

In this tutorial, we are going to see a few examples, from the simplest to the most complicated. You can find (and run) all these examples from the `__tests__` folder.

## How to run the tests

- Checkout the code: `git clone https://github.com/antoinejaussoin/redux-saga-testing.git`
- Install the dependencies: `npm i`
- Run the tests: `npm test`

## Tutorial

This tutorial goes from simple to complex. As you will see, testing Sagas becomes as easy as testing regular (and synchronous) code.

### Simple (non-Saga) examples

This example uses a simple generator. This is not using any of the `redux-saga` functions and helpers.

```
// This is the generator / saga you with to test
function* mySaga() {
    yield 42;
    yield 43;
    yield 44;
}

describe('When testing a very simple generator (not even a Saga)', () => {
    // You start by overidding the "it" function of your test framework, in this scope.
    // That way, all the tests after that will look like regular tests but will actually be
    // running the generator forward at each step.
    // All you have to do is to pass your generator and call it.
    const it = sagaHelper(mySaga());

    // This looks very much like a normal "it", with one difference: the function is passed
    // a "result", which is what has been yield by the generator.
    // This is what you are going to test, using your usual testing framework syntax.
    // Here we are using "expect" because we are using Jest, but really it could be anything.
    it('should return 42', result => {
        expect(result).toBe(42);
    });

    // On the next "it", we move the generator forward one step, and test again.
    it('and then 43', result => {
        expect(result).toBe(43);
    });

    // Same here
    it('and then 44', result => {
        expect(result).toBe(44);
    });

    // Now the generator doesn't yield anything, so we can test we arrived at the end
    it('and then nothing', result => {
        expect(result).toBeUndefined();
    });
});
```