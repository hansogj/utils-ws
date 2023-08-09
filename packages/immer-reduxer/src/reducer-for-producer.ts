import { Draft, produce } from 'immer';
import { Producer } from './types';

/**
 * Combine producers mapping individual action types to a draft into a reducer.
 *
 * Avoids the boilerplate `produce`, `switch`, and `break` syntax.
 *
 * This is still fully type safe and enforces the draft pattern provided by immer.
 */
export const reducerForProducers =
    <State, Action extends { type: ActionType }, ActionType extends string = Action['type']>(
        initialState: State,
        producers: { [actionType in ActionType]: Producer<State, Action> },
    ) =>
    (state: State = initialState, action: Action = {} as Action): State =>
        produce(state, (draft: Draft<State>) => {
            if (typeof producers[action.type] === 'function') {
                producers[action.type](draft, action);
            }
        });
