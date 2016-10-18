import sagaHelper from '../main';
import { call, put } from 'redux-saga/effects';
import testAva from 'ava';
import sinon from 'sinon';

const api = sinon.spy();
const someAction = payload => ({ type: 'SOME_ACTION', payload });

function* mySaga() {
    const someData = yield call(api);
    const transformedData = someData.map(x => x.id);
    yield put(someAction(transformedData));
}

const test = sagaHelper(mySaga(), testAva);

test('should have called the mock API first, which returns some data', (result, t) => {
    t.deepEqual(result, call(api));
    return [
        { id: 1, title: 'foo' },
        { id: 2, title: 'bar' },
        { id: 3, title: 'foobar' }
    ];
});

test('and then trigger an action with the transformed data we got from the API', (result, t) => {
    t.deepEqual(result, put(someAction([1, 2, 3])));
});

test('and then nothing', (result, t) => {
    t.is(result, undefined);
});