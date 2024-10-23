import React from 'react'
import { Text, View } from 'react-native'
import Footerstyles from '../style/Footerstyles'

export default Footer = () => {
  return (
    <View style={Footerstyles.footer}>
      <Text style={Footerstyles.author}>
        Author: Ilari Hietala
      </Text>
    </View>
  )
}