import sagaHelper from "../helper";
import { put } from "redux-saga/effects";
import "jest";

interface Action {
  type: string;
  payload: string;
}

const someOtherAction = (payload: string): Action => ({
  type: "SOME_OTHER_ACTION",
  payload,
});

function* mySaga(action: Action): any {
  yield put(someOtherAction(action.payload));
}

describe("When testing Saga that has an input (usually an action)", () => {
  const it = sagaHelper(mySaga({ type: "SOME_ACTION", payload: "foo" }));

  it("should trigger the other action with the input action payload", (result) => {
    expect(result).toEqual(put(someOtherAction("foo")));
  });

  it("and then nothing", (result) => {
    expect(result).toBeUndefined();
  });
});
