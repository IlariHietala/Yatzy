import { useState, useEffect } from 'react';
import { Text, View, Pressable, TextInput, Keyboard } from 'react-native';
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
import Homestyles from '../style/Homestyles';


export default Home = ({ navigation }) => {

    const [playerName, setPlayerName] = useState('');
    const [hasPlayerName, setHasPlayerName] = useState(false)

    const handlePlayerName = (value) => {
        if (value.trim().length > 0) {
            setHasPlayerName(true);
            Keyboard.dismiss();
        }
    }

    return (
        <>
            <Header />
            <View style={Homestyles.icon}>
                <MaterialCommunityIcons name="information" size={90} color={'green'} />
                {!hasPlayerName ?
                    <>
                        <Text>Anna käyttäjänimi:</Text>
                        <TextInput onChangeText={setPlayerName} autoFocus={true}></TextInput>
                        <Pressable
                            onPress={() => handlePlayerName(playerName)}
                            style={{ padding: 10, backgroundColor: '#49ac7d' }}>
                            <Text>OKKE</Text>
                        </Pressable>
                    </>
                    :
                    <>
                        <Text style={Homestyles.rules}>Rules of the Game</Text>
                        <Text multiline="true">
                            THE GAME: Upper section of the classic Yahtzee
                            dice game. You have {NBR_OF_DICES} dices and
                            for the every dice you have {NBR_OF_THROWS}
                            throws. After each throw you can keep dices in
                            order to get same dice spot counts as many as
                            possible. In the end of the turn you must select
                            your points from {MIN_SPOT} to {MAX_SPOT}.
                            Game ends when all points have been selected.
                            The order for selecting those is free.
                            POINTS: After each turn game calculates the sum
                            for the dices you selected. Only the dices having
                            the same spot count are calculated. Inside the
                            game you can not select same points from
                            {MIN_SPOT} to {MAX_SPOT} again.
                            GOAL: To get points as much as possible.
                            {BONUS_POINTS_LIMIT} points is the limit of
                            getting bonus which gives you {BONUS_POINTS}
                            points more.
                        </Text>
                        <Text> Go to hell, {playerName}</Text>
                        <Pressable
                            onPress={() => navigation.navigate('Gameboard', {player: playerName})}
                            style={{ padding: 10, backgroundColor: '#49ac7d' }}>
                            <Text>PLAY</Text>
                        </Pressable>
                    </>}
            </View>
            <Footer />
        </>
    )
} 