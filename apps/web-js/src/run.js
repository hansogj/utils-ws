

window.run = () => {
    const { defined, definedList } = window.defined;
    const find = window.find.default;
    const maybe = window.maybe.default;
    const suite = window.suite;
    suite("Include by script tag")
        .test("hello void", () => verify("hello", () => "javascript").toEqual("javascript"))
        .test("array.onEmpty", () => {
            verify("[] should be empty]", () => [].onEmpty((o) => o.push("is empty")).shift()).toEqual("is empty");
            verify("[\"is not empty\"] should not be empty", () => ["is not empty"].onEmpty((o) => o.push("is empty")).shift()).toEqual("is not empty");
        })

        .test("array.defined", () => {
            verify("should filter out defined elements on array", () => [null, false, undefined, 0, 1].defined()).toEqual([0, 1]);
            verify("definedList should filter out defined elements from array", () => definedList([null, false, undefined, 0, 1])).toEqual([0, 1]);
            verify("defined", () => [defined(null), defined(""), defined(true)]).toEqual([false, false, true,]);
            verify("allDefined", () => [false, true].allDefined()).toEqual([]);
            verify("array first", () => ["first", "second"].first()).toEqual(["first"]);

        }).test("find.js", () => {

            verify("li:", () => find("li", window.document.body).map((e) => e.innerText)).toEqual([
                "@hansogj/find-js",
                "@hansogj/array.utils",
                "@hansogj/maybe",
                "@hansogj/abonnement-js"
            ]);
        }).test("maybe", () => {
            verify("maybe should filter defined elements", () =>
                maybe(find("ul"))
                    .map((it) => it.first().shift())
                    .map((it) => it.nodeName)
                    .valueOrExecute(() => "no ul in set")
            ).toEqual("UL");
        }).after((numberOfTests) => verify('expect to have ran 5 tests', () => numberOfTests).toEqual(5));
}