import { StyleSheet } from 'react-native';



export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainText: {
        fontSize: 14,
        lineHeight: 24, // Parantaa luettavuutta
        color: '#333', // Tummanharmaa teksti
        marginHorizontal: 5
    },
    boldText: {
        fontWeight: 'bold',
        color: '#000', // Musta teksti
    },
    highlight: {
        color: '#007bff', // Sininen korostusväri
        fontWeight: 'bold',
    },
    goodLuckText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#28a745', // Vihreä väri
    },
    rules: {
        fontSize: 20,
        fontWeight: 'bold,'
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
    },
    name: {
        padding: 10,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 5,
        marginVertical: 10,
        backgroundColor: '#f9f9f9',
        color: '#333',
        width: 150
    },
});
