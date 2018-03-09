import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import * as Posts from '../stars/posts';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CommonStyles from '../styles/commonStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemContainer: {
    width: 320,
    height: 320,
    margin: 20,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'black'
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
    alignSelf: 'stretch'
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    opacity: 0.4,
    alignItems: 'center'
  },
  image: {}
});

class PostsDetailedView extends Component {
  componentDidMount() {
    this.props.actions.getPost({
      pathParams: {
        id: this.props.params.id
      }
    });
  }

  render() {
    const { data, loading, error } = this.props.posts.getPost;
    if ((loading || data === null) && error === null) {
      return <ActivityIndicator size="large" />;
    }

    return (
      <View style={[styles.container]}>
        <Text> POSTS DETAILED VIEW </Text>
        <Image source={{ uri: data.data.image, width: 600, height: 400 }} style={styles.image} />
        <Text numberOfLines={1} style={styles.title}>
          {data.data.title}
        </Text>
        <Text numberOfLines={1} style={styles.author}>
          {data.data.author}
        </Text>
        <Text style={styles.description}>{data.long_description}</Text>
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
  return {
    actions: bindActionCreators({ ...Posts.actions }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostsDetailedView);
