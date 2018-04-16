import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import faker from 'faker';
import { connect } from 'react-redux';
import * as BlogItems from '../stars/blogItems';
import { bindActionCreators } from 'redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderBottomColor: 'gray'
  }
});

class NavigationBar extends Component {
  postBlogItem = () => {
    const length = (this.props.blogItems.getBlogItems.data && this.props.blogItems.getBlogItems.data.data.length) || 0;
    this.props.actions.postBlogItem({
      data: {
        title: faker.lorem.words(),
        author: faker.name.findName(),
        author_image: faker.image.avatar(),
        release_date: faker.date.recent(),
        image: `${faker.image.nature()}/${length}`,
        short_description: faker.lorem.sentence(),
        long_description: faker.lorem.paragraphs()
      }
    });
  };
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Button title="New Post" onPress={() => this.postBlogItem()} />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    blogItems: state.blogItems
  };
};

const mapDispatchToProps = dispatch => {
  return { actions: bindActionCreators(BlogItems.actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);
