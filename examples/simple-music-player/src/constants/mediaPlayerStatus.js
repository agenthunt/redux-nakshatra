export const MediaPlayerStatus = {
  UNLOADED: 'UNLOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  ENDED: 'ENDED',
  STOPPED: 'STOPPED'
};

export function convertHowlLoadedStateToMediaPlayerStatus(state) {
  if (state === 'unloaded') {
    return MediaPlayerStatus.UNLOADED;
  }
  if (state === 'loading') {
    return MediaPlayerStatus.LOADING;
  }
  if (state === 'loaded') {
    return MediaPlayerStatus.LOADED;
  }
}
