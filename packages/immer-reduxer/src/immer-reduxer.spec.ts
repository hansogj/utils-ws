import { reducerForProducers } from './reducer-for-producer';
import { ActionDataType, Mutable } from './types';
import { toAction } from './utils';
import { passReducer, writeToDraft, writeValuesToDraft } from './write-to-draft';

type State = {
    readonly data: unknown;
    readonly error: unknown;
    readonly url: unknown;
};

const shape = (p: unknown) => JSON.stringify(p, null, 0); // TODO

type ActionData = Mutable<State>;

export enum Actions {
    DATA = 'ACTION_DATA',
    ERROR = 'ACTION_ERROR',
    URL = 'ACTION_url',
}
const init = (): State => ({
    data: undefined,
    error: undefined,
    url: undefined,
});

export type ActionTypes = ActionDataType<Actions, Partial<ActionData>>;

describe('immer-reduxer', () => {
    describe('utils', () => {
        describe.each([
            [undefined, undefined, { type: undefined }] as unknown,
            [Actions.ERROR, undefined, { type: Actions.ERROR }],
            [Actions.ERROR, {}, { type: Actions.ERROR }],
            [Actions.ERROR, { error: 'error' }, { type: Actions.ERROR, error: 'error' }],
            [Actions.DATA, undefined, { type: Actions.DATA }],
            [Actions.DATA, { data: 'data' }, { type: Actions.DATA, data: 'data' }],
            [Actions.DATA, { error: 'error' }, { type: Actions.DATA, error: 'error' }],
        ] as Array<[Actions, Partial<ActionData>, ActionTypes]>)('with arguments %j & %j', (type, data, expected) => {
            it(`toAction should produce ${shape(expected)}`, () => expect(toAction(type, data)).toEqual(expected));
        });
    });
    describe('reducer for producer', () => {
        let producer: (state: State, action: ActionTypes) => State;

        describe('writeToDraft', () => {
            beforeEach(() => {
                producer = reducerForProducers<State, ActionTypes, Actions>(init(), {
                    [Actions.ERROR]: writeToDraft('error'),
                    [Actions.DATA]: writeToDraft('data'),
                    [Actions.URL]: writeToDraft('url'),
                });
            });
            describe.each([
                [{}, {}, {}],
                [init(), {}, init()],
                [init(), { type: Actions.ERROR, error: 'error' }, { ...init(), error: 'error' }],
                [init(), { type: Actions.ERROR, data: 'data' }, init()],
                [init(), { type: Actions.DATA, error: 'error' }, init()],
                [init(), { type: Actions.DATA, data: 'data' }, { ...init(), data: 'data' }],
            ] as Array<[State, ActionTypes, State]>)('when called with %j, %j', (currentState, action, nextState) => {
                it(`should produce ${shape(nextState)}`, () =>
                    expect(producer(currentState, action)).toEqual(nextState));
            });
        });

        describe('writeToDraft multiple keys', () => {
            beforeEach(() => {
                producer = reducerForProducers<State, ActionTypes, Actions>(init(), {
                    [Actions.ERROR]: writeToDraft('error', 'data', 'url'),
                    [Actions.DATA]: writeToDraft('data'),
                    [Actions.URL]: writeToDraft('url'),
                });
            });
            describe.each([
                [{}, {}, {}],
                [init(), {}, init()],
                [init(), { type: Actions.ERROR, error: 'error' }, { ...init(), error: 'error' }],
                [init(), { type: Actions.ERROR, data: 'data' }, { ...init(), data: 'data' }],
                [init(), { type: Actions.ERROR, url: 'url' }, { ...init(), url: 'url' }],
                [
                    init(),
                    { type: Actions.ERROR, error: 'error', data: 'data', url: 'url' },
                    { ...init(), error: 'error', data: 'data', url: 'url' },
                ],
                [init(), { type: Actions.DATA, error: 'error' }, init()],
                [init(), { type: Actions.DATA, data: 'data' }, { ...init(), data: 'data' }],
            ] as Array<[State, ActionTypes, State]>)('when called with %j, %j', (currentState, action, nextState) => {
                it(`should produce ${shape(nextState)}`, () =>
                    expect(producer(currentState, action)).toEqual(nextState));
            });
        });

        describe('passReducer', () => {
            beforeEach(() => {
                producer = reducerForProducers<State, ActionTypes, Actions>(init(), {
                    [Actions.ERROR]: passReducer,
                    [Actions.DATA]: passReducer,
                    [Actions.URL]: passReducer,
                });
            });
            describe.each([
                [{}, {}, {}],
                [init(), {}, init()],
                [init(), { type: Actions.ERROR, error: 'error' }, init()],
                [init(), { type: Actions.ERROR, data: 'data' }, init()],
                [init(), { type: Actions.DATA, error: 'error' }, init()],
                [init(), { type: Actions.DATA, data: 'data' }, init()],
            ] as Array<[State, ActionTypes, State]>)('when called with %j, %j', (currentState, action, nextState) => {
                it(`should produce ${shape(nextState)}`, () =>
                    expect(producer(currentState, action)).toEqual(nextState));
            });
        });

        describe('writeValuesToDraft ', () => {
            const alteredState: State = { error: 'NO_ERROR', data: 'NO_DATA', url: 'NO_URL' };
            beforeEach(() => {
                producer = reducerForProducers<State, ActionTypes, Actions>(init(), {
                    [Actions.ERROR]: writeValuesToDraft(alteredState),
                    [Actions.DATA]: passReducer,
                    [Actions.URL]: passReducer,
                });
            });
            describe.each([
                [{}, {}, {}],
                [init(), {}, init()],
                [init(), { type: Actions.ERROR, error: 'error' }, alteredState],
                [init(), { type: Actions.ERROR, data: 'data' }, alteredState],
                [init(), { type: Actions.ERROR, url: 'url' }, alteredState],
                [init(), { type: Actions.DATA, error: 'error' }, init()],
                [init(), { type: Actions.DATA, data: 'data' }, init()],
            ] as Array<[State, ActionTypes, State]>)('when called with %j, %j', (currentState, action, nextState) => {
                it(`should produce ${shape(nextState)}`, () =>
                    expect(producer(currentState, action)).toEqual(nextState));
            });
        });
    });
});
