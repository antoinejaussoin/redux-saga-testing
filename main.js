export default generator => {
    let input = undefined;
    return (title, fn) => {
        it(title, () => {
            if (input instanceof Error) {
                const result = generator.throw(input);
                input = fn(result.value);
            } else {
                const result = generator.next(input);
                input = fn(result.value);
            }
        });
    };
};
