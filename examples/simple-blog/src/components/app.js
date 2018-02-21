import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import PostsView from './postsView'
import NavigationBar from './navigationBar'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20
  }
})
class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <NavigationBar />
        <ScrollView>
          <PostsView />
        </ScrollView>
      </View>
    )
  }
}

export default App
