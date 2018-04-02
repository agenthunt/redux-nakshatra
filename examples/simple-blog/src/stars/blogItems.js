import { createStar } from 'redux-nakshatra';
import { take, put } from 'redux-saga/effects';

export const { types, actions, rootReducer, rootSaga } = createStar({
  name: 'blogItem',
  http: {
    generateDefault: true,
    url: 'http://localhost:5000/blogitems'
  },
  reducer: function(state, action) {
    switch (action.type) {
      case types.patchBlogItem_SUCCESS: {
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
        yield take(types.deleteBlogItem_SUCCESS);
        yield put({
          type: types.getBlogItems_REQUEST
        });
      }
    },
    *watchPostBlogItemSuccessRequestSaga() {
      while (true) {
        yield take(types.postBlogItem_SUCCESS);
        yield put({
          type: types.getBlogItems_REQUEST
        });
      }
    }
  }
});
