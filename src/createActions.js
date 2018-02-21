import { ucfirst, httpMethodToCRUDName } from './utils';

export default function createActions({
  name,
  pluralName,
  types,
  generateDefault,
  moreActions,
  add
}) {
  const nameUpperCase = name.toUpperCase();
  const pluralNameUpperCase = pluralName.toUpperCase();
  const ucFirstName = ucfirst(name);
  const ucFirstPluralName = ucfirst(pluralName);
  let defaultActions = {};
  if (generateDefault) {
    defaultActions = {
      [`get${ucFirstName}`]: function(obj) {
        return {
          type: types[`GET_${nameUpperCase}_REQUEST`],
          obj
        };
      },
      [`get${ucFirstPluralName}`]: function(obj) {
        return {
          type: types[`GET_${pluralNameUpperCase}_REQUEST`],
          obj
        };
      },
      [`create${ucFirstName}`]: function(obj) {
        return {
          type: types[`CREATE_${nameUpperCase}_REQUEST`],
          obj
        };
      },
      [`update${ucFirstName}`]: function(obj) {
        return {
          type: types[`UPDATE_${nameUpperCase}_REQUEST`],
          obj
        };
      },
      [`delete${ucFirstName}`]: function(obj) {
        return {
          type: types[`DELETE_${nameUpperCase}_REQUEST`],
          obj
        };
      }
    };
  }
  let addActions = {};
  add &&
    Object.keys(add).forEach(key => {
      const addObj = add[key];
      const nameUpperCase = key.toUpperCase();
      const ucFirstName = ucfirst(key);
      const actionName = httpMethodToCRUDName[addObj.method];
      const actionNameUpperCase = actionName.toUpperCase();
      addActions[`${actionName}${ucFirstName}`] = function(obj) {
        return {
          type: types[`${actionNameUpperCase}_${nameUpperCase}_REQUEST`],
          obj
        };
      };
    });
  return {
    ...defaultActions,
    ...moreActions,
    ...addActions
  };
}
