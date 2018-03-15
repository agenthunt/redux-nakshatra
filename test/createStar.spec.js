import { createStar, StarTypes } from '../';
import { take } from 'redux-saga/effects';

describe('createStar', () => {
  it('exposes the public API', () => {
    const { types, actions, rootReducer, rootSaga } = createStar({
      name: 'blogItem',
      http: {
        url: 'http://localhost:5000/blogitems'
      }
    });

    expect(types).toEqual(
      expect.objectContaining({
        POSTBLOGITEM_FAILURE: '@star/POSTBLOGITEM_FAILURE',
        POSTBLOGITEM_REQUEST: '@star/POSTBLOGITEM_REQUEST',
        POSTBLOGITEM_SUCCESS: '@star/POSTBLOGITEM_SUCCESS',
        DELETEBLOGITEM_FAILURE: '@star/DELETEBLOGITEM_FAILURE',
        DELETEBLOGITEM_REQUEST: '@star/DELETEBLOGITEM_REQUEST',
        DELETEBLOGITEM_SUCCESS: '@star/DELETEBLOGITEM_SUCCESS',
        GETBLOGITEMS_FAILURE: '@star/GETBLOGITEMS_FAILURE',
        GETBLOGITEMS_REQUEST: '@star/GETBLOGITEMS_REQUEST',
        GETBLOGITEMS_SUCCESS: '@star/GETBLOGITEMS_SUCCESS',
        GETBLOGITEM_FAILURE: '@star/GETBLOGITEM_FAILURE',
        GETBLOGITEM_REQUEST: '@star/GETBLOGITEM_REQUEST',
        GETBLOGITEM_SUCCESS: '@star/GETBLOGITEM_SUCCESS',
        PUTBLOGITEM_FAILURE: '@star/PUTBLOGITEM_FAILURE',
        PUTBLOGITEM_REQUEST: '@star/PUTBLOGITEM_REQUEST',
        PUTBLOGITEM_SUCCESS: '@star/PUTBLOGITEM_SUCCESS',
        PATCHBLOGITEM_FAILURE: '@star/PATCHBLOGITEM_FAILURE',
        PATCHBLOGITEM_REQUEST: '@star/PATCHBLOGITEM_REQUEST',
        PATCHBLOGITEM_SUCCESS: '@star/PATCHBLOGITEM_SUCCESS'
      })
    );
    expect(Object.keys(actions)).toEqual(['getBlogItem', 'getBlogItems', 'postBlogItem', 'patchBlogItem', 'putBlogItem', 'deleteBlogItem']);

    const initialState = { test: 'test' };
    expect(rootReducer(initialState, { type: 'unknown' })).toBe(initialState);
  });
});
