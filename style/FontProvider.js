import React, { createContext, useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useFonts, Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';

const FontContext = createContext();

export const FontProvider = ({ children }) => {
    let [fontsLoaded] = useFonts({
        Lato_400Regular,
        Lato_700Bold,
    });

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <FontContext.Provider value={{ Lato_400Regular, Lato_700Bold }}>
            {children}
        </FontContext.Provider>
    );
};

export const useFont = () => {
    return useContext(FontContext);
};
