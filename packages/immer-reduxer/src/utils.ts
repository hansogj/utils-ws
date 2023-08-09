/* eslint-disable @typescript-eslint/ban-ts-comment */

import { ActionDataType } from './types';

export const selectFromRoot = <State, Key extends keyof State>(state: State, select: Key): State[Key] =>
    state && select && state[select];

export const toAction = <T, P>(type: T, data: Partial<P> = {}): ActionDataType<T, P> => ({
    ...data,
    type,
});

export const fromActionType = <Actions, ActionData>(type: Actions) => ({
    withData:
        <
            ActionType extends Pick<Partial<ActionData>, keyof ActionData> & { action: Actions },
            Key extends keyof ActionData,
        >(
            ...fields: Array<Key>
        ) =>
        (...data: Array<ActionData[Array<Key>[number]]>) =>
            toAction<Actions, ActionType>(
                type,
                (fields || []).reduce((aggregate, key, index) => ({ ...aggregate, [key]: data[index] }), {}),
            ),
});
