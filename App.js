import React from 'react';
import { View } from 'react-native';
import Header from './components/Header'
import Gameboard from './components/Gameboard'
import Footer from './components/Footer'
import styles from './style/style'

export default function App() {
  return (
    <View style={styles.container}>
      <Header />
      <Gameboard />
      <Footer />
    </View>
  )
}