import { createStar, StarTypes } from '../';
import { take } from 'redux-saga/effects';

describe('createStar', () => {
  it('exposes the public API', () => {
    const { types, actions, rootReducer, rootSaga } = createStar({
      name: 'post',
      url: 'http://localhost:5000/posts'
    });

    expect(types).toEqual(
      expect.objectContaining({
        CREATE_POST_FAILURE: '@star/CREATE_POST_FAILURE',
        CREATE_POST_REQUEST: '@star/CREATE_POST_REQUEST',
        CREATE_POST_SUCCESS: '@star/CREATE_POST_SUCCESS',
        DELETE_POST_FAILURE: '@star/DELETE_POST_FAILURE',
        DELETE_POST_REQUEST: '@star/DELETE_POST_REQUEST',
        DELETE_POST_SUCCESS: '@star/DELETE_POST_SUCCESS',
        GET_POSTS_FAILURE: '@star/GET_POSTS_FAILURE',
        GET_POSTS_REQUEST: '@star/GET_POSTS_REQUEST',
        GET_POSTS_SUCCESS: '@star/GET_POSTS_SUCCESS',
        GET_POST_FAILURE: '@star/GET_POST_FAILURE',
        GET_POST_REQUEST: '@star/GET_POST_REQUEST',
        GET_POST_SUCCESS: '@star/GET_POST_SUCCESS',
        UPDATE_POST_FAILURE: '@star/UPDATE_POST_FAILURE',
        UPDATE_POST_REQUEST: '@star/UPDATE_POST_REQUEST',
        UPDATE_POST_SUCCESS: '@star/UPDATE_POST_SUCCESS'
      })
    );
    expect(Object.keys(actions)).toEqual([
      'getPost',
      'getPosts',
      'createPost',
      'updatePost',
      'deletePost'
    ]);

    const initialState = { test: 'test' };
    expect(rootReducer(initialState, { type: 'unknown' })).toBe(initialState);
  });

  it('should override properly', () => {
    const { types, actions, rootReducer, rootSaga } = createStar({
      name: 'post',
      url: 'http://localhost:5000/posts',
      override: {
        getPost: {
          url: 'http://localhost:5000/posts'
        }
      }
    });
  });
});
