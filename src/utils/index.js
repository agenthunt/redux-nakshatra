export const ucfirst = str => str.charAt(0).toUpperCase() + str.substr(1);

export const httpMethodToCRUDName = {
  get: 'get',
  post: 'create',
  patch: 'update',
  delete: 'delete'
};

export function replacePathParamsByValue(url, pathParams) {
  let result = url;
  Object.keys(pathParams).forEach(key => {
    result = result.replaceAll(`:${key}`, pathParams[key]);
  });
  return result;
}
