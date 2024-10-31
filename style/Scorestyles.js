import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    button: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    scoreCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    scoreText: {
        fontSize: 16,
        fontFamily: 'Lato_400Regular', // Käytetään Lato-fonttia
        marginBottom: 5,
    },
    scoreHeader: {
        fontSize: 20,
        fontFamily: 'Lato_700Bold', // Käytetään paksua Lato-fonttia
        marginBottom: 10,
    },
    clearButtonText: {
        color: '#fff', // Valkoinen teksti
        fontSize: 16,
        fontFamily: 'Lato_700Bold',
    },
});
