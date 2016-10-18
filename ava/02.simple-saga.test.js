import sagaHelper from '../main';
import { call, put } from 'redux-saga/effects';
import testAva from 'ava';
import sinon from 'sinon';

const api = sinon.spy();
const someAction = () => ({ type: 'SOME_ACTION', payload: 'foo' });

function* mySaga() {
    yield call(api);
    yield put(someAction());
}

const test = sagaHelper(mySaga(), testAva);

test('should have called the mock API first', (result, t) => {
    // Here we test that the generator did run the "call" function, with the "api" as an argument.
    // The api funtion is NOT called.
    t.deepEqual(result, call(api));

    // It's very important to understand that the generator ran the 'call' function,
    // which only describes what it does, and that the API itself is never called.
    // This is what we are testing here: (but you don't need to test that in your own tests)
    t.false(api.called);
});

test('and then trigger an action', (result, t) => {
    // We then test that on the next step some action is called
    // Here, obviously, 'someAction' is called but it doesn't have any effect
    // since it only returns an object describing the action
    t.deepEqual(result, put(someAction()));
});

test('and then nothing', (result, t) => {
    t.is(result, undefined);
});