# redux-saga-testing

---

A no-brainer way of testing your Sagas™®

---

#### Examples include [Jest](https://facebook.github.io/jest/), [Mocha](https://mochajs.org/) and [AVA](https://github.com/avajs/ava)

[![npm](https://img.shields.io/npm/v/redux-saga-testing.svg?style=flat-square)](https://www.npmjs.com/package/redux-saga-testing)
[![Dependency Status](https://gemnasium.com/badges/github.com/antoinejaussoin/redux-saga-testing.svg)](https://gemnasium.com/github.com/antoinejaussoin/redux-saga-testing)
[![Travis branch](https://img.shields.io/travis/antoinejaussoin/redux-saga-testing/master.svg?style=flat-square)](https://travis-ci.org/antoinejaussoin/redux-saga-testing)
[![Known Vulnerabilities](https://snyk.io/test/npm/redux-saga-testing/badge.svg)](https://snyk.io/test/npm/redux-saga-testing)

> Sagas are hard, testing them is even harder
> (*Napoleon*)

Testing Sagas is difficult, and the aim of this little utility is to make testing them as close as possible to testing regular code.

It should work with your favourite testing framework, although in this README the examples are using Jest.

You can find examples for `mocha` and `ava` as well in the GitHub repository:
- [Jest](https://facebook.github.io/jest/) in this [location](https://github.com/antoinejaussoin/redux-saga-testing/tree/master/jest) (now including **code coverage**)
- [Mocha](https://mochajs.org/), [expect.js](https://github.com/Automattic/expect.js), [sinon](http://sinonjs.org/) in this [location](https://github.com/antoinejaussoin/redux-saga-testing/tree/master/mocha) (now including **code coverage**)
- [AVA](https://github.com/avajs/ava), [sinon](http://sinonjs.org/) in this [location](https://github.com/antoinejaussoin/redux-saga-testing/tree/master/ava)


## How to use

- Simply import the helper by doing `import sagaHelper from 'redux-saga-testing';`
- Override your "it" testing function with the wrapper: `const it = sagaHelper(sagaUnderTest())`
- Add one "it" per iteration to to test each step (see examples below to see how it works)

# Dependencies

The helper doesn't depend on *anything*.

You can then use this with any version of `redux-saga`, or without it for that matter and test simple generators.

## How to run the tests

- Checkout the code: `git clone https://github.com/antoinejaussoin/redux-saga-testing.git`
- Install the dependencies: `npm i` (or better: `yarn`)
- Run the tests: `npm test`

## Tutorial

This tutorial goes from simple to complex. As you will see, testing Sagas becomes as easy as testing regular (and synchronous) code.

Note: for Mocha examples, please [look here](https://github.com/antoinejaussoin/redux-saga-testing/tree/master/mocha)

### Simple (non-Saga) examples

This example uses a simple generator. This is not using any of the `redux-saga` functions and helpers.

```javascript
import sagaHelper from 'redux-saga-testing';

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

## Testing a simple Saga

This examples is now actually using the `redux-saga` utility functions.

The important point to note here, is that Sagas **describe** what happens, and don't actually act on it.
For example, an API will never be called, you don't have to mock it, when using `call`.
Same thing for a selector, you don't need to mock the state when using `yield select(mySelector)`.

This makes testing very easy indeed.

```javascript
import sagaHelper from 'redux-saga-testing';
import { call, put } from 'redux-saga/effects';

const api = jest.fn();
const someAction = () => ({ type: 'SOME_ACTION', payload: 'foo' });

function* mySaga() {
    yield call(api);
    yield put(someAction());
}

describe('When testing a very simple Saga', () => {
    const it = sagaHelper(mySaga());

    it('should have called the mock API first', result => {
        // Here we test that the generator did run the "call" function, with the "api" as an argument.
        // The api funtion is NOT called.
        expect(result).toEqual(call(api));

        // It's very important to understand that the generator ran the 'call' function,
        // which only describes what it does, and that the API itself is never called.
        // This is what we are testing here: (but you don't need to test that in your own tests)
        expect(api).not.toHaveBeenCalled();
    });

    it('and then trigger an action', result => {
        // We then test that on the next step some action is called
        // Here, obviously, 'someAction' is called but it doesn't have any effect
        // since it only returns an object describing the action
        expect(result).toEqual(put(someAction()));
    });

    it('and then nothing', result => {
        expect(result).toBeUndefined();
    });
});
```

## Testing a complex Saga

This example deals with pretty much all use-cases for using Sagas, which involves using a `select`or, `call`ing an API, getting exceptions, have some conditional logic based on some inputs and `put`ing new actions.

```javascript
import sagaHelper from 'redux-saga-testing';
import { call, put, select } from 'redux-saga/effects';

const splitApi = jest.fn();
const someActionSuccess = payload => ({ type: 'SOME_ACTION_SUCCESS', payload });
const someActionEmpty = () => ({ type: 'SOME_ACTION_EMPTY' });
const someActionError = error => ({ type: 'SOME_ACTION_ERROR', payload: error });
const selectFilters = state => state.filters;

function* mySaga(input) {
    try {
        // We get the filters list from the state, using "select"
        const filters = yield select(selectFilters);

        // We try to call the API, with the given input
        // We expect this API takes a string and returns an array of all the words, split by comma
        const someData = yield call(splitApi, input);

        // From the data we get from the API, we filter out the words 'foo' and 'bar'
        const transformedData = someData.filter(w => filters.indexOf(w) === -1);

        // If the resulting array is empty, we call the empty action, otherwise we call the success action
        if (transformedData.length === 0) {
            yield put(someActionEmpty());
        } else {
            yield put(someActionSuccess(transformedData));
        }
        
    } catch (e) {
        // If we got an exception along the way, we call the error action with the error message
        yield put(someActionError(e.message));
    }   
}

describe('When testing a complex Saga', () => {
    
    describe('Scenario 1: When the input contains other words than foo and bar and doesn\'t throw', () => {
        const it = sagaHelper(mySaga('hello,foo,bar,world'));

        it('should get the list of filters from the state', result => {
            expect(result).toEqual(select(selectFilters));

            // Here we specify what the selector should have returned.
            // The selector is not called so we have to give its expected return value.
            return ['foo', 'bar'];
        });

        it('should have called the mock API first, which we are going to specify the results of', result => {
            expect(result).toEqual(call(splitApi, 'hello,foo,bar,world'));

            // Here we specify what the API should have returned.
            // Again, the API is not called so we have to give its expected response.
            return ['hello', 'foo', 'bar', 'world'];
        });

        it('and then trigger an action with the transformed data we got from the API', result => {
            expect(result).toEqual(put(someActionSuccess(['hello', 'world'])));
        });

        it('and then nothing', result => {
            expect(result).toBeUndefined();
        });
    });

    describe('Scenario 2: When the input only contains foo and bar', () => {
        const it = sagaHelper(mySaga('foo,bar'));

        it('should get the list of filters from the state', result => {
            expect(result).toEqual(select(selectFilters));
            return ['foo', 'bar'];
        });

        it('should have called the mock API first, which we are going to specify the results of', result => {
            expect(result).toEqual(call(splitApi, 'foo,bar'));
            return ['foo', 'bar'];
        });

        it('and then trigger the empty action since foo and bar are filtered out', result => {
            expect(result).toEqual(put(someActionEmpty()));
        });

        it('and then nothing', result => {
            expect(result).toBeUndefined();
        });
    });

    describe('Scenario 3: The API is broken and throws an exception', () => {
        const it = sagaHelper(mySaga('hello,foo,bar,world'));

        it('should get the list of filters from the state', result => {
            expect(result).toEqual(select(selectFilters));
            return ['foo', 'bar'];
        });

        it('should have called the mock API first, which will throw an exception', result => {
            expect(result).toEqual(call(splitApi, 'hello,foo,bar,world'));

            // Here we pretend that the API threw an exception.
            // We don't "throw" here but we return an error, which will be considered by the
            // redux-saga-testing helper to be an exception to throw on the generator
            return new Error('Something went wrong');
        });

        it('and then trigger an error action with the error message', result => {
            expect(result).toEqual(put(someActionError('Something went wrong')));
        });

        it('and then nothing', result => {
            expect(result).toBeUndefined();
        });
    });
    
});
```

### Other examples

You have other examples in the [various](https://github.com/antoinejaussoin/redux-saga-testing/tree/master/jest) [tests](https://github.com/antoinejaussoin/redux-saga-testing/tree/master/mocha) [folders](https://github.com/antoinejaussoin/redux-saga-testing/tree/master/ava).


## FAQ

#### How can I test a Saga that uses `take` or `takeEvery`?

You should separate this generator in two: one that only uses `take` or `takeEvery` (the "watchers"), and the ones that atually run the code when the wait is over, like so:

```javascript
import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { SOME_ACTION, ANOTHER_ACTION } from './state';

export function* onSomeAction(action) {
        const { payload: data } = action;
        yield put(actionGenerator(data));
}

export function* onAnotherAction() {
        etc.
}

export default function* rootSaga() {
    yield [
        takeEvery(SOME_ACTION, onSomeAction),
        takeEvery(ANOTHER_ACTION, onAnotherAction),
        etc.
    ];
}
```

From the previous example, you don't have to test `rootSaga` but you can test `onSomeAction` and `onAnotherAction`.

#### Do I need to mock the store and/or the state?

No you don't. If you read the examples above carefuly, you'll notice that the actual selector (for example) is never called. That means you don't need to mock anything, just return the value your selector should have returned.
This library is to test a saga *workflow*, not about testing your actual *selectors*. If you need to test a selector, do it in isolation (it's just a pure function after all).


## Code coverage

This library should be compatible with your favourite code-coverage frameworks.

In the GitHub repo, you'll find examples using **Istanbul** (for Mocha) and **Jest**.

## Change Log

### v1.0.5
 - Updating dependencies
 - Adding examples using `selector`s (thanks [@TAGC](https://github.com/tagc) for the suggestion)

### v1.0.4

- Updating dependencies
- Fixed Ava issues with `babel-polyfill`

### v1.0.3

- Adding documentation regarding `take` and `takeEvery`
- Updating dependencies

### v1.0.2

- Updating dependencies
- Jest updated from 0.16 to 0.17
- redux-saga upgraded to the latest 0.13 version

### v1.0.1

- Fixing a Yarn.lock issue
- Fixing a few readme problems 

### v1.0.0

- Adding code-coverage support for Jest and Mocha
- The API will stay stable, and will enforce semver.

### v0.1.1

- Adding Yarn support
- Minifying the generated ES3 helper

### v0.1.0

- Adding AVA tests
- Improved documentation

### v0.0.5

- Bug fix on `npm test`

### v0.0.4

- Adding Mocha tests
- Moved Jest tests to their own folders

### v0.0.3

- Adding Travis support
- Improve documentation

### v0.0.2

- Making the helper ES3 compatible

### v0.0.1

- Basic functionality
- Addubg Jest tests examples
- Readme
