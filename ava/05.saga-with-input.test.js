import sagaHelper from '../main';
import { call, put } from 'redux-saga/effects';
import testAva from 'ava';

const someOtherAction = payload => ({ type: 'SOME_OTHER_ACTION', payload });

function* mySaga(action) {
    yield put(someOtherAction(action.payload));
}

const test = sagaHelper(mySaga({ type: 'SOME_ACTION', payload: 'foo' }), testAva);

test('should trigger the other action with the input action payload', (result, t) => {
    t.deepEqual(result, put(someOtherAction('foo')));
});

test('and then nothing', (result, t) => {
    t.is(result, undefined);
});