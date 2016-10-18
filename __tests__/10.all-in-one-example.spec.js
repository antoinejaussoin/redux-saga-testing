import sagaHelper from '../main';
import { call, put } from 'redux-saga/effects';

const mockApi = jest.fn();
const mockActionSuccess = payload => ({ type: 'SOME_ACTION_SUCCESS', payload });
const mockActionEmpty = () => ({ type: 'SOME_ACTION_EMPTY' });
const mockActionError = error => ({ type: 'SOME_ACTION_ERROR', payload: error });

function* mySaga(input) {
    try {
        const someData = yield call(mockApi, input);
        const transformedData = someData.filter(w => ['foo', 'bar'].indexOf(w) === -1);

        if (transformedData.length === 0) {
            yield put(mockActionEmpty());
        } else {
            yield put(mockActionSuccess(transformedData));
        }
        
    } catch (e) {
        yield put(mockActionError(e.message));
    }   
}

describe('When testing a complex Saga', () => {
    
    describe('Scenario 1: When the input contains other words than foo and bar and doesn\'t throw', () => {
        const it = sagaHelper(mySaga('hello,foo,bar,world'));

        it('should have called the mock API first, which we are going to specify the results of', result => {
            expect(result).toEqual(call(mockApi, 'hello,foo,bar,world'));
            return ['hello', 'foo', 'bar', 'world'];
        });

        it('and then trigger an action with the transformed data we got from the API', result => {
            expect(result).toEqual(put(mockActionSuccess(['hello', 'world'])));
        });

        it('and then nothing', result => {
            expect(result).toBeUndefined();
        });
    });

    describe('Scenario 2: When the input only contains foo and bar', () => {
        const it = sagaHelper(mySaga('foo,bar'));

        it('should have called the mock API first, which we are going to specify the results of', result => {
            expect(result).toEqual(call(mockApi, 'foo,bar'));
            return ['foo', 'bar'];
        });

        it('and then trigger the empty action since foo and bar are filtered out', result => {
            expect(result).toEqual(put(mockActionEmpty()));
        });

        it('and then nothing', result => {
            expect(result).toBeUndefined();
        });
    });

    describe('Scenario 3: The API is broken and throws an exception', () => {
        const it = sagaHelper(mySaga('hello,foo,bar,world'));

        it('should have called the mock API first, which will throw an exception', result => {
            expect(result).toEqual(call(mockApi, 'hello,foo,bar,world'));
            return new Error('Something went wrong');
        });

        it('and then trigger an error action with the error message', result => {
            expect(result).toEqual(put(mockActionError('Something went wrong')));
        });

        it('and then nothing', result => {
            expect(result).toBeUndefined();
        });
    });
    
});