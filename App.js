import React from 'react';
import { ImageBackground, View, ActivityIndicator } from 'react-native';
import Header from './components/Header'
import Gameboard from './components/Gameboard'
import Footer from './components/Footer'
import Home from './components/Home'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Scoreboard from './components/Scoreboard';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import { FontProvider } from './style/FontProvider';
const Tab = createBottomTabNavigator();


export default App = () => {



  return (
    <FontProvider>
      <NavigationContainer>
        <Tab.Navigator
          sceneContainerStyle={{ backgroundColor: 'transparent' }}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = focused
                  ? 'information'
                  : 'information-outline';
              } else if (route.name === 'Gameboard') {
                iconName = focused
                  ? 'dice-multiple'
                  : 'dice-multiple-outline';
              } else if (route.name === 'Scoreboard') {
                iconName = focused
                  ? 'view-list'
                  : 'view-list-outline';
              }
              return <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            },
            tabBarActiveTintColor: 'steelblue',
            tabBarInactiveTintColot: 'gray',
          })}
        >
          <Tab.Screen name="Home" component={Home} options={{ tabBarStyle: { display: "none" } }} />
          <Tab.Screen name="Gameboard" component={Gameboard} />
          <Tab.Screen name="Scoreboard" component={Scoreboard} />
        </Tab.Navigator>
      </NavigationContainer>
    </FontProvider>
  );
}