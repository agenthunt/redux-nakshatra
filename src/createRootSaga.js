import { ucfirst, httpMethodToCRUDName, replacePathParamsByValue } from './utils/index';
import { take, call, put, all, fork } from 'redux-saga/effects';
import axios from 'axios';
import idx from 'idx';
import StarTypes from './starTypes';

export default function createSagas({ name, pluralName, types, url, override, starType, generateDefault, log, moreSagas, add }) {
  const nameUpperCase = name.toUpperCase();
  const pluralNameUpperCase = pluralName.toUpperCase();
  const ucFirstName = ucfirst(name);
  const ucFirstPluralName = ucfirst(pluralName);

  let defaultSagas = {};
  if (generateDefault && starType === StarTypes.REST) {
    defaultSagas = {
      *[`watchGet${ucFirstPluralName}RequestSaga`]() {
        while (true) {
          const request = yield take(types[`GET_${pluralNameUpperCase}_REQUEST`]);

          const pathParams = idx(request, _ => _.obj.pathParams);
          let finalizedUrl = url;
          if (idx(request, _ => _.obj.url)) {
            const urlFromObj = idx(request, _ => _.obj.url);
            finalizedUrl = replacePathParamsByValue(urlFromObj, pathParams);
          } else if (idx(override, _ => _[`get${ucFirstPluralName}`].url)) {
            const urlFromObj = idx(override, _ => _[`get${ucFirstPluralName}`].url);
            finalizedUrl = replacePathParamsByValue(urlFromObj, pathParams);
          }

          try {
            const result = yield call(() =>
              axios({
                method: 'get',
                url: finalizedUrl,
                headers:
                  idx(request, _ => _.obj.headers) ||
                  idx(override, _ => _[`get${ucFirstPluralName}`].headers) ||
                  idx(override, _ => _.headers),
                params:
                  idx(request, _ => _.obj.params) || idx(override, _ => _[`get${ucFirstPluralName}`].params) || idx(override, _ => _.params)
              })
            );
            if (result.status !== 200) {
              throw result;
            }
            const transformResponse = idx(override, _ => _[`get${ucFirstPluralName}`].transformResponse);
            yield put({
              type: types[`GET_${pluralNameUpperCase}_SUCCESS`],
              response: (transformResponse && transformResponse(result)) || result
            });
          } catch (error) {
            log && console.error(error);
            yield put({
              type: types[`GET_${pluralNameUpperCase}_FAILURE`],
              response: error
            });
          }
        }
      },
      *[`watchGet${ucFirstName}RequestSaga`]() {
        while (true) {
          const request = yield take(types[`GET_${nameUpperCase}_REQUEST`]);

          const pathParams = idx(request, _ => _.obj.pathParams);
          let finalizedUrl = url; // use url value the createStar configuration
          if (idx(request, _ => _.obj.url)) {
            // 1. Check in request obj
            const urlFromObj = idx(request, _ => _.obj.url);
            finalizedUrl = replacePathParamsByValue(urlFromObj, pathParams);
          } else if (idx(override, _ => _[`get${ucFirstName}`].url)) {
            // 2. Next check in override configuration
            const urlFromObj = idx(override, _ => _[`get${ucFirstName}`].url);
            finalizedUrl = replacePathParamsByValue(urlFromObj, pathParams);
          } else {
            // use standard REST convention, i.e for singular get, patch and delete expect an id path param
            if (!pathParams || !pathParams.id) {
              throw new Error(`Expecting get${ucFirstName} {pathParams: { id: <someValue> }}`);
            }
            finalizedUrl = `${url}/${pathParams.id}`;
          }

          if (finalizedUrl.trim().length === 0) {
            throw new Error(`url cannot be empty for ${ucFirstName}`);
          }

          try {
            const result = yield call(() => {
              const config = {
                method: 'get',
                url: finalizedUrl,
                headers:
                  idx(request, _ => _.obj.headers) || idx(override, _ => _[`get${ucFirstName}`].headers) || idx(override, _ => _.headers),
                params:
                  idx(request, _ => _.obj.params) || idx(override, _ => _[`get${ucFirstName}`].params) || idx(override, _ => _.params),
                responseType:
                  idx(request, _ => _.obj.responseType) ||
                  idx(override, _ => _[`get${ucFirstName}`].responseType) ||
                  idx(override, _ => _.responseType)
              };

              const transformResponse =
                idx(request, _ => _.obj.transformResponse) ||
                idx(override, _ => _[`get${ucFirstName}`].transformResponse) ||
                idx(override, _ => _.transformResponse);

              const transformRequest =
                idx(request, _ => _.obj.transformRequest) ||
                idx(override, _ => _[`get${ucFirstName}`].transformRequest) ||
                idx(override, _ => _.transformRequest);
              if (transformResponse) {
                config.transformResponse = transformResponse;
              }
              if (transformRequest) {
                config.transformRequest = transformRequest;
              }
              return axios(config);
            });
            if (result.status !== 200) {
              throw result;
            }
            yield put({
              type: types[`GET_${nameUpperCase}_SUCCESS`],
              response: result
            });
          } catch (error) {
            log && console.error(error);
            yield put({
              type: types[`GET_${nameUpperCase}_FAILURE`],
              response: error
            });
          }
        }
      },
      *[`watchCreate${ucFirstName}RequestSaga`]() {
        while (true) {
          const request = yield take(types[`CREATE_${nameUpperCase}_REQUEST`]);
          const pathParams = idx(request, _ => _.obj.pathParams);
          let finalizedUrl = url; // use url value the createStar configuration
          if (idx(request, _ => _.obj.url)) {
            // 1. Check in request obj
            const urlFromObj = idx(request, _ => _.obj.url);
            finalizedUrl = replacePathParamsByValue(urlFromObj, pathParams);
          } else if (idx(override, _ => _[`create${ucFirstName}`].url)) {
            // 2. Next check in override configuration
            const urlFromObj = idx(override, _ => _[`create${ucFirstName}`].url);
            finalizedUrl = replacePathParamsByValue(urlFromObj, pathParams);
          }

          try {
            const result = yield call(() =>
              axios({
                method: 'post',
                url: finalizedUrl,
                headers:
                  idx(request, _ => _.obj.headers) ||
                  idx(override, _ => _[`create${ucFirstName}`].headers) ||
                  idx(override, _ => _.headers),
                params:
                  idx(request, _ => _.obj.params) || idx(override, _ => _[`create${ucFirstName}`].params) || idx(override, _ => _.params),
                data: idx(request, _ => _.obj.data) || idx(override, _ => _[`create${ucFirstName}`].data)
              })
            );
            if (result.status !== 200 && result.status !== 201) {
              throw result;
            }
            yield put({
              type: types[`CREATE_${nameUpperCase}_SUCCESS`],
              response: result
            });
          } catch (error) {
            log && console.error(`create${ucFirstName} failed`, error);
            yield put({
              type: types[`CREATE_${nameUpperCase}_FAILURE`],
              response: error
            });
          }
        }
      },
      *[`watchDelete${ucFirstName}RequestSaga`]() {
        while (true) {
          const request = yield take(types[`DELETE_${nameUpperCase}_REQUEST`]);

          const pathParams = idx(request, _ => _.obj.pathParams);
          let finalizedUrl = url; // use url value the createStar configuration
          if (idx(request, _ => _.obj.url)) {
            // 1. Check in request obj
            const urlFromObj = idx(request, _ => _.obj.url);
            finalizedUrl = replacePathParamsByValue(urlFromObj, pathParams);
          } else if (idx(override, _ => _[`delete${ucFirstName}`].url)) {
            // 2. Next check in override configuration
            const urlFromObj = idx(override, _ => _[`delete${ucFirstName}`].url);
            finalizedUrl = replacePathParamsByValue(urlFromObj, pathParams);
          } else {
            // use standard REST convention, i.e for singular get, patch and delete expect an id path param
            if (!pathParams.id) {
              throw new Error('{pathParams: { id: <someValue> }} expected');
            }
            finalizedUrl = replacePathParamsByValue(url, pathParams);
          }

          try {
            const result = yield call(() =>
              axios({
                method: 'delete',
                url: finalizedUrl,
                headers:
                  idx(request, _ => _.obj.headers) ||
                  idx(override, _ => _[`delete${ucFirstName}`].headers) ||
                  idx(override, _ => _.headers),
                params:
                  idx(request, _ => _.obj.params) || idx(override, _ => _[`delete${ucFirstName}`].params) || idx(override, _ => _.params)
              })
            );
            if (result.status !== 200) {
              throw result;
            }
            yield put({
              type: types[`DELETE_${nameUpperCase}_SUCCESS`],
              response: result
            });
          } catch (error) {
            log && console.error(error);
            yield put({
              type: types[`DELETE_${nameUpperCase}_FAILURE`],
              response: error
            });
          }
        }
      },
      *[`watchUpdate${ucFirstName}RequestSaga`]() {
        while (true) {
          const request = yield take(types[`UPDATE_${nameUpperCase}_REQUEST`]);
          const pathParams = idx(request, _ => _.obj.pathParams);
          let finalizedUrl = url; // use url value the createStar configuration
          if (idx(request, _ => _.obj.url)) {
            // 1. Check in request obj
            const urlFromObj = idx(request, _ => _.obj.url);
            finalizedUrl = replacePathParamsByValue(urlFromObj, pathParams);
          } else if (idx(override, _ => _[`update${ucFirstName}`].url)) {
            // 2. Next check in override configuration
            const urlFromObj = idx(override, _ => _[`update${ucFirstName}`].url);
            finalizedUrl = replacePathParamsByValue(urlFromObj, pathParams);
          } else {
            // use standard REST convention, i.e for singular get, patch and delete expect an id path param
            if (!pathParams.id) {
              throw new Error('{pathParams: { id: <someValue> }} expected');
            }
            finalizedUrl = replacePathParamsByValue(url, pathParams);
          }

          try {
            const result = yield call(() =>
              axios({
                method: idx(request, _ => _.obj.method) || idx(override, _ => _[`update${ucFirstName}`].method) || 'patch',
                url: finalizedUrl,
                headers:
                  idx(request, _ => _.obj.headers) ||
                  idx(override, _ => _[`update${ucFirstName}`].headers) ||
                  idx(override, _ => _.headers),
                params:
                  idx(request, _ => _.obj.params) || idx(override, _ => _[`update${ucFirstName}`].params) || idx(override, _ => _.params),
                data: idx(request, _ => _.obj.data) || idx(override, _ => _[`update${ucFirstName}`].data)
              })
            );
            if (result.status !== 200) {
              throw result;
            }
            yield put({
              type: types[`UPDATE_${nameUpperCase}_SUCCESS`],
              response: result
            });
          } catch (error) {
            log && console.error(error);
            yield put({
              type: types[`UPDATE_${nameUpperCase}_FAILURE`],
              response: error
            });
          }
        }
      }
    };
  }

  let addSagas = {};
  add &&
    Object.keys(add).forEach(key => {
      const addObj = add[key];
      const nameUpperCase = key.toUpperCase();
      const ucFirstName = ucfirst(key);
      const actionName = httpMethodToCRUDName[addObj.method];
      const actionNameUpperCase = actionName.toUpperCase();
      if (addObj.saga) {
        addSagas[`watch${actionName}${ucFirstName}RequestSaga`] = addObj.saga;
      } else {
        addSagas[`watch${actionName}${ucFirstName}RequestSaga`] = function*() {
          while (true) {
            const request = yield take(types[`${actionNameUpperCase}_${nameUpperCase}_REQUEST`]);

            const pathParams = idx(request, _ => _.obj.pathParams);
            let finalizedUrl = addObj.url; // use url value the createStar configuration
            if (idx(request, _ => _.obj.url)) {
              // 1. Check in request obj
              const urlFromObj = idx(request, _ => _.obj.url);
              finalizedUrl = replacePathParamsByValue(urlFromObj, pathParams);
            } else if (idx(addObj, _ => _.url)) {
              const urlFromObj = idx(addObj, _ => _.url);
              finalizedUrl = replacePathParamsByValue(urlFromObj, pathParams);
            } else {
              // use standard REST convention, i.e for singular get, patch and delete expect an id path param
              if (!pathParams.id) {
                throw new Error('{pathParams: { id: <someValue> }} expected');
              }
              finalizedUrl = replacePathParamsByValue(addObj.url, pathParams);
            }

            try {
              const result = yield call(() => {
                const config = {
                  method: idx(request, _ => _.obj.method) || idx(override, _ => _[`${actionName}${ucFirstName}`].method) || addObj.method,
                  url: finalizedUrl,
                  headers:
                    idx(request, _ => _.obj.headers) ||
                    idx(override, _ => _[`${actionName}${ucFirstName}`].headers) ||
                    idx(override, _ => _.headers),
                  params:
                    idx(request, _ => _.obj.params) ||
                    idx(override, _ => _[`${actionName}${ucFirstName}`].params) ||
                    idx(override, _ => _.params),
                  data: idx(request, _ => _.obj.data) || idx(override, _ => _[`${actionName}${ucFirstName}`].data)
                };

                const transformResponse =
                  idx(request, _ => _.obj.transformResponse) || idx(override, _ => _[`${actionName}${ucFirstName}`].transformResponse);
                const transformRequest =
                  idx(request, _ => _.obj.transformRequest) || idx(override, _ => _[`${actionName}${ucFirstName}`].transformRequest);
                if (transformRequest) {
                  config.transformRequest = transformRequest;
                }
                if (transformResponse) {
                  config.transformResponse = transformResponse;
                }

                return axios(config);
              });

              if (result.status !== 200) {
                throw result;
              }
              yield put({
                type: types[`${actionNameUpperCase}_${nameUpperCase}_SUCCESS`],
                response: result
              });
            } catch (error) {
              log && console.error(error);
              yield put({
                type: types[`${actionNameUpperCase}_${nameUpperCase}_FAILURE`],
                response: error
              });
            }
          }
        };
      }
    });
  const sagas = {
    ...defaultSagas,
    ...moreSagas,
    ...addSagas
  };
  function* rootSaga() {
    const allSagas = Object.keys(sagas).map(key => fork(sagas[key]));
    yield all([allSagas]);
  }
  return rootSaga;
}
