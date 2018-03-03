import { createStar, StarTypes } from 'redux-nakshatra';
import { take, put } from 'redux-saga/effects';

const postStar = createStar({
  name: 'post',
  url: 'http://localhost:5000/posts',
  types: {
    UPDATE_STATE_AFTER_UPDATE_POST_SUCCESS:
      'UPDATE_STATE_AFTER_UPDATE_POST_SUCCESS'
  },
  reducer: function(state, action) {
    switch (action.type) {
      case '@star/UPDATE_POST_SUCCESS': {
        const updatedIndex = state.items.findIndex(
          obj => action.response.data.id === obj.id
        );
        state.items[updatedIndex] = action.response.data;
        return {
          items: [...state.items]
        };
      }
      default:
        return state;
    }
  },
  sagas: {
    *watchDeletePostSuccess() {
      while (true) {
        yield take('@star/DELETE_POST_SUCCESS');
        try {
          yield put({
            type: '@star/GET_POSTS_REQUEST'
          });
        } catch (error) {
          yield put({
            type: 'GET_POSTS_AFTER_DELETE_FAILURE',
            response: error
          });
        }
      }
    }
  }
});

export const CustomStar = createStar({
  starType: StarTypes.CUSTOM,
  sagas: {
    *watchCreatePostSuccessRequestSaga() {
      while (true) {
        yield take(postStar.types.CREATE_POST_SUCCESS);
        try {
          yield put({
            type: postStar.types.GET_POSTS_REQUEST
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

export const { types, actions, rootReducer, rootSaga } = postStar;
