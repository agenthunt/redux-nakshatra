import { createStar, StarTypes } from '../';
import { take } from 'redux-saga/effects';

describe('createStar', () => {
  it('exposes the public API', () => {
    const { types, actions, rootReducer, rootSaga } = createStar({
      name: 'blogitem',
      url: 'http://localhost:5000/blogitems'
    });

    expect(types).toEqual(
      expect.objectContaining({
        POST_BLOGITEM_FAILURE: '@star/POST_BLOGITEM_FAILURE',
        POST_BLOGITEM_REQUEST: '@star/POST_BLOGITEM_REQUEST',
        POST_BLOGITEM_SUCCESS: '@star/POST_BLOGITEM_SUCCESS',
        DELETE_BLOGITEM_FAILURE: '@star/DELETE_BLOGITEM_FAILURE',
        DELETE_BLOGITEM_REQUEST: '@star/DELETE_BLOGITEM_REQUEST',
        DELETE_BLOGITEM_SUCCESS: '@star/DELETE_BLOGITEM_SUCCESS',
        GET_BLOGITEMS_FAILURE: '@star/GET_BLOGITEMS_FAILURE',
        GET_BLOGITEMS_REQUEST: '@star/GET_BLOGITEMS_REQUEST',
        GET_BLOGITEMS_SUCCESS: '@star/GET_BLOGITEMS_SUCCESS',
        GET_BLOGITEM_FAILURE: '@star/GET_BLOGITEM_FAILURE',
        GET_BLOGITEM_REQUEST: '@star/GET_BLOGITEM_REQUEST',
        GET_BLOGITEM_SUCCESS: '@star/GET_BLOGITEM_SUCCESS',
        PUT_BLOGITEM_FAILURE: '@star/PUT_BLOGITEM_FAILURE',
        PUT_BLOGITEM_REQUEST: '@star/PUT_BLOGITEM_REQUEST',
        PUT_BLOGITEM_SUCCESS: '@star/PUT_BLOGITEM_SUCCESS',
        PATCH_BLOGITEM_FAILURE: '@star/PATCH_BLOGITEM_FAILURE',
        PATCH_BLOGITEM_REQUEST: '@star/PATCH_BLOGITEM_REQUEST',
        PATCH_BLOGITEM_SUCCESS: '@star/PATCH_BLOGITEM_SUCCESS'
      })
    );
    expect(Object.keys(actions)).toEqual(['getBlogitem', 'getBlogitems', 'postBlogitem', 'putBlogitem', 'patchBlogitem', 'deleteBlogitem']);

    const initialState = { test: 'test' };
    expect(rootReducer(initialState, { type: 'unknown' })).toBe(initialState);
  });

  it('should override properly', () => {
    const { types, actions, rootReducer, rootSaga } = createStar({
      name: 'blogitem',
      url: 'http://localhost:5000/blogitems',
      override: {
        getBlogitem: {
          url: 'http://localhost:5000/blogitems'
        }
      }
    });
  });
});
