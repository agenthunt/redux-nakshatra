export const ucfirst = str => str.charAt(0).toUpperCase() + str.substr(1);

export function replacePathParamsByValue(url, pathParams) {
  let result = url;
  pathParams &&
    Object.keys(pathParams).forEach(key => {
      const regex = new RegExp(`:${key}`, 'gi');
      result = result.replace(regex, pathParams[key]);
    });
  return result;
}
