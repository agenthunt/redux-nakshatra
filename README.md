Under development

redux-nakshatra is a small redux addon library that generates redux boilerplate based on configuration.

Sagas ([redux-saga](https://redux-saga.js.org/) , Types, Actions, Reducers (STAR aka nakshatra) are the main building blocks of this library

[![build status](https://img.shields.io/travis/agenthunt/redux-nakshatra/master.svg?style=flat-square)](https://travis-ci.org/agenthunt/redux-nakshatra)
[![npm version](https://img.shields.io/npm/v/redux-nakshatra.svg?style=flat-square)](https://www.npmjs.com/package/redux-nakshatra)
[![npm downloads](https://img.shields.io/npm/dm/redux-nakshatra.svg?style=flat-square)](https://www.npmjs.com/package/redux-nakshatra)

## Installation

To install the stable version:

```
npm install --save redux-nakshatra
```

or

```
yarn add redux-nakshatra
```

# Peer dependencies

Install the following packages

* redux-saga
* axios

## Quick start

* Sagas, Types, Actions, Reducers (STAR aka nakshatra) are the main building
  blocks of this library. All these are generated based on a config that you
  describe using the `createStar` function

```js
import { createStar } from 'redux-nakshatra';

export const { types, actions, rootReducer, rootSaga } = createStar({
  name: 'blogItem',
  http: {
    generateDefault: true,
    url: 'http://localhost:5000/blogitems'
  }
});
```

* `generateDefault: true` will generate 6 different HTTP redux actions

  * `getBlogItem(obj)`
  * `getBlogItems(obj)`
  * `postBlogItem(obj)`
  * `patchBlogItem(obj)`
  * `putBlogItem(obj)`
  * `patchBlogItem(obj)`

* You can then use in your redux store configuration as below.

```js
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { fork } from 'redux-saga/effects';
import * as BlogItems from '../stars/blogItems';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

const appReducer = combineReducers({
  blogItems: BlogItems.rootReducer
});

function* rootSaga() {
  yield fork(BlogItems.rootSaga);
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
import * as BlogItems from '../stars/blogItems';
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

class BlogItemsScreen extends Component {
  componentWillMount() {
    this.props.actions.getBlogItems();
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
    const { loading, error, data } = this.props;
    return (
      <View style={[styles.container, this.props.style]}>
        {this.renderItem({ title: 'Title', author: 'Author' }, -1)}
        {data && data.map(this.renderItem)}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.blogItems.getBlogItems
  };
};

const mapDispatchToProps = dispatch => {
  return { actions: bindActionCreators(BlogItems.actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(BlogItemsScreen);
```

## Documentation

* [http](http://redux-nakshatra.js.org/docs/config/http.html)
* [graphql](http://redux-nakshatra.js.org/docs/config/graphql.html)
* [custom](http://redux-nakshatra.js.org/docs/config/custom.html)
* [API Reference](http://redux-nakshatra.js.org/docs/api/index.html)

## Examples

* [Simple Blog Http](https://github.com/agenthunt/redux-nakshatra/tree/master/examples/simple-blog)
* [Simple Blog Graphql](https://github.com/agenthunt/redux-nakshatra/tree/master/examples/simple-blog-graphql)
* [Simple Music Player](https://github.com/agenthunt/redux-nakshatra/tree/master/examples/simple-music-player)

## License

MIT

## Influences

[redux-rest-resource](http://mgcrea.github.io/redux-rest-resource/)
