import sagaHelper from "../helper";
import { call, put } from "redux-saga/effects";
import avaTest, { Assertions } from "ava";
import sinon from "sinon";

interface ApiResult {
  id: number;
  title: string;
}

const api = sinon.spy();
const someActionSuccess = (payload: ApiResult) => ({
  type: "SOME_ACTION_SUCCESS",
  payload,
});
const someActionError = (error: string) => ({
  type: "SOME_ACTION_ERROR",
  payload: error,
});

function* mySaga(): any {
  try {
    const someData = yield call(api);
    const transformedData = someData.map((x: ApiResult) => x.id);
    yield put(someActionSuccess(transformedData));
  } catch (e: any) {
    yield put(someActionError(e.message));
  }
}

const test = sagaHelper(mySaga(), avaTest);

test("should have called the mock API first, which will throw an exception", (result, t: Assertions) => {
  t.deepEqual(result, call(api));
  return new Error("Something went wrong");
});

test("and then trigger an error action with the error message", (result, t: Assertions) => {
  t.deepEqual(result, put(someActionError("Something went wrong")));
});

test("and then nothing", (result, t: Assertions) => {
  t.is(result, undefined);
});
