/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Draft } from 'immer';
import { Producer, SharedKeys } from './types';

/**
 * Write the value for `action.key` to `draft.key`.
 *
 * Avoids the boilerplate arrow function syntax.
 */

export const writeToDraft =
    <
        State,
        Action extends Pick<Partial<Draft<State>>, Key> & { type: ActionType }, // This guarantees the types to be compatible, but the IDE doesn't catch it.
        Key extends SharedKeys<Draft<State>, Action>, // The key must be valid for both the action and the state/draft
        ActionType extends string = Action['type'],
    >(
        ...keys: Array<Key>
    ): Producer<State, Action> =>
    (draft: Draft<State>, action: Action) =>
        // eslint-disable-next-line
        keys.forEach((key) => (draft[key] = action[key] as any));

export const writeValuesToDraft =
    <
        State,
        Action extends Pick<Partial<Draft<State>>, Key> & { type: ActionType }, // This guarantees the types to be compatible, but the IDE doesn't catch it.
        Key extends SharedKeys<Draft<State>, Action>, // The key must be valid for both the action and the state/draft
        ActionType extends string = Action['type'],
    >(
        obj: State
    ): Producer<State, Action> =>
    (draft: Draft<State>) =>
        Object.entries(obj as unknown as Record<keyof State, State>).forEach(([key, val]) => {
            // @ts-ignore
            draft[key] = val;
        });

export const passReducer = <T>(draft: Draft<T>): Draft<T> => draft;
