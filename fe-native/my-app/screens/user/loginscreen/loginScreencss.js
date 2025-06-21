import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    goBackButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
    },
    userIcon: {
        marginBottom: 25,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f6f8b',
        marginBottom: 35,
    },
    input: {
        width: '100%',
        paddingVertical: 14,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
        borderColor: '#ddd',
        borderWidth: 1,
        fontSize: 16,
        color: '#333',
    },
    passwordContainer: {
        position: 'relative',
        width: '100%',
    },
    showPasswordButton: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
    forgotPasswordContainer: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 25,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#1f6f8b',
        textDecorationLine: 'underline',
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        alignSelf: 'flex-start',
    },
    checkbox: {
        width: 24, // Đảm bảo checkbox đủ rộng
        height: 24, // Đảm bảo checkbox đủ cao
        borderRadius: 6,
        borderColor: '#1f6f8b',
        borderWidth: 2, // Tăng độ dày viền để dễ nhìn
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        backgroundColor: '#fff', // Màu nền mặc định
    },
    rememberMeLabel: {
        fontSize: 16,
        color: '#333',
    },
    loginButton: {
        width: '100%',
        backgroundColor: '#1f6f8b',
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 30,
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    signUpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    signUpText: {
        fontSize: 16,
        color: '#555',
    },
    signUpLink: {
        color: '#1f6f8b',
        fontWeight: 'bold',
        marginLeft: 5,
        textDecorationLine: 'underline',
    },
    copyrightContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#f9f9f9',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    copyright: {
        fontSize: 14,
        color: '#888',
    },
});
