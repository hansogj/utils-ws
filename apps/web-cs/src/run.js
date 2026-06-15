const { suite, dependencies, verify, versions } = require('shared');
const Abonnement = require("@hansogj/abonnement-js").Abonnement;
const find = require("@hansogj/find-js").default;
const maybe = require("@hansogj/maybe").default;
const arrayDefined = require("@hansogj/array.utils");
require("@hansogj/array.utils");

const { defined, definedList } = arrayDefined;

export const run = () => {

    suite("Module include ")
        .before(dependencies)
        .test("hello void", () => verify("hello", () => "commonJS").toEqual("commonJS"))
        .test("array.onEmpty", () => {
            verify("[] should be empty]", () => [].onEmpty((o) => o.push("is empty")).shift()).toEqual("is empty");
            verify("[\"is not empty\"] should not be empty", () => ["is not empty"].onEmpty((o) => o.push("is empty")).shift()).toEqual("is not empty");
        })
        .test("array.defined", () => {
            verify("should filter out defined elements on array", () => [null, false, undefined, 0, 1].defined()).toEqual([0, 1]);
            verify("should filter out defined elements from array", () => definedList([null, false, undefined, 0, 1])).toEqual([0, 1]);
            verify("defined", () => [defined(null), defined(""), defined(true)]).toEqual([false, false, true,]);
            verify("allDefined", () => [false, true].allDefined()).toEqual([]);
            verify("array first", () => ["first", "second"].first()).toEqual(["first"]);
        })
        .test("find.js", () =>
            verify("li:", () => find("li", window.document.body).map((e) => e.innerText)).toEqual(Object.entries(versions).map((keyVal) => keyVal.join("@v"))))
        .test("maybe", () => {
            verify("maybe should filter defined elements", () =>
                maybe(find("ul"))
                    .map((it) => it.first().shift())
                    .map((it) => it.nodeName)
                    .valueOrExecute(() => "no ul in set")
            ).toEqual("UL");
        }).test("abonnement", () => {
            const abonnement = new Abonnement("init");
            abonnement.varsle("oppdatert verdi");
            abonnement.abonner((val) => verify("@hansogj/abonnement", () => val).toDiffer("init"));
        })

        .after((numberOfTests) => verify('expect to have ran 6 tests', () => numberOfTests).toEqual(6));

};
