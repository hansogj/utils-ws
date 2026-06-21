
const might = (should) => `should${should ? '' : ' not'}`;

const createShouldIt = (testFn) => (description, condition, toBe) => {
    const tests = {
        then: (suite, timeout) => {
            if (condition) {
                const suffix = toBe ? ` ${JSON.stringify(toBe)}` : '';
                testFn(`${might(condition)} ${description}${suffix}`, suite, timeout);
            }
            return tests;
        },
        dont: (suite, timeout) => {
            if (!condition) testFn(`${might(condition)} ${description}`, suite, timeout);
            return tests;
        },
    };
    return tests;
};

const resolveGlobalTest = () => {
    const t = typeof test === 'function' ? test : (typeof globalThis !== 'undefined' && globalThis.test);
    if (typeof t !== 'function') {
        throw new Error("shouldIt: global 'test' not found. Use createShouldIt(testFn) to wire your own runner.");
    }
    return t;
};

const shouldIt = (description, condition, toBe) =>
    createShouldIt((name, fn, timeout) => resolveGlobalTest()(name, fn, timeout))(description, condition, toBe);

try {
    module.exports.might = might;
    module.exports.createShouldIt = createShouldIt;
    module.exports.shouldIt = shouldIt;
} catch {
    window.might = might;
    window.createShouldIt = createShouldIt;
    window.shouldIt = shouldIt;
}
