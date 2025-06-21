import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1f6f8b',
        textAlign: 'center',
        marginVertical: 20,
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 4,
    },
    cardText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '600',
        color: '#1f6f8b',
    },
    backBtn: {
        backgroundColor: '#1f6f8b',
        padding: 12,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    backText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
});
