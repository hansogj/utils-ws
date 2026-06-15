

const html = (template = '') => document.createRange().createContextualFragment(template);

const suite = (desc) => {
    let numberOfTests = 0;
    let before, after;
    const tests = {};
    const self = {
        before: (cb => {
            before = cb;
            return self;
        }),
        test: (key, cb) => {
            tests[key] = cb;
            return self;
        },
        after: cb => {
            after = cb;
            return self;
        },

    }

    setTimeout(() => {
        desc && document.querySelector("#verification").append(html(`<h2>${desc}</h2>`))
        before && before();

        Object.entries(tests).forEach(([key, cb]) => {
            try {
                document.querySelector("#verification").append(html(`<h3>${key}</h3>`))
                cb();
                numberOfTests += 1;
                console.log(numberOfTests)
            } catch (error) {
                document.querySelector("#verification").append(html(`<pre class="error">${error} </pre>`))
            }
        });


        if (after) {
            document.querySelector("#verification").append(html(`<h3>After all</h3>`))
            after(numberOfTests);
        }
    }, 100);

    return self

}

try {
    module.exports.suite = suite
    module.exports.html = html

} catch {
    window.suite = suite;
    window.html = html;
}