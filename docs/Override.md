Consider the following example

```js
export { rootSaga, types, actions, rootReducer }  = createStar({
  name: 'post',
  starType: StarTypes.REST, // default is StarTypes.REST
  url: 'http://localhost:5000/posts',
  override: {
    getPost: {
      method: 'get',
      url: 'http://localhost:5000/posts',
    }
  }
})
```

The interpretation of url is as follows

* plural GET requests will use url as defined in the config object i.e `http://localhost:5000/posts`
* POST request will use url as `http://localhost:5000/posts`
* PATCH request will url as `http://localhost:5000/posts/:id`
* DELETE request will url as `http://localhost:5000/posts/:id`
* singular GET request will url as `http://localhost:5000/posts` (Since this has been overridden)
