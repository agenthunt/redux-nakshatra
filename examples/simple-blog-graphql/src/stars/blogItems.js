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
      // case types.removeBlogItem_SUCCESS: {
      //   const toRemoveIndex = state.getBlogItems.data.allBlogItems.findIndex(obj => action.response.data.updateBlogItem.id === obj.id);
      //   const newAllBlogItems = [...state.getBlogItems.data.allBlogItems];
      //   newAllBlogItems.splice(toRemoveIndex, 1);
      //   const newGetBlogItems = {
      //     data: {
      //       allBlogItems: newAllBlogItems
      //     }
      //   };
      //   return {
      //     ...state,
      //     getBlogItems: {
      //       ...newGetBlogItems
      //     }
      //   };
      // }
      default:
        return state;
    }
  }
});
