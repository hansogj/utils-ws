/* eslint-disable @typescript-eslint/no-explicit-any */
import './polyfill';

describe('polyfill.array', () => {
    afterEach(jest.restoreAllMocks);

    describe('[].defined', () => {
        describe.each([[[1, false]], [[1, undefined]]] as Array<any[]>)('%p', (list) => {
            it('forventer kun de elementene i en liste som er definert', () => expect(list.defined()).toEqual([1]));
        });

        describe.each([[[1, true]], [[1, 'a']]] as Array<any[]>)('%p', (list) => {
            it('forventer alle elementene i en liste må være definert', () => expect(list.defined().length).toEqual(2));
        });
    });

    describe('[].allDefined]', () => {
        describe.each([[[1, false]], [[1, undefined]]] as Array<any[]>)('%p', (list) =>
            it('forventer alle elementene i en liste må være definert', () => expect(list.allDefined().length).toBe(0)),
        );

        describe.each([[[1, 2]], [[1, 'allDefined']]] as Array<any[]>)('%p ', (list) => {
            it('forventer alle elementene i en liste må være definert', () => expect(list.allDefined().length).toBe(2));
        });
    });

    describe('first', () => {
        let spy: jest.Mock;

        beforeEach(() => (spy = jest.fn()));

        describe('tom array', () => {
            beforeEach(() => [].first().map((i) => spy(i)));
            it('spy skal ikke kalles', () => expect(spy).not.toHaveBeenCalled());
        });

        describe('ett elements array', () => {
            beforeEach(() => [1].first().map((i) => spy(i)));
            it('spy skal kalles en gang', () => expect(spy).toHaveBeenCalled());
            it('spy skal kalles en gang', () => expect(spy).toHaveBeenCalledWith(1));
        });

        describe('mangfoldent elements array', () => {
            beforeEach(() => [1, {}, 'a'].first().map((i) => spy(i)));
            it('spy skal kalles en gang', () => expect(spy).toHaveBeenCalled());
            it('spy skal kalles en gang', () => expect(spy).toHaveBeenCalledWith(1));
        });

        describe('last', () => {
            beforeEach(() => (spy = jest.fn()));

            describe('tom array', () => {
                beforeEach(() => [].last().map((i) => spy(i)));
                it('spy skal ikke kalles', () => expect(spy).not.toHaveBeenCalled());
            });

            describe('ett elements array', () => {
                beforeEach(() => [1].last().map((i) => spy(i)));
                it('spy skal kalles en gang', () => expect(spy).toHaveBeenCalled());
                it('spy skal kalles en gang', () => expect(spy).toHaveBeenCalledWith(1));
            });

            describe('mangfoldet elements array', () => {
                beforeEach(() => [1, {}, 'a'].last().map((i) => spy(i)));
                it('spy skal kalles en gang', () => expect(spy).toHaveBeenCalled());
                it('spy skal kalles en gang', () => expect(spy).toHaveBeenCalledWith('a'));
            });
        });
    });
});
