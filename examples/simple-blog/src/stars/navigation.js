import { createStar, StarTypes } from 'redux-nakshatra';

export const { types, actions, rootReducer, rootSaga } = createStar({
  name: 'navigation',
  starType: StarTypes.CUSTOM,
  types: {
    NAVIGATE_TO: 'NAVIGATE_TO'
  },
  actions: {
    navigateTo(route) {
      return {
        type: 'NAVIGATE_TO',
        route
      };
    }
  },
  initialState: {
    route: {
      id: 'postsView'
    }
  },
  reducer(state, action) {
    switch (action.type) {
      case 'NAVIGATE_TO':
        return {
          ...state,
          route: action.route
        };
      default:
        return state;
    }
  }
});
