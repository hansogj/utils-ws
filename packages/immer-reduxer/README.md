# IMMER-REDUXER

```bash
npm install -s @hansogj/immer-reduxer
```

Provides a wrapper for immutable redux state reducers and and shortcuts to update your state on action events.
For more on immer, see [https://immerjs.github.io/immer/](https://immerjs.github.io/immer/)

## Usage

```tsx

/// in some.reducer.ts
export enum Actions {
  ERROR = 'ERROR',
  INIT = 'INIT',
  RESET = 'RESET',
}


export const initialState: AppState ({
  init: 'not initiated', // type string
  error: undefined, // type Error
});

const appReducer = reducerForProducers<AppState, ActionTypes, Actions>(initialState, {
  [Actions.INIT]: writeToDraft('init'), // writes the value of 'init' property of any action {type: "INIT", init: ... } to current state.init
  [Actions.RESET]: writeValuesToDraft({ init: 'reset', error: undefined }), // replaces state.init & state.error respectively on any action {type: "RESET", ... }
  [Actions.APP_ERROR]: passReducer,
});

// .... then define some actions ...

export const actions = {
    init: fromActionType(Actions.INIT).withData("init"),
    error: fromActionType(Actions.ERROR).withData("error"),
    reset: fromActionType(Actions.RESET).withData("init", "error"),
    // or just
    reset: fromActionType(Actions.RESET).withData(),
};

/// somewhere else in your code

dispatch(actions.init("The application is now fully initiated"));
dispatch(actions.error(new Error("something terrible happened")));
dispatch(actions.reset("", undefined));
// or just
dispatch(actions.reset());

```

The action functions (`actions.init`, `actions.error`, `actions.reset`) has now type security with their respective parameters
