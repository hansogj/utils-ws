/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionDataType, Mutable } from './types';
import { selectFromRoot, toAction, fromActionType } from './utils';

//
interface AppState {
    readonly init: string;
    readonly error?: Error;
}

type ActionData = Mutable<AppState>;

export enum Actions {
    ERROR = 'ERROR',
    INIT = 'INIT',
    RESET = 'RESET',
}

export type ActionTypes = ActionDataType<Actions, ActionData>;

const shape = (p: unknown) => JSON.stringify(p, null, 0); // TODO
const theError = new Error('the Error');

describe('utils', () => {
    describe.each([
        [undefined, undefined, undefined],
        [{}, undefined, undefined],
        [{}, 'init', undefined],
        [{ init: undefined }, undefined, undefined],
        [{ init: undefined }, 'init', undefined],
        [{ init: 'val' }, 'init', 'val'],
        [{ init: 'val' }, 'nomatch', undefined],
        [{ init: { NO_MATCH: 'NO_VAL' } }, 'init', { NO_MATCH: 'NO_VAL' }],
    ] as Array<[AppState, keyof AppState, unknown]>)('selectFromRoot(%p, %s)', (state, key, val) => {
        it(`should result in ${shape(val)}`, () => expect(selectFromRoot(state, key)).toEqual(val));
    });

    describe('toActions', () => {
        const asAction =
            (type: Actions) =>
            (data: Partial<ActionData> = {}) =>
                toAction<Actions, Partial<ActionData>>(type, data);

        const actions = {
            init: asAction(Actions.INIT),
            error: asAction(Actions.ERROR),
            reset: asAction(Actions.RESET),
        };

        describe.each([
            [undefined, undefined, {}],
            [Actions.INIT, undefined, { type: 'INIT' }],
            [Actions.INIT, { init: 'INIT_VALUE' }, { type: 'INIT', init: 'INIT_VALUE' }],
            [Actions.ERROR, undefined, { type: 'ERROR' }],
            [Actions.ERROR, { error: theError }, { type: 'ERROR', error: theError }],
            [Actions.ERROR, { theError, init: 'INIT_VALUE' }, { type: 'ERROR', theError, init: 'INIT_VALUE' }],
        ] as Array<[Actions, Partial<ActionData>, ActionTypes]>)('with type %s and data %p', (type, data, expected) => {
            it(`toAction should result in ${shape(expected)}`, () => expect(toAction(type, data)).toEqual(expected));
        });

        describe.each([
            [actions.init, undefined, { type: 'INIT' }],
            [actions.init, { init: 'INIT_VALUE' }, { type: 'INIT', init: 'INIT_VALUE' }],
            [actions.error, { theError }, { type: 'ERROR', theError }],
            [actions.error, { theError, init: 'INIT_VALUE' }, { type: 'ERROR', theError, init: 'INIT_VALUE' }],
        ] as Array<[any, unknown, unknown]>)('when setup as %p and called with %p', (fn, args, expected) => {
            it(`should result in ${shape(expected)}`, () => expect(fn(args)).toEqual(expected));
        });
    });

    describe('fromActionType', () => {
        it('usage example', () =>
            expect(
                fromActionType<Actions, ActionData>(Actions.INIT).withData('init', 'error')('INIT_VALUE', theError)
            ).toEqual({
                type: Actions.INIT,
                init: 'INIT_VALUE',
                error: theError,
            }));

        describe.each([
            [undefined, [], [], { type: undefined }] as any,
            [Actions.INIT, [], [], { type: Actions.INIT }],
            [Actions.INIT, ['init'], ['INIT_VALUE'], { type: Actions.INIT, init: 'INIT_VALUE' }],
            [
                Actions.INIT,
                ['init', 'error'],
                ['INIT_VALUE', theError],
                { type: Actions.INIT, init: 'INIT_VALUE', error: theError },
            ],
            [Actions.ERROR, ['error'], [theError], { type: Actions.ERROR, error: theError }],
        ] as Array<
            [Actions, Array<keyof ActionData>, Array<ActionData[Array<keyof ActionData>[number]]>, ActionTypes]
        >)('with action %s, keys %p and data %p', (type, keys, values, expected) => {
            it(`should result in ${shape(expected)}`, () =>
                expect(fromActionType<Actions, ActionData>(type).withData(...keys)(...values)).toEqual(expected));
        });
    });
});
