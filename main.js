module.exports = function(generator) {
    var input = undefined;
    return function(title, fn) {
        it(title, function() {
            if (input instanceof Error) {
                var result = generator.throw(input);
                input = fn(result.value);
            } else {
                var result = generator.next(input);
                input = fn(result.value);
            }
        });
    }
}