import sagaHelper from '../main';
import { call, put } from 'redux-saga/effects';
import expect from 'expect.js';
import sinon from 'sinon';

const api = sinon.spy();
const someAction = payload => ({ type: 'SOME_ACTION', payload });

function* mySaga() {
    const someData = yield call(api);
    const transformedData = someData.map(x => x.id);
    yield put(someAction(transformedData));
}

describe('When testing a Saga that manipulates data', () => {
    const it = sagaHelper(mySaga());

    it('should have called the mock API first, which returns some data', result => {
        expect(result).to.eql(call(api));
        return [
            { id: 1, title: 'foo' },
            { id: 2, title: 'bar' },
            { id: 3, title: 'foobar' }
        ];
    });

    it('and then trigger an action with the transformed data we got from the API', result => {
        expect(result).to.eql(put(someAction([1, 2, 3])));
    });

    it('and then nothing', result => {
        expect(result).to.be(undefined);
    });
});