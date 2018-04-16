import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Button, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import * as BlogItems from '../stars/blogItems';
import { bindActionCreators } from 'redux';
import CommonStyles from '../styles/commonStyles';
import faker from 'faker';
import * as Navigation from '../stars/navigation';
import gql from 'graphql-tag';

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

class BlogItemsScreen extends Component {
  componentDidMount() {
    this.props.actions.getBlogItems();
  }
  removeBlogItem = item => {
    this.props.actions.removeBlogItem({
      variables: {
        id: item.id
      },
      mutation: gql`
        mutation removeBlogItem($id: ID!) {
          removeBlogItem(id: $id)
        }
      `
    });
  };

  updateBlogItem = item => {
    this.props.actions.updateBlogItem({
      variables: {
        title: faker.lorem.words(),
        author: faker.name.findName(),
        author_image: faker.image.avatar(),
        release_date: faker.date.recent(),
        image: faker.image.nature(),
        short_description: faker.lorem.sentence(),
        long_description: faker.lorem.paragraphs(),
        id: item.id
      },
      mutation: gql`
        mutation updateBlogItem(
          $title: String!
          $author: String!
          $author_image: String!
          $release_date: String!
          $image: String!
          $short_description: String!
          $long_description: String!
          $id: ID!
        ) {
          updateBlogItem(
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
  goToDetailsScreen = id => {
    this.props.actions.navigateTo({
      id: 'blogItemsDetailedScreen',
      params: {
        id
      }
    });
  };
  renderItem = (item, index, array) => {
    return (
      <TouchableOpacity key={index} onPress={() => this.goToDetailsScreen(item.id)}>
        <View style={[styles.itemContainer, CommonStyles.card]}>
          <Image source={{ uri: item.image, width: 320, height: 320 }} style={styles.image} />
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
            <Button title="Update" onPress={() => this.updateBlogItem(item)} />
            <TouchableOpacity onPress={() => this.removeBlogItem(item)}>
              <Image source={require('../images/delete_white_48x48.png')} style={{ width: 36, height: 36 }} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    const { data, loading, error } = this.props.getBlogItems;
    return <View style={[styles.container, this.props.style]}>{data && data.allBlogItems && data.allBlogItems.map(this.renderItem)}</View>;
  }
}

const mapStateToProps = state => {
  return {
    getBlogItems: state.blogItems.getBlogItems
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ ...BlogItems.actions, ...Navigation.actions }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BlogItemsScreen);
