import 'babel-polyfill';
import createTypes from './createTypes';
import createActions from './createActions';
import createRootSaga from './createRootSaga';
import createRootReducer from './createRootReducer';
import StarTypes from './starTypes';

/**
 *
 *
 * @param {Object} A config object that has the following properties
 * @namespace
 * @property {name}
 * @property {pluralName}
 * @property {url}
 * @property {starType}  Default is StarTypes.REST
 * @property {override}
 * @property {add}
 * @property {types}
 * @property {actions}
 * @property {reducer}
 * @property {sagas}
 * @property {log}
 *
 * @returns {STAR}  returns STAR (Sagas, Types, Actions, Reducer) object
 * @property {rootSaga}: contains all generated and custom sagas
 * @property rootReducer: combines all generated reducers and custom reducers
 * @property types: contains all generated types and custom types
 * @property actions: contains all generated actions and custom actions
 */

export function createStar({
  name,
  pluralName,
  url,
  starType = StarTypes.REST,
  generateDefault = true,
  override,
  add,
  initialState: moreInitialState,
  types: moreTypes,
  actions: moreActions,
  reducer,
  sagas: moreSagas,
  log = false
}) {
  if (starType === StarTypes.CUSTOM) {
    name = '';
  } else {
    if (generateDefault === true) {
      if (name === undefined || name === null) {
        throw new Error(`name cannot be null for StarType.${starType}`);
      }
    } else {
      name = '';
    }
  }

  if (pluralName === null || pluralName === undefined) {
    pluralName = `${name}s`;
  }

  const types = createTypes({
    name,
    pluralName,
    starType,
    generateDefault,
    moreTypes,
    add
  });

  const actions = createActions({
    name,
    pluralName,
    types,
    starType,
    generateDefault,
    moreActions,
    add
  });

  const rootReducer = createRootReducer({
    name,
    pluralName,
    moreInitialState,
    types,
    starType,
    generateDefault,
    reducer,
    add
  });

  const rootSaga = createRootSaga({
    name,
    pluralName,
    types,
    url,
    override,
    add,
    starType,
    generateDefault,
    moreSagas,
    log
  });

  return {
    types,
    actions,
    rootReducer,
    rootSaga
  };
}
