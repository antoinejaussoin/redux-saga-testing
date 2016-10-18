import sagaHelper from '../main';
import { call, put } from 'redux-saga/effects';
import expect from 'expect.js';

const someOtherAction = payload => ({ type: 'SOME_OTHER_ACTION', payload });

function* mySaga(action) {
    yield put(someOtherAction(action.payload));
}

describe('When testing Saga that has an input (usually an action)', () => {
    const it = sagaHelper(mySaga({ type: 'SOME_ACTION', payload: 'foo' }));

    it('should trigger the other action with the input action payload', result => {
        expect(result).to.eql(put(someOtherAction('foo')));
    });

    it('and then nothing', result => {
        expect(result).to.be(undefined);
    });
});