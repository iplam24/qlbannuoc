import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7fafc',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 0,
        paddingTop: 0,
        marginTop: 70, // Add marginTop to ScrollView to avoid overlap
    },
    fixedHeader: {
        position: 'absolute', // Position the header absolutely
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#333',
        zIndex: 10, 
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 10,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginHorizontal: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginTop:20
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 20,
        borderWidth: 2,
        borderColor: '#e2e8f0',
    },
    profileDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a5265',
        marginBottom: 8,
    },
    userEmail: {
        fontSize: 16,
        color: '#718096',
    },
    optionsContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    optionsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a5265',
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        marginBottom: 15,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    optionText: {
        marginLeft: 18,
        fontSize: 18,
        color: '#4a5568',
    },
});
