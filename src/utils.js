export const ucfirst = str => str.charAt(0).toUpperCase() + str.substr(1);

export const httpMethodToCRUDName = {
  get: 'get',
  post: 'create',
  patch: 'update',
  delete: 'delete'
};
