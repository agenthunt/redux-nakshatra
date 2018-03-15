export default function createActions({ types, combinedObjs, moreActions }) {
  let combinedActions = {};

  Object.keys(combinedObjs).forEach(key => {
    combinedActions[key] = function(obj) {
      return {
        type: types[`${key}_REQUEST`],
        obj
      };
    };
  });

  return {
    ...combinedActions,
    ...moreActions
  };
}
