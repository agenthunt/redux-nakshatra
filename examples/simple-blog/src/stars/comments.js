import { createStar } from 'redux-nakshatra'

export const { types, actions, rootReducer, rootSaga } = createStar({
  name: 'comment',
  url: 'http://localhost:5000/comments'
})
