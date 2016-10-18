import sagaHelper from '../main';
import { call, put } from 'redux-saga/effects';
import testAva from 'ava';
import sinon from 'sinon';

const api = sinon.spy();
const someActionSuccess = payload => ({ type: 'SOME_ACTION_SUCCESS', payload });
const someActionError = error => ({ type: 'SOME_ACTION_ERROR', payload: error });

function* mySaga() {
    try {
        const someData = yield call(api);
        const transformedData = someData.map(x => x.id);
        yield put(someActionSuccess(transformedData));
    } catch (e) {
        yield put(someActionError(e.message));
    }   
}

const test = sagaHelper(mySaga(), testAva);

test('should have called the mock API first, which will throw an exception', (result, t) => {
    t.deepEqual(result, call(api));
    return new Error('Something went wrong');
});

test('and then trigger an error action with the error message', (result, t) => {
    t.deepEqual(result, put(someActionError('Something went wrong')));
});

test('and then nothing', (result, t) => {
    t.is(result, undefined);
});