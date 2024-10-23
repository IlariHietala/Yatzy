import { useState, useEffect, useSyncExternalStore } from 'react';
import { Text, View, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Header from './Header';
import Footer from './Footer';
import {
  NBR_OF_DICES,
  NBR_OF_THROWS,
  MIN_SPOT,
  MAX_SPOT,
  BONUS_POINTS_LIMIT,
  BONUS_POINTS,
  MAX_NBR_OF_SCOREBOARD_ROWS,
  SCOREBOARD_KEY
} from '../constants/Game.js';
import Gamestyles from '../style/Gamestyles';
import { Container, Row, Col } from 'react-native-flex-grid';

let board = [];

export default Gameboard = ({ navigation, route }) => {

  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
  const [throwsLeft, setThrowsLeft] = useState(true);
  const [status, setStatus] = useState('Throw dices.');
  const [hasGameEnded, setHasGameEnded] = useState(false);
  const [playerName, setPlayerName] = useState('');
  // Mitkä nopat heitetty?
  const [selectedDices, setSelectedDices] =
    useState(new Array(NBR_OF_DICES).fill(false))
  // Silmäluvut
  const [diceSpots, setDiceSpots] =
    useState(new Array(NBR_OF_DICES).fill(0));
  // Mitkä nopat valittu pisteisiin?
  const [selectedDicePoints, setSelectedDicePoints] =
    useState(new Array(MAX_SPOT).fill(0));
  // Valittujen noppien pistemäärä total
  const [dicePointsTotal, setDicePointsTotal] =
    useState(new Array(MAX_SPOT).fill(0));
  const [scores, setScores] = useState([]);

  const resetDices = () => {
    setSelectedDices(new Array(NBR_OF_DICES).fill(false));
  }

  const startNewGame = () => {
    setNbrOfThrowsLeft(3);
    setStatus('');
    setHasGameEnded(false);
    setSelectedDices(new Array(NBR_OF_DICES).fill(false)); // Nollaa valitut nopat
    setDiceSpots(new Array(NBR_OF_DICES).fill(0)); // Nollaa nopan silmäluvut
    setSelectedDicePoints(new Array(MAX_SPOT).fill(0)); // Nollaa valitut pisteet
    setDicePointsTotal(new Array(MAX_SPOT).fill(0)); // Nollaa pistemäärät
  }

  // pisteiden tallennus
  const savePlayerPoints = async () => {
    const newKey = scores.length + 1;
    const playerPoints = {
      key: newKey,
      name: playerName,
      date: 'date',
      time: 'time',
      points: 0
    }
    try {
      const newScore = [...scores, playerPoints];
      const jsonValue = JSON.stringify(newScore);
      await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue);
      console.log('Gameboard: Save successful: ' + jsonValue)
    }
    catch (e) {
      console.log('Gameboard: save error: ' + e)
    }
  }

  // Luodaan nopparivi sarakkeittain (col)
  const dicesRow = [];
  for (let dice = 0; dice < NBR_OF_DICES; dice++) {
    dicesRow.push(
      <Col key={"dice" + dice}>
        <Pressable
          key={"row" + dice}
          onPress={() => chosenDice(dice)}>
          <MaterialCommunityIcons
            name={board[dice]}
            key={"row" + dice}
            size={50}
            color={getDiceColor(dice)}>
          </MaterialCommunityIcons>
        </Pressable>
      </Col>
    );
  }

  // Tässä luodaan piste(score)rivi
  const pointsRow = [];
  for (let spot = 0; spot < MAX_SPOT; spot++) {
    pointsRow.push(
      <Col key={"pointsRow" + spot}>
        <Text key={"pointsRow" + spot} style={Gamestyles.points}>
          {getSpotTotal(spot)}
        </Text>
      </Col>
    )
  }

  // Tässä luodaan rivi, joka kertoo onko pisteet jo valittu silmäluvulle
  const pointsToSelectedRow = [];
  for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
    pointsToSelectedRow.push(
      <Col key={"buttonsRow" + diceButton}>
        <Pressable
          key={"buttonsRow" + diceButton}
          onPress={() => chosenDicePoints(diceButton)}>
          <MaterialCommunityIcons
            name={"numeric-" + (diceButton + 1) + "-circle"}
            key={"buttonsRow" + diceButton}
            color={getDicePointsColor(diceButton)}
            style={Gamestyles.icon}
          >

          </MaterialCommunityIcons>
        </Pressable>
      </Col>
    )
  }

  // Pelaajan nimi?
  useEffect(() => {
    if (playerName === '' && route.params?.player) {
      setPlayerName(route.params.player);
    }
  }, [route.params?.player]);

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
        console.log('GAMEBOARD: Scores:' + tmpScores.length)
      }
    }
    catch (e) {
      console.log('Error @GAMEBOARD.js async');
    }
  }

  // Valitun nopan värimuunnos
  function getDiceColor(i) {
    return selectedDices[i] ? "black" : "green";
  }

  function getDicePointsColor(i) {
    return selectedDicePoints[i] && !hasGameEnded ? "black" : "green";
  }

  function getSpotTotal(i) {
    return dicePointsTotal[i];
  }

  // Valittu noppa
  const chosenDice = (i) => {
    if (nbrOfThrowsLeft < NBR_OF_THROWS && !hasGameEnded) {
      let dices = [...selectedDices];
      dices[i] = selectedDices[i] ? false : true;
      setSelectedDices(dices);
    }
    else {
      setStatus('You have to throw dices first.')
    }
  }

  useEffect (() => {
    if (nbrOfThrowsLeft === 0) {
      setThrowsLeft(false);
    } else {
      setThrowsLeft(true);
    }
  }, [nbrOfThrowsLeft]);

  useEffect(() => {
    // Tarkistetaan, ovatko kaikki lohkot täytetty
    const allPointsSelected = selectedDicePoints.every(point => point === true);
    
    if (allPointsSelected) {
      setHasGameEnded(true);  // Peli päättyy
      setStatus("Peli on päättynyt. Kaikki pisteet asetettu!");
    }
  }, [selectedDicePoints]);  // Tämä useEffect käynnistyy aina, kun selectedDicePoints muuttuu
  

  // Noppien heitto
  const throwDices = () => {
    if (nbrOfThrowsLeft === 0) {
      setStatus("No throws left. Select points.");
      setThrowsLeft(false);
      return;
    }

    let spots = [...diceSpots];
    for (let i = 0; i < NBR_OF_DICES; i++) {
      if (!selectedDices[i]) {
        let randomNumber = Math.floor(Math.random() * 6 + 1);
        board[i] = 'dice-' + randomNumber
        spots[i] = randomNumber;
      }
    }
    setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
    setDiceSpots(spots);
    setStatus('Select and throw dices again.')
  }

  // Heittoja jäljellä + pistelasku
  const chosenDicePoints = (i) => {
    if (nbrOfThrowsLeft === 0) {
      let selectedPoints = [...selectedDicePoints];
      let points = [...dicePointsTotal];
      if (!selectedPoints[i]) {
        selectedPoints[i] = true;
        let nbrOfDices =
          diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1 : total), 0);
        points[i] = nbrOfDices * (i + 1);
        savePlayerPoints();
        setNbrOfThrowsLeft(3);
        resetDices();
      }
      else {
        setStatus("You already selected points for " + (i + 1));
        return points[i];
      }
      setDicePointsTotal(points);
      setSelectedDicePoints(selectedPoints);
      return points[i];
    }
    else {
      setStatus("Throw " + NBR_OF_THROWS + " times before setting points.")
    }
  }


  return (
    <>
      <Header />
      <View>
        <Container>
          <Row>
            {dicesRow}
          </Row>
        </Container>
        <Text>Throws left: {nbrOfThrowsLeft}</Text>
        <Text>{status}</Text>
  
        {/* Ehdollinen renderöinti pelin päättymiselle */}
        {hasGameEnded ? (
          <Text style={Gamestyles.buttontext}>Peli on päättynyt!</Text>
        ) : (
          <Pressable
            style={Gamestyles.button}
            onPress={() => throwDices()}
          >
            <Text style={Gamestyles.buttontext}>{throwsLeft ? 'Heitä noppia!' : 'Aseta pisteet!'}</Text>
          </Pressable>
        )}


        <Container>
          <Row>{pointsRow}</Row>
        </Container>
        <Container>
          <Row>{pointsToSelectedRow}</Row>
        </Container>
        {hasGameEnded && (
        <Pressable
          style={Gamestyles.button}
          onPress={() => startNewGame()}
          >
            <Text style={Gamestyles.buttontext}>Aloita uusi peli!</Text>
          </Pressable>
          )}
      </View>
      <Footer />
    </>
  )
  
}