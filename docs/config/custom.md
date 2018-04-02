And sometimes you need to write a fully custom saga may be aggregating data from different end points (http, graphql or local state or anything) In this case, you can do something similar as shown below

```js
import { take, call, put, all, fork, race, select } from 'redux-saga/effects';
import { createStar } from 'redux-nakshatra';
import axios from 'axios';

export const { rootSaga, types, actions, rootReducer } = createStar({
  name: 'users',
  http: {
    url: 'http://localhost:5000/users',
    generateDefault: true
  },
  custom: {
    getUsersAndFriends: {
      saga: function* watchGetUsersAndFriendsRequestSaga(dispatch) {
        while (true) {
          const request = yield take(types.getUsersAndFriends_REQUEST);
          try {
            yield put({
              type: types.getUsers_REQUEST
            });

            yield race([types.getUsers_SUCCESS, types.getUsers_FAILURE]);
            const getUsers = yield select(state => state.getUsers);
            const userIds = getUsers.data.map(o => o.id);
            const getFriendsForUsers = yield call(() =>
              axios({
                url: 'http://localhost:5000/friends',
                data: {
                  userIds
                }
              })
            );
            const result = getUsers.data.map((user, index) => {
              return {
                ...user,
                friend: getFriendsForUsers.data[index]
              };
            });
            yield put({
              type: types.getUsersAndFriends_SUCCESS,
              response: result
            });
          } catch (error) {
            yield put({
              type: types.getUsersAndFriends_FAILURE,
              response: error
            });
          }
        }
      }
    }
  }
});
```

If you need more low level control, you can add more actions, types, initialState, reducer, sagas separately as well. Example

```js
import { createStar } from 'redux-nakshatra';
import { take, put, race, select } from 'redux-saga/effects';
import { MediaPlayerStatus } from '../constants/mediaPlayerStatus';
import { Howl } from 'howler';

const MediaPlayerActionTypes = {
  playPause_REQUEST: 'playPause_REQUEST',
  playPause_SUCCESS: 'playPause_SUCCESS',
  playPause_FAILURE: 'playPause_FAILURE',
  updateCurrentTrack_REQUEST: 'updateCurrentTrack_REQUEST',
  updateCurrentTrack_SUCCESS: 'updateCurrentTrack_SUCCESS',
  updateCurrentTrack_FAILURE: 'updateCurrentTrack_FAILURE',
  updateStatus: 'updateStatus'
};

const initialState = {
  status: MediaPlayerStatus.PAUSED,
  currentTrack: null,
  updateCurrentTrackFailureMessage: null,
  updateCurrentTrackInProgress: true,
  isLoopingCurrentTrack: false,
  tracks: [
    {
      id: 1,
      title: 'Rave Digger',
      file: 'rave_digger',
      howl: null
    },
    {
      id: 2,
      title: '80s Vibe',
      file: '80s_vibe',
      howl: null
    },
    {
      id: 3,
      title: 'Running Out',
      file: 'running_out',
      howl: null
    }
  ]
};

export const { rootSaga, types, actions, rootReducer } = createStar({
  name: 'mediaPlayer',
  types: MediaPlayerActionTypes,
  actions: {
    updateCurrentTrack(track) {
      return {
        type: MediaPlayerActionTypes.updateCurrentTrack_REQUEST,
        track
      };
    },
    playPause(track) {
      return {
        type: MediaPlayerActionTypes.playPause_REQUEST,
        track
      };
    },
    updateMediaPlayerStatus(status) {
      return {
        type: MediaPlayerActionTypes.updateStatus,
        status
      };
    }
  },
  initialState,
  reducer(state = initialState, action) {
    switch (action.type) {
      case MediaPlayerActionTypes.updateStatus: {
        return {
          ...state,
          status: action.status
        };
      }
      case MediaPlayerActionTypes.updateCurrentTrack_REQUEST: {
        return {
          ...state,
          updateCurrentTrackFailureMessage: null,
          updateCurrentTrackInProgress: true
        };
      }
      case MediaPlayerActionTypes.updateCurrentTrack_SUCCESS: {
        return {
          ...state,
          currentTrack: action.track,
          updateCurrentTrackInProgress: false
        };
      }
      case MediaPlayerActionTypes.updateCurrentTrack_FAILURE: {
        return {
          ...state,
          updateCurrentTrackFailureMessage: action.response,
          updateCurrentTrackInProgress: false
        };
      }
      default:
        return state;
    }
  },
  sagas: {
    *watchUpdateCurrentTrackRequest(dispatch) {
      while (true) {
        const request = yield take(MediaPlayerActionTypes.updateCurrentTrack_REQUEST);

        const track = {
          ...request.track,
          howl: new Howl({
            src: ['./audio/' + request.track.file + '.webm', './audio/' + request.track.file + '.mp3'],
            volume: 1,
            html5: true,
            onplay: function() {
              dispatch({
                type: types.updateStatus,
                status: MediaPlayerStatus.PLAYING
              });
            },
            onload: function() {
              dispatch({
                type: types.updateStatus,
                status: MediaPlayerStatus.LOADED
              });
            },
            onend: function() {
              dispatch({
                type: types.updateStatus,
                status: MediaPlayerStatus.ENDED
              });
            },
            onpause: function() {
              dispatch({
                type: types.updateStatus,
                status: MediaPlayerStatus.PAUSED
              });
            },
            onstop: function() {
              dispatch({
                type: types.updateStatus,
                status: MediaPlayerStatus.STOPPED
              });
            }
          })
        };
        try {
          yield put({
            type: MediaPlayerActionTypes.updateCurrentTrack_SUCCESS,
            track
          });
        } catch (error) {
          console.log(error);
          yield put({
            type: MediaPlayerActionTypes.updateCurrentTrack_FAILURE,
            response: error
          });
        }
      }
    },
    *watchPlayPauseRequestSaga() {
      while (true) {
        const request = yield take(MediaPlayerActionTypes.playPause_REQUEST);
        try {
          const currentTrack = yield select(state => state.mediaPlayer.currentTrack);
          if (currentTrack === null || (currentTrack && currentTrack.id !== request.track.id)) {
            if (currentTrack) {
              currentTrack.howl.pause();
            }

            yield put({
              type: MediaPlayerActionTypes.updateCurrentTrack_REQUEST,
              track: request.track
            });
            yield race([take(MediaPlayerActionTypes.updateCurrentTrack_SUCCESS), take(MediaPlayerActionTypes.updateCurrentTrack_FAILURE)]);

            const updateCurrentTrackFailureMessage = yield select(state => state.mediaPlayer.updateCurrentTrackFailureMessage);
            if (updateCurrentTrackFailureMessage) {
              throw updateCurrentTrackFailureMessage;
            } else {
              const updatedCurrentTrack = yield select(state => state.mediaPlayer.currentTrack);
              updatedCurrentTrack.howl.play();
            }
          }

          if (currentTrack && currentTrack.id === request.track.id) {
            const status = yield select(state => state.mediaPlayer.status);
            if (status === MediaPlayerStatus.PLAYING) {
              currentTrack.howl.pause();
            } else {
              currentTrack.howl.play();
            }
          }

          yield put({
            type: MediaPlayerActionTypes.playPause_SUCCESS
          });
        } catch (error) {
          yield put({
            type: MediaPlayerActionTypes.playPause_FAILURE,
            response: error
          });
        }
      }
    }
  }
});
```
