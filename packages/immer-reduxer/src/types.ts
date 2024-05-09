/* eslint-disable @typescript-eslint/no-shadow */

import { Draft } from 'immer';

export type ReduxAction = import('redux').Action;

export type Data = Record<string, unknown>;

interface Action<T extends string = string> extends ReduxAction {
    type: T;
}

export type Mutable<Type> = {
    -readonly [Key in keyof Type]: Type[Key];
};

export type ActionDataType<T extends string = string, P extends Data = Data> = Action<T> & Partial<P>;
export type ActionTypesValues<T extends string = string, P extends Data = Data> = ActionDataType<
    T,
    P
>[keyof ActionDataType<T, P>];
export type DispatchAction<T extends string = string, P extends Data = Data> = (
    ..._: ActionTypesValues<T, P>[]
) => ActionDataType<T, P>;

export type Producer<State, Action> = (draft: Draft<State>, action: Action) => void;
export type SharedKeys<Type, OtherType> = keyof Type & keyof OtherType;
