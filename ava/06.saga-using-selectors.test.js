import sagaHelper from '../main';
import { call, select, put } from 'redux-saga/effects';
import testAva from 'ava';

const loginAction = payload => ({ type: 'LOGIN', payload });
const selectUsername = state => state.foo;

function* loginSaga() {
    const username = yield select(selectUsername);
    yield put(loginAction(username));
}

const test = sagaHelper(loginSaga(), testAva);

test('should select the current username from the state', (result, t) => {
    // Remember, we are not testing the selector here, just testing that the "select" function was called with a given selector function
    // The selector won't be executed (and it can't anyway, there is no state known to redux-saga on this test)
    t.deepEqual(result, select(selectUsername));
    // We return what the selector should have returned
    return 'donald.drumpf';
});

test('should trigger the login action with the username we got from the state', (result, t) => {
    t.deepEqual(result, put(loginAction('donald.drumpf')));
});

test('and then nothing', (result, t) => {
    t.is(result, undefined);
});