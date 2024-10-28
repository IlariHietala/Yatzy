import React, { useState, useEffect } from 'react';
import { Text, View, Pressable, FlatList } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Header from './Header';
import Footer from './Footer';
import Scorestyles from '../style/Scorestyles';
import { SCOREBOARD_KEY } from '../constants/Game';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';



export default function Scoreboard() {

  const [scores, setScores] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getScoreBoardData();
    });

    return unsubscribe;
  }, [navigation]);

  const getScoreBoardData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
      if (jsonValue !== null) {
        const tmpScores = JSON.parse(jsonValue); // Oikea tapa jäsentää JSON
        // Lajittelu pistemäärän perusteella
        if (Array.isArray(tmpScores)) {
          tmpScores.sort((a, b) => b.points - a.totalPoints);
          setScores(tmpScores);
          console.log('async getScoreBoardData toimii');
          console.log('Scores:', tmpScores.length);
        } else {
          console.log('Virhe: tmpScores ei ole taulukko');
        }
      } else {
        console.log('Pistetaulukkoa ei löytynyt.');
      }
    } catch (e) {
      console.log('Error @scoreboard.js async', e); // Lisää virheen tiedot
    }
  };

  const clearScoreboard = async () => {
    try {
      await AsyncStorage.removeItem(SCOREBOARD_KEY);
      setScores([]);
    }
    catch (e) {
      console.log("SCOREBOARD error @clearscoreboard")
    }
  }


  return (
    <>
      <Header />
      <View>
      <Pressable style={Scorestyles.button} onPress={clearScoreboard}>
              <Text>Tyhjennä lista</Text>
            </Pressable>
            <FlatList
        data={scores}
        keyExtractor={(item, index) => index.toString()} // Voit käyttää item.key, jos se on ainutlaatuinen
        renderItem={({ item }) => (
          <View>
            <Text>Nimi: {item.name}</Text>
            <Text>Päivämäärä: {item.date}</Text>
            <Text>Aika: {item.time}</Text>
            <Text>Pisteet: {item.points ? (item.points.totalPoints || item.points) : 0}</Text>
          </View>
        )}
      />
      </View>
      <Footer />
    </>
  )
}