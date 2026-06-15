/**
 * @jest-environment jsdom
 */


import { jest } from '@jest/globals';
import { Abonnement } from "@hansogj/abonnement-js";
import { definedList } from "@hansogj/array.utils";
import "@hansogj/array.utils";
import find from '@hansogj/find-js';

const template = `
 <ul>
 <li>1</li>
 <li>2</li>
 <li>3</li>
 <li>4</li>
 </ul>
 `;


describe("javascripts", () => {

    afterAll(() => jest.clearAllMocks());
    let spy;
    beforeEach(() => {
        document.body.innerHTML = template;
        spy = jest.fn();
    });
    describe("@hansogj/find-js", () => {
        it("use jsdom in this test file", () => expect(find("li")).toHaveLength(4));
        it("use jsdom in this test file", () =>
            expect(find("haba")).toHaveLength(0));
    })
    describe("onEmpty", () => {
        describe.each([
            [undefined, true],
            ["h5", true],
            ["li", false],
        ])("find(%s)", (selector, expected) => {
            beforeEach(() => find(selector, document.body).onEmpty(spy));
            it(`should ${expected ? "" : "not "}fire onEmpty callback`, () => {
                expected
                    ? expect(spy).toHaveBeenCalledTimes(1)
                    : expect(spy).not.toHaveBeenCalled();
            });
        });
    });

    describe("defined", () => {
        const array = [null, undefined, false, true, {}];

        it("is defined", () => expect(array.defined).toBeDefined());

        it("has length", () => expect(array.defined()).toHaveLength(2));
        it("has length", () => {
            debugger

            definedList(array)
            expect(definedList(array)).toHaveLength(2);
        });

        it("all defined", () => expect(array.allDefined()).toEqual([]));

        it("first", () => expect(array.first()).toEqual([null]));
    });

    describe("@hansogj/abonnement ", () => {
        let abonnentSpy;
        let abonnement;

        beforeEach(() => {
            abonnentSpy = jest.fn();
            abonnement = new Abonnement("init");
            abonnement.abonner(abonnentSpy);
        });
        it("init value", () => {
            expect(abonnentSpy).toHaveBeenCalledTimes(1);
            expect(abonnentSpy).toHaveBeenCalledWith("init");
            expect(abonnement.verdi).toEqual("init");
        });


        it("value is updated", () => {
            abonnement.varsle("update");
            expect(abonnentSpy).toHaveBeenCalledTimes(2);
            expect(abonnentSpy).toHaveBeenLastCalledWith("update", "init");
            expect(abonnement.verdi).toEqual("update");

        });
    });

})