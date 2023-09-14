/* eslint-disable @typescript-eslint/no-explicit-any */
import { definedList } from './definedList';
import './polyfill';

describe('definedList', () => {
    afterEach(jest.restoreAllMocks);
    describe.each([undefined, null, [], false, ''])('definedList of %p', (cond) =>
        it('forventer udefinerte', () => expect(definedList(cond)).toEqual([])),
    );

    describe.each([{}, 'tekstlig innhold', true, 0, 1])('defined of %p', (cond: any) =>
        it('forventer definerte ', () => expect(definedList(cond)).toEqual([cond])),
    );

    describe.each([[{}], ['tekstlig innhold'], [true], [0], [1]])('defined of %p', (cond: any) =>
        it('forventer definerte liste retunerer som liste', () => expect(definedList(cond)).toEqual([cond])),
    );

    describe.each([
        [1, false],
        [1, undefined],
        // eslint-disable-next-line
        // @ts-ignore
    ])('defined of %p', (cond: any) =>
        it('forventer alle elementene i en liste må være definert', () => {
            expect(definedList(cond)).toEqual([1]);
        }),
    );
});
