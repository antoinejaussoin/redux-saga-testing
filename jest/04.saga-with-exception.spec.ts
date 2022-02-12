import sagaHelper from "../helper";
import { call, put } from "redux-saga/effects";
import "jest";

interface ApiResult {
  id: number;
  title: string;
}

const api = jest.fn();
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

describe("When testing a Saga that throws an error", () => {
  const it = sagaHelper(mySaga());

  it("should have called the mock API first, which will throw an exception", (result) => {
    expect(result).toEqual(call(api));
    return new Error("Something went wrong");
  });

  it("and then trigger an error action with the error message", (result) => {
    expect(result).toEqual(put(someActionError("Something went wrong")));
  });

  it("and then nothing", (result) => {
    expect(result).toBeUndefined();
  });
});
