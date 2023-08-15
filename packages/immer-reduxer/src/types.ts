/* eslint-disable @typescript-eslint/no-shadow */

import { Draft } from 'immer';

export type ReduxAction = import('redux').Action;

interface Action<T> extends ReduxAction {
    type: T;
}

export type Mutable<Type> = {
    -readonly [Key in keyof Type]: Type[Key];
};

export type ActionDataType<T, P> = Action<T> & Partial<P>;
export type ActionTypesValues<T, P> = ActionDataType<T, P>[keyof ActionDataType<T, P>];
export type DispatchAction<T, P> = (..._: ActionTypesValues<T, P>[]) => ActionDataType<T, P>;

export type Producer<State, Action> = (draft: Draft<State>, action: Action) => void;
export type SharedKeys<Type, OtherType> = keyof Type & keyof OtherType;
