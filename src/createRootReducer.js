import { ucfirst, httpMethodToCRUDName } from './utils';

export default function createRootReducer({
  name,
  pluralName,
  types,
  generateDefault,
  moreReducers,
  add
}) {
  const nameUpperCase = name.toUpperCase();
  const pluralNameUpperCase = pluralName.toUpperCase();
  const ucFirstName = ucfirst(name);
  const ucFirstPluralName = ucfirst(pluralName);

  let initialState = {};
  let defaultReducers = {};
  if (generateDefault) {
    initialState = {
      items: [],
      item: null
    };
    defaultReducers = {
      [`@star/GET_${nameUpperCase}_REQUEST`]: function(state, action) {
        return {
          ...state,
          [`get${ucFirstName}InProgress`]: true,
          [`get${ucFirstName}FailureMessage`]: null
        };
      },
      [`@star/GET_${nameUpperCase}_SUCCESS`]: function(state, action) {
        return {
          ...state,
          [`get${ucFirstName}InProgress`]: false,
          item: action.response
        };
      },
      [`@star/GET_${nameUpperCase}_FAILURE`]: function(state, action) {
        return {
          ...state,
          [`get${ucFirstName}InProgress`]: false,
          [`get${ucFirstName}FailureMessage`]: action.response
        };
      },
      [`@star/GET_${pluralNameUpperCase}_REQUEST`]: function(state, action) {
        return {
          ...state,
          [`get${ucFirstPluralName}InProgress`]: true,
          [`get${ucFirstPluralName}FailureMessage`]: null
        };
      },
      [`@star/GET_${pluralNameUpperCase}_SUCCESS`]: function(state, action) {
        return {
          ...state,
          [`get${ucFirstPluralName}InProgress`]: false,
          items: action.response
        };
      },
      [`@star/GET_${pluralNameUpperCase}_FAILURE`]: function(state, action) {
        return {
          ...state,
          [`get${ucFirstPluralName}InProgress`]: false,
          [`get${ucFirstPluralName}FailureMessage`]: action.response
        };
      },
      [`@star/CREATE_${nameUpperCase}_REQUEST`]: function(state, action) {
        return {
          ...state,
          [`create${ucFirstName}InProgress`]: true,
          [`create${ucFirstName}FailureMessage`]: null
        };
      },
      [`@star/CREATE_${nameUpperCase}_SUCCESS`]: function(state, action) {
        return {
          ...state,
          [`create${ucFirstName}InProgress`]: false,
          lastCreatedItem: action.response
        };
      },
      [`@star/CREATE_${nameUpperCase}_FAILURE`]: function(state, action) {
        return {
          ...state,
          [`create${ucFirstName}InProgress`]: false,
          [`create${ucFirstName}FailureMessage`]: action.response
        };
      },
      [`@star/UPDATE_${nameUpperCase}_REQUEST`]: function(state, action) {
        return {
          ...state,
          [`update${ucFirstName}InProgress`]: true,
          [`update${ucFirstName}FailureMessage`]: null
        };
      },
      [`@star/UPDATE_${nameUpperCase}_SUCCESS`]: function(state, action) {
        return {
          ...state,
          [`update${ucFirstName}InProgress`]: false,
          lastUpdatedItem: action.response
        };
      },
      [`@star/UPDATE_${nameUpperCase}_FAILURE`]: function(state, action) {
        return {
          ...state,
          [`update${ucFirstName}InProgress`]: false,
          [`update${ucFirstName}FailureMessage`]: action.response
        };
      },
      [`@star/DELETE_${nameUpperCase}_REQUEST`]: function(state, action) {
        return {
          ...state,
          [`delete${ucFirstName}InProgress`]: true,
          [`delete${ucFirstName}FailureMessage`]: null
        };
      },
      [`@star/DELETE_${nameUpperCase}_SUCCESS`]: function(state, action) {
        return {
          ...state,
          [`delete${ucFirstName}InProgress`]: false,
          lastDeletedItem: action.response
        };
      },
      [`@star/DELETE_${nameUpperCase}_FAILURE`]: function(state, action) {
        return {
          ...state,
          [`delete${ucFirstName}InProgress`]: false,
          [`delete${ucFirstName}FailureMessage`]: action.response
        };
      }
    };
  }
  let addReducers = {};
  add &&
    Object.keys(add).forEach(key => {
      const addObj = add[key];
      const nameUpperCase = key.toUpperCase();
      const ucFirstName = ucfirst(key);
      const actionName = httpMethodToCRUDName[addObj.method];
      const actionNameUpperCase = actionName.toUpperCase();
      addReducers[
        `@star/${actionNameUpperCase}_${nameUpperCase}_REQUEST`
      ] = function(state, action) {
        return {
          ...state,
          [`${actionName}${ucFirstName}InProgress`]: true,
          [`${actionName}${ucFirstName}FailureMessage`]: null
        };
      };
      addReducers[
        `@star/${actionNameUpperCase}_${nameUpperCase}_SUCCESS`
      ] = function(state, action) {
        return {
          ...state,
          [`${actionName}${ucFirstName}InProgress`]: false,
          [key]: action.response
        };
      };
      addReducers[
        `@star/${actionNameUpperCase}_${nameUpperCase}_FAILURE`
      ] = function(state, action) {
        return {
          ...state,
          [`${actionName}${ucFirstName}InProgress`]: false,
          [`${actionName}${ucFirstName}FailureMessage`]: action.response
        };
      };
    });
  const reducers = {
    ...defaultReducers,
    ...moreReducers,
    ...addReducers
  };

  function rootReducer(state = initialState, action) {
    const reducer = reducers[action.type];
    if (reducer) {
      return reducer(state, action);
    }

    return state;
  }
  return rootReducer;
}
