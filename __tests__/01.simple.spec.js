import sagaHelper from '../main';

function* mySaga() {
    yield 42;
    yield 43;
    yield 44;
}

describe('When testing a very simple generator (not even a Saga)', () => {
    const it = sagaHelper(mySaga());

    it('should return 42', result => {
        expect(result).toBe(42);
    });

    it('and then 43', result => {
        expect(result).toBe(43);
    });

    it('and then 44', result => {
        expect(result).toBe(44);
    });

    it('and then nothing', result => {
        expect(result).toBeUndefined();
    });
});