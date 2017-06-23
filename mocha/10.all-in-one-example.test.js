import sagaHelper from '../main';
import { call, put, select } from 'redux-saga/effects';
import expect from 'expect.js';
import sinon from 'sinon';

const splitApi = sinon.spy();
const someActionSuccess = payload => ({ type: 'SOME_ACTION_SUCCESS', payload });
const someActionEmpty = () => ({ type: 'SOME_ACTION_EMPTY' });
const someActionError = error => ({ type: 'SOME_ACTION_ERROR', payload: error });
const selectFilters = state => state.filters;

function* mySaga(input) {
    try {
        // We get the filters list from the state, using "select"
        const filters = yield select(selectFilters);

        // We try to call the API, with the given input
        // We expect this API takes a string and returns an array of all the words, split by comma
        const someData = yield call(splitApi, input);

        // From the data we get from the API, we filter out the words 'foo' and 'bar'
        const transformedData = someData.filter(w => filters.indexOf(w) === -1);

        // If the resulting array is empty, we call the empty action, otherwise we call the success action
        if (transformedData.length === 0) {
            yield put(someActionEmpty());
        } else {
            yield put(someActionSuccess(transformedData));
        }
        
    } catch (e) {
        // If we got an exception along the way, we call the error action with the error message
        yield put(someActionError(e.message));
    }   
}

describe('When testing a complex Saga', () => {
    
    describe('Scenario 1: When the input contains other words than foo and bar and doesn\'t throw', () => {
        const it = sagaHelper(mySaga('hello,foo,bar,world'));

        it('should get the list of filters from the state', result => {
            expect(result).to.eql(select(selectFilters));

            // Here we specify what the selector should have returned.
            // The selector is not called so we have to give its expected return value.
            return ['foo', 'bar'];
        });

        it('should have called the mock API first, which we are going to specify the results of', result => {
            expect(result).to.eql(call(splitApi, 'hello,foo,bar,world'));

            // Here we specify what the API should have returned.
            // Again, the API is not called so we have to give its expected response.
            return ['hello', 'foo', 'bar', 'world'];
        });

        it('and then trigger an action with the transformed data we got from the API', result => {
            expect(result).to.eql(put(someActionSuccess(['hello', 'world'])));
        });

        it('and then nothing', result => {
            expect(result).to.be(undefined);
        });
    });

    describe('Scenario 2: When the input only contains foo and bar', () => {
        const it = sagaHelper(mySaga('foo,bar'));

        it('should get the list of filters from the state', result => {
            expect(result).to.eql(select(selectFilters));
            return ['foo', 'bar'];
        });

        it('should have called the mock API first, which we are going to specify the results of', result => {
            expect(result).to.eql(call(splitApi, 'foo,bar'));
            return ['foo', 'bar'];
        });

        it('and then trigger the empty action since foo and bar are filtered out', result => {
            expect(result).to.eql(put(someActionEmpty()));
        });

        it('and then nothing', result => {
            expect(result).to.be(undefined);
        });
    });

    describe('Scenario 3: The API is broken and throws an exception', () => {
        const it = sagaHelper(mySaga('hello,foo,bar,world'));

        it('should get the list of filters from the state', result => {
            expect(result).to.eql(select(selectFilters));
            return ['foo', 'bar'];
        });

        it('should have called the mock API first, which will throw an exception', result => {
            expect(result).to.eql(call(splitApi, 'hello,foo,bar,world'));

            // Here we pretend that the API threw an exception.
            // We don't "throw" here but we return an error, which will be considered by the
            // redux-saga-testing helper to be an exception to throw on the generator
            return new Error('Something went wrong');
        });

        it('and then trigger an error action with the error message', result => {
            expect(result).to.eql(put(someActionError('Something went wrong')));
        });

        it('and then nothing', result => {
            expect(result).to.be(undefined);
        });
    });
    
});