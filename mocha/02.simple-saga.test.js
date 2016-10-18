import sagaHelper from '../main';
import { call, put } from 'redux-saga/effects';
import expect from 'expect.js';
import sinon from 'sinon';

const api = sinon.spy();
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
        expect(result).to.eql(call(api));

        // It's very important to understand that the generator ran the 'call' function,
        // which only describes what it does, and that the API itself is never called.
        // This is what we are testing here: (but you don't need to test that in your own tests)
        expect(api.called).not.to.be(true);
    });

    it('and then trigger an action', result => {
        // We then test that on the next step some action is called
        // Here, obviously, 'someAction' is called but it doesn't have any effect
        // since it only returns an object describing the action
        expect(result).to.eql(put(someAction()));
    });

    it('and then nothing', result => {
        expect(result).to.be(undefined);
    });
});