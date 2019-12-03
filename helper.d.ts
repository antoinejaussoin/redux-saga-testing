/// <reference path="src/global.d.ts" />
declare type resultFunction<T> = (result: T, ...args: any[]) => any | undefined | void;
declare type regularTestingFunction = (title: string, fn: () => void) => void;
declare type sagaTestingFunction<T> = (title: string, fn: resultFunction<T>) => void;
declare function sagaTestingHelper<T>(generator: IterableIterator<T>, testFunction?: regularTestingFunction): sagaTestingFunction<T>;
export default sagaTestingHelper;
