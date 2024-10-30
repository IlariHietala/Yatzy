import React from 'react'
import { Text, View } from 'react-native'
import Headerstyles from '../style/Headerstyles'


export default Header = () => {
  return (
    <View style={Headerstyles.header}>
      <Text style={Headerstyles.title}>
        Nice Dice
      </Text>
    </View>
  )
}