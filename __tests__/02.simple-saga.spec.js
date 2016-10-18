import sagaHelper from '../main';
import { call, put } from 'redux-saga/effects';

const mockApi = jest.fn();
const mockAction = () => ({ type: 'SOME_ACTION', payload: 'foo' });

function* mySaga() {
    yield call(mockApi);
    yield put(mockAction());
}

describe('When testing a very simple Saga', () => {
    const it = sagaHelper(mySaga());

    it('should have called the mock API first', result => {
        expect(result).toEqual(call(mockApi));
    });

    it('and then trigger an action', result => {
        expect(result).toEqual(put(mockAction()));
    });

    it('and then nothing', result => {
        expect(result).toBeUndefined();
    });
});