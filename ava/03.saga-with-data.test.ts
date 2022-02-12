import sagaHelper from "../helper";
import { call, put } from "redux-saga/effects";
import avaTest, { Assertions } from "ava";
import sinon from "sinon";

interface ApiResult {
  id: number;
  title: string;
}

const api = sinon.spy();
const someAction = (payload: number[]) => ({ type: "SOME_ACTION", payload });

function* mySaga(): any {
  const someData = yield call(api);
  const transformedData = someData.map((x: ApiResult) => x.id);
  yield put(someAction(transformedData));
}

const test = sagaHelper(mySaga(), avaTest);

test("should have called the mock API first, which returns some data", (result, t: Assertions) => {
  t.deepEqual(result, call(api));
  return [
    { id: 1, title: "foo" },
    { id: 2, title: "bar" },
    { id: 3, title: "foobar" },
  ];
});

test("and then trigger an action with the transformed data we got from the API", (result, t: Assertions) => {
  t.deepEqual(result, put(someAction([1, 2, 3])));
});

test("and then nothing", (result, t: Assertions) => {
  t.is(result, undefined);
});
