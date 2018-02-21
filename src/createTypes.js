import { httpMethodToCRUDName } from './utils';
export default function createTypes({
  name,
  pluralName,
  generateDefault,
  add,
  moreTypes
}) {
  const nameUpperCase = name.toUpperCase();
  const pluralNameUpperCase = pluralName.toUpperCase();
  let defaultTypes = {};
  if (generateDefault) {
    defaultTypes = {
      // GET one item
      [`GET_${nameUpperCase}_REQUEST`]: `@star/GET_${nameUpperCase}_REQUEST`,
      [`GET_${nameUpperCase}_SUCCESS`]: `@star/GET_${nameUpperCase}_SUCCESS`,
      [`GET_${nameUpperCase}_FAILURE`]: `@star/GET_${nameUpperCase}_FAILURE`,

      // GET items
      [`GET_${pluralNameUpperCase}_REQUEST`]: `@star/GET_${pluralNameUpperCase}_REQUEST`,
      [`GET_${pluralNameUpperCase}_SUCCESS`]: `@star/GET_${pluralNameUpperCase}_SUCCESS`,
      [`GET_${pluralNameUpperCase}_FAILURE`]: `@star/GET_${pluralNameUpperCase}_FAILURE`,

      // CREATE item
      [`CREATE_${nameUpperCase}_REQUEST`]: `@star/CREATE_${nameUpperCase}_REQUEST`,
      [`CREATE_${nameUpperCase}_SUCCESS`]: `@star/CREATE_${nameUpperCase}_SUCCESS`,
      [`CREATE_${nameUpperCase}_FAILURE`]: `@star/CREATE_${nameUpperCase}_FAILURE`,

      // UPDATE ITEM
      [`UPDATE_${nameUpperCase}_REQUEST`]: `@star/UPDATE_${nameUpperCase}_REQUEST`,
      [`UPDATE_${nameUpperCase}_SUCCESS`]: `@star/UPDATE_${nameUpperCase}_SUCCESS`,
      [`UPDATE_${nameUpperCase}_FAILURE`]: `@star/UPDATE_${nameUpperCase}_FAILURE`,

      // DELETE ITEM
      [`DELETE_${nameUpperCase}_REQUEST`]: `@star/DELETE_${nameUpperCase}_REQUEST`,
      [`DELETE_${nameUpperCase}_SUCCESS`]: `@star/DELETE_${nameUpperCase}_SUCCESS`,
      [`DELETE_${nameUpperCase}_FAILURE`]: `@star/DELETE_${nameUpperCase}_FAILURE`
    };
  }
  let addTypes = {};
  if (add) {
    Object.keys(add).forEach(key => {
      const addObj = add[key];
      const nameUpperCase = key.toUpperCase();
      const actionName = httpMethodToCRUDName[addObj.method].toUpperCase();
      addTypes[
        `${actionName}_${nameUpperCase}_REQUEST`
      ] = `@star/${actionName}_${nameUpperCase}_REQUEST`;
      addTypes[
        `${actionName}_${nameUpperCase}_SUCCESS`
      ] = `@star/${actionName}_${nameUpperCase}_SUCCESS`;
      addTypes[
        `${actionName}_${nameUpperCase}_FAILURE`
      ] = `@star/${actionName}_${nameUpperCase}_FAILURE`;
    });
  }
  return {
    ...defaultTypes,
    ...moreTypes,
    ...addTypes
  };
}
