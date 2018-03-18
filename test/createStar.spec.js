import { createStar } from '../';

describe('createStar', () => {
  it('exposes the public API', () => {
    const { types, actions, rootReducer, rootSaga } = createStar({
      name: 'blogItem',
      http: {
        generateDefault: true,
        url: 'http://localhost:5000/blogitems'
      }
    });

    expect(types).toEqual(
      expect.objectContaining({
        postBlogItem_FAILURE: '@star/blogItem/postBlogItem_FAILURE',
        postBlogItem_REQUEST: '@star/blogItem/postBlogItem_REQUEST',
        postBlogItem_SUCCESS: '@star/blogItem/postBlogItem_SUCCESS',
        deleteBlogItem_FAILURE: '@star/blogItem/deleteBlogItem_FAILURE',
        deleteBlogItem_REQUEST: '@star/blogItem/deleteBlogItem_REQUEST',
        deleteBlogItem_SUCCESS: '@star/blogItem/deleteBlogItem_SUCCESS',
        getBlogItems_FAILURE: '@star/blogItem/getBlogItems_FAILURE',
        getBlogItems_REQUEST: '@star/blogItem/getBlogItems_REQUEST',
        getBlogItems_SUCCESS: '@star/blogItem/getBlogItems_SUCCESS',
        getBlogItem_FAILURE: '@star/blogItem/getBlogItem_FAILURE',
        getBlogItem_REQUEST: '@star/blogItem/getBlogItem_REQUEST',
        getBlogItem_SUCCESS: '@star/blogItem/getBlogItem_SUCCESS',
        putBlogItem_FAILURE: '@star/blogItem/putBlogItem_FAILURE',
        putBlogItem_REQUEST: '@star/blogItem/putBlogItem_REQUEST',
        putBlogItem_SUCCESS: '@star/blogItem/putBlogItem_SUCCESS',
        patchBlogItem_FAILURE: '@star/blogItem/patchBlogItem_FAILURE',
        patchBlogItem_REQUEST: '@star/blogItem/patchBlogItem_REQUEST',
        patchBlogItem_SUCCESS: '@star/blogItem/patchBlogItem_SUCCESS'
      })
    );
    expect(Object.keys(actions)).toEqual(['getBlogItem', 'getBlogItems', 'postBlogItem', 'patchBlogItem', 'putBlogItem', 'deleteBlogItem']);

    const initialState = { test: 'test' };
    expect(rootReducer(initialState, { type: 'unknown' })).toBe(initialState);
  });
});
