/* eslint-disable @typescript-eslint/no-explicit-any */
import { defined } from './defined';
import './polyfill';

describe('defined', () => {
    afterEach(jest.restoreAllMocks);

    describe.each([undefined, null, [], false, ''])('defined of  %p ', (cond: any) => {
        it('forventer udefinerte ', () => expect(defined(cond)).toBeFalsy());
    });

    describe.each([{}, [1, 2, 3], 'tekstlig innhold', true, 0, 1])('defined of %p ', (cond: any) => {
        it('forventer definerte ', () => expect(defined(cond)).toBeTruthy());
    });

    describe.each([{}, { a: undefined }, { a: null }, { a: '' }, { a: [] }, { a: false }])(
        'defined of object %p',
        (cond: any) => {
            it('forventer definerte egenskaper', () => expect(defined(cond.a)).toBeFalsy());
        }
    );

    describe.each([{ a: {} }, { a: [1, 2, 3] }, { a: 'tekstlig innhold' }, { a: true }])(
        'defined of object %p',
        (cond: any) => {
            it('forventer definerte egenskaper', () => expect(defined(cond.a)).toBeTruthy());
        }
    );

    describe.each([function () {}, () => {}])('defined of function of %p ', (cond: any) => {
        it('should result in expected', () => expect(defined(cond)).toBeTruthy());
    });
});
