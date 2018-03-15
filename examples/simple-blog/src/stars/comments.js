import { createStar } from 'redux-nakshatra';

export const { types, actions, rootReducer, rootSaga } = createStar({
  name: 'comment',
  http: {
    url: 'http://localhost:5000/comments'
  }
});
