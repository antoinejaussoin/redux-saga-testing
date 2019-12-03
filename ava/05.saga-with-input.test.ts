import sagaHelper from '../helper';
import { put } from 'redux-saga/effects';
import avaTest, { Assertions } from 'ava';

interface Action {
  type: string;
  payload: string;
}

const someOtherAction = (payload: string) => ({
  type: 'SOME_OTHER_ACTION',
  payload
});

function* mySaga(action: Action) {
  yield put(someOtherAction(action.payload));
}

const test = sagaHelper(
  mySaga({ type: 'SOME_ACTION', payload: 'foo' }),
  avaTest
);

test('should trigger the other action with the input action payload', (result, t: Assertions) => {
  t.deepEqual(result, put(someOtherAction('foo')));
});

test('and then nothing', (result, t: Assertions) => {
  t.is(result, undefined);
});
