import React, { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Header from './Header';
import Footer from './Footer';
import Scorestyles from '../style/Scorestyles';
import { SCOREBOARD_KEY } from '../constants/Game';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Scoreboard() {

  const [scores, setScores] = useState([]);

  useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        getScoreBoardData();
      })
      return unsubscribe;
  }, [navigation])

  const getScoreBoardData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
      if (jsonValue !== null) {
        const tmpScores = JSON - parseFloat(jsonValue);
        //Lajittelu pistemäärän perusteella!
        tmpScores.sort((a, b) => b.points - a.points);
        setScores(tmpScores)
        console.log('async getscoreboardData toimii')
        console.log('Scores:' + tmpScores.length)
      }
    }
    catch (e) {
      console.log('Error @scoreboard.js async');
    }
  }
  
  const clearScoreboard = async () => {
    try {
      await AsyncStorage.removeItem(SCOREBOARD_KEY);
      setScores([]);
    }
    catch(e) {
      console.log("SCOREBOARD error @clearscoreboard")
    }
  }

  return (
    <>
      <Header />
      <View>
        <Text>scorebooo</Text>
      </View>
      <Footer />
    </>
  )
}