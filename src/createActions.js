export default function createActions({ types, combinedObjs, moreActions }) {
  let combinedActions = {};

  Object.keys(combinedObjs).forEach(key => {
    const nameUpperCase = key.toUpperCase();
    combinedActions[key] = function(obj) {
      return {
        type: types[`${nameUpperCase}_REQUEST`],
        obj
      };
    };
  });

  return {
    ...combinedActions,
    ...moreActions
  };
}
