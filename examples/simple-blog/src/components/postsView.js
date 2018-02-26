import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import * as Posts from '../stars/posts';
import { bindActionCreators } from 'redux';
import CommonStyles from '../styles/commonStyles';
import faker from 'faker';

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
  image: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  },
  deleteUpdateContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row'
  }
});

class PostsView extends Component {
  componentDidMount() {
    this.props.actions.getPosts();
  }
  deletePost = item => {
    this.props.actions.deletePost({
      url: `http://localhost:5000/posts/${item.id}`
    });
  };

  updatePost = item => {
    this.props.actions.updatePost({
      url: `http://localhost:5000/posts/${item.id}`,
      data: {
        title: faker.lorem.words(),
        author: faker.name.findName(),
        author_image: faker.image.avatar(),
        release_date: faker.date.recent(),
        image: `${faker.image.nature()}/${this.props.posts.items.length}`,
        short_description: faker.lorem.sentence(),
        long_description: faker.lorem.paragraphs()
      }
    });
  };
  renderItem = (item, index, array) => {
    return (
      <TouchableOpacity key={index}>
        <View style={[styles.itemContainer, CommonStyles.card]}>
          <Image
            source={{ uri: item.image, width: 320, height: 320 }}
            style={styles.image}
          />
          <View style={styles.section}>
            <View style={styles.backgroundContainer}>
              <Text numberOfLines={1} style={styles.title}>
                {item.title}
              </Text>
              <Text numberOfLines={1} style={styles.author}>
                {item.author}
              </Text>
            </View>
          </View>
          <View style={styles.deleteUpdateContainer}>
            <Button title="Update" onPress={() => this.updatePost(item)} />
            <TouchableOpacity onPress={() => this.deletePost(item)}>
              <Image
                source={require('../images/delete_white_48x48.png')}
                style={{ width: 36, height: 36 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
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
