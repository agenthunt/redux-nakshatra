import { createStar } from 'redux-nakshatra';
import { take, put } from 'redux-saga/effects';

const blogItemStar = createStar({
  name: 'blogItem',
  http: {
    generateDefault: true,
    url: 'http://localhost:5000/blogitems'
  },
  types: {
    UPDATE_STATE_AFTER_PATCH_BLOGITEM_SUCCESS: 'UPDATE_STATE_AFTER_PATCH_BLOGITEM_SUCCESS'
  },
  reducer: function(state, action) {
    switch (action.type) {
      case '@star/PATCHBLOGITEM_SUCCESS': {
        const updatedIndex = state.getBlogItems.data.data.findIndex(obj => action.response.data.id === obj.id);
        state.getBlogItems.data.data[updatedIndex] = action.response.data;
        state.getBlogItems.data.data = [...state.getBlogItems.data.data];
        state.getBlogItems.data = { ...state.getBlogItems.data };
        return {
          ...state,
          getBlogItems: {
            ...state.getBlogItems
          }
        };
      }
      default:
        return state;
    }
  },
  sagas: {
    *watchDeleteBlogItemSuccess() {
      while (true) {
        yield take('@star/DELETEBLOGITEM_SUCCESS');
        try {
          yield put({
            type: '@star/GETBLOGITEMS_REQUEST'
          });
        } catch (error) {
          yield put({
            type: 'GET_BLOGITEMS_AFTER_DELETE_FAILURE',
            response: error
          });
        }
      }
    }
  }
});

console.log(blogItemStar);

export const CustomStar = createStar({
  name: 'customStar',
  sagas: {
    *watchPostBlogItemSuccessRequestSaga() {
      while (true) {
        yield take(blogItemStar.types.postBlogItem_SUCCESS);
        try {
          yield put({
            type: blogItemStar.types.getBlogItems_REQUEST
          });
        } catch (error) {
          yield put({
            type: 'GET_BLOGITEMS_AFTER_CREATE_FAILURE',
            response: error
          });
        }
      }
    }
  }
});

export const { types, actions, rootReducer, rootSaga } = blogItemStar;
