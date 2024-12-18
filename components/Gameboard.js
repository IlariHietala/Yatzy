import React, { useState, useEffect, useSyncExternalStore, useRef } from 'react';
import { Animated, Text, View, Pressable, ScrollView, ActivityIndicator } from 'react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFont } from '../style/FontProvider.js';

console.log

let board = [];

export default Gameboard = ({ navigation, route }) => {

  const { Lato_400Regular, Lato_700Bold } = useFont(); // käytetään ladattuja fontteja
  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS); //Heittokertoja jäljellä
  const [throwsLeft, setThrowsLeft] = useState(true); //Onko heittoja jäljellä?
  const [status, setStatus] = useState('Throw dices.');
  const [hasGameEnded, setHasGameEnded] = useState(false); //Onko peli päättynyt?
  const [playerName, setPlayerName] = useState(''); //Pelaajan nimi
  const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false)) // Mitkä nopat valittu?
  const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0));   // Silmäluvut
  const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(0));   // Mitkä nopat lasketaan pisteisiin
  const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0));   // Valittujen noppien pistemäärä total
  const [scores, setScores] = useState([]); //pistetaulukko
  const [bonus, setBonus] = useState(false); //Bonus aktivoitu?
  const [ogPoints, setOgPoints] = useState(0); //Pisteet ilman bonusta
  const [totalPoints, setTotalPoints] = useState(0); //Kokonaispisteet
  const DiceIcon = "\u{1F3B2}"; //Noppaikoni ennen pelin aloittamista
  const [hasGameNotStarted, setHasGameNotStarted] = useState(true); //Eikö peli ole vielä alkanut? :D Mielenkiintonen lähestymistapa
  const [topThreeScores, setTopThreeScores] = useState([0, 0, 0]); //hiscorea varten
  const [playerNames, setPlayerNames] = useState([]); //Pejaajien nimet hiscorea varten
  const [dicesRolled, setDicesRolled] = useState(false);


  //Noppien reset
  const resetDices = () => {
    setSelectedDices(new Array(NBR_OF_DICES).fill(false));
  }

  //Uusi peli
  const startNewGame = () => {
    setNbrOfThrowsLeft(NBR_OF_THROWS);
    setStatus('Throw dices!');
    setHasGameEnded(false);
    setSelectedDices(new Array(NBR_OF_DICES).fill(false)); // Nollaa valitut nopat
    setDiceSpots(new Array(NBR_OF_DICES).fill(0)); // Nollaa nopan silmäluvut
    setSelectedDicePoints(new Array(MAX_SPOT).fill(0)); // Nollaa valitut pisteet
    setDicePointsTotal(new Array(MAX_SPOT).fill(0)); // Nollaa pistemäärät
  }

  //Pisteiden tallennus
  const savePlayerPoints = async () => {
    const newKey = Date.now();
    const playerPoints = {
      key: newKey,
      name: playerName,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      points: totalPoints,
    };

    try {
      const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
      const existingScores = jsonValue !== null ? JSON.parse(jsonValue) : [];
      const newScore = [...existingScores, playerPoints];

      // Lajittele pisteet laskevassa järjestyksessä
      newScore.sort((a, b) => (b.points.totalPoints || b.points) - (a.points.totalPoints || a.points));

      // Taulukon pituusrajoitus
      if (newScore.length > 7) {
        newScore.splice(7); // ylikirjoita huonoin tulos
      }

      await AsyncStorage.setItem(SCOREBOARD_KEY, JSON.stringify(newScore));
      setScores(newScore);

      // Haetaan parhaat pisteet
      const bestScore = getTopThreeScores(newScore);
      setTopThreeScores(bestScore.points);
      setPlayerNames(bestScore.names);

      console.log('Gameboard: Save successful');
    } catch (e) {
      console.log('Gameboard: save error:', e);
    }
  };



  // Luodaan nopparivi sarakkeittain (col)
  const dicesRow = [];

  const rotationAnim = useRef(new Animated.Value(0)).current; // Animaation arvo
  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });


  for (let dice = 0; dice < NBR_OF_DICES; dice++) {
    dicesRow.push(
      <Col key={"dice" + dice}>
        <Pressable
          key={"row" + dice}
          onPress={() => chosenDice(dice)}>
          <Animated.View
            style={{
              transform: [
                {
                  rotate: selectedDices[dice] ? '0deg' : rotateInterpolate,
                },
              ],
            }}>
            <MaterialCommunityIcons
              name={board[dice]}
              key={"row" + dice}
              size={50}
              color={getDiceColor(dice)}>
            </MaterialCommunityIcons>
          </Animated.View>
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
          onPress={() => { chosenDicePoints(diceButton) }}>
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

  // Hiscores päivitys navigoidessa
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getScoreBoardData();
      getTopThreeScores();

    })
    return unsubscribe;
  }, [navigation])

  //Top 3 tulokset ja nimet hiscores varten
  const getTopThreeScores = (scores) => {
    if (!Array.isArray(scores) || scores.length === 0) {
      return { points: [0, 0, 0], names: ['', '', ''] }; // Palauta tyhjät tulokset ja nimet jos taulukossa ei oo mitään
    }

    const allScores = scores.map(score => ({
      points: score.points.totalPoints !== undefined ? score.points.totalPoints : score.points,
      name: score.name,
    }));

    //Järjestys
    const sortedScores = allScores.sort((a, b) => b.points - a.points);
    const topThree = sortedScores.slice(0, 3);

    const topPoints = [];
    const topNames = [];

    for (let i = 0; i < 3; i++) {
      if (topThree[i]) {
        topPoints.push(topThree[i].points);
        topNames.push(topThree[i].name);
      } else {
        topPoints.push(0);
        topNames.push('');
      }
    }

    return { points: topPoints, names: topNames };
  };

  //Scoreboard lataus
  const getScoreBoardData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);


      if (jsonValue !== null) {
        const tmpScores = JSON.parse(jsonValue);


        // Hae kolme parasta pistemäärää ja niiden nimet
        if (Array.isArray(tmpScores) && tmpScores.length > 0) {

          const { points: topThreeScores, names: topThreeNames } = getTopThreeScores(tmpScores);

          console.log('Asetetaan paras pistemäärä:', topThreeScores); // Tulosta parhaat pistemäärät
          setTopThreeScores(topThreeScores); // Aseta kolme parasta pistemäärää
          setPlayerNames(topThreeNames); // Aseta pelaajien nimet
        }
      } else {
        console.log('Ei tallennettuja tietoja löytynyt.');
      }
    } catch (e) {
      console.log('Virhe @GAMEBOARD.js async:', e.message || e); // Tulosta virheen viesti
    }
  };


  // Valitun nopan värimuunnokset
  function getDiceColor(i) {
    if (hasGameEnded || nbrOfThrowsLeft === NBR_OF_THROWS) {
      return '#6b6b6b';
    }
    return selectedDices[i] ? '#1e4d15' : "green";
  }

  function getDicePointsColor(i) {
    return selectedDicePoints[i] && !hasGameEnded ? "black" : "green";
  }

  //Pistelasku
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

  //Tilanhallinta onko heittoja jäljellä muuttujalle
  useEffect(() => {
    if (nbrOfThrowsLeft === 0) {
      setThrowsLeft(false);
    } else {
      setThrowsLeft(true);
    }
  }, [nbrOfThrowsLeft]);

  // Tarkistetaan, ovatko kaikki lohkot täytetty
  useEffect(() => {
    const allPointsSelected = selectedDicePoints.every(point => point === true);

    if (allPointsSelected) {
      setHasGameEnded(true);  // Peli päättyy
      setDicesRolled(false);

    }
  }, [selectedDicePoints]);  // Tämä useEffect käynnistyy aina, kun selectedDicePoints muuttuu


  // Noppien heitto
  const throwDices = () => {
    if (nbrOfThrowsLeft === 0) {
      setStatus("No throws left. Select points.");
      setThrowsLeft(false);
      return;
    }


    // Pyöritysanimaatio
    Animated.timing(rotationAnim, {
      toValue: 2, // 360 + 360 astetta
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Resetoi arvo takaisin nollaan animaation jälkeen
      rotationAnim.setValue(0);
    });

    let spots = [...diceSpots];
    for (let i = 0; i < NBR_OF_DICES; i++) {
      if (!selectedDices[i]) {
        let randomNumber = Math.floor(Math.random() * 6 + 1);
        board[i] = 'dice-' + randomNumber;
        spots[i] = randomNumber;
      }
    }
    setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
    setDiceSpots(spots);

    if (nbrOfThrowsLeft - 1 > 0) {
      setStatus('Select and throw dices again.');
    } else {
      setStatus("No throws left. Select points.");
    }

    setDicesRolled(true)

  };



  // Valittujen noppien pisteiden laskeminen
  const chosenDicePoints = (i) => {
    if (nbrOfThrowsLeft === 0 || (areAllDicesSameValue() && dicesRolled)) {
      let selectedPoints = [...selectedDicePoints];
      let points = [...dicePointsTotal];
      if (!selectedPoints[i]) {
        selectedPoints[i] = true;
        let nbrOfDices =
          diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1 : total), 0);
        points[i] = nbrOfDices * (i + 1);
        setNbrOfThrowsLeft(NBR_OF_THROWS);
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

  //Pistelasku bonusta varten, käytetään myös refreshaamaan pistetaulukot
  useEffect(() => {
    const currentPoints = dicePointsTotal.reduce((total, points) => total + points, 0);
    setOgPoints(currentPoints);

    if (currentPoints > BONUS_POINTS_LIMIT) {
      setBonus(true);
      setTotalPoints(currentPoints + BONUS_POINTS)

    } else {
      setBonus(false);
      setTotalPoints(currentPoints)
    }

    if (hasGameEnded) {
      savePlayerPoints();
      getScoreBoardData();
      getTopThreeScores();
    }

  }, [dicePointsTotal, hasGameEnded]);





  // Funktio, joka tarkistaa, ovatko kaikki nopat saman arvoisia että tulos voidaan tallentaa myös kesken kierroksen jos saa yatzyn
  const areAllDicesSameValue = () => {

    if (!hasGameNotStarted) {
      const firstValue = diceSpots[0];
      return diceSpots.every(value => value === firstValue);
    }
  };

  // Eikö peli ole alkanu?
  const startGame = () => {
    setHasGameNotStarted(false)
  };

  return (
    <>
      <Header />
      <View style={Gamestyles.container}>
        <Container>
          <Row style={Gamestyles.starticon}>
            {hasGameNotStarted && nbrOfThrowsLeft === 3 ? (
              <Text style={Gamestyles.icon2}>{DiceIcon}</Text>
            ) : (
              dicesRow
            )}
          </Row>
        </Container>
        {!hasGameEnded && (
          <Text style={Gamestyles.infotext}>Throws left: {nbrOfThrowsLeft}</Text>
        )}
        <ScrollView>
          {!hasGameEnded && (
            <Text style={Gamestyles.infotext2}>{status}</Text>
          )}
          <Pressable
            style={[
              Gamestyles.button,
              (hasGameEnded || nbrOfThrowsLeft === 0) ? { opacity: 0.5 } : null, // Tyylin muutos, jos peli on päättynyt tai heittoja ei ole jäljellä
            ]}
            onPress={() => {
              if (!hasGameEnded) {
                throwDices();
                startGame();
              }
            }}
            disabled={hasGameEnded || nbrOfThrowsLeft === 0} // Estä nappi, jos peli on päättynyt
          >
            <Text style={Gamestyles.buttontext}>
              {hasGameEnded
                ? 'Game has ended!'
                : (throwsLeft ? 'Throw dices!' : 'Select points!')}</Text>
          </Pressable>
          <Container>
            <Row>{pointsRow}</Row>
          </Container>
          <Container>
            <Row style={Gamestyles.icons}>{pointsToSelectedRow}</Row>
          </Container>
          <View style={Gamestyles.pointcontainer}>
            <Text style={Gamestyles.pointtext}>Points: {ogPoints !== undefined ? ogPoints : 0}</Text>
            <Text style={Gamestyles.pointtext}>Bonus: {bonus ? BONUS_POINTS : 0}</Text>
            <Text style={Gamestyles.pointtext2}>Total: {totalPoints !== undefined ? totalPoints : 0}</Text>
          </View>
          {hasGameEnded && (
            <Pressable
              style={Gamestyles.button}
              onPress={() => startNewGame()}
            >
              <Text style={Gamestyles.buttontext}>PLAY AGAIN!</Text>
            </Pressable>
          )}
          <View style={Gamestyles.pointcontainer2}>
            <Text style={Gamestyles.pointtext3}>Hiscores!</Text>
            <View style={Gamestyles.scores}>
              <MaterialCommunityIcons name="crown" size={24} color="gold" />
              <Text style={Gamestyles.pointtext}>{playerNames[0] || '----'}: {topThreeScores[0] !== undefined ? topThreeScores[0] : 0}</Text>
            </View>
            <View style={Gamestyles.scores}>
              <MaterialCommunityIcons name="crown" size={24} color="silver" />
              <Text style={Gamestyles.pointtext}>{playerNames[1] || '----'}: {topThreeScores[1] !== undefined ? topThreeScores[1] : 0}</Text>
            </View>
            <View style={Gamestyles.scores}>
              <MaterialCommunityIcons name="crown" size={24} color="brown" />
              <Text style={Gamestyles.pointtext}>{playerNames[2] || '----'}: {topThreeScores[2] !== undefined ? topThreeScores[2] : 0}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
      <Footer />
    </>
  )

}