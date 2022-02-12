import sagaHelper from "../helper";
import { call, put, select } from "redux-saga/effects";
import avaTest, { Assertions } from "ava";
import sinon from "sinon";

interface State {
  filters: string[];
}

const splitApi = sinon.spy();
const someActionSuccess = (payload: string[]) => ({
  type: "SOME_ACTION_SUCCESS",
  payload,
});
const someActionEmpty = () => ({ type: "SOME_ACTION_EMPTY" });
const someActionError = (error: string) => ({
  type: "SOME_ACTION_ERROR",
  payload: error,
});
const selectFilters = (state: State) => state.filters;

function* mySaga(input: string): any {
  try {
    // We get the filters list from the state, using "select"
    const filters = yield select(selectFilters);

    // We try to call the API, with the given input
    // We expect this API takes a string and returns an array of all the words, split by comma
    const someData = yield call(splitApi, input);

    // From the data we get from the API, we filter out the words 'foo' and 'bar' (from the list of filters we got from the state)
    const transformedData = someData.filter(
      (w: string) => filters.indexOf(w) === -1
    );

    // If the resulting array is empty, we call the empty action, otherwise we call the success action
    if (transformedData.length === 0) {
      yield put(someActionEmpty());
    } else {
      yield put(someActionSuccess(transformedData));
    }
  } catch (e: any) {
    // If we got an exception along the way, we call the error action with the error message
    yield put(someActionError(e.message));
  }
}

// Scenario 1: When the input contains other words than foo and bar and doesn\'t throw
let test = sagaHelper(mySaga("hello,foo,bar,world"), avaTest);

test("Scenario 1: should get the list of filters from the state", (result, t: Assertions) => {
  t.deepEqual(result, select(selectFilters));

  // Here we specify what the selector should have returned.
  // The selector is not called so we have to give its expected return value.
  return ["foo", "bar"];
});

test("Scenario 1: should have called the mock API first, which we are going to specify the results of", (result, t: Assertions) => {
  t.deepEqual(result, call(splitApi, "hello,foo,bar,world"));

  // Here we specify what the API should have returned.
  // Again, the API is not called so we have to give its expected response.
  return ["hello", "foo", "bar", "world"];
});

test("Scenario 1: and then trigger an action with the transformed data we got from the API", (result, t: Assertions) => {
  t.deepEqual(result, put(someActionSuccess(["hello", "world"])));
});

test("Scenario 1: and then nothing", (result, t: Assertions) => {
  t.is(result, undefined);
});

// Scenario 2: When the input only contains foo and bar
test = sagaHelper(mySaga("foo,bar"), avaTest);

test("Scenario 2: should get the list of filters from the state", (result, t: Assertions) => {
  t.deepEqual(result, select(selectFilters));
  return ["foo", "bar"];
});

test("Scenario 2: should have called the mock API first, which we are going to specify the results of", (result, t: Assertions) => {
  t.deepEqual(result, call(splitApi, "foo,bar"));
  return ["foo", "bar"];
});

test("Scenario 2: and then trigger the empty action since foo and bar are filtered out", (result, t: Assertions) => {
  t.deepEqual(result, put(someActionEmpty()));
});

test("Scenario 2: and then nothing", (result, t: Assertions) => {
  t.is(result, undefined);
});

// Scenario 3: The API is broken and throws an exception
test = sagaHelper(mySaga("hello,foo,bar,world"), avaTest);

test("Scenario 3: should get the list of filters from the state", (result, t: Assertions) => {
  t.deepEqual(result, select(selectFilters));
  return ["foo", "bar"];
});

test("Scenario 3: should have called the mock API first, which will throw an exception", (result, t: Assertions) => {
  t.deepEqual(result, call(splitApi, "hello,foo,bar,world"));

  // Here we pretend that the API threw an exception.
  // We don't "throw" here but we return an error, which will be considered by the
  // redux-saga-testing helper to be an exception to throw on the generator
  return new Error("Something went wrong");
});

test("Scenario 3: and then trigger an error action with the error message", (result, t: Assertions) => {
  t.deepEqual(result, put(someActionError("Something went wrong")));
});

test("Scenario 3: and then nothing", (result, t: Assertions) => {
  t.is(result, undefined);
});
