The `http` config property is to define your server API information to generate STAR.

Let’s say you want to fetch a list of items through a HTTP GET call, you can do something like

```js
import { createStar } from 'redux-nakshatra';

export const { rootSaga, types, actions, rootReducer } = createStar({
  name: 'users',
  http: {
    url: 'http://localhost:5000/users',
    add: {
      getUsers: {
        method: 'get'
      }
    }
  }
});
```

which internally generates the boilerplate as shown below(some details omitted for brevity).

```js
import { take, call, put, all, fork } from 'redux-saga/effects';
import axios from 'axios';

const types = {
  getUsers_REQUEST: '@star/users/getUsers_REQUEST',
  getUsers_SUCCESS: '@star/users/getUsers_SUCCESS',
  getUsers_FAILURE: '@star/users/getUsers_FAILURE'
};

const actions = {
  getUsers: function(obj) {
    return {
      type: '@star/users/getUsers_REQUEST',
      obj
    };
  }
};

const initialState = {
  getUsers: {
    loading: false,
    data: null,
    error: null
  }
};

const reducers = {
  '@star/users/getUsers_REQUEST': function(state = initialState, action) {
    return {
      ...state,
      getUsers: {
        ...state.getUsers,
        loading: true,
        error: null
      }
    };
  },
  '@star/users/getUsers_SUCCESS': function(state = initialState, action) {
    return {
      ...state,
      getUsers: {
        ...state.getUsers,
        loading: false,
        data: action.response
      }
    };
  },
  '@star/users/getUsers_FAILURE': function(state = initialState, action) {
    return {
      ...state,
      getUsers: {
        ...state.getUsers,
        loading: false,
        error: action.response
      }
    };
  }
};

function rootReducer(state = initialState, action) {
  let newState = state;

  const selectedReducer = reducers[action.type];
  if (selectedReducer) {
    newState = selectedReducer(state, action);
  }
  return newState;
}

export function* watchGetUsersRequestSaga() {
  while (true) {
    try {
      const request = yield take('@star/users/getUsers_REQUEST');
      const result = yield call(() =>
        axios({
          method: 'get',
          url: 'http://localhost:5000/users'
        })
      );
      if (result.status !== 200 && result.status !== 201) {
        throw result;
      }
      yield put({
        type: '@star/users/getUsers_SUCCESS',
        response: result
      });
    } catch (error) {
      yield put({
        type: '@star/users/getUsers_FAILURE',
        response: error
      });
    }
  }
}

function* rootSaga(args) {
  yield all([watchGetUsersRequestSaga]);
}
```

## Configure Store

You can connect the users STAR to the redux store similar to as shown below

```js
...
...
import * as Users from '../stars/users';
const appReducer = combineReducers({
  users: Users.rootReducer
});

function* rootSaga(args) {
  yield fork(Users.rootSaga, args);
}

const enhancer = composeEnhancers(applyMiddleware(...middlewares));

export default function configureStore() {
  const store = createStore(appReducer, {}, enhancer);
  sagaMiddleware.run(rootSaga, store.dispatch);
  return store;
}

...
...
```

Lets say you add more endpoints like POST, UPDATE, DELETE, PATCH and PUT like

```js
import { createStar } from 'redux-nakshatra';

export const { rootSaga, types, actions, rootReducer } = createStar({
  name: 'users',
  http: {
    url: 'http://localhost:5000/users',
    add: {
      getUsers: {
        method: 'get'
      },
      postUser: {
        method: 'post'
      },
      patchUser: {
        method: 'patch'
      },
      deleteUser: {
        method: 'delete'
      },
      putUser: {
        method: 'put'
      }
    }
  }
});
```

## generateDefault

You can imagine the amount of code you would have to write for this.
A even more handy property that you can provide is `generateDefault: true` and if you follow the REST pluralized conventions such as

```js
GET: 'http://localhost:5000/users'; //returns all users
GET: 'http://localhost:5000/users/:id'; //returns a user
POST: 'http://localhost:5000/users'; // creates a new user
DELETE: 'http://localhost:5000/users/:id'; // deletes a user
PATCH: 'http://localhost:5000/users/:id'; // patches a user
PUT: 'http://localhost:5000/users/:id'; // replaces a user
```

you can just use the following configuration

```js
import { createStar } from 'redux-nakshatra';

export const { rootSaga, types, actions, rootReducer } = createStar({
  name: 'users',
  http: {
    url: 'http://localhost:5000/users',
    generateDefault: true
  }
});
```

##override
Not all APIs follow the same convention and when you need to change something small, you can use the override property

```js
import { createStar } from 'redux-nakshatra';

export const { rootSaga, types, actions, rootReducer } = createStar({
  name: 'users',
  http: {
    url: 'http://localhost:5000/users',
    generateDefault: true,
    override: {
      getUser: {
        url: 'http://localhost:5000/user/:id'
      }
    }
  }
});
```

You can also add more endpoints along with default.

```js
import { createStar } from 'redux-nakshatra';

export const { rootSaga, types, actions, rootReducer } = createStar({
  name: 'users',
  http: {
    url: 'http://localhost:5000/users',
    generateDefault: true,
    add: {
      findUsersByLastName: {
        method: 'get'
      }
    }
  }
});

// And Provide query params when invoking the action
actions.findUsersByLastName({
  params: {
    lastName: 'Andersson'
  }
});
```

Note: This library currently is dependent on axios for http requests. So the redux actions generated for http takes axios config parameters (Not all of them yet)
