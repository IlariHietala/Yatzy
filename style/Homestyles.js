import { StyleSheet } from 'react-native';



export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    username: {
        fontSize: 18,
        fontFamily: 'Lato_700Bold',
    },
    mainText: {
        fontSize: 14,
        lineHeight: 24, // Parantaa luettavuutta
        color: '#333', // Tummanharmaa teksti
        marginHorizontal: 5,
        fontFamily: 'Lato_400Regular',
    },
    boldText: {
        fontFamily: 'Lato_700Bold',
        color: '#000', // Musta teksti
    },
    highlight: {
        color: '#007bff', // Sininen korostusväri
        fontFamily: 'Lato_700Bold',
    },
    goodLuckText: {
        fontSize: 20,
        fontFamily: 'Lato_700Bold',
        color: '#28a745', // Vihreä väri
    },
    rules: {
        fontSize: 20,
        fontFamily: 'Lato_700Bold',
    },
    button: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10
    },
    buttontext: {
        fontSize: 24,
        fontFamily: 'Lato_700Bold',
    },
    name: {
        padding: 10,
        fontSize: 18,
        fontFamily: 'Lato_400Regular',
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 5,
        marginVertical: 10,
        backgroundColor: '#f9f9f9',
        color: '#333',
        width: 150
    },
});
