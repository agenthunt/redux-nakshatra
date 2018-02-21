import { ucfirst, httpMethodToCRUDName } from './utils';
import { take, call, put, all, fork } from 'redux-saga/effects';
import axios from 'axios';
import idx from 'idx';

export default function createSagas({
  name,
  pluralName,
  types,
  url,
  override,
  generateDefault,
  log,
  moreSagas,
  add
}) {
  const nameUpperCase = name.toUpperCase();
  const pluralNameUpperCase = pluralName.toUpperCase();
  const ucFirstName = ucfirst(name);
  const ucFirstPluralName = ucfirst(pluralName);

  let defaultSagas = {};
  if (generateDefault) {
    defaultSagas = {
      *[`watchGet${ucFirstPluralName}RequestSaga`]() {
        while (true) {
          const request = yield take(
            types[`GET_${pluralNameUpperCase}_REQUEST`]
          );
          try {
            const result = yield call(() =>
              axios({
                method: 'get',
                url:
                  idx(request, _ => _.obj.url) ||
                  idx(override, _ => _[`get${ucFirstPluralName}`].url) ||
                  url,
                headers:
                  idx(request, _ => _.obj.headers) ||
                  idx(override, _ => _[`get${ucFirstPluralName}`].headers) ||
                  idx(override, _ => _.headers),
                params:
                  idx(request, _ => _.obj.params) ||
                  idx(override, _ => _[`get${ucFirstPluralName}`].params) ||
                  idx(override, _ => _.params)
              })
            );
            if (result.status !== 200) {
              throw result;
            }
            const transformResponse = idx(
              override,
              _ => _[`get${ucFirstPluralName}`].transformResponse
            );
            yield put({
              type: types[`GET_${pluralNameUpperCase}_SUCCESS`],
              response:
                (transformResponse && transformResponse(result)) || result
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
          try {
            const result = yield call(() =>
              axios({
                method: 'get',
                url:
                  idx(request, _ => _.obj.url) ||
                  idx(override, _ => _[`get${ucFirstName}`].url) ||
                  url,
                headers:
                  idx(request, _ => _.obj.headers) ||
                  idx(override, _ => _[`get${ucFirstName}`].headers) ||
                  idx(override, _ => _.headers),
                params:
                  idx(request, _ => _.obj.params) ||
                  idx(override, _ => _[`get${ucFirstName}`].params) ||
                  idx(override, _ => _.params)
              })
            );
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
          try {
            const result = yield call(() =>
              axios({
                method: 'post',
                url:
                  idx(request, _ => _.obj.url) ||
                  idx(override, _ => _[`create${ucFirstName}`].url) ||
                  url,
                headers:
                  idx(request, _ => _.obj.headers) ||
                  idx(override, _ => _[`create${ucFirstName}`].headers) ||
                  idx(override, _ => _.headers),
                params:
                  idx(request, _ => _.obj.params) ||
                  idx(override, _ => _[`create${ucFirstName}`].params) ||
                  idx(override, _ => _.params),
                data:
                  idx(request, _ => _.obj.data) ||
                  idx(override, _ => _[`create${ucFirstName}`].data)
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
          try {
            const result = yield call(() =>
              axios({
                method: 'delete',
                url:
                  idx(request, _ => _.obj.url) ||
                  idx(override, _ => _[`delete${ucFirstName}`].url) ||
                  url,
                headers:
                  idx(request, _ => _.obj.headers) ||
                  idx(override, _ => _[`delete${ucFirstName}`].headers) ||
                  idx(override, _ => _.headers),
                params:
                  idx(request, _ => _.obj.params) ||
                  idx(override, _ => _[`delete${ucFirstName}`].params) ||
                  idx(override, _ => _.params)
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
          try {
            const result = yield call(() =>
              axios({
                method:
                  idx(request, _ => _.obj.method) ||
                  idx(override, _ => _[`update${ucFirstName}`].method) ||
                  'patch',
                url:
                  idx(request, _ => _.obj.url) ||
                  idx(override, _ => _[`update${ucFirstName}`].url) ||
                  url,
                headers:
                  idx(request, _ => _.obj.headers) ||
                  idx(override, _ => _[`update${ucFirstName}`].headers) ||
                  idx(override, _ => _.headers),
                params:
                  idx(request, _ => _.obj.params) ||
                  idx(override, _ => _[`update${ucFirstName}`].params) ||
                  idx(override, _ => _.params),
                data:
                  idx(request, _ => _.obj.data) ||
                  idx(override, _ => _[`update${ucFirstName}`].data)
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
      addSagas[`watch${actionName}${ucFirstName}RequestSaga`] = function*() {
        while (true) {
          const request = yield take(
            types[`${actionNameUpperCase}_${nameUpperCase}_REQUEST`]
          );
          try {
            const result = yield call(() =>
              axios({
                method:
                  idx(request, _ => _.obj.method) ||
                  idx(override, _ => _[`${actionName}${ucFirstName}`].method) ||
                  addObj.method,
                url:
                  idx(request, _ => _.obj.url) ||
                  idx(override, _ => _[`${actionName}${ucFirstName}`].url) ||
                  addObj.url,
                headers:
                  idx(request, _ => _.obj.headers) ||
                  idx(
                    override,
                    _ => _[`${actionName}${ucFirstName}`].headers
                  ) ||
                  idx(override, _ => _.headers),
                params:
                  idx(request, _ => _.obj.params) ||
                  idx(override, _ => _[`${actionName}${ucFirstName}`].params) ||
                  idx(override, _ => _.params),
                data:
                  idx(request, _ => _.obj.data) ||
                  idx(override, _ => _[`${actionName}${ucFirstName}`].data)
              })
            );
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
