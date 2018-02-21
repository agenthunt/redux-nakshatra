Under development

redux-nakshatra is a redux addon library that reduces redux boiler plate. This library
aims to automate most of them with a set of opiniated conventions. Generates Sagas, Types, Actions, Reducers (STAR aka nakshatra)

[![build status](https://img.shields.io/travis/agenthunt/redux-nakshatra/master.svg?style=flat-square)](https://travis-ci.org/agenthunt/redux-nakshatra)
[![npm version](https://img.shields.io/npm/v/redux-nakshatra.svg?style=flat-square)](https://www.npmjs.com/package/redux-nakshatra)
[![npm downloads](https://img.shields.io/npm/dm/redux-nakshatra.svg?style=flat-square)](https://www.npmjs.com/package/redux-nakshatra)

## Influences

This library is inspired from
[redux-rest-resource](http://mgcrea.github.io/redux-rest-resource/)

## Installation

To install the stable version:

```
npm install --save redux-nakshatra
```

This assumes you are using [npm](https://www.npmjs.com/) as your package
manager.

## Quick start

* Sagas, Types, Actions, Reducers (STAR aka nakshatra) are the main building
  blocks of this library. All these are generated based on a config that you
  describe using the `createStar` function

```js
import { createStar } from 'redux-nakshatra'

export { rootSaga, types, actions, rootReducer }  = createStar({
  name: 'post',
  type: 'rest',
  url: 'http://localhost:5000/posts'
})
```

* You can use in your redux store configuration now. For example

```js
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { fork } from 'redux-saga/effects';
import * as Posts from '../stars/posts';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

const appReducer = combineReducers({
  posts: Posts.rootReducer
});

function* rootSaga() {
  yield fork(Posts.rootSaga);
}

const enhancer = composeEnhancers(applyMiddleware(...middlewares));

export default function configureStore() {
  const store = createStore(appReducer, {}, enhancer);
  sagaMiddleware.run(rootSaga);
  return store;
}
```

* And a component that wants to render these can be something like

```js
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import * as Posts from '../stars/posts';
import { bindActionCreators } from 'redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemContainer: {
    flexDirection: 'row'
  }
});

class PostsView extends Component {
  componentWillMount() {
    this.props.actions.getPosts();
  }

  renderItem(item, index, array) {
    return (
      <View style={styles.itemContainer} key={index}>
        <Text style={{ flex: 1 }}>{item.title}</Text>
        <Text style={{ flex: 1 }}>{item.author}</Text>
      </View>
    );
  }
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.renderItem({ title: 'Title', author: 'Author' }, -1)}
        {this.props.posts.items && this.props.posts.items.map(this.renderItem)}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    posts: state.posts
  };
};

const mapDispatchToProps = dispatch => {
  return { actions: bindActionCreators(Posts.actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostsView);
```

## Documentation

* [Detailed](http://redux-nakshatra.js.org/docs/Detailed.html)
* [Troubleshooting](http://redux-nakshatra.js.org/docs/Troubleshooting.html)
* [API Reference](http://redux-nakshatra.js.org/docs/api/index.html)

## Examples

Almost all examples have a corresponding CodeSandbox sandbox. This is an
interactive version of the code that you can play with online.

* [Simple Blog](http://redux-nakshatra.js.org/docs/introduction/Examples.html#simple-blog)
  ([source](https://github.com/agenthunt/redux/tree/master/examples/simple-blog))

## License

MIT

## Todo

* [] Option to bring in your http library
