Consider the following example

```js
import { createStar } from 'redux-nakshatra'

export { rootSaga, types, actions, rootReducer }  = createStar({
  name: 'blogItem',
  http: {
    generateDefault: true,
    url: 'http://localhost:5000/blogitems'
  }
});
```

Fot the default generated HTTP redux actions, the interpretation of url is as follows as long as any of the standard actions are not overridden. For overriding See [override](/docs/Override.md)

* plural GET requests will use url as defined in the config object i.e `http://localhost:5000/blogitems`
* POST request will use url as `http://localhost:5000/blogitems`
* PATCH request will url as `http://localhost:5000/blogitems/:id`
* DELETE request will url as `http://localhost:5000/blogitems/:id`
* singular GET request will url as `http://localhost:5000/blogitems/:id`

The value of id can be provided in the action object
For ex:

```js
Posts.actions.getPost({
  pathParams: {
    id: 123
  }
});

Posts.actions.deletePost({
  pathParams: {
    id: 123
  }
});

Posts.actions.updatePost({
  pathParams: {
    id: 123
  },
  data: {
    title: 'Updated title',
    author: 'Neve'
  }
});
```

The `name` value in the config object will be used to generate the following

* Types

```js
const GET_POST_REQUEST = '@star/GET_POST_REQUEST';
const GET_POST_SUCCESS = '@star/GET_POST_SUCCESS';
const GET_POST_FAILURE = '@star/GET_POST_FAILURE';
const GET_POSTS_REQUEST = '@star/GET_POSTS_REQUEST';
const GET_POSTS_SUCCESS = '@star/GET_POSTS_SUCCESS';
const GET_POSTS_FAILURE = '@star/GET_POSTS_FAILURE';
const CREATE_POST_REQUEST = '@star/CREATE_POST_REQUEST';
const CREATE_POST_SUCCESS = '@star/CREATE_POST_SUCCESS';
const CREATE_POST_FAILURE = '@star/CREATE_POST_FAILURE';
const UPDATE_POST_REQUEST = '@star/UPDATE_POST_REQUEST';
const UPDATE_POST_SUCCESS = '@star/UPDATE_POST_SUCCESS';
const UPDATE_POST_FAILURE = '@star/UPDATE_POST_FAILURE';
const DELETE_POST_REQUEST = '@star/DELETE_POST_REQUEST';
const DELETE_POST_SUCCESS = '@star/DELETE_POST_SUCCESS';
const DELETE_POST_FAILURE = '@star/DELETE_POST_FAILURE';
```

* Actions

```js
function createPost(obj) {
  return {
    type: '@star/CREATE_POST_REQUEST'
  };
}
function deletePost(obj) {
  return {
    type: '@star/DELETE_POST_REQUEST'
  };
}
function getPost(obj) {
  return {
    type: '@star/GET_POST_REQUEST'
  };
}
function getPosts(obj) {
  return {
    type: '@star/GET_POSTS_REQUEST'
  };
}
function updatePost(obj) {
  return {
    type: '@star/UPDATE_POST_REQUEST'
  };
}
```

* Sagas

Simplified code shown here for illustration.

```js
function* watchCreatePostRequestSaga() {
    while (true) {
      const request = yield take('@star/CREATE_POST_REQUEST');
      try {
        const result = yield call(() => axios.post(...)); //
            .....
        if (result.status !== 200) {
          throw result;
        }
        yield put({
          type: '@star/CREATE_POST_SUCCESS',
          response:
            (transformResponse && transformResponse(result)) || result
        });
      } catch (error) {
        log && console.error(error);
        yield put({
          type: '@star/CREATE_POST_FAILURE',
          response: error
        });
      }
    }
  }
}
function* watchDeletePostRequestSaga() {
    while (true) {
      const request = yield take('@star/DELETE_POST_REQUEST');
      try {
        const result = yield call(() => axios.delete(...)); //
            .....
        if (result.status !== 200) {
          throw result;
        }
        yield put({
          type: '@star/DELETE_POST_SUCCESS',
          response:
            (transformResponse && transformResponse(result)) || result
        });
      } catch (error) {
        log && console.error(error);
        yield put({
          type: '@star/DELETE_POST_FAILURE',
          response: error
        });
      }
    }
  }
}
function* watchGetPostRequestSaga() {
    while (true) {
      const request = yield take('@star/GET_POST_REQUEST');
      try {
        const result = yield call(() => axios.get(...)); //
            .....
        if (result.status !== 200) {
          throw result;
        }
        yield put({
          type: '@star/GET_POST_SUCCESS',
          response:
            (transformResponse && transformResponse(result)) || result
        });
      } catch (error) {
        log && console.error(error);
        yield put({
          type: '@star/GET_POST_FAILURE',
          response: error
        });
      }
    }
  }
}
function* watchGetPostsRequestSaga() {
    while (true) {
      const request = yield take('@star/GET_POSTS_REQUEST');
      try {
        const result = yield call(() => axios.get(...)); //
            .....
        if (result.status !== 200) {
          throw result;
        }
        yield put({
          type: '@star/GET_POSTS_SUCCESS',
          response:
            (transformResponse && transformResponse(result)) || result
        });
      } catch (error) {
        log && console.error(error);
        yield put({
          type: '@star/GET_POSTS_FAILURE',
          response: error
        });
      }
    }
  }
}
function* watchUpdatePostRequestSaga() {
    while (true) {
      const request = yield take('@star/UPDATE_POST_REQUEST');
      try {
        const result = yield call(() => axios.patch(...)); //
            .....
        if (result.status !== 200) {
          throw result;
        }
        yield put({
          type: '@star/UPDATE_POST_SUCCESS',
          response:
            (transformResponse && transformResponse(result)) || result
        });
      } catch (error) {
        log && console.error(error);
        yield put({
          type: '@star/UPDATE_POST_FAILURE',
          response: error
        });
      }
    }
  }

}
```
