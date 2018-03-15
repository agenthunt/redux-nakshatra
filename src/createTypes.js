export default function createTypes({ name, combinedObjs, moreTypes }) {
  let combinedTypes = {};
  Object.keys(combinedObjs).forEach(key => {
    combinedTypes[`${key}_REQUEST`] = `@star/${name}/${key}_REQUEST`;
    combinedTypes[`${key}_SUCCESS`] = `@star/${name}/${key}_SUCCESS`;
    combinedTypes[`${key}_FAILURE`] = `@star/${name}/${key}_FAILURE`;
  });

  return {
    ...combinedTypes,
    ...moreTypes
  };
}
