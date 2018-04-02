import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import faker from 'faker';
import { connect } from 'react-redux';
import * as BlogItems from '../stars/blogItems';
import { bindActionCreators } from 'redux';
import gql from 'graphql-tag';

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
  createBlogItem = () => {
    const length = (this.props.blogItems.getBlogItems.data.allBlogItems && this.props.blogItems.getBlogItems.data.allBlogItems.length) || 0;
    this.props.actions.createBlogItem({
      variables: {
        title: faker.lorem.words(),
        author: faker.name.findName(),
        author_image: faker.image.avatar(),
        release_date: faker.date.recent(),
        image: faker.image.nature(),
        short_description: faker.lorem.sentence(),
        long_description: faker.lorem.paragraphs(),
        id: length
      },
      mutation: gql`
        mutation createBlogItem(
          $title: String!
          $author: String!
          $author_image: String!
          $release_date: String!
          $image: String!
          $short_description: String!
          $long_description: String!
          $id: ID!
        ) {
          createBlogItem(
            title: $title
            author: $author
            author_image: $author_image
            release_date: $release_date
            image: $image
            short_description: $short_description
            long_description: $long_description
            id: $id
          ) {
            id
            title
            author
            author_image
            release_date
            image
            short_description
            long_description
          }
        }
      `
    });
  };
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Button title="New Post" onPress={() => this.createBlogItem()} />
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
