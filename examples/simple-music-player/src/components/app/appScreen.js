import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CommonStyles from '../../styles/commonStyles';
import PlayPauseButton from '../common/playPauseButton';
import { MediaPlayerStatus } from '../../constants/mediaPlayerStatus';
import * as MediaPlayer from '../../stars/mediaPlayer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    margin: 80
  },
  trackItem: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    padding: 16
  },
  play: {
    width: 48,
    height: 48
  },
  title: {
    marginLeft: 20
  }
});

class App extends Component {
  renderPlayer() {
    return <View />;
  }

  renderTrack = (track, index, length) => {
    const { currentTrack, status } = this.props.mediaPlayer;
    const playStatus = currentTrack && currentTrack.id === track.id ? status : MediaPlayerStatus.PAUSED;
    return (
      <View key={index} style={[CommonStyles.card, styles.trackItem]}>
        <PlayPauseButton status={playStatus} onPress={() => this.props.actions.playPause(track)} iconSize={48} />
        <Text style={styles.title}>
          {track.title} - {track.file}
        </Text>
      </View>
    );
  };

  render() {
    const { tracks } = this.props.mediaPlayer;
    return (
      <View style={[styles.container, CommonStyles.card, this.props.style]}>
        {this.renderPlayer()}
        <ScrollView>{tracks.map(this.renderTrack)}</ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    mediaPlayer: state.mediaPlayer
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(
      {
        ...MediaPlayer.actions
      },
      dispatch
    )
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
