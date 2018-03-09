import { ucfirst, httpMethodToCRUDName } from './utils/index';
import StarTypes from './starTypes';

export default function createRootReducer({ name, pluralName, types, starType, moreInitialState, generateDefault, reducer, add }) {
  const nameUpperCase = name.toUpperCase();
  const pluralNameUpperCase = pluralName.toUpperCase();
  const ucFirstName = ucfirst(name);
  const ucFirstPluralName = ucfirst(pluralName);

  let initialState = {};
  let defaultReducers = {};
  if (generateDefault && starType === StarTypes.REST) {
    initialState = {
      [`get${ucFirstName}`]: {
        loading: false,
        error: null,
        data: null
      },
      [`get${ucFirstPluralName}`]: {
        loading: false,
        error: null,
        data: null
      },
      [`create${ucFirstName}`]: {
        loading: false,
        error: null,
        data: null
      },
      [`update${ucFirstName}`]: {
        loading: false,
        error: null,
        data: null
      },
      [`delete${ucFirstName}`]: {
        loading: false,
        error: null,
        data: null
      }
    };
    defaultReducers = {
      [`@star/GET_${nameUpperCase}_REQUEST`]: function(state, action) {
        return {
          ...state,
          [`get${ucFirstName}`]: {
            ...state[`get${ucFirstName}`],
            loading: true,
            error: null
          }
        };
      },
      [`@star/GET_${nameUpperCase}_SUCCESS`]: function(state, action) {
        return {
          ...state,
          [`get${ucFirstName}`]: {
            ...state[`get${ucFirstName}`],
            loading: false,
            data: action.response
          }
        };
      },
      [`@star/GET_${nameUpperCase}_FAILURE`]: function(state, action) {
        return {
          ...state,
          [`get${ucFirstName}`]: {
            ...state[`get${ucFirstName}`],
            loading: false,
            error: action.response
          }
        };
      },
      [`@star/GET_${pluralNameUpperCase}_REQUEST`]: function(state, action) {
        return {
          ...state,
          [`get${ucFirstPluralName}`]: {
            ...state[`get${ucFirstPluralName}`],
            loading: true,
            error: null
          }
        };
      },
      [`@star/GET_${pluralNameUpperCase}_SUCCESS`]: function(state, action) {
        return {
          ...state,
          [`get${ucFirstPluralName}`]: {
            ...state[`get${ucFirstPluralName}`],
            loading: true,
            data: action.response
          }
        };
      },
      [`@star/GET_${pluralNameUpperCase}_FAILURE`]: function(state, action) {
        return {
          ...state,
          [`get${ucFirstPluralName}`]: {
            ...state[`get${ucFirstPluralName}`],
            loading: true,
            error: action.response
          }
        };
      },
      [`@star/CREATE_${nameUpperCase}_REQUEST`]: function(state, action) {
        return {
          ...state,
          [`create${ucFirstName}`]: {
            ...state[`get${ucFirstPluralName}`],
            loading: true,
            error: null
          }
        };
      },
      [`@star/CREATE_${nameUpperCase}_SUCCESS`]: function(state, action) {
        return {
          ...state,
          [`create${ucFirstName}`]: {
            ...state[`create${ucFirstName}`],
            loading: false,
            data: action.response
          }
        };
      },
      [`@star/CREATE_${nameUpperCase}_FAILURE`]: function(state, action) {
        return {
          ...state,
          [`create${ucFirstName}`]: {
            ...state[`create${ucFirstName}`],
            loading: false,
            error: action.response
          }
        };
      },
      [`@star/UPDATE_${nameUpperCase}_REQUEST`]: function(state, action) {
        return {
          ...state,
          [`update${ucFirstName}`]: {
            ...state[`update${ucFirstName}`],
            loading: true,
            error: null
          }
        };
      },
      [`@star/UPDATE_${nameUpperCase}_SUCCESS`]: function(state, action) {
        return {
          ...state,
          [`update${ucFirstName}`]: {
            ...state[`update${ucFirstName}`],
            loading: true,
            data: action.response
          }
        };
      },
      [`@star/UPDATE_${nameUpperCase}_FAILURE`]: function(state, action) {
        return {
          ...state,
          [`update${ucFirstName}`]: {
            ...state[`update${ucFirstName}`],
            loading: false,
            error: action.response
          }
        };
      },
      [`@star/DELETE_${nameUpperCase}_REQUEST`]: function(state, action) {
        return {
          ...state,
          [`delete${ucFirstName}`]: {
            ...state[`delete${ucFirstName}`],
            loading: true,
            error: null
          }
        };
      },
      [`@star/DELETE_${nameUpperCase}_SUCCESS`]: function(state, action) {
        return {
          ...state,
          [`delete${ucFirstName}`]: {
            ...state[`delete${ucFirstName}`],
            loading: false,
            data: action.response
          }
        };
      },
      [`@star/DELETE_${nameUpperCase}_FAILURE`]: function(state, action) {
        return {
          ...state,
          [`delete${ucFirstName}`]: {
            ...state[`delete${ucFirstName}`],
            loading: false,
            error: action.response
          }
        };
      }
    };
  }
  let addReducers = {};
  let addInitialState = {};
  add &&
    Object.keys(add).forEach(key => {
      const addObj = add[key];
      const nameUpperCase = key.toUpperCase();
      const ucFirstName = ucfirst(key);
      const actionName = httpMethodToCRUDName[addObj.method];
      const actionNameUpperCase = actionName.toUpperCase();

      addInitialState[`${actionName}${ucFirstName}`] = {
        loading: false,
        error: null,
        data: null
      };
      addReducers[`@star/${actionNameUpperCase}_${nameUpperCase}_REQUEST`] = function(state, action) {
        return {
          ...state,
          [`${actionName}${ucFirstName}`]: {
            ...state[`${actionName}${ucFirstName}`],
            loading: true,
            error: null
          }
        };
      };
      addReducers[`@star/${actionNameUpperCase}_${nameUpperCase}_SUCCESS`] = function(state, action) {
        return {
          ...state,
          [`${actionName}${ucFirstName}`]: {
            ...state[`${actionName}${ucFirstName}`],
            loading: false,
            data: action.response
          }
        };
      };
      addReducers[`@star/${actionNameUpperCase}_${nameUpperCase}_FAILURE`] = function(state, action) {
        return {
          ...state,
          [`${actionName}${ucFirstName}`]: {
            ...state[`${actionName}${ucFirstName}`],
            loading: false,
            error: action.response
          }
        };
      };
    });
  const reducers = {
    ...defaultReducers,
    ...addReducers
  };

  initialState = {
    ...initialState,
    ...addInitialState,
    ...moreInitialState
  };
  function rootReducer(state = initialState, action) {
    let newState = state;

    const selectedReducer = reducers[action.type];
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
