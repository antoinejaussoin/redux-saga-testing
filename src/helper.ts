/// <reference path="./global.d.ts" />

type resultFunction<T> = (result: T, ...args: any[]) => any | undefined | void;
type regularTestingFunction = (title: string, fn: () => void) => void;
type sagaTestingFunction<T> = (title: string, fn: resultFunction<T>) => void;

function sagaTestingHelper<T>(
  generator: IterableIterator<T>,
  testFunction?: regularTestingFunction
): sagaTestingFunction<T> {
  let input: T | Error | undefined = undefined;
  let testFn: regularTestingFunction | undefined = testFunction;
  if (!testFn) {
    testFn = it as any;
  }
  return (
    title: string,
    fn: resultFunction<T>
  ): T | Error | undefined | void => {
    testFn!(title, function() {
      if (input instanceof Error) {
        const result = generator.throw!(input);
        input = fn(result.value, ...(arguments as any));
      } else {
        const result = generator.next(input as any);
        input = fn(result.value, ...(arguments as any));
      }
    });
  };
}

export default sagaTestingHelper;
