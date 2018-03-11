import { ucfirst } from './utils/index';
import StarTypes from './starTypes';

export default function createActions({ name, pluralName, types, starType, generateDefault, moreActions, add }) {
  const nameUpperCase = name.toUpperCase();
  const pluralNameUpperCase = pluralName.toUpperCase();
  const ucFirstName = ucfirst(name);
  const ucFirstPluralName = ucfirst(pluralName);
  let defaultActions = {};
  if (generateDefault && starType === StarTypes.REST) {
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
      [`post${ucFirstName}`]: function(obj) {
        return {
          type: types[`POST_${nameUpperCase}_REQUEST`],
          obj
        };
      },
      [`put${ucFirstName}`]: function(obj) {
        return {
          type: types[`PUT_${nameUpperCase}_REQUEST`],
          obj
        };
      },
      [`patch${ucFirstName}`]: function(obj) {
        return {
          type: types[`PATCH_${nameUpperCase}_REQUEST`],
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
      const actionName = addObj.method;
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
    ...addActions,
    ...moreActions
  };
}
