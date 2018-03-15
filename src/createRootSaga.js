import { ucfirst, replacePathParamsByValue } from './utils/index';
import { take, call, put, all, fork } from 'redux-saga/effects';
import axios from 'axios';
import idx from 'idx';

export default function createSagas({ types, combinedObjs, log, moreSagas }) {
  let defaultSagas = {};

  let combinedSagas = {};
  Object.keys(combinedObjs).forEach(key => {
    const obj = combinedObjs[key];
    const ucFirstKey = ucfirst(key);
    const nameUpperCase = key.toUpperCase();
    if (obj.saga) {
      combinedSagas[`watch${ucFirstKey}RequestSaga`] = obj.saga;
    } else {
      combinedSagas[`watch${ucFirstKey}RequestSaga`] = function*() {
        while (true) {
          const request = yield take(types[`${nameUpperCase}_REQUEST`]);

          const pathParams = idx(request, _ => _.obj.pathParams);
          let finalizedUrl = obj.url; // use url value the createStar configuration
          if (idx(request, _ => _.obj.url)) {
            // 1. Check in request obj
            const urlFromObj = idx(request, _ => _.obj.url);
            finalizedUrl = replacePathParamsByValue(urlFromObj, pathParams);
          } else if (idx(obj, _ => _.url)) {
            const urlFromObj = idx(obj, _ => _.url);
            finalizedUrl = replacePathParamsByValue(urlFromObj, pathParams);
          } else {
            // use standard REST convention, i.e for singular get, patch and delete expect an id path param
            if (!pathParams.id) {
              throw new Error('{pathParams: { id: <someValue> }} expected');
            }
            finalizedUrl = replacePathParamsByValue(obj.url, pathParams);
          }

          try {
            const result = yield call(() => {
              const config = {
                method: idx(request, _ => _.obj.method) || obj.method,
                url: finalizedUrl,
                headers: idx(request, _ => _.obj.headers),
                params: idx(request, _ => _.obj.params),
                data: idx(request, _ => _.obj.data)
              };

              const transformResponse = idx(request, _ => _.obj.transformResponse);
              const transformRequest = idx(request, _ => _.obj.transformRequest);
              if (transformRequest) {
                config.transformRequest = transformRequest;
              }
              if (transformResponse) {
                config.transformResponse = transformResponse;
              }

              return axios(config);
            });

            if (result.status !== 200 && result.status !== 201) {
              throw result;
            }
            yield put({
              type: types[`${nameUpperCase}_SUCCESS`],
              response: result
            });
          } catch (error) {
            log && console.error(error);
            yield put({
              type: types[`${nameUpperCase}_FAILURE`],
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
    ...combinedSagas
  };
  function* rootSaga(args) {
    const allSagas = Object.keys(sagas).map(key => fork(sagas[key], args));
    yield all([allSagas]);
  }
  return rootSaga;
}
