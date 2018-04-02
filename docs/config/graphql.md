If you have a graphql backend, you can use graphql property of config to define graphql mutations and queries. For example

```js
import { createStar } from 'redux-nakshatra';
import { take, put } from 'redux-saga/effects';
import gql from 'graphql-tag';
import { apolloClient } from '../store/apolloClient';

export const { types, actions, rootReducer, rootSaga } = createStar({
  name: 'blogItem',
  log: true,
  graphql: {
    client: apolloClient,
    add: {
      getBlogItems: {
        query: gql`
          query {
            allBlogItems {
              id
              title
              author
              image
            }
          }
        `
      },
      getBlogItem: {},
      createBlogItem: {},
      updateBlogItem: {},
      removeBlogItem: {}
    }
  },
  reducer: function(state, action) {
    switch (action.type) {
      case types.updateBlogItem_SUCCESS: {
        const updatedIndex = state.getBlogItems.data.allBlogItems.findIndex(obj => action.response.data.updateBlogItem.id === obj.id);
        const newAllBlogItems = [...state.getBlogItems.data.allBlogItems];
        newAllBlogItems[updatedIndex] = action.response.data.updateBlogItem;
        const newGetBlogItems = {
          data: {
            allBlogItems: newAllBlogItems
          }
        };
        return {
          ...state,
          getBlogItems: {
            ...newGetBlogItems
          }
        };
      }
      case types.createBlogItem_SUCCESS: {
        const newAllBlogItems = [...state.getBlogItems.data.allBlogItems, action.response.data.createBlogItem];
        const newGetBlogItems = {
          data: {
            allBlogItems: newAllBlogItems
          }
        };
        return {
          ...state,
          getBlogItems: {
            ...newGetBlogItems
          }
        };
      }
      default:
        return state;
    }
  }
});
```

## How to invoke mutations

You can pass in mutation graphql query through the actions that are generated. For example for the `createBlogItem` action that is generated you can invoke it as follows

```js
const length = (this.props.blogItems.getBlogItems.data.allBlogItems && this.props.blogItems.getBlogItems.data.allBlogItems.length) || 0;
this.props.actions.createBlogItem({
  variables: {
    title: faker.lorem.words(),
    author: faker.name.findName(),
    author_image: faker.image.avatar(),
    release_date: faker.date.recent(),
    image: faker.image.nature(),
    short_description: faker.lorem.sentence(),
    long_description: faker.lorem.paragraphs(),
    id: length
  },
  mutation: gql`
    mutation createBlogItem(
      $title: String!
      $author: String!
      $author_image: String!
      $release_date: String!
      $image: String!
      $short_description: String!
      $long_description: String!
      $id: ID!
    ) {
      createBlogItem(
        title: $title
        author: $author
        author_image: $author_image
        release_date: $release_date
        image: $image
        short_description: $short_description
        long_description: $long_description
        id: $id
      ) {
        id
        title
        author
        author_image
        release_date
        image
        short_description
        long_description
      }
    }
  `
});
```
