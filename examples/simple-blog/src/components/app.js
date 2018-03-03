import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PostsView from './postsView';
import PostsDetailedView from './postsDetailedView';
import NavigationBar from './navigationBar';
import { connect } from 'react-redux';
import * as Navigation from '../stars/navigation';
import { bindActionCreators } from 'redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  }
});
class App extends Component {
  renderContent() {
    const { route } = this.props.navigation;
    switch (route && route.id) {
      case 'postsView':
        return (
          <ScrollView>
            <PostsView />
          </ScrollView>
        );
      case 'postsDetailedView':
        return (
          <ScrollView>
            <PostsDetailedView params={route.params} />
          </ScrollView>
        );
      default:
        return null;
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <NavigationBar />
        {this.renderContent()}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    navigation: state.navigation
  };
};

const mapDispatchToProps = dispatch => {
  return { actions: bindActionCreators(Navigation.actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
