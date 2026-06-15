/**
 * @jest-environment jsdom
 */

import '@hansogj/array.utils/dist/onEmpty';
import find from '@hansogj/find-js';

const template = `
 <ul>
 <li>1</li>
 <li>2</li>
 <li>3</li>
 <li>4</li>
 </ul>
 `;

describe('typescripts', () => {
    afterAll(() => jest.clearAllMocks());
    let spy: jest.SpyInstance;
    beforeEach(() => {
        document.body.innerHTML = template;
        spy = jest.fn();
    });

    describe('onEmpty', () => {
        describe.each([
            [undefined, true],
            ['h5', true],
            ['li', false],
        ] as Array<[string, boolean]>)('find(%s)', (selector, expected) => {
            beforeEach(() => find(selector, document.body).onEmpty(spy as any));
            it(`should ${expected ? '' : 'not '}fire onEmpty callback`, () => {
                expected ? expect(spy).toHaveBeenCalledTimes(1) : expect(spy).not.toHaveBeenCalled();
            });
        });
    });
});
