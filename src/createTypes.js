export default function createTypes({ combinedObjs, moreTypes }) {
  let combinedTypes = {};
  Object.keys(combinedObjs).forEach(key => {
    const nameUpperCase = key.toUpperCase();
    combinedTypes[`${nameUpperCase}_REQUEST`] = `@star/${nameUpperCase}_REQUEST`;
    combinedTypes[`${nameUpperCase}_SUCCESS`] = `@star/${nameUpperCase}_SUCCESS`;
    combinedTypes[`${nameUpperCase}_FAILURE`] = `@star/${nameUpperCase}_FAILURE`;
  });

  return {
    ...combinedTypes,
    ...moreTypes
  };
}
