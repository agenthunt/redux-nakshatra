import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import * as Posts from '../stars/posts';
import { bindActionCreators } from 'redux';
import CommonStyles from '../styles/commonStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  itemContainer: {
    width: 320,
    height: 320,
    margin: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  title: {
    fontSize: 24
  },
  content: {
    flex: 0.8,
    fontSize: 18,
    maxHeight: 250,
    overflow: 'hidden'
  },
  author: {
    fontSize: 18,
    fontStyle: 'bold'
  },
  section: {
    flex: 0.2,
    marginTop: 16,
    borderTopWidth: 1,
    borderColor: 'gray'
  },
  image: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  }
});

class PostsView extends Component {
  componentDidMount() {
    this.props.actions.getPosts();
  }

  renderItem(item, index, array) {
    return (
      <TouchableOpacity key={index}>
        <View style={[styles.itemContainer, CommonStyles.card]}>
          <Image
            source={{ uri: item.image, width: 320, height: 320 }}
            style={styles.image}
          />
          <View style={styles.section}>
            <Text numberOfLines={1} style={styles.title}>
              {item.title}
            </Text>
            <Text numberOfLines={1} style={styles.author}>
              {item.author}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.props.posts.items && this.props.posts.items.map(this.renderItem)}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    posts: state.posts
  };
};

const mapDispatchToProps = dispatch => {
  return { actions: bindActionCreators(Posts.actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostsView);
