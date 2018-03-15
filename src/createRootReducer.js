export default function createRootReducer({ types, combinedObjs, moreInitialState, reducer }) {
  let combinedReducers = {};
  let combinedInitialState = {};
  Object.keys(combinedObjs).forEach(key => {
    combinedInitialState[key] = {
      loading: false,
      error: null,
      data: null
    };
    combinedReducers[types[`${key}_REQUEST`]] = function(state, action) {
      return {
        ...state,
        [key]: {
          ...state[key],
          loading: true,
          error: null
        }
      };
    };
    combinedReducers[types[`${key}_SUCCESS`]] = function(state, action) {
      return {
        ...state,
        [key]: {
          ...state[key],
          loading: false,
          data: action.response
        }
      };
    };
    combinedReducers[types[`${key}_FAILURE`]] = function(state, action) {
      return {
        ...state,
        [key]: {
          ...state[key],
          loading: false,
          error: action.response
        }
      };
    };
  });

  const initialState = {
    ...combinedInitialState,
    ...moreInitialState
  };
  function rootReducer(state = initialState, action) {
    let newState = state;

    const selectedReducer = combinedReducers[action.type];
    if (selectedReducer) {
      newState = selectedReducer(state, action);
    }

    // custom reducer by the user provided createStar() config
    if (reducer) {
      newState = reducer(newState, action);
    }

    return newState;
  }
  return rootReducer;
}
