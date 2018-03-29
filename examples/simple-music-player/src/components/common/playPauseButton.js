import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Colors from '../../styles/colors';
import FontStyleSheet from '../../styles/fontStyleSheet';
import PropTypes from 'prop-types';
import { MediaPlayerStatus } from '../../constants/mediaPlayerStatus';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

class PlayPauseButton extends Component {
  renderIcon() {
    const { status, color, iconSize } = this.props;
    switch (status) {
      case MediaPlayerStatus.PLAYING:
        return (
          <Image
            style={{
              width: iconSize,
              height: iconSize
            }}
            source={require('../../images/pause.png')}
          />
        );
      default:
        return (
          <Image
            style={{
              width: iconSize,
              height: iconSize
            }}
            source={require('../../images/play.png')}
          />
        );
    }
  }
  render() {
    return (
      <TouchableOpacity style={[styles.container, this.props.style]} onPress={this.props.onPress}>
        {this.renderIcon()}
      </TouchableOpacity>
    );
  }
}

PlayPauseButton.propTypes = {
  iconSize: PropTypes.number,
  status: PropTypes.oneOf(Object.keys(MediaPlayerStatus)),
  onPress: PropTypes.func
};

PlayPauseButton.defaultProps = {
  iconSize: 64,
  status: MediaPlayerStatus.PAUSED
};

export default PlayPauseButton;
