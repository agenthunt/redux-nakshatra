import { createStar, StarTypes } from 'redux-nakshatra';
import { take, put } from 'redux-saga/effects';
let tmp = null;
export const { types, actions, rootReducer, rootSaga } = (tmp = createStar({
  name: 'post',
  url: 'http://localhost:5000/posts',
  override: {
    getPosts: {
      transformResponse: response => {
        return response.data;
      }
    }
  }
}));

export const CustomStar = createStar({
  type: StarTypes.CUSTOM,
  generateDefault: false,
  sagas: {
    *watchCreatePostSuccessRequestSaga() {
      while (true) {
        yield take(tmp.types.CREATE_POST_SUCCESS);
        try {
          yield put({
            type: tmp.types.GET_POSTS_REQUEST
          });
        } catch (error) {
          yield put({
            type: 'GET_POSTS_AFTER_CREATE_FAILURE',
            response: error
          });
        }
      }
    }
  }
});
