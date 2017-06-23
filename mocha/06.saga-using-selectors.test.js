import sagaHelper from '../main';
import { call, select, put } from 'redux-saga/effects';
import expect from 'expect.js';

const loginAction = payload => ({ type: 'LOGIN', payload });
const selectUsername = state => state.foo;

function* loginSaga() {
    const username = yield select(selectUsername);
    yield put(loginAction(username));
}

describe('When testing Saga that has a selector (fake login workflow)', () => {
    const it = sagaHelper(loginSaga());

    it('should select the current username from the state', result => {
        // Remember, we are not testing the selector here, just testing that the "select" function was called with a given selector function
        // The selector won't be executed (and it can't anyway, there is no state known to redux-saga on this test)
        expect(result).to.eql(select(selectUsername));
        // We return what the selector should have returned
        return 'donald.drumpf';
    });

    it('should trigger the login action with the username we got from the state', result => {
        expect(result).to.eql(put(loginAction('donald.drumpf')));
    });

    it('and then nothing', result => {
        expect(result).to.be(undefined);
    });
});