export default (generator, testFunction) => {
    let input = undefined;
    let testFn = testFunction;
    if (!testFn) {
        testFn = it;
    }
    return (title, fn) => {
        testFn(title, function() {
            if (input instanceof Error) {
                const result = generator.throw(input);
                input = fn(result.value, ...arguments);
            } else {
                const result = generator.next(input);
                input = fn(result.value, ...arguments);
            }
        });
    };
};
