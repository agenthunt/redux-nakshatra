import StarTypes from './starTypes';

export default function createTypes({ name, pluralName, starType, generateDefault, add, moreTypes }) {
  const nameUpperCase = name.toUpperCase();
  const pluralNameUpperCase = pluralName.toUpperCase();
  let defaultTypes = {};
  if (generateDefault && starType === StarTypes.REST) {
    defaultTypes = {
      // GET one item
      [`GET_${nameUpperCase}_REQUEST`]: `@star/GET_${nameUpperCase}_REQUEST`,
      [`GET_${nameUpperCase}_SUCCESS`]: `@star/GET_${nameUpperCase}_SUCCESS`,
      [`GET_${nameUpperCase}_FAILURE`]: `@star/GET_${nameUpperCase}_FAILURE`,

      // GET items
      [`GET_${pluralNameUpperCase}_REQUEST`]: `@star/GET_${pluralNameUpperCase}_REQUEST`,
      [`GET_${pluralNameUpperCase}_SUCCESS`]: `@star/GET_${pluralNameUpperCase}_SUCCESS`,
      [`GET_${pluralNameUpperCase}_FAILURE`]: `@star/GET_${pluralNameUpperCase}_FAILURE`,

      // POST item
      [`POST_${nameUpperCase}_REQUEST`]: `@star/POST_${nameUpperCase}_REQUEST`,
      [`POST_${nameUpperCase}_SUCCESS`]: `@star/POST_${nameUpperCase}_SUCCESS`,
      [`POST_${nameUpperCase}_FAILURE`]: `@star/POST_${nameUpperCase}_FAILURE`,

      // PUT ITEM
      [`PUT_${nameUpperCase}_REQUEST`]: `@star/PUT_${nameUpperCase}_REQUEST`,
      [`PUT_${nameUpperCase}_SUCCESS`]: `@star/PUT_${nameUpperCase}_SUCCESS`,
      [`PUT_${nameUpperCase}_FAILURE`]: `@star/PUT_${nameUpperCase}_FAILURE`,

      // PATCH ITEM
      [`PATCH_${nameUpperCase}_REQUEST`]: `@star/PATCH_${nameUpperCase}_REQUEST`,
      [`PATCH_${nameUpperCase}_SUCCESS`]: `@star/PATCH_${nameUpperCase}_SUCCESS`,
      [`PATCH_${nameUpperCase}_FAILURE`]: `@star/PATCH_${nameUpperCase}_FAILURE`,

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
      const actionName = addObj.method.toUpperCase();
      addTypes[`${actionName}_${nameUpperCase}_REQUEST`] = `@star/${actionName}_${nameUpperCase}_REQUEST`;
      addTypes[`${actionName}_${nameUpperCase}_SUCCESS`] = `@star/${actionName}_${nameUpperCase}_SUCCESS`;
      addTypes[`${actionName}_${nameUpperCase}_FAILURE`] = `@star/${actionName}_${nameUpperCase}_FAILURE`;
    });
  }
  return {
    ...defaultTypes,
    ...moreTypes,
    ...addTypes
  };
}
