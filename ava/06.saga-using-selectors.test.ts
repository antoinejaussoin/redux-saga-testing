import sagaHelper from '../helper';
import { call, select, put } from 'redux-saga/effects';
import avaTest, { Assertions } from 'ava';

interface State {
  foo: string;
}

const loginAction = (payload: string) => ({ type: 'LOGIN', payload });
const selectUsername = (state: State) => state.foo;

function* loginSaga() {
  const username = yield select(selectUsername);
  yield put(loginAction(username));
}

const test = sagaHelper(loginSaga(), avaTest);

test('should select the current username from the state', (result, t: Assertions) => {
  // Remember, we are not testing the selector here, just testing that the "select" function was called with a given selector function
  // The selector won't be executed (and it can't anyway, there is no state known to redux-saga on this test)
  t.deepEqual(result, select(selectUsername));
  // We return what the selector should have returned
  return 'donald.drumpf';
});

test('should trigger the login action with the username we got from the state', (result, t: Assertions) => {
  t.deepEqual(result, put(loginAction('donald.drumpf')));
});

test('and then nothing', (result, t: Assertions) => {
  t.is(result, undefined);
});
